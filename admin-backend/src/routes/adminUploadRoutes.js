const router = require('express').Router();
const multer = require('multer');
const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary');
const { requireAdmin } = require('../middleware/adminAuth');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } });

function uploadBufferToCloudinary(buffer, folder) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

router.use(requireAdmin);

// POST /api/admin/upload/image?folder=products|categories|banners  (field name "image")
// Supports multiple files at once via "images" field too (for product galleries).
router.post('/image', upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No image uploaded' });
  const folder = `clothstore/${req.query.folder || 'misc'}`;
  try {
    const result = await uploadBufferToCloudinary(req.file.buffer, folder);
    res.json({ url: result.secure_url });
  } catch (err) {
    res.status(500).json({ message: 'Upload failed', detail: err.message });
  }
});

router.post('/images', upload.array('images', 8), async (req, res) => {
  if (!req.files?.length) return res.status(400).json({ message: 'No images uploaded' });
  const folder = `clothstore/${req.query.folder || 'products'}`;
  try {
    const results = await Promise.all(req.files.map((f) => uploadBufferToCloudinary(f.buffer, folder)));
    res.json({ urls: results.map((r) => r.secure_url) });
  } catch (err) {
    res.status(500).json({ message: 'Upload failed', detail: err.message });
  }
});

module.exports = router;
