import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { createServer as createViteServer } from 'vite';

// Load env variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API route for Contact Form
app.post('/api/contact', async (req: express.Request, res: express.Response) => {
  try {
    const { name, company, email, phone, service, kegs, subject, message } = req.body;

    // Validate request
    if (!name || !company || !email || !phone || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields.'
      });
    }

    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_APP_PASSWORD;
    const recipient = process.env.CONTACT_RECIPIENT_EMAIL || gmailUser;

    console.log(`[Contact Form] Submission received:`, { name, company, email, subject });

    if (!gmailUser || !gmailPass) {
      console.warn('[Gmail SMTP] GMAIL_USER or GMAIL_APP_PASSWORD credentials are missing. Simulating delivery.');
      return res.status(200).json({
        success: true,
        simulated: true,
        message: 'Gmail SMTP credentials are not configured in environment variables. The form submission was simulated successfully on the server.',
        data: { name, company, email, phone, service, kegs, subject, message }
      });
    }

    // Lazy initialize nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });

    const mailOptions = {
      from: `"${name} (${company})" <${gmailUser}>`, // Must send from the authenticated Gmail address
      to: recipient,
      replyTo: email, // Extremely important so replies go to the user
      subject: `[Hero Keg Inquiry] ${subject}`,
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
        <td style="padding: 8px 0; color: #1f2937;">${name}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-weight: bold; color: #4b5563;">Company:</td>
        <td style="padding: 8px 0; color: #1f2937;">${company}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-weight: bold; color: #4b5563;">Email Address:</td>
        <td style="padding: 8px 0; color: #1f2937;"><a href="mailto:${email}" style="color: #C5A059; text-decoration: none;">${email}</a></td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-weight: bold; color: #4b5563;">Phone Number:</td>
        <td style="padding: 8px 0; color: #1f2937;"><a href="tel:${phone}" style="color: #C5A059; text-decoration: none;">${phone}</a></td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-weight: bold; color: #4b5563;">Service Required:</td>
        <td style="padding: 8px 0; color: #1f2937;">${service || 'Not specified'}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-weight: bold; color: #4b5563;">Approx. Kegs:</td>
        <td style="padding: 8px 0; color: #1f2937;">${kegs || 'Not specified'}</td>
      </tr>
    </table>

    <h2 style="font-size: 18px; font-weight: bold; border-bottom: 2px solid #C5A059; padding-bottom: 8px; color: #183346; margin-top: 24px;">Subject: ${subject}</h2>
    <div style="background-color: #f9fafb; padding: 16px; border-radius: 4px; border-left: 4px solid #C5A059; margin-top: 12px; white-space: pre-wrap; font-size: 14px; color: #374151;">
${message}
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
      simulated: false,
      message: 'Your inquiry has been submitted and sent successfully.'
    });

  } catch (error: any) {
    console.error('[Gmail SMTP Error] Failed to send email:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while routing your inquiry via email. Please check your SMTP settings or try again later.',
      error: error?.message || 'Unknown error'
    });
  }
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
