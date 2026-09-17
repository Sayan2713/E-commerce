import { useEffect, useState } from 'react';
import adminApi from '../api/client';

export default function Banners() {
  const [banners, setBanners] = useState([]);
  const [uploading, setUploading] = useState(false);

  const load = () => adminApi.get('/banners').then((r) => setBanners(r.data.banners));
  useEffect(() => { load(); }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const { data } = await adminApi.post('/upload/image?folder=banners', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await adminApi.post('/banners', { image: data.url });
      load();
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeBanner = async (id) => {
    await adminApi.delete(`/banners/${id}`);
    load();
  };

  return (
    <div>
      <h2>Home Page Slider (Web)</h2>
      <label style={{ display: 'inline-block', background: '#8B9A6E', color: 'white', padding: '10px 16px', borderRadius: 8, cursor: 'pointer' }}>
        {uploading ? 'Uploading...' : 'Upload Banner Image'}
        <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} style={{ display: 'none' }} />
      </label>
      <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
        {banners.map((b) => (
          <div key={b._id} style={{ position: 'relative' }}>
            <img src={b.image} alt="" style={{ width: 200, height: 110, objectFit: 'cover', borderRadius: 8 }} />
            <button onClick={() => removeBanner(b._id)} style={{ position: 'absolute', top: 4, right: 4 }}>✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}
