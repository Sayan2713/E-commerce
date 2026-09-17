const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const catalogRoutes = require('./routes/catalogRoutes');
const userRoutes = require('./routes/userRoutes');
const { router: uploadRoutes } = require('./routes/uploadRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const statsRoutes = require('./routes/statsRoutes');
const supportRoutes = require('./routes/supportRoutes');

const app = express();
const isProduction = process.env.NODE_ENV === 'production';

// Required so req.ip reflects the real client IP (not the load balancer's)
// when this sits behind Render/Railway/nginx/etc. - rate limiting keys on
// req.ip, so this matters for it to work correctly in production.
if (isProduction) app.set('trust proxy', 1);

// Optional: redirect HTTP -> HTTPS. Most hosts (Render, Railway, Vercel,
// AWS ALB, etc.) terminate TLS for you and this isn't needed - only turn it
// on if you're running behind a bare reverse proxy that forwards plain HTTP.
if (process.env.FORCE_HTTPS === 'true') {
  app.use((req, res, next) => {
    if (req.secure || req.headers['x-forwarded-proto'] === 'https') return next();
    res.redirect(301, `https://${req.headers.host}${req.originalUrl}`);
  });
}

app.use(helmet());

// CORS: in production this must be an explicit allow-list - wildcard "*"
// would let any website's frontend call these APIs (including with a
// logged-in user's cookies/headers, if credentialed requests are made from
// a browser). Fail loudly at boot if it's misconfigured in production
// rather than silently falling back to an open policy.
const corsOrigins = process.env.CORS_ORIGIN?.split(',').map((o) => o.trim()).filter(Boolean);
if (isProduction && (!corsOrigins || corsOrigins.length === 0)) {
  throw new Error('CORS_ORIGIN must be set to your production frontend URL(s) when NODE_ENV=production');
}
app.use(cors({
  origin: isProduction ? corsOrigins : (corsOrigins?.length ? corsOrigins : '*'),
  credentials: true,
}));

app.use(express.json({ limit: '2mb' }));

// Strips any request key starting with "$" or containing "." from
// req.body/req.query/req.params - closes the classic NoSQL-injection hole
// where e.g. { "identifier": { "$ne": null } } could otherwise short-circuit
// a Mongo query.
app.use(mongoSanitize());

app.use(morgan(isProduction ? 'combined' : 'dev'));

// Defense-in-depth: a generous ceiling on the whole API, on top of the
// tighter per-route limiters on auth endpoints (see middleware/rateLimiters.js).
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
}));

app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api', catalogRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api', reviewRoutes);
app.use('/api', statsRoutes);
app.use('/api', supportRoutes);

// central error handler
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Malformed request body' });
  }
  console.error(err);
  res.status(err.status || 500).json({ message: isProduction ? 'Something went wrong' : (err.message || 'Server error') });
});

module.exports = app;
