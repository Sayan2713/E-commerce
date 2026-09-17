import { useEffect, useState, Fragment } from 'react';
import adminApi from '../api/client';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [form, setForm] = useState({
    name: '', description: '', category: '', subCategory: '', basePrice: '', color: '', lowStockThreshold: 5, images: [],
    isCancellable: true, isReturnable: true,
    sizesInput: '', // comma separated: "S,M,L" or "6-7Y,8-9Y" or custom
  });

  const load = () => {
    adminApi.get('/products').then((r) => setProducts(r.data.products));
    adminApi.get('/categories').then((r) => setCategories(r.data.categories));
  };
  useEffect(() => { load(); }, []);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      const fd = new FormData();
      files.forEach((f) => fd.append('images', f));
      const { data } = await adminApi.post('/upload/images?folder=products', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm((f) => ({ ...f, images: [...f.images, ...data.urls] }));
    } finally {
      setUploading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    const variants = form.sizesInput.split(',').map((s) => s.trim()).filter(Boolean).map((entry) => {
      // Accepts "S:10" (size + starting stock) or just "S" (defaults to 0 -
      // stays out-of-stock until restocked from the product list below).
      const [size, stock] = entry.split(':').map((s) => s.trim());
      return { size, stock: Number(stock) || 0 };
    });
    await adminApi.post('/products', {
      name: form.name,
      description: form.description,
      category: form.category,
      subCategory: form.subCategory || undefined,
      basePrice: Number(form.basePrice),
      color: form.color || undefined,
      lowStockThreshold: Number(form.lowStockThreshold) || 5,
      isCancellable: form.isCancellable,
      isReturnable: form.isReturnable,
      images: form.images,
      variants,
    });
    setForm({ name: '', description: '', category: '', subCategory: '', basePrice: '', color: '', lowStockThreshold: 5, images: [], isCancellable: true, isReturnable: true, sizesInput: '' });
    load();
  };

  const updateStock = async (product, size, currentStock) => {
    const input = window.prompt(`Set stock for ${product.name} (size ${size}):`, currentStock ?? 0);
    if (input === null) return; // cancelled
    const stock = Number(input);
    if (Number.isNaN(stock) || stock < 0) { alert('Please enter a valid non-negative number'); return; }
    // Setting an actual stock number is what actually takes it out of "out
    // of stock" - just flipping the outOfStock flag alone doesn't work,
    // since the backend re-derives outOfStock from the stock count on save.
    await adminApi.patch(`/products/${product._id}/variants/${size}/stock`, { stock, outOfStock: stock <= 0 });
    load();
  };

  const startEdit = (p) => {
    setEditingId(p._id);
    setEditForm({ name: p.name, description: p.description, basePrice: p.basePrice, color: p.color || '', lowStockThreshold: p.lowStockThreshold ?? 5, isCancellable: p.isCancellable !== false, isReturnable: p.isReturnable !== false });
  };

  const saveEdit = async (id) => {
    await adminApi.patch(`/products/${id}`, {
      name: editForm.name,
      description: editForm.description,
      basePrice: Number(editForm.basePrice),
      color: editForm.color || undefined,
      lowStockThreshold: Number(editForm.lowStockThreshold) || 5,
      isCancellable: editForm.isCancellable,
      isReturnable: editForm.isReturnable,
    });
    setEditingId(null);
    load();
  };

  const deleteProduct = async (p) => {
    if (!window.confirm(`Remove "${p.name}" from the storefront? You can reactivate it later from this same page.`)) return;
    await adminApi.delete(`/products/${p._id}`);
    load();
  };

  const reactivateProduct = async (p) => {
    await adminApi.patch(`/products/${p._id}`, { isActive: true });
    load();
  };

  return (
    <div>
      <h2>Products</h2>

      <form onSubmit={submit} className="admin-card" style={{ background: 'white', padding: 16, borderRadius: 8, display: 'grid', gap: 8, maxWidth: 480 }}>
        <h4>Add Item</h4>
        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
          <option value="">Select category</option>
          {categories.filter((c) => !c.parent).map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <select value={form.subCategory} onChange={(e) => setForm({ ...form, subCategory: e.target.value })}>
          <option value="">Select subcategory (optional)</option>
          {categories.filter((c) => c.parent === form.category).map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <label style={{ fontSize: 13 }}>
          Product Photos
          <input type="file" accept="image/*" multiple onChange={handleImageUpload} disabled={uploading} />
        </label>
        {uploading && <div style={{ fontSize: 12, color: '#777' }}>Uploading...</div>}
        {form.images.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {form.images.map((url) => <img key={url} src={url} alt="" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 6 }} />)}
          </div>
        )}
        <input placeholder="Item name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        <input
          placeholder="Sizes with stock, comma separated (e.g. S:10,M:15,L:5 - or just S,M,L to add them with 0 stock for now)"
          value={form.sizesInput}
          onChange={(e) => setForm({ ...form, sizesInput: e.target.value })}
          required
        />
        <input placeholder="Base price (pre-tax, pre-delivery)" type="number" value={form.basePrice} onChange={(e) => setForm({ ...form, basePrice: e.target.value })} required />
        <input placeholder="Color (optional, e.g. Navy Blue)" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
        <label style={{ fontSize: 13 }}>
          Low-stock alert threshold
          <input type="number" value={form.lowStockThreshold} onChange={(e) => setForm({ ...form, lowStockThreshold: e.target.value })} min={0} />
        </label>
        <label style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
          <input type="checkbox" checked={form.isCancellable} onChange={(e) => setForm({ ...form, isCancellable: e.target.checked })} />
          Customers can cancel orders for this item (before shipping)
        </label>
        <label style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
          <input type="checkbox" checked={form.isReturnable} onChange={(e) => setForm({ ...form, isReturnable: e.target.checked })} />
          Customers can request a return for this item (after delivery)
        </label>
        <button type="submit" disabled={uploading || form.images.length === 0}>Add Product</button>
      </form>

      <h3 style={{ marginTop: 24 }}>All Products</h3>
      <table width="100%" cellPadding={6} style={{ background: 'white' }}>
        <thead>
          <tr>
            <th align="left">Name</th>
            <th align="left">Price</th>
            <th align="left">Color</th>
            <th align="left">Low-stock at</th>
            <th align="left">Variants (stock)</th>
            <th align="left">Status</th>
            <th align="left"></th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <Fragment key={p._id}>
              <tr style={{ opacity: p.isActive === false ? 0.5 : 1 }}>
                <td>{p.name}</td>
                <td>Rs. {p.basePrice}</td>
                <td>{p.color || '-'}</td>
                <td>{p.lowStockThreshold ?? 5}</td>
                <td>
                  {p.variants.map((v) => (
                    <button
                      key={v.size}
                      onClick={() => updateStock(p, v.size, v.stock)}
                      style={{ marginRight: 6, color: v.outOfStock ? '#c0392b' : 'inherit' }}
                      title="Click to set stock quantity"
                    >
                      {v.size}: {v.outOfStock ? 'OUT' : v.stock}
                    </button>
                  ))}
                </td>
                <td>{p.isActive === false ? 'Deactivated' : 'Active'}</td>
                <td style={{ whiteSpace: 'nowrap' }}>
                  <button onClick={() => startEdit(p)} style={{ marginRight: 6 }}>Edit</button>
                  {p.isActive === false ? (
                    <button onClick={() => reactivateProduct(p)}>Reactivate</button>
                  ) : (
                    <button onClick={() => deleteProduct(p)} style={{ color: '#c0392b' }}>Delete</button>
                  )}
                </td>
              </tr>
              {editingId === p._id && (
                <tr>
                  <td colSpan={7}>
                    <div style={{ background: '#F7F2EB', padding: 12, borderRadius: 8, display: 'grid', gap: 8, maxWidth: 420 }}>
                      <input placeholder="Name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                      <textarea placeholder="Description" value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
                      <input placeholder="Base price" type="number" value={editForm.basePrice} onChange={(e) => setEditForm({ ...editForm, basePrice: e.target.value })} />
                      <input placeholder="Color" value={editForm.color} onChange={(e) => setEditForm({ ...editForm, color: e.target.value })} />
                      <label style={{ fontSize: 13 }}>
                        Low-stock alert threshold
                        <input type="number" value={editForm.lowStockThreshold} onChange={(e) => setEditForm({ ...editForm, lowStockThreshold: e.target.value })} min={0} />
                      </label>
                      <label style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <input type="checkbox" checked={editForm.isCancellable} onChange={(e) => setEditForm({ ...editForm, isCancellable: e.target.checked })} />
                        Cancellable before shipping
                      </label>
                      <label style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <input type="checkbox" checked={editForm.isReturnable} onChange={(e) => setEditForm({ ...editForm, isReturnable: e.target.checked })} />
                        Returnable after delivery
                      </label>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => saveEdit(p._id)}>Save</button>
                        <button onClick={() => setEditingId(null)}>Cancel</button>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
