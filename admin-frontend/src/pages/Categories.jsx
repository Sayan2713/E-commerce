import { useEffect, useState } from 'react';
import adminApi from '../api/client';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ name: '', slug: '', parent: '', sizeMode: 'STANDARD', image: '' });

  const load = () => adminApi.get('/categories').then((r) => setCategories(r.data.categories));
  useEffect(() => { load(); }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const { data } = await adminApi.post('/upload/image?folder=categories', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm((f) => ({ ...f, image: data.url }));
    } finally {
      setUploading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    await adminApi.post('/categories', { ...form, parent: form.parent || null });
    setForm({ name: '', slug: '', parent: '', sizeMode: 'STANDARD', image: '' });
    load();
  };

  const deleteCategory = async (c) => {
    if (!window.confirm(`Remove "${c.name}"? Products already using it will keep their existing link, but it won't show up when adding new products.`)) return;
    await adminApi.delete(`/categories/${c._id}`);
    load();
  };

  return (
    <div>
      <h2>Categories</h2>
      <form onSubmit={submit} style={{ background: 'white', padding: 16, borderRadius: 8, display: 'grid', gap: 8, maxWidth: 400 }}>
        <input placeholder="Name (e.g. Mens)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input placeholder="Slug (e.g. mens)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
        <select value={form.parent} onChange={(e) => setForm({ ...form, parent: e.target.value })}>
          <option value="">Top-level category</option>
          {categories.filter((c) => !c.parent).map((c) => <option key={c._id} value={c._id}>Subcategory of {c.name}</option>)}
        </select>
        <select value={form.sizeMode} onChange={(e) => setForm({ ...form, sizeMode: e.target.value })}>
          <option value="STANDARD">Standard (S/M/L/XL)</option>
          <option value="AGE">By age group</option>
          <option value="NUMERIC">Numeric (waist size etc.)</option>
          <option value="CUSTOM">Custom</option>
        </select>
        <label style={{ fontSize: 13 }}>
          Category icon
          <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} />
        </label>
        {form.image && <img src={form.image} alt="" style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover' }} />}
        <button type="submit" disabled={uploading}>Add Category</button>
      </form>
      <ul>
        {categories.map((c) => (
          <li key={c._id} style={{ opacity: c.isActive === false ? 0.5 : 1, marginBottom: 4 }}>
            {c.name} {c.parent ? '(sub)' : ''} - size mode: {c.sizeMode}
            {c.isActive === false && ' (deactivated)'}
            <button onClick={() => deleteCategory(c)} style={{ marginLeft: 10, fontSize: 12, color: '#c0392b' }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
