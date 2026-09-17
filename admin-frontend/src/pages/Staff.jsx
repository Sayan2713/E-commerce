import { useEffect, useState } from 'react';
import adminApi from '../api/client';

export default function Staff() {
  const [admins, setAdmins] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'STAFF' });
  const [error, setError] = useState('');

  const load = () => adminApi.get('/staff').then((r) => setAdmins(r.data.admins));
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await adminApi.post('/staff', form);
      setForm({ name: '', email: '', password: '', role: 'STAFF' });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create account');
    }
  };

  const toggleActive = async (admin) => {
    await adminApi.patch(`/staff/${admin._id}`, { isActive: !admin.isActive });
    load();
  };

  return (
    <div>
      <h2>Staff Accounts</h2>
      <p style={{ color: '#777', fontSize: 13 }}>
        STAFF accounts can manage products, orders, coupons, banners, and categories.
        Only SUPER_ADMIN accounts can change GST rates, delivery pricing, or manage other staff.
      </p>

      <form onSubmit={submit} style={{ background: 'white', padding: 16, borderRadius: 8, display: 'grid', gap: 8, maxWidth: 400 }}>
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="STAFF">Staff</option>
          <option value="SUPER_ADMIN">Super Admin</option>
        </select>
        {error && <div style={{ color: 'red', fontSize: 13 }}>{error}</div>}
        <button type="submit">Create Account</button>
      </form>

      <table width="100%" cellPadding={6} style={{ background: 'white', marginTop: 16 }}>
        <thead><tr><th align="left">Name</th><th align="left">Email</th><th align="left">Role</th><th align="left">Status</th><th></th></tr></thead>
        <tbody>
          {admins.map((a) => (
            <tr key={a._id}>
              <td>{a.name}</td>
              <td>{a.email}</td>
              <td>{a.role}</td>
              <td>{a.isActive === false ? 'Deactivated' : 'Active'}</td>
              <td><button onClick={() => toggleActive(a)}>{a.isActive === false ? 'Reactivate' : 'Deactivate'}</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
