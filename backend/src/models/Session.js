const mongoose = require('mongoose');

/**
 * One document per logged-in device.
 * Refresh tokens rotate: every refresh issues a new refreshTokenHash and
 * invalidates the old one (old value moves to previous for a short grace
 * window so we can detect token re-use = theft).
 */
const sessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  refreshTokenHash: { type: String, required: true },
  previousTokenHash: { type: String }, // for reuse detection after rotation
  userAgent: String,
  ip: String,
  deviceLabel: String, // e.g. "Chrome on Windows" / "Expo App - Android"
  isRevoked: { type: Boolean, default: false },
  revokedReason: String, // 'logout' | 'logout-all' | 'password-change' | 'reuse-detected' | 'expired'
  lastUsedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true }, // now + 1 year per requirement
}, { timestamps: true });

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // auto-cleanup

module.exports = mongoose.model('Session', sessionSchema);
