const sgMail = require('@sendgrid/mail');

let configured = false;
function ensureConfigured() {
  if (configured) return;
  if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    configured = true;
  }
}

async function sendPasswordResetEmail(to, resetUrl) {
  const html = `
    <p>You requested a password reset for your ClothStore account.</p>
    <p><a href="${resetUrl}">Click here to reset your password</a></p>
    <p>This link expires in 1 hour. If you didn't request this, you can ignore this email.</p>
  `;

  ensureConfigured();

  if (!configured) {
    // No SendGrid API key set (e.g. local dev) - log instead of failing
    // silently, so the reset flow is still testable end-to-end.
    console.log('--- Password reset email (SENDGRID_API_KEY not set) ---');
    console.log(`To: ${to}`);
    console.log(`Reset URL: ${resetUrl}`);
    console.log('---------------------------------------------------------');
    return;
  }

  await sgMail.send({
    to,
    from: process.env.SENDGRID_FROM_EMAIL || 'no-reply@clothstore.com',
    subject: 'Reset your ClothStore password',
    html,
  });
}

module.exports = { sendPasswordResetEmail };
