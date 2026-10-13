import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { createServer as createViteServer } from 'vite';

// Load env variables
dotenv.config();

const app = express();
const PORT = 3000;

app.set('trust proxy', 1);
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

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.'
      });
    }

    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_APP_PASSWORD;
    const recipient = process.env.CONTACT_RECIPIENT_EMAIL || gmailUser;

    console.log(`[Contact Form] Submission received:`, { name, company, email, subject });

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

    // Lazy initialize nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });

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

    await transporter.sendMail(mailOptions);
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
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
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
