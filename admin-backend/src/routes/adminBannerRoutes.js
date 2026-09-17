const router = require('express').Router();
const { Banner } = require('../models/shared');
const { requireAdmin } = require('../middleware/adminAuth');

router.use(requireAdmin);

router.get('/', async (req, res) => {
  const banners = await Banner.find().sort('sortOrder');
  res.json({ banners });
});

router.post('/', async (req, res) => {
  const banner = await Banner.create(req.body);
  res.status(201).json({ banner });
});

router.patch('/:id', async (req, res) => {
  const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ banner });
});

router.delete('/:id', async (req, res) => {
  await Banner.findByIdAndDelete(req.params.id);
  res.json({ message: 'Banner removed' });
});

module.exports = router;
