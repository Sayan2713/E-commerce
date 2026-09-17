const router = require('express').Router();
const ctrl = require('../controllers/orderController');
const { requireAuth } = require('../middleware/auth');
const { handleValidation, orderItemsRules } = require('../validators/orderValidators');

router.use(requireAuth); // buying always requires login, per spec

router.post('/price-preview', orderItemsRules, handleValidation, ctrl.pricePreview);
router.post('/', orderItemsRules, handleValidation, ctrl.placeOrder);
router.post('/checkout-started', ctrl.checkoutStarted);
router.get('/', ctrl.listMyOrders);
router.get('/:id', ctrl.getOrder);
router.patch('/:id/cancel', ctrl.cancelOrder);
router.post('/:id/request-return', ctrl.requestReturn);

module.exports = router;
