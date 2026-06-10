import "./loadEnv.js";
import { Hono } from 'hono'
import { serveStatic } from '@hono/node-server/serve-static'
import { serve } from '@hono/node-server';
import nodemailer from 'nodemailer';
import fs from 'fs';

const app = new Hono();

// Helper to create SMTP mail transporter if settings are configured in env.json
const getTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587');
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for 587 or others
      auth: { user, pass }
    });
  }
  return null;
};

// Helper to save all submissions persistently on the server to prevent data loss
const saveSubmission = (type: string, data: any) => {
  const filePath = './submissions.json';
  let submissions = [];
  if (fs.existsSync(filePath)) {
    try {
      submissions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
      submissions = [];
    }
  }
  submissions.push({
    id: Date.now().toString(),
    type,
    data,
    timestamp: new Date().toISOString()
  });
  fs.writeFileSync(filePath, JSON.stringify(submissions, null, 2), 'utf8');
};

// API Endpoint: Contact message submissions
app.post('/_api/contact', async (c) => {
  try {
    const { name, email, subject, message } = await c.req.json();

    if (!name || !email || !subject || !message) {
      return c.json({ error: 'Lütfen tüm alanları doldurun.' }, 400);
    }

    // 1. Save locally to server disk
    saveSubmission('contact', { name, email, subject, message });

    // 2. Email notify
    const transporter = getTransporter();
    const mailOptions = {
      from: process.env.SMTP_FROM || 'no-reply@mihrapp.com.tr',
      to: 'bilgi@mihrapp.com.tr',
      subject: `Mihrapp Yeni İletişim Mesajı: ${subject}`,
      text: `Mihrapp web sitesinden yeni bir iletişim mesajı alındı.\n\n` +
            `Gönderen Adı: ${name}\n` +
            `E-posta: ${email}\n` +
            `Konu: ${subject}\n\n` +
            `Mesaj:\n${message}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #d4af37; border-radius: 8px; background-color: #0c0c0c; color: #fff;">
          <h2 style="color: #d4af37; border-bottom: 2px solid #d4af37; padding-bottom: 10px; margin-top: 0;">Yeni İletişim Mesajı</h2>
          <p><strong>Gönderen Adı:</strong> ${name}</p>
          <p><strong>E-posta:</strong> <a href="mailto:${email}" style="color: #d4af37;">${email}</a></p>
          <p><strong>Konu:</strong> ${subject}</p>
          <hr style="border: 0; border-top: 1px solid rgba(212, 175, 55, 0.2); margin: 20px 0;" />
          <p><strong>Mesaj:</strong></p>
          <p style="background-color: rgba(255, 255, 255, 0.03); padding: 15px; border-radius: 5px; border-left: 4px solid #d4af37; white-space: pre-wrap; color: #e5e5e5; line-height: 1.6;">${message}</p>
        </div>
      `
    };

    if (transporter) {
      await transporter.sendMail(mailOptions);
      console.log(`[Email Sent] Contact form from ${email} to bilgi@mihrapp.com.tr`);
    } else {
      console.log(`[Local Simulation] SMTP credentials not set. Contact form saved & logged:\n`, mailOptions);
    }

    return c.json({ success: true, message: 'Mesajınız başarıyla iletildi.' });
  } catch (err: any) {
    console.error('Contact API error:', err);
    return c.json({ error: 'Mesaj gönderilirken bir hata oluştu: ' + err.message }, 500);
  }
});

// API Endpoint: Newsletter subscribe submissions
app.post('/_api/subscribe', async (c) => {
  try {
    const { email } = await c.req.json();

    if (!email || !email.includes('@')) {
      return c.json({ error: 'Lütfen geçerli bir e-posta adresi giriniz.' }, 400);
    }

    // 1. Save locally to server disk
    saveSubmission('newsletter', { email });

    // 2. Email notify
    const transporter = getTransporter();
    const mailOptions = {
      from: process.env.SMTP_FROM || 'no-reply@mihrapp.com.tr',
      to: 'bilgi@mihrapp.com.tr',
      subject: `Mihrapp Yeni Bülten Aboneliği`,
      text: `Mihrapp bültenine yeni bir abone eklendi.\n\nE-posta: ${email}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #d4af37; border-radius: 8px; background-color: #0c0c0c; color: #fff;">
          <h2 style="color: #d4af37; border-bottom: 2px solid #d4af37; padding-bottom: 10px; margin-top: 0;">Yeni Bülten Aboneliği</h2>
          <p>Mihrapp web sitesi bültenine yeni bir kullanıcı kaydoldu.</p>
          <p><strong>E-posta:</strong> <a href="mailto:${email}" style="color: #d4af37;">${email}</a></p>
        </div>
      `
    };

    if (transporter) {
      await transporter.sendMail(mailOptions);
      console.log(`[Email Sent] Newsletter subscription for ${email} to bilgi@mihrapp.com.tr`);
    } else {
      console.log(`[Local Simulation] SMTP credentials not set. Newsletter subscription saved & logged:\n`, mailOptions);
    }

    return c.json({ success: true, message: 'Bültene başarıyla abone olundu.' });
  } catch (err: any) {
    console.error('Newsletter API error:', err);
    return c.json({ error: 'Abone olunurken bir hata oluştu: ' + err.message }, 500);
  }
});

app.use('/*', serveStatic({ root: './dist' }))
app.get("*", async (c, next) => {
  const p = c.req.path;
  if (p.startsWith("/_api")) {
    return next();
  }
  return serveStatic({ path: "./dist/index.html" })(c, next);
});

serve({ fetch: app.fetch, port: 3344 });
console.log("Running at http://localhost:3344");