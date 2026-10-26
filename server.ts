import express from 'express';
import compression from 'compression';
import path from 'path';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

// Load env variables
dotenv.config();

const app = express();
const PORT = 3000;

// The built bundle always runs as production, even if NODE_ENV wasn't set,
// so a deploy can never fall back to the Vite dev server.
const runningFromBuild = /[\\/]dist[\\/]server\.cjs$/.test(process.argv[1] ?? '');
const isProduction = process.env.NODE_ENV === 'production' || runningFromBuild;

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(compression());

const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self'",
  // motion sets inline styles; Google Fonts serves the stylesheet and font files
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data:",
  "connect-src 'self'",
  // Google Maps embed on the contact page
  "frame-src https://www.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ');

if (isProduction) {
  app.use((_req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.setHeader('Content-Security-Policy', CONTENT_SECURITY_POLICY);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000');
    next();
  });
}

app.use(express.json({ limit: '20kb' }));

const FALLBACK_CONTACT = 'Please call us on +251 943 739 086 or email herokegservice@gmail.com.';

// Escape user input before placing it in the HTML email
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// One address only: no lists, quotes, comments or angle brackets that a mail
// parser could turn into extra Reply-To recipients.
const EMAIL_PATTERN = /^[^\s@,;:"<>()[\]\\]+@[^\s@,;:"<>()[\]\\]+\.[^\s@,;:"<>()[\]\\]+$/;

let transporter: nodemailer.Transporter | null = null;

function getTransporter(user: string, pass: string): nodemailer.Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
      // Fail fast so a stalled SMTP connection doesn't hold the request open
      connectionTimeout: 15_000,
      greetingTimeout: 15_000,
      socketTimeout: 15_000,
    });
  }
  return transporter;
}

function field(value: unknown, maxLength: number): string {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

// Simple in-memory rate limit: 5 submissions per IP per 15 minutes
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const submissionsByIp = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (submissionsByIp.get(ip) || []).filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX) {
    submissionsByIp.set(ip, recent);
    return true;
  }
  recent.push(now);
  submissionsByIp.set(ip, recent);
  return false;
}

setInterval(() => {
  const now = Date.now();
  for (const [ip, times] of submissionsByIp) {
    if (times.every(t => now - t >= RATE_LIMIT_WINDOW_MS)) submissionsByIp.delete(ip);
  }
}, RATE_LIMIT_WINDOW_MS).unref();

