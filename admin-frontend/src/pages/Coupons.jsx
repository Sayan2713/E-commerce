import { useEffect, useState } from 'react';
import adminApi from '../api/client';

export default function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({
    code: '', discountType: 'FLAT', discountValue: '', minOrderValue: '', maxDiscountAmount: '',
    reason: '', description: '', ruleMode: 'PRESET',
  });

  const load = () => adminApi.get('/coupons').then((r) => setCoupons(r.data.coupons));
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    await adminApi.post('/coupons', {
      ...form,
      discountValue: Number(form.discountValue),
      minOrderValue: Number(form.minOrderValue) || 0,
      maxDiscountAmount: form.maxDiscountAmount ? Number(form.maxDiscountAmount) : undefined,
    });
    setForm({ code: '', discountType: 'FLAT', discountValue: '', minOrderValue: '', maxDiscountAmount: '', reason: '', description: '', ruleMode: 'PRESET' });
    load();
  };

  const deleteCoupon = async (c) => {
    if (!window.confirm(`Deactivate coupon "${c.code}"? It will stop working immediately.`)) return;
    await adminApi.delete(`/coupons/${c._id}`);
    load();
  };

  return (
    <div>
      <h2>Coupon Codes</h2>
      <form onSubmit={submit} style={{ background: 'white', padding: 16, borderRadius: 8, display: 'grid', gap: 8, maxWidth: 480 }}>
        <input placeholder="Code (e.g. WELCOME100)" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required />
        <label>
          Rule Mode:
          <select value={form.ruleMode} onChange={(e) => setForm({ ...form, ruleMode: e.target.value })}>
            <option value="PRESET">Preset</option>
            <option value="CUSTOM">Custom</option>
          </select>
        </label>
        <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })}>
          <option value="FLAT">Flat (Rs. off)</option>
          <option value="PERCENTAGE">Percentage (% off)</option>
        </select>
        <input placeholder="Discount value" type="number" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} required />
        <input placeholder="Minimum order value" type="number" value={form.minOrderValue} onChange={(e) => setForm({ ...form, minOrderValue: e.target.value })} />
        {form.discountType === 'PERCENTAGE' && (
          <input placeholder="Max discount cap (Rs.)" type="number" value={form.maxDiscountAmount} onChange={(e) => setForm({ ...form, maxDiscountAmount: e.target.value })} />
        )}
        <input placeholder="Why this offer? (e.g. Durga Puja Special)" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
        <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <button type="submit">Create Coupon</button>
      </form>

      <table width="100%" cellPadding={6} style={{ background: 'white', marginTop: 16 }}>
        <thead><tr><th align="left">Code</th><th align="left">Discount</th><th align="left">Reason</th><th align="left">Used</th><th align="left">Status</th><th></th></tr></thead>
        <tbody>
          {coupons.map((c) => (
            <tr key={c._id} style={{ opacity: c.isActive === false ? 0.5 : 1 }}>
              <td>{c.code}</td>
              <td>{c.discountType === 'FLAT' ? `Rs. ${c.discountValue}` : `${c.discountValue}%`}</td>
              <td>{c.reason}</td>
              <td>{c.timesUsed}</td>
              <td>{c.isActive === false ? 'Deactivated' : 'Active'}</td>
              <td>{c.isActive !== false && <button onClick={() => deleteCoupon(c)} style={{ color: '#c0392b', fontSize: 12 }}>Delete</button>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
