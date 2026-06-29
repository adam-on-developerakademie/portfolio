const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3001);

app.use(express.json({ limit: '1mb' }));

// Sends basic runtime diagnostics for backend health checks.
function handleHealthRequest(_req, res) {
  return res.json({
    success: true,
    status: 'ok',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
}

// Exposes backend health diagnostics endpoint.
app.get('/api/health', handleHealthRequest);

// Parses boolean-like env values safely (true/false, 1/0, yes/no).
function parseBool(value, fallback) {
  if (value === undefined) return fallback;
  const normalized = String(value).trim().toLowerCase();
  if (['true', '1', 'yes', 'y', 'on'].includes(normalized)) return true;
  if (['false', '0', 'no', 'n', 'off'].includes(normalized)) return false;
  return fallback;
}

// Builds transport security options from SMTP environment values.
function getSmtpSecurityOptions() {
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpUseTls = parseBool(process.env.SMTP_USE_TLS, false);
  const smtpUseSsl = parseBool(process.env.SMTP_USE_SSL, false);
  const secure = smtpPort === 465 || smtpUseSsl;
  const requireTLS = smtpPort === 587 || smtpUseTls;
  return { smtpPort, secure, requireTLS: !secure && requireTLS };
}

// Returns configured SMTP transport options from environment values.
function getSmtpConfig() {
  const { smtpPort, secure, requireTLS } = getSmtpSecurityOptions();
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

// Returns required SMTP keys that are missing from environment values.
function getMissingSmtpKeys() {
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

// Detects template-like placeholder values that should never be used in production.
function isPlaceholderValue(value) {
  const normalized = String(value || '').trim().toLowerCase();
  const markers = ['dein_', 'your_', 'changeme', 'example.com', 'placeholder'];
  return markers.some((marker) => normalized.includes(marker));
}

// Returns SMTP keys that still contain unresolved placeholder values.
function getPlaceholderSmtpKeys() {
  const keys = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM_EMAIL', 'SMTP_TO_EMAIL'];
  return keys.filter((key) => isPlaceholderValue(process.env[key]));
}

// Validates server environment configuration for SMTP sending.
function validateServerConfig() {
  return {
    missingKeys: getMissingSmtpKeys(),
    placeholderKeys: getPlaceholderSmtpKeys()
  };
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

// Builds plain text mail body from sanitized contact request values.
function buildContactMailText(name, email, message, timestamp) {
  return [
    `Name: ${name}`,
    `Email: ${email}`,
    '',
    'Message:',
    String(message),
    '',
    `Timestamp: ${timestamp}`
  ].join('\n');
}

// Creates a nodemailer-compatible mail options object.
function buildContactMailOptions(name, email, message, timestamp) {
  return {
    from: `${process.env.SMTP_FROM_NAME || 'Portfolio Contact'} <${process.env.SMTP_FROM_EMAIL}>`,
    to: process.env.SMTP_TO_EMAIL,
    replyTo: email,
    subject: `Portfolio contact: ${name}`,
    text: buildContactMailText(name, email, message, timestamp)
  };
}

// Sends a configured SMTP message for a validated contact payload.
async function sendContactMail(name, email, message) {
  const transporter = nodemailer.createTransport(getSmtpConfig());
  const timestamp = new Date().toLocaleString('de-DE', {
    dateStyle: 'medium',
    timeStyle: 'medium'
  });
  await transporter.sendMail(buildContactMailOptions(name, email, message, timestamp));
}

// Sends HTTP validation error for invalid or incomplete SMTP configuration.
function respondWithConfigError(res, configErrors) {
  const details = [];
  if (configErrors.missingKeys.length) details.push(`Missing: ${configErrors.missingKeys.join(', ')}`);
  if (configErrors.placeholderKeys.length) {
    details.push(`Invalid placeholder values: ${configErrors.placeholderKeys.join(', ')}`);
  }
  return res.status(500).json({
    success: false,
    message: 'Invalid SMTP configuration',
    details: details.join(' | ')
  });
}

// Executes SMTP send and maps failures to a stable API response.
async function sendContactResponse(res, name, email, message) {
  try {
    await sendContactMail(name, email, message);
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to send email',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Handles contact form requests including validation and SMTP delivery.
async function handleContactRequest(req, res) {
  const configErrors = validateServerConfig();
  if (configErrors.missingKeys.length || configErrors.placeholderKeys.length) {
    return respondWithConfigError(res, configErrors);
  }

  const payloadError = validateContactPayload(req.body);
  if (payloadError) return res.status(400).json({ success: false, message: payloadError });

  const { name, email, message } = req.body;
  return sendContactResponse(res, name, email, message);
}

app.post('/api/contact', async (req, res) => {
  return handleContactRequest(req, res);
});

app.listen(port, () => {
  console.log(`SMTP contact API listening on port ${port}`);
});
