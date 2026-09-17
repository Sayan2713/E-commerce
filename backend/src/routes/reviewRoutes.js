const router = require('express').Router();
const ctrl = require('../controllers/reviewController');
const { requireAuth } = require('../middleware/auth');

router.get('/products/:id/reviews', ctrl.listForProduct); // public read
router.post('/reviews', requireAuth, ctrl.create);
router.delete('/reviews/:id', requireAuth, ctrl.remove);

module.exports = router;
