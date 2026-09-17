const mongoose = require('mongoose');

const supportMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  subject: String,
  message: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // set if submitted while logged in
  status: { type: String, enum: ['OPEN', 'RESOLVED'], default: 'OPEN' },
}, { timestamps: true });

module.exports = mongoose.model('SupportMessage', supportMessageSchema);
