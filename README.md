# Portfolio

Compact guide to run the project locally with full functionality, including contact form email delivery.

## 1) Prerequisites

Install the following tools first:

- Git
- Node.js 20+ (including npm)
- SMTP credentials from an email provider (for example Gmail App Password, Office365, or a custom SMTP server)

Check your installation:

```bash
node -v
npm -v
git --version
```

## 2) Download the project

```bash
git clone https://github.com/adam-on-developerakademie/portfolio.git
cd portfolio
```

## 3) Install dependencies

```bash
npm install
```

## 4) Configure environment variables for email

Copy the template:

```bash
cp .env.example .env
```

PowerShell alternative:

```powershell
Copy-Item .env.example .env
```

Then fill in the .env file. Required variables:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM_EMAIL`
- `SMTP_TO_EMAIL`

Optional variables:

- `PORT` (default: `3001`)
- `SMTP_FROM_NAME`
- `SMTP_USE_TLS`
- `SMTP_USE_SSL`

Important:

- .env.example is only a template.
- Real credentials must be stored only in .env, never in the repository.

## 5) Start the project (frontend + API)

```bash
npm run start:all
```

This starts:

- Angular frontend on `http://localhost:4200`
- Express API on `http://localhost:3001`

The frontend forwards /api/* requests to the API through proxy.conf.json.

## 6) Test email delivery

1. Open http://localhost:4200.
2. Fill out the contact form.
3. Send the message.
4. Confirm that the email arrives at SMTP_TO_EMAIL.

If delivery fails:

- Re-check SMTP values in .env.
- Verify port and TLS/SSL combination (typical: 587 + TLS or 465 + SSL).
- Review API logs in the terminal with npm run start:api.

## 7) Optional: production build

```bash
npm run build
```
