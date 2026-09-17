// Run once: node src/seedAdmin.js  "Owner Name" owner@example.com StrongPassword123
require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

async function run() {
  const [, , name, email, password] = process.argv;
  if (!name || !email || !password) {
    console.log('Usage: node src/seedAdmin.js "Name" email@example.com password');
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/clothstore');
  const existing = await Admin.findOne({ email: email.toLowerCase() });
  if (existing) {
    console.log('Admin already exists with that email.');
    process.exit(0);
  }
  const admin = new Admin({ name, email: email.toLowerCase(), role: 'SUPER_ADMIN' });
  await admin.setPassword(password);
  await admin.save();
  console.log('Super admin created:', admin.email);
  process.exit(0);
}

run();
