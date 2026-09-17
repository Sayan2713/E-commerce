const mongoose = require('mongoose');

const storeSettingsSchema = new mongoose.Schema({
  singleton: { type: String, default: 'CONFIG', unique: true },
  whatsappNumber: String, // stored as digits with country code, e.g. "919876543210" - used to build a wa.me link
  supportPhone: String,
  supportEmail: String,
  socialLinks: {
    instagram: String,
    facebook: String,
    twitter: String,
    youtube: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('StoreSettings', storeSettingsSchema);
