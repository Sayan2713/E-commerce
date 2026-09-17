import { useEffect, useState } from 'react';
import adminApi from '../api/client';

export default function Settings() {
  const [form, setForm] = useState({ oldPassword: '', newPassword: '' });
  const [msg, setMsg] = useState('');
  const isSuperAdmin = localStorage.getItem('adminRole') === 'SUPER_ADMIN';

  const submit = async (e) => {
    e.preventDefault();
    try {
      await adminApi.post('/auth/change-password', form);
      setMsg('Password updated.');
    } catch {
      setMsg('Old password incorrect.');
    }
  };

  return (
    <div>
      <h2>Settings</h2>
      <form onSubmit={submit} style={{ background: 'white', padding: 16, borderRadius: 8, display: 'grid', gap: 8, maxWidth: 320 }}>
        <input type="password" placeholder="Old password" value={form.oldPassword} onChange={(e) => setForm({ ...form, oldPassword: e.target.value })} />
        <input type="password" placeholder="New password" value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} />
        <button type="submit">Change Password</button>
        {msg && <div>{msg}</div>}
      </form>

      {isSuperAdmin && <StoreContactSettings />}
    </div>
  );
}

function StoreContactSettings() {
  const [settings, setSettings] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    adminApi.get('/store-settings').then((r) => setSettings(r.data.settings));
  }, []);

  const save = async (e) => {
    e.preventDefault();
    setSaved(false);
    await adminApi.put('/store-settings', settings);
    setSaved(true);
  };

  if (!settings) return null;

  return (
    <div style={{ marginTop: 24 }}>
      <h3>Store Contact & Social Links</h3>
      <p style={{ fontSize: 13, color: '#777', maxWidth: 480 }}>
        These power the "Need Help?" section on the homepage and the footer.
        WhatsApp number should include the country code with no + or spaces
        (e.g. 919876543210).
      </p>
      <form onSubmit={save} style={{ background: 'white', padding: 16, borderRadius: 8, display: 'grid', gap: 8, maxWidth: 400 }}>
        <label style={{ fontSize: 13 }}>
          WhatsApp number
          <input value={settings.whatsappNumber || ''} onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })} placeholder="919876543210" />
        </label>
        <label style={{ fontSize: 13 }}>
          Support phone
          <input value={settings.supportPhone || ''} onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })} placeholder="+91 98765 43210" />
        </label>
        <label style={{ fontSize: 13 }}>
          Support email
          <input value={settings.supportEmail || ''} onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })} placeholder="support@yourdomain.com" />
        </label>
        <label style={{ fontSize: 13 }}>
          Instagram URL
          <input value={settings.socialLinks?.instagram || ''} onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, instagram: e.target.value } })} />
        </label>
        <label style={{ fontSize: 13 }}>
          Facebook URL
          <input value={settings.socialLinks?.facebook || ''} onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, facebook: e.target.value } })} />
        </label>
        <label style={{ fontSize: 13 }}>
          Twitter / X URL
          <input value={settings.socialLinks?.twitter || ''} onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, twitter: e.target.value } })} />
        </label>
        <label style={{ fontSize: 13 }}>
          YouTube URL
          <input value={settings.socialLinks?.youtube || ''} onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, youtube: e.target.value } })} />
        </label>
        <button type="submit">Save</button>
        {saved && <div style={{ color: 'green', fontSize: 13 }}>Saved.</div>}
      </form>
    </div>
  );
}
