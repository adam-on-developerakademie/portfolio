const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

const envFilePath = path.resolve(__dirname, '../.env');
const requiredSmtpKeys = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM_EMAIL', 'SMTP_TO_EMAIL'];

dotenv.config({ path: envFilePath, override: true });

const app = express();
const port = Number(process.env.PORT || 3001);

app.use(express.json({ limit: '1mb' }));

// Reads and validates the .env file before request handling starts.
function readEnvFileDiagnostics(filePath) {
  try {
    if (!fs.existsSync(filePath)) return { fileExists: false, fileReadable: false, missingKeys: requiredSmtpKeys, placeholderKeys: [], readError: '.env file not found' };
    const parsed = dotenv.parse(fs.readFileSync(filePath, 'utf8'));
    return { fileExists: true, fileReadable: true, missingKeys: requiredSmtpKeys.filter((key) => !parsed[key]), placeholderKeys: requiredSmtpKeys.filter((key) => isPlaceholderValue(parsed[key])) };
  } catch (error) {
    return { fileExists: true, fileReadable: false, missingKeys: requiredSmtpKeys, placeholderKeys: [], readError: error instanceof Error ? error.message : 'Unable to read .env file' };
  }
}

// Stores a startup snapshot of the .env file state for later requests.
const envFileDiagnostics = readEnvFileDiagnostics(envFilePath);

// Returns whether request-scoped debug output is enabled.
function isDebugModeEnabled(req) {
  return parseBool(req.query?.debug, false) || parseBool(process.env.SMTP_DEBUG, false);
}

// Builds a compact environment validation result from the startup snapshot.
function validateEnvFileConfig() {
  return {
    ...envFileDiagnostics,
    placeholderKeys: envFileDiagnostics.placeholderKeys || [],
    missingKeys: envFileDiagnostics.missingKeys || []
  };
}

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

// Detects template-like placeholder values that should never be used in production.
function isPlaceholderValue(value) {
  const normalized = String(value || '').trim().toLowerCase();
  const markers = ['dein_', 'your_', 'changeme', 'example.com', 'placeholder'];
  return markers.some((marker) => normalized.includes(marker));
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
function respondWithConfigError(res, configErrors, debugMode) {
  const details = getConfigErrorDetails(configErrors, debugMode);
  return res.status(500).json({
    success: false,
    message: debugMode ? 'Invalid SMTP configuration' : 'Email service is not ready',
    ...(details ? { details } : {})
  });
}

// Builds a debug-only diagnostic message for SMTP configuration failures.
function getConfigErrorDetails(configErrors, debugMode) {
  if (!debugMode) return '';
  const details = [];
  if (!configErrors.fileExists) details.push(`.env file not found at ${envFilePath}`);
  if (configErrors.readError) details.push(`.env read error: ${configErrors.readError}`);
  if (configErrors.missingKeys.length) details.push(`Missing keys: ${configErrors.missingKeys.join(', ')}`);
  if (configErrors.placeholderKeys.length) details.push(`Placeholder values: ${configErrors.placeholderKeys.join(', ')}`);
  return details.join(' | ');
}

// Executes SMTP send and maps failures to a stable API response.
async function sendContactResponse(res, name, email, message, debugMode) {
  try {
    await sendContactMail(name, email, message);
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: debugMode ? 'Failed to send email' : 'Email send failed',
      ...(debugMode ? { details: error instanceof Error ? error.message : 'Unknown error' } : {})
    });
  }
}

// Handles contact form requests including validation and SMTP delivery.
async function handleContactRequest(req, res) {
  const debugMode = isDebugModeEnabled(req);
  const configErrors = validateEnvFileConfig();
  if (configErrors.missingKeys.length || configErrors.placeholderKeys.length) {
    return respondWithConfigError(res, configErrors, debugMode);
  }

  const payloadError = validateContactPayload(req.body);
  if (payloadError) return res.status(400).json({ success: false, message: debugMode ? payloadError : 'Invalid contact form data' });

  const { name, email, message } = req.body;
  return sendContactResponse(res, name, email, message, debugMode);
}

app.post('/api/contact', async (req, res) => {
  return handleContactRequest(req, res);
});

app.listen(port, () => {
  console.log(`SMTP contact API listening on port ${port}`);
});
