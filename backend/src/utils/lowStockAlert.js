const sgMail = require('@sendgrid/mail');

let configured = false;
function ensureConfigured() {
  if (configured) return;
  if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    configured = true;
  }
}

/**
 * Call after any stock decrement. Emails ADMIN_ALERT_EMAIL once per variant
 * per low-stock "episode" - lowStockAlertSent stays true until the variant
 * is restocked above its threshold (reset in the admin stock-update route),
 * so this doesn't spam an email per unit sold while stock stays low.
 */
async function checkAndSendLowStockAlert(product) {
  let alertsSent = false;

  for (const variant of product.variants) {
    const threshold = product.lowStockThreshold ?? 5;
    const isLow = !variant.outOfStock && variant.stock > 0 && variant.stock <= threshold;

    if (isLow && !variant.lowStockAlertSent) {
      variant.lowStockAlertSent = true;
      alertsSent = true;
      await sendLowStockEmail(product, variant);
    }
  }

  if (alertsSent) await product.save();
}

async function sendLowStockEmail(product, variant) {
  ensureConfigured();
  const to = process.env.ADMIN_ALERT_EMAIL;
  if (!to) {
    console.log(`[low-stock] ${product.name} (${variant.size}) is down to ${variant.stock} units - set ADMIN_ALERT_EMAIL to get an email for this.`);
    return;
  }

  const html = `
    <p><strong>${product.name}</strong> (size ${variant.size}) is down to <strong>${variant.stock}</strong> units - at or below the low-stock threshold of ${product.lowStockThreshold ?? 5}.</p>
    <p>Restock it or adjust the threshold from the admin panel's Products page.</p>
  `;

  if (!configured) {
    console.log(`[low-stock] ${product.name} (${variant.size}): ${variant.stock} left (SENDGRID_API_KEY not set, email not sent)`);
    return;
  }

  try {
    await sgMail.send({
      to,
      from: process.env.SENDGRID_FROM_EMAIL || 'no-reply@clothstore.com',
      subject: `Low stock: ${product.name} (${variant.size})`,
      html,
    });
  } catch (err) {
    console.error('Low-stock alert email failed:', err.message);
  }
}

module.exports = { checkAndSendLowStockAlert };
