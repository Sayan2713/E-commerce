const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email: email.toLowerCase() });
  if (!admin || !(await admin.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  if (!admin.isActive) {
    return res.status(403).json({ message: 'This account has been deactivated' });
  }
  const token = jwt.sign(
    { sub: admin._id.toString(), role: admin.role },
    process.env.ADMIN_JWT_SECRET,
    { expiresIn: '12h' }
  );
  res.json({ token, admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role } });
};

exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const admin = await Admin.findById(req.adminId);
  if (!(await admin.comparePassword(oldPassword))) {
    return res.status(400).json({ message: 'Old password incorrect' });
  }
  await admin.setPassword(newPassword);
  await admin.save();
  res.json({ message: 'Password updated' });
};
