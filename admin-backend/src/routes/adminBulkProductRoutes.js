const router = require('express').Router();
const multer = require('multer');
const { parse } = require('csv-parse/sync');
const { Product, Category } = require('../models/shared');
const { requireAdmin } = require('../middleware/adminAuth');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 2 * 1024 * 1024 } });

router.use(requireAdmin);

// GET /api/admin/bulk-products/template - a CSV with headers + one example row
router.get('/template', (req, res) => {
  const csv = [
    'name,description,categorySlug,subCategorySlug,basePrice,images,sizes,highlights',
    '"Cotton Kurta","Comfortable everyday kurta",mens,kurta,799,"https://example.com/img1.jpg|https://example.com/img2.jpg","S:10,M:15,L:10,XL:5","100% cotton|Machine washable"',
  ].join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="product-upload-template.csv"');
  res.send(csv);
});

// POST /api/admin/bulk-products/upload  (multipart, field name "file")
// CSV columns: name, description, categorySlug, subCategorySlug (optional),
// basePrice, images (pipe-separated URLs), sizes (comma-separated "SIZE:STOCK"
// pairs), highlights (pipe-separated, optional).
// Every row is validated independently - a bad row is reported and skipped
// rather than failing the whole upload.
router.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No CSV file uploaded' });

  let records;
  try {
    records = parse(req.file.buffer.toString('utf-8'), { columns: true, skip_empty_lines: true, trim: true });
  } catch (err) {
    return res.status(400).json({ message: 'Could not parse CSV', detail: err.message });
  }

  const categories = await Category.find();
  const categoryBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));

  const results = { created: 0, failed: [] };

  for (let i = 0; i < records.length; i++) {
    const row = records[i];
    const rowNum = i + 2; // +1 for header row, +1 for 1-indexing
    try {
      if (!row.name || !row.description || !row.categorySlug || !row.basePrice) {
        throw new Error('Missing required field (name, description, categorySlug, basePrice)');
      }
      const category = categoryBySlug[row.categorySlug];
      if (!category) throw new Error(`Unknown category slug "${row.categorySlug}"`);
      const subCategory = row.subCategorySlug ? categoryBySlug[row.subCategorySlug] : null;
      if (row.subCategorySlug && !subCategory) throw new Error(`Unknown subcategory slug "${row.subCategorySlug}"`);

      const basePrice = Number(row.basePrice);
      if (!basePrice || basePrice <= 0) throw new Error('Invalid basePrice');

      const images = (row.images || '').split('|').map((s) => s.trim()).filter(Boolean);
      if (images.length === 0) throw new Error('At least one image URL is required');

      const variants = (row.sizes || '').split(',').map((s) => s.trim()).filter(Boolean).map((pair) => {
        const [size, stock] = pair.split(':').map((s) => s.trim());
        if (!size) throw new Error(`Invalid size entry "${pair}"`);
        return { size, stock: Number(stock) || 0 };
      });
      if (variants.length === 0) throw new Error('At least one size is required (e.g. "S:10,M:15")');

      const highlights = (row.highlights || '').split('|').map((s) => s.trim()).filter(Boolean);

      await Product.create({
        name: row.name,
        description: row.description,
        category: category._id,
        subCategory: subCategory?._id,
        basePrice,
        images,
        variants,
        highlights,
      });
      results.created += 1;
    } catch (err) {
      results.failed.push({ row: rowNum, name: row.name || '(missing)', error: err.message });
    }
  }

  res.json(results);
});

module.exports = router;
