const router = require('express').Router();
const ctrl = require('../controllers/adminAuthController');
const { requireAdmin } = require('../middleware/adminAuth');
const { adminLoginLimiter } = require('../middleware/rateLimiters');
const { handleValidation, loginRules, changePasswordRules } = require('../validators/authValidators');

router.post('/login', adminLoginLimiter, loginRules, handleValidation, ctrl.login);
router.post('/change-password', requireAdmin, changePasswordRules, handleValidation, ctrl.changePassword);

module.exports = router;
