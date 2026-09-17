const jwt = require('jsonwebtoken');

function requireAdmin(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Not authenticated' });
  try {
    const payload = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
    req.adminId = payload.sub;
    req.adminRole = payload.role;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

function requireSuperAdmin(req, res, next) {
  if (req.adminRole !== 'SUPER_ADMIN') return res.status(403).json({ message: 'Forbidden' });
  next();
}

module.exports = { requireAdmin, requireSuperAdmin };
