const { body, validationResult } = require('express-validator');

/** Drop this after any validator chain - turns collected errors into a 400. */
function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: errors.array()[0].msg,
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
}

const registerRules = [
  body('name').trim().isLength({ min: 2, max: 80 }).withMessage('Name must be 2-80 characters'),
  body('password').isLength({ min: 6, max: 128 }).withMessage('Password must be at least 6 characters'),
  body('confirmPassword').custom((value, { req }) => value === req.body.password).withMessage('Passwords do not match'),
  body('mobile').optional({ checkFalsy: true }).trim().matches(/^[6-9]\d{9}$/).withMessage('Enter a valid 10-digit mobile number'),
  body('email').optional({ checkFalsy: true }).trim().isEmail().withMessage('Enter a valid email address').normalizeEmail(),
  body('dob').optional({ checkFalsy: true }).isISO8601().withMessage('Enter a valid date of birth'),
  body('referralCode').optional({ checkFalsy: true }).trim().isLength({ max: 12 }).withMessage('Invalid referral code'),
  body().custom((value) => {
    if (!value.mobile && !value.email) throw new Error('Mobile number or email is required');
    return true;
  }),
];

const loginRules = [
  body('identifier').trim().notEmpty().withMessage('Mobile number or email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const forgotPasswordRules = [
  body('identifier').trim().notEmpty().withMessage('Mobile number or email is required'),
];

const resetPasswordRules = [
  body('email').trim().isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('token').trim().notEmpty().withMessage('Reset token is required'),
  body('newPassword').isLength({ min: 6, max: 128 }).withMessage('Password must be at least 6 characters'),
];

const changePasswordRules = [
  body('oldPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6, max: 128 }).withMessage('New password must be at least 6 characters'),
];

const googleAuthRules = [
  body('idToken').notEmpty().withMessage('Missing Google idToken'),
];

const completeProfileRules = [
  body('mobile').optional({ checkFalsy: true }).trim().matches(/^[6-9]\d{9}$/).withMessage('Enter a valid 10-digit mobile number'),
  body('dob').optional({ checkFalsy: true }).isISO8601().withMessage('Enter a valid date of birth'),
];

module.exports = {
  handleValidation,
  registerRules,
  loginRules,
  forgotPasswordRules,
  resetPasswordRules,
  changePasswordRules,
  googleAuthRules,
  completeProfileRules,
};
