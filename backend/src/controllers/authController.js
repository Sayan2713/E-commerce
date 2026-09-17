const { OAuth2Client } = require('google-auth-library');
const crypto = require('crypto');
const User = require('../models/User');
const Session = require('../models/Session');
const { signAccessToken, generateRefreshToken, hashToken } = require('../utils/tokens');
const { sendPasswordResetEmail } = require('../utils/mailer');
const { generateReferralCode } = require('../utils/referral');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function deviceLabelFrom(req) {
  return (req.headers['x-device-label'] || req.headers['user-agent'] || 'Unknown device').slice(0, 120);
}

async function createSession(user, req) {
  const { raw, hash, expiresAt } = generateRefreshToken();
  await Session.create({
    user: user._id,
    refreshTokenHash: hash,
    userAgent: req.headers['user-agent'],
    ip: req.ip,
    deviceLabel: deviceLabelFrom(req),
    expiresAt,
  });
  const accessToken = signAccessToken(user);
  return { accessToken, refreshToken: raw };
}

// POST /api/auth/register
exports.register = async (req, res) => {
  const { name, mobile, email, dob, password, confirmPassword, referralCode } = req.body;
  if (!name || !password || (!mobile && !email)) {
    return res.status(400).json({ message: 'name, password and mobile or email are required' });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }
  const existing = await User.findOne({ $or: [{ email }, { mobile }] });
  if (existing) return res.status(409).json({ message: 'Account already exists' });

  let referredBy;
  if (referralCode) {
    const referrer = await User.findOne({ referralCode: referralCode.toUpperCase() });
    if (referrer) referredBy = referrer._id;
    // silently ignore an invalid/unknown code rather than blocking signup over it
  }

  const user = new User({ name, mobile, email, dob, referredBy, referralCode: await generateReferralCode() });
  await user.setPassword(password);
  await user.save();

  const tokens = await createSession(user, req);
  res.status(201).json({ user: sanitize(user), ...tokens });
};

// POST /api/auth/login
exports.login = async (req, res) => {
  const { identifier, password } = req.body; // identifier = mobile or email
  const user = await User.findOne({ $or: [{ email: identifier }, { mobile: identifier }] });
  if (!user || !(await user.comparePassword(password))) {
    // TODO: suspicious-login detection hook - log failed attempt, rate-limit by IP/account
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const tokens = await createSession(user, req);
  res.json({ user: sanitize(user), ...tokens });
};

// POST /api/auth/google
exports.googleAuth = async (req, res) => {
  const { idToken } = req.body;
  const ticket = await googleClient.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID });
  const payload = ticket.getPayload();

  let user = await User.findOne({ $or: [{ googleId: payload.sub }, { email: payload.email }] });
  let isNew = false;
  if (!user) {
    isNew = true;
    user = await User.create({
      name: payload.name,
      email: payload.email,
      googleId: payload.sub,
      profilePic: payload.picture,
      profileComplete: false, // mobile/dob still missing
      referralCode: await generateReferralCode(),
    });
  } else if (!user.googleId) {
    user.googleId = payload.sub;
    await user.save();
  }

  const needsProfileCompletion = !user.mobile || !user.dob;
  const tokens = await createSession(user, req);
  res.json({ user: sanitize(user), ...tokens, isNew, needsProfileCompletion });
};

// POST /api/auth/complete-profile  (after google signup)
exports.completeProfile = async (req, res) => {
  const { mobile, dob } = req.body;
  const user = await User.findById(req.userId);
  if (mobile) user.mobile = mobile;
  if (dob) user.dob = dob;
  user.profileComplete = !!(user.mobile && user.dob);
  await user.save();
  res.json({ user: sanitize(user) });
};

