require('dotenv').config();
const cron = require('node-cron');
const app = require('./app');
const connectDB = require('./config/db');
const { checkAbandonedCarts } = require('./scripts/checkAbandonedCarts');
const Product = require('./models/Product');

const PORT = process.env.PORT || 5000;

connectDB()
  .then(async () => {
    // Self-heals any stale/broken indexes on `products` left over from an
    // earlier schema version (see admin-backend/src/server.js for the full
    // story - this is the other process that also touches this collection,
    // so it needs the same fix).
    try {
      await Product.syncIndexes();
      console.log('Product indexes are in sync.');
    } catch (err) {
      console.error('Could not sync Product indexes (non-fatal, continuing):', err.message);
    }

    app.listen(PORT, () => console.log(`Customer API running on port ${PORT}`));

    // Abandoned-cart reminder job: runs automatically every hour as long as
    // this server process is running - no external cron setup needed. Set
    // ABANDONED_CART_CRON_ENABLED=false in .env to disable (e.g. if you'd
    // rather run backend/src/scripts/checkAbandonedCarts.js via an external
    // cron/scheduler instead, on a multi-instance deploy where you only
    // want one instance running this job).
    if (process.env.ABANDONED_CART_CRON_ENABLED !== 'false') {
      cron.schedule('0 * * * *', () => {
        checkAbandonedCarts().catch((err) => console.error('[abandoned-cart] Scheduled run failed:', err));
      });
      console.log('Abandoned-cart reminder job scheduled (hourly).');
    }
  })
  .catch((err) => {
    console.error('DB connection failed', err);
    process.exit(1);
  });
