import { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import adminApi from '../api/client';

export default function AdminLayout() {
  const navigate = useNavigate();
  const isSuperAdmin = localStorage.getItem('adminRole') === 'SUPER_ADMIN';
  const [lowStockCount, setLowStockCount] = useState(0);
  const [openSupportCount, setOpenSupportCount] = useState(0);

  useEffect(() => {
    adminApi.get('/products/low-stock').then((r) => setLowStockCount(r.data.count)).catch(() => {});
    adminApi.get('/support-messages', { params: { status: 'OPEN' } }).then((r) => setOpenSupportCount(r.data.messages.length)).catch(() => {});
  }, []);

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminRole');
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <aside style={{ width: 220, background: '#8B9A6E', color: 'white', padding: 16 }}>
        <h3>ClothStore Admin</h3>
        <nav style={{ display: 'grid', gap: 10 }}>
          <Link to="/" style={{ color: 'white' }}>Dashboard</Link>
          <Link to="/products" style={{ color: 'white' }}>
            Products {lowStockCount > 0 && <Badge count={lowStockCount} />}
          </Link>
          <Link to="/bulk-upload" style={{ color: 'white' }}>Bulk Upload</Link>
          <Link to="/categories" style={{ color: 'white' }}>Categories</Link>
          <Link to="/banners" style={{ color: 'white' }}>Banners</Link>
          <Link to="/coupons" style={{ color: 'white' }}>Coupons</Link>
          <Link to="/orders" style={{ color: 'white' }}>Orders</Link>
          <Link to="/sales" style={{ color: 'white' }}>Sales Dashboard</Link>
          <Link to="/accounting" style={{ color: 'white' }}>Accounting</Link>
          {isSuperAdmin && <Link to="/delivery" style={{ color: 'white' }}>Delivery Zones</Link>}
          {isSuperAdmin && <Link to="/gst" style={{ color: 'white' }}>GST Settings</Link>}
          {isSuperAdmin && <Link to="/staff" style={{ color: 'white' }}>Staff</Link>}
          <Link to="/help-center" style={{ color: 'white' }}>
            Help Center {openSupportCount > 0 && <Badge count={openSupportCount} />}
          </Link>
          <Link to="/settings" style={{ color: 'white' }}>Settings</Link>
          <button onClick={logout} style={{ marginTop: 20 }}>Logout</button>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: 24, background: '#F7F2EB' }}>
        <Outlet />
      </main>
    </div>
  );
}

function Badge({ count }) {
  return (
    <span style={{ background: '#c0392b', borderRadius: 10, fontSize: 11, padding: '1px 7px', marginLeft: 6 }}>
      {count}
    </span>
  );
}
