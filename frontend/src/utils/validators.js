export function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v || '');
}

export function isValidIndianMobile(v) {
  const digits = (v || '').replace(/\D/g, '');
  // Must be exactly 10 digits, starting 6-9 - previously this sliced to the
  // last 10 digits before checking, which silently accepted 11+ digit input
  // (e.g. "98409303346" would pass by dropping the extra leading digit).
  return digits.length === 10 && /^[6-9]\d{9}$/.test(digits);
}

export function isValidPincode(v) {
  return /^\d{6}$/.test(v || '');
}

/** Returns an error string, or '' if valid. */
export function validateRegisterForm(form) {
  if (!form.name || form.name.trim().length < 2) return 'Please enter your full name';
  if (!isValidIndianMobile(form.mobile)) return 'Please enter a valid 10-digit mobile number';
  if (form.email && !isValidEmail(form.email)) return 'Please enter a valid email address';
  if (form.password.length < 6) return 'Password must be at least 6 characters';
  if (form.password !== form.confirmPassword) return 'Passwords do not match';
  return '';
}

export function validateAddressForm(form) {
  if (!form.fullName?.trim()) return 'Please enter a full name';
  if (!isValidIndianMobile(form.phone)) return 'Please enter a valid 10-digit phone number';
  if (!form.line1?.trim()) return 'Please enter your address';
  if (!form.city?.trim()) return 'Please enter your city';
  if (!form.state?.trim()) return 'Please enter your state';
  if (!isValidPincode(form.pincode)) return 'Please enter a valid 6-digit PIN code';
  return '';
}
