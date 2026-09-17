const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const addressSchema = new mongoose.Schema({
  label: { type: String, default: 'Home' },
  fullName: String,
  phone: String,
  line1: String,
  line2: String,
  landmark: String,
  postOffice: String,
  city: String,
  state: String,
  pincode: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
  mobile: { type: String, unique: true, sparse: true, trim: true },
  dob: { type: Date },
  passwordHash: { type: String }, // absent for pure Google-auth accounts until they set one
  googleId: { type: String, index: true, sparse: true },
  profilePic: { type: String, default: '' },
  addresses: [addressSchema],
  savedItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],

  // Google-auth profile completion tracking
  profileComplete: { type: Boolean, default: true }, // false until mobile+dob filled for google signups

  role: { type: String, enum: ['customer'], default: 'customer' },
  expoPushToken: { type: String },

  // Referral program
  referralCode: { type: String, unique: true, sparse: true, uppercase: true },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  referralRewardIssued: { type: Boolean, default: false }, // set true once the referrer's reward has been granted for this user's first delivered order

  // password reset
  resetTokenHash: { type: String },
  resetTokenExpiresAt: { type: Date },

  // security
  passwordChangedAt: { type: Date },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

userSchema.methods.setPassword = async function (plain) {
  this.passwordHash = await bcrypt.hash(plain, 12);
  this.passwordChangedAt = new Date();
};

userSchema.methods.comparePassword = function (plain) {
  if (!this.passwordHash) return Promise.resolve(false);
  return bcrypt.compare(plain, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);
