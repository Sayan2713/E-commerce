require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');
const Product = require('./models/Product');

const PORT = process.env.ADMIN_PORT || 5050;

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/clothstore')
  .then(async () => {
    console.log('Admin API connected to MongoDB');

    // Drops any indexes on `products` that no longer match the current
    // schema and creates whatever's missing. This exists specifically to
    // self-heal a stale/broken index left over from an earlier version of
    // this schema (a bad compound text index that crashed every product
    // insert) - without this, fixing the schema in code alone doesn't
    // remove an index that already exists in the database, and you'd have
    // to go drop it by hand in mongosh/Compass. Safe to leave in
    // permanently: it's a no-op once indexes are already in sync.
    try {
      await Product.syncIndexes();
      console.log('Product indexes are in sync.');
    } catch (err) {
      console.error('Could not sync Product indexes (non-fatal, continuing):', err.message);
    }

    app.listen(PORT, () => console.log(`Admin API running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('DB connection failed', err);
    process.exit(1);
  });