// API route for Contact Form
app.post('/api/contact', async (req: express.Request, res: express.Response) => {
  try {
    const body = req.body || {};

    // Honeypot: real visitors never see this field, so a filled value means a bot.
    // Reply as if it worked so the bot doesn't retry.
    if (field(body.website, 200)) {
      return res.status(200).json({
        success: true,
        message: 'Your inquiry has been submitted and sent successfully.'
      });
    }

    if (isRateLimited(req.ip || 'unknown')) {
      return res.status(429).json({
        success: false,
        message: `Too many submissions from your connection. ${FALLBACK_CONTACT}`
      });
    }

    const name = field(body.name, 100);
    const company = field(body.company, 150);
    const email = field(body.email, 200);
    const phone = field(body.phone, 50);
    const service = field(body.service, 100);
    const kegs = field(body.kegs, 20);
    const subject = field(body.subject, 200);
    const message = field(body.message, 5000);

    // Validate request
    if (!name || !company || !email || !phone || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields.'
      });
    }

    if (!EMAIL_PATTERN.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.'
      });
    }

    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_APP_PASSWORD;
    const recipient = process.env.CONTACT_RECIPIENT_EMAIL || gmailUser;

    if (!gmailUser || !gmailPass) {
      // Never pretend the inquiry was delivered: the lead would be lost.
      console.error('[Gmail SMTP] GMAIL_USER or GMAIL_APP_PASSWORD is not set. Inquiry NOT delivered:', { name, company, email, phone, subject });
      return res.status(503).json({
        success: false,
        message: `Our online form is temporarily unavailable. ${FALLBACK_CONTACT}`
      });
    }

    const html = {
      name: escapeHtml(name),
      company: escapeHtml(company),
      email: escapeHtml(email),
      phone: escapeHtml(phone),
      service: escapeHtml(service || 'Not specified'),
      kegs: escapeHtml(kegs || 'Not specified'),
      subject: escapeHtml(subject),
      message: escapeHtml(message),
    };
    const senderName = `${name} (${company})`.replace(/["\r\n]/g, '');

    const mailOptions = {
      from: `"${senderName}" <${gmailUser}>`, // Must send from the authenticated Gmail address
      to: recipient,
      replyTo: email, // Extremely important so replies go to the user
      subject: `[Hero Keg Inquiry] ${subject.replace(/[\r\n]+/g, ' ')}`,
      text: `
New inquiry received from Hero Keg Contact Form:

Name: ${name}
Company: ${company}
Email: ${email}
Phone: ${phone}
Service Requested: ${service || 'Not specified'}
Number of Kegs: ${kegs || 'Not specified'}

Subject: ${subject}

Message:
${message}
      `,
      html: `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
  <div style="background-color: #183346; color: white; padding: 24px; text-align: center;">
    <h1 style="margin: 0; font-size: 24px; font-weight: bold;">Hero Keg Inquiry</h1>
    <p style="margin: 4px 0 0; font-size: 14px; color: #9ca3af;">New customer inquiry from contact page</p>
  </div>
  <div style="padding: 24px; background-color: #ffffff;">
    <h2 style="font-size: 18px; font-weight: bold; border-bottom: 2px solid #C5A059; padding-bottom: 8px; color: #183346; margin-top: 0;">Inquiry Details</h2>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
      <tr>
        <td style="padding: 8px 0; font-weight: bold; width: 35%; color: #4b5563;">Name:</td>
        <td style="padding: 8px 0; color: #1f2937;">${html.name}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-weight: bold; color: #4b5563;">Company:</td>
        <td style="padding: 8px 0; color: #1f2937;">${html.company}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-weight: bold; color: #4b5563;">Email Address:</td>
        <td style="padding: 8px 0; color: #1f2937;"><a href="mailto:${html.email}" style="color: #C5A059; text-decoration: none;">${html.email}</a></td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-weight: bold; color: #4b5563;">Phone Number:</td>
        <td style="padding: 8px 0; color: #1f2937;"><a href="tel:${html.phone}" style="color: #C5A059; text-decoration: none;">${html.phone}</a></td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-weight: bold; color: #4b5563;">Service Required:</td>
        <td style="padding: 8px 0; color: #1f2937;">${html.service}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-weight: bold; color: #4b5563;">Approx. Kegs:</td>
        <td style="padding: 8px 0; color: #1f2937;">${html.kegs}</td>
      </tr>
    </table>

    <h2 style="font-size: 18px; font-weight: bold; border-bottom: 2px solid #C5A059; padding-bottom: 8px; color: #183346; margin-top: 24px;">Subject: ${html.subject}</h2>
    <div style="background-color: #f9fafb; padding: 16px; border-radius: 4px; border-left: 4px solid #C5A059; margin-top: 12px; white-space: pre-wrap; font-size: 14px; color: #374151;">
${html.message}
    </div>
  </div>
  <div style="background-color: #f3f4f6; color: #6b7280; text-align: center; padding: 12px; font-size: 12px; border-top: 1px solid #e5e7eb;">
    This email was automatically generated and sent via Hero Keg's Express backend with Gmail SMTP.
  </div>
</div>
      `
    };

    await getTransporter(gmailUser, gmailPass).sendMail(mailOptions);
    console.log('[Gmail SMTP] Email sent successfully to', recipient);

    return res.status(200).json({
      success: true,
      message: 'Your inquiry has been submitted and sent successfully.'
    });

  } catch (error: any) {
    console.error('[Gmail SMTP Error] Failed to send email:', error);
    return res.status(500).json({
      success: false,
      message: `We couldn't send your inquiry right now. ${FALLBACK_CONTACT}`
    });
  }
});

app.all('/api/contact', (_req: express.Request, res: express.Response) => {
  res.status(405).set('Allow', 'POST').json({ success: false, message: 'Method not allowed.' });
});

app.all('/api/*', (_req: express.Request, res: express.Response) => {
  res.status(404).json({ success: false, message: 'Not found.' });
});

// JSON errors for the API (e.g. malformed or oversized bodies) instead of Express's HTML page
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!req.path.startsWith('/api/')) return next(err);
  const status = typeof err?.status === 'number' && err.status >= 400 && err.status < 500 ? err.status : 500;
  const message = status === 413
    ? `Your message is too long. ${FALLBACK_CONTACT}`
    : status === 500 ? `Something went wrong. ${FALLBACK_CONTACT}` : 'Invalid request.';
  if (status === 500) console.error('[API Error]', err);
  res.status(status).json({ success: false, message });
});

// Explicit Search Engine & Crawler Endpoints
app.get('/sitemap.xml', (_req: express.Request, res: express.Response) => {
  const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  res.header('Content-Type', 'application/xml; charset=utf-8');
  res.sendFile(sitemapPath);
});

app.get('/robots.txt', (_req: express.Request, res: express.Response) => {
  const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
  res.header('Content-Type', 'text/plain; charset=utf-8');
  res.sendFile(robotsPath);
});

// Vite middleware flow or Production static file server
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    // The server bundle is built into dist/ too; never serve it
    app.use(/^\/server\.cjs(\.map)?$/, (_req: express.Request, res: express.Response) => {
      res.status(404).end();
    });
    // Hashed build assets never change, so let browsers keep them
    app.use('/assets', express.static(path.join(distPath, 'assets'), { immutable: true, maxAge: '1y' }));
    app.use(express.static(distPath));
    app.get('*', (req: express.Request, res: express.Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
