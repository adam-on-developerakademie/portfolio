const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3001);

app.use(express.json({ limit: '1mb' }));

// Parses boolean-like env values safely (true/false, 1/0, yes/no).
function parseBool(value, fallback) {
  if (value === undefined) return fallback;
  const normalized = String(value).trim().toLowerCase();
  if (['true', '1', 'yes', 'y', 'on'].includes(normalized)) return true;
  if (['false', '0', 'no', 'n', 'off'].includes(normalized)) return false;
  return fallback;
}

// Returns configured SMTP transport options from environment values.
function getSmtpConfig() {
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpUseTls = parseBool(process.env.SMTP_USE_TLS, false);
  const smtpUseSsl = parseBool(process.env.SMTP_USE_SSL, false);
  const secure = smtpPort === 465 || smtpUseSsl;
  const requireTLS = smtpPort === 587 || smtpUseTls;
  return {
    host: process.env.SMTP_HOST,
    port: smtpPort,
    secure,
    requireTLS: !secure && requireTLS,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  };
}

// Validates required server environment configuration for SMTP sending.
function validateServerConfig() {
  const required = [
    'SMTP_HOST',
    'SMTP_PORT',
    'SMTP_USER',
    'SMTP_PASS',
    'SMTP_FROM_EMAIL',
    'SMTP_TO_EMAIL'
  ];
  return required.filter((key) => !process.env[key]);
}

// Validates contact payload fields before SMTP processing.
function validateContactPayload(payload) {
  const { name, email, message, privacy } = payload || {};
  if (!name || String(name).trim().length < 2) return 'Invalid name';
  if (!email || !String(email).includes('@')) return 'Invalid email';
  if (!message || String(message).trim().length < 10) return 'Invalid message';
  if (privacy !== true) return 'Privacy consent is required';
  return null;
}

app.post('/api/contact', async (req, res) => {
  const configErrors = validateServerConfig();
  if (configErrors.length > 0) {
    return res.status(500).json({
      success: false,
      message: `Missing SMTP configuration: ${configErrors.join(', ')}`
    });
  }

  const payloadError = validateContactPayload(req.body);
  if (payloadError) {
    return res.status(400).json({ success: false, message: payloadError });
  }

  const { name, email, message } = req.body;
  const transporter = nodemailer.createTransport(getSmtpConfig());
  const timestamp = new Date().toLocaleString('de-DE', {
    dateStyle: 'medium',
    timeStyle: 'medium'
  });

  try {
    await transporter.sendMail({
      from: `${process.env.SMTP_FROM_NAME || 'Portfolio Contact'} <${process.env.SMTP_FROM_EMAIL}>`,
      to: process.env.SMTP_TO_EMAIL,
      replyTo: email,
      subject: `Portfolio contact: ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        '',
        'Message:',
        String(message),
        '',
        `Timestamp: ${timestamp}`
      ].join('\n')
    });

    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to send email',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.listen(port, () => {
  console.log(`SMTP contact API listening on port ${port}`);
});
