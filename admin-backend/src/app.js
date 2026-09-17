const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/adminAuthRoutes');
const productRoutes = require('./routes/adminProductRoutes');
const categoryRoutes = require('./routes/adminCategoryRoutes');
const bannerRoutes = require('./routes/adminBannerRoutes');
const couponRoutes = require('./routes/adminCouponRoutes');
const configRoutes = require('./routes/adminConfigRoutes');
const orderRoutes = require('./routes/adminOrderRoutes');
const uploadRoutes = require('./routes/adminUploadRoutes');
const staffRoutes = require('./routes/adminStaffRoutes');
const analyticsRoutes = require('./routes/adminAnalyticsRoutes');
const bulkProductRoutes = require('./routes/adminBulkProductRoutes');
const shippingWebhookRoutes = require('./routes/shippingWebhookRoutes');
const settingsRoutes = require('./routes/adminSettingsRoutes');

const app = express();
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) app.set('trust proxy', 1);

// Optional: redirect HTTP -> HTTPS. Most hosts terminate TLS for you and
// this isn't needed - only turn it on behind a bare reverse proxy.
if (process.env.FORCE_HTTPS === 'true') {
  app.use((req, res, next) => {
    if (req.secure || req.headers['x-forwarded-proto'] === 'https') return next();
    res.redirect(301, `https://${req.headers.host}${req.originalUrl}`);
  });
}

app.use(helmet());

// The admin panel is a much higher-value target than the storefront - it
// must NEVER fall back to an open CORS policy in production. This is your
// separate admin website's origin only, not the customer site's.
const adminCorsOrigins = process.env.ADMIN_CORS_ORIGIN?.split(',').map((o) => o.trim()).filter(Boolean);
if (isProduction && (!adminCorsOrigins || adminCorsOrigins.length === 0)) {
  throw new Error('ADMIN_CORS_ORIGIN must be set to your production admin frontend URL when NODE_ENV=production');
}
app.use(cors({
  origin: isProduction ? adminCorsOrigins : (adminCorsOrigins?.length ? adminCorsOrigins : '*'),
  credentials: true,
}));

app.use(express.json({ limit: '5mb' })); // slightly higher than customer API - admin forms carry more data
app.use(mongoSanitize());
app.use(morgan(isProduction ? 'combined' : 'dev'));

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500, // admin staff will legitimately make more calls per session than a shopper
  standardHeaders: true,
  legacyHeaders: false,
}));

app.get('/health', (req, res) => res.json({ ok: true }));

// static serving of generated GST invoice PDFs
app.use('/invoices', express.static(path.resolve(__dirname, '../invoices')));

app.use('/api/admin/auth', authRoutes);
app.use('/api/admin/products', productRoutes);
app.use('/api/admin/categories', categoryRoutes);
app.use('/api/admin/banners', bannerRoutes);
app.use('/api/admin/coupons', couponRoutes);
app.use('/api/admin/config', configRoutes);
app.use('/api/admin/orders', orderRoutes);
app.use('/api/admin/upload', uploadRoutes);
app.use('/api/admin/staff', staffRoutes);
app.use('/api/admin/analytics', analyticsRoutes);
app.use('/api/admin/bulk-products', bulkProductRoutes);

// Public webhook endpoint (Shiprocket calls this directly - no admin JWT,
// protected by a shared secret token instead, see shippingWebhookRoutes.js)
app.use('/api/shipping', shippingWebhookRoutes);
app.use('/api/admin', settingsRoutes);

app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Malformed request body' });
  }
  console.error(err);
  res.status(err.status || 500).json({ message: isProduction ? 'Something went wrong' : (err.message || 'Server error') });
});

module.exports = app;