// POST /api/auth/refresh
// Rotates the refresh token every call. If a token that was already rotated
// away gets reused, we treat it as theft: revoke the whole session chain.
exports.refresh = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: 'Missing refresh token' });
  const incomingHash = hashToken(refreshToken);

  const session = await Session.findOne({
    $or: [{ refreshTokenHash: incomingHash }, { previousTokenHash: incomingHash }],
  });
  if (!session || session.isRevoked || session.expiresAt < new Date()) {
    return res.status(401).json({ message: 'Session invalid, please log in again' });
  }

  if (session.previousTokenHash === incomingHash) {
    // reuse of a rotated-out token => likely stolen token; kill this session
    session.isRevoked = true;
    session.revokedReason = 'reuse-detected';
    await session.save();
    return res.status(401).json({ message: 'Security alert: session revoked, please log in again' });
  }

  const { raw, hash, expiresAt } = generateRefreshToken();
  session.previousTokenHash = session.refreshTokenHash;
  session.refreshTokenHash = hash;
  session.expiresAt = expiresAt;
  session.lastUsedAt = new Date();
  await session.save();

  const user = await User.findById(session.user);
  const accessToken = signAccessToken(user);
  res.json({ accessToken, refreshToken: raw });
};

// POST /api/auth/logout  (this device only)
exports.logout = async (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) {
    await Session.updateOne(
      { refreshTokenHash: hashToken(refreshToken) },
      { isRevoked: true, revokedReason: 'logout' }
    );
  }
  res.json({ message: 'Logged out' });
};

// POST /api/auth/logout-all  (requires valid access token)
exports.logoutAll = async (req, res) => {
  await Session.updateMany(
    { user: req.userId, isRevoked: false },
    { isRevoked: true, revokedReason: 'logout-all' }
  );
  res.json({ message: 'Logged out of all devices' });
};

// GET /api/auth/sessions  (device/session management list)
exports.listSessions = async (req, res) => {
  const sessions = await Session.find({ user: req.userId, isRevoked: false })
    .select('deviceLabel ip lastUsedAt createdAt expiresAt');
  res.json({ sessions });
};

// POST /api/auth/change-password
exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.userId);
  if (!(await user.comparePassword(oldPassword))) {
    return res.status(400).json({ message: 'Old password is incorrect' });
  }
  await user.setPassword(newPassword);
  await user.save();

  // password change invalidates all existing sessions (forces re-login everywhere)
  await Session.updateMany(
    { user: user._id, isRevoked: false },
    { isRevoked: true, revokedReason: 'password-change' }
  );

  res.json({ message: 'Password changed. Please log in again on all devices.' });
};

function sanitize(user) {
  const obj = user.toObject();
  delete obj.passwordHash;
  delete obj.resetTokenHash;
  return obj;
}

// POST /api/auth/forgot-password  { identifier }  (mobile or email)
// Always responds the same way whether or not the account exists, so this
// endpoint can't be used to enumerate registered emails/mobiles.
exports.forgotPassword = async (req, res) => {
  const { identifier } = req.body;
  const user = await User.findOne({ $or: [{ email: identifier }, { mobile: identifier }] });

  if (user && user.email) {
    const rawToken = crypto.randomBytes(32).toString('hex');
    user.resetTokenHash = hashToken(rawToken);
    user.resetTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    const resetUrl = `${process.env.WEB_APP_URL || 'http://localhost:5173'}/reset-password?token=${rawToken}&email=${encodeURIComponent(user.email)}`;
    await sendPasswordResetEmail(user.email, resetUrl);
  }
  // Note: if the account has no email on file (mobile-only signup), there's
  // nowhere to send a link - still return the generic success message.

  res.json({ message: 'If an account exists for that email, a reset link has been sent.' });
};

// POST /api/auth/reset-password  { email, token, newPassword }
exports.resetPassword = async (req, res) => {
  const { email, token, newPassword } = req.body;
  if (!email || !token || !newPassword) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  const user = await User.findOne({ email, resetTokenHash: hashToken(token) });
  if (!user || !user.resetTokenExpiresAt || user.resetTokenExpiresAt < new Date()) {
    return res.status(400).json({ message: 'This reset link is invalid or has expired' });
  }

  await user.setPassword(newPassword);
  user.resetTokenHash = undefined;
  user.resetTokenExpiresAt = undefined;
  await user.save();

  // same rule as a manual password change: kill all existing sessions
  await Session.updateMany(
    { user: user._id, isRevoked: false },
    { isRevoked: true, revokedReason: 'password-change' }
  );

  res.json({ message: 'Password reset successfully. Please log in.' });
};
