import { useEffect, useState } from 'react';
import adminApi from '../api/client';

export default function GstSettings() {
  const [form, setForm] = useState(null);

  useEffect(() => {
    adminApi.get('/config/gst-config').then((r) => setForm(r.data.config));
  }, []);

  const save = async (e) => {
    e.preventDefault();
    await adminApi.put('/config/gst-config', form);
    alert('GST settings updated');
  };

  if (!form) return null;

  return (
    <div>
      <h2>GST Settings</h2>
      <form onSubmit={save} style={{ background: 'white', padding: 16, borderRadius: 8, display: 'grid', gap: 8, maxWidth: 400 }}>
        <label>Home state (for CGST+SGST vs IGST)
          <input value={form.homeState} onChange={(e) => setForm({ ...form, homeState: e.target.value })} />
        </label>
        <label>Standard GST rate (%)
          <input type="number" value={form.standardRate} onChange={(e) => setForm({ ...form, standardRate: Number(e.target.value) })} />
        </label>
        <label>Higher GST rate (%) - applies above threshold
          <input type="number" value={form.higherRate} onChange={(e) => setForm({ ...form, higherRate: Number(e.target.value) })} />
        </label>
        <label>Higher rate threshold (Rs.)
          <input type="number" value={form.higherRateThreshold} onChange={(e) => setForm({ ...form, higherRateThreshold: Number(e.target.value) })} />
        </label>
        <button type="submit">Save</button>
      </form>
    </div>
  );
}
