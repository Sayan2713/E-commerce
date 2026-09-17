import { useState } from 'react';
import adminApi from '../api/client';

export default function BulkUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const downloadTemplate = async () => {
    const res = await adminApi.get('/bulk-products/template', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product-upload-template.csv';
    a.click();
  };

  const upload = async () => {
    if (!file) return;
    setUploading(true);
    setError('');
    setResult(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const { data } = await adminApi.post('/bulk-products/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h2>Bulk Product Upload</h2>
      <p style={{ color: '#777', fontSize: 13, maxWidth: 600 }}>
        Upload a CSV to add many products at once. Columns: <code>name, description,
        categorySlug, subCategorySlug, basePrice, images (pipe-separated URLs),
        sizes (e.g. "S:10,M:15,L:5"), highlights (pipe-separated, optional)</code>.
        Category/subcategory slugs must already exist - create them first from the
        Categories page. Image URLs must already be hosted somewhere (e.g. upload
        to Cloudinary via the Products page first, or use your own URLs) - this
        tool doesn't upload files itself, just links to them.
      </p>

      <button onClick={downloadTemplate} style={{ marginBottom: 16 }}>Download CSV Template</button>

      <div style={{ background: 'white', padding: 16, borderRadius: 8, maxWidth: 480 }}>
        <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={upload} disabled={!file || uploading} style={{ marginTop: 12 }}>
          {uploading ? 'Uploading...' : 'Upload CSV'}
        </button>
      </div>

      {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}

      {result && (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontWeight: 700 }}>{result.created} product(s) created.</div>
          {result.failed.length > 0 && (
            <>
              <div style={{ color: '#c0392b', marginTop: 8, fontWeight: 600 }}>{result.failed.length} row(s) failed:</div>
              <table width="100%" cellPadding={6} style={{ background: 'white', marginTop: 8 }}>
                <thead><tr><th align="left">Row</th><th align="left">Name</th><th align="left">Error</th></tr></thead>
                <tbody>
                  {result.failed.map((f, i) => (
                    <tr key={i}><td>{f.row}</td><td>{f.name}</td><td style={{ color: '#c0392b' }}>{f.error}</td></tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      )}
    </div>
  );
}
