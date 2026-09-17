const rateLimit = require('express-rate-limit');

// Shared response shape/logging for anything that gets rate limited.
function limiterHandler(req, res) {
  res.status(429).json({ message: 'Too many attempts. Please wait a bit and try again.' });
}

// Login: keyed by IP - a few tries per minute is plenty for a real user
// who mistyped their password, but stops credential-stuffing/brute force.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  handler: limiterHandler,
  message: { message: 'Too many login attempts. Please try again in a few minutes.' },
});

// Registration: prevents scripted mass account creation from one IP.
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: limiterHandler,
});

// Forgot-password: this is the easiest one to abuse for spam/email-bombing
// a victim's inbox, so it gets the tightest limit.
const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: limiterHandler,
});

// Generic fallback for other auth-adjacent routes (refresh, google, reset)
// that don't need a bespoke limit but shouldn't be wide open either.
const authGeneralLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  handler: limiterHandler,
});

module.exports = { loginLimiter, registerLimiter, forgotPasswordLimiter, authGeneralLimiter };
