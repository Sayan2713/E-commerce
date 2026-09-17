// Runs as both a standalone CLI script AND an importable function used by
// the in-process cron scheduler in server.js - see the bottom of this file
// for which mode is active.
//
// Standalone (external cron):
//   0 * * * * cd /path/to/backend && node src/scripts/checkAbandonedCarts.js
//
// In-process (already wired into server.js via node-cron - no setup needed,
// runs automatically every hour as long as the server is running):
//   just start the server normally with `npm run dev` / `npm start`.
const mongoose = require('mongoose');
const CheckoutSession = require('../models/CheckoutSession');
const Product = require('../models/Product');
const User = require('../models/User');
const { sendExpoPush } = require('../utils/expoPush');

const REMINDER_DELAY_MS = 60 * 60 * 1000; // remind 1 hour after checkout was started

async function checkAbandonedCarts() {
  const cutoff = new Date(Date.now() - REMINDER_DELAY_MS);
  const candidates = await CheckoutSession.find({
    converted: false,
    reminderSent: false,
    createdAt: { $lte: cutoff },
  });

  if (candidates.length === 0) return { checked: 0, remindersSent: 0 };

  console.log(`[abandoned-cart] Found ${candidates.length} abandoned checkout(s) to remind.`);
  let remindersSent = 0;

  for (const session of candidates) {
    const [user, product] = await Promise.all([
      User.findById(session.user),
      Product.findById(session.product),
    ]);

    if (user?.expoPushToken && product) {
      await sendExpoPush(
        user.expoPushToken,
        'Still thinking it over?',
        `${product.name} (size ${session.size}) is still in your bag - complete your order before it sells out.`,
        { productId: product._id.toString(), screen: 'Product' }
      );
      remindersSent += 1;
    }

    // mark as sent regardless of whether a push token existed, so we don't
    // keep re-checking (and re-logging) the same stale session forever
    session.reminderSent = true;
    await session.save();
  }

  console.log(`[abandoned-cart] Sent ${remindersSent} reminder(s).`);
  return { checked: candidates.length, remindersSent };
}

// CLI mode: only connects/disconnects/exits when run directly
// (`node checkAbandonedCarts.js`), not when imported by server.js.
if (require.main === module) {
  require('dotenv').config();
  mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/clothstore')
    .then(checkAbandonedCarts)
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('[abandoned-cart] Job failed:', err);
      process.exit(1);
    });
}

module.exports = { checkAbandonedCarts };
