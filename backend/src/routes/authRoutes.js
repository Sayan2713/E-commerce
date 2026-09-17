const router = require('express').Router();
const ctrl = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');
const { loginLimiter, registerLimiter, forgotPasswordLimiter, authGeneralLimiter } = require('../middleware/rateLimiters');
const {
  handleValidation, registerRules, loginRules, forgotPasswordRules,
  resetPasswordRules, changePasswordRules, googleAuthRules, completeProfileRules,
} = require('../validators/authValidators');

router.post('/register', registerLimiter, registerRules, handleValidation, ctrl.register);
router.post('/login', loginLimiter, loginRules, handleValidation, ctrl.login);
router.post('/google', authGeneralLimiter, googleAuthRules, handleValidation, ctrl.googleAuth);
router.post('/refresh', authGeneralLimiter, ctrl.refresh);
router.post('/logout', authGeneralLimiter, ctrl.logout);
router.post('/forgot-password', forgotPasswordLimiter, forgotPasswordRules, handleValidation, ctrl.forgotPassword);
router.post('/reset-password', authGeneralLimiter, resetPasswordRules, handleValidation, ctrl.resetPassword);

router.post('/complete-profile', requireAuth, completeProfileRules, handleValidation, ctrl.completeProfile);
router.post('/logout-all', requireAuth, ctrl.logoutAll);
router.get('/sessions', requireAuth, ctrl.listSessions);
router.post('/change-password', requireAuth, changePasswordRules, handleValidation, ctrl.changePassword);

module.exports = router;
