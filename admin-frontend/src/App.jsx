import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import BulkUpload from './pages/BulkUpload';
import Categories from './pages/Categories';
import Banners from './pages/Banners';
import Coupons from './pages/Coupons';
import DeliveryZones from './pages/DeliveryZones';
import GstSettings from './pages/GstSettings';
import Orders from './pages/Orders';
import SalesDashboard from './pages/SalesDashboard';
import Accounting from './pages/Accounting';
import Staff from './pages/Staff';
import HelpCenter from './pages/HelpCenter';
import Settings from './pages/Settings';

function RequireAdmin({ children }) {
  const token = localStorage.getItem('adminToken');
  return token ? children : <Navigate to="/login" replace />;
}

function RequireSuperAdmin({ children }) {
  const token = localStorage.getItem('adminToken');
  if (!token) return <Navigate to="/login" replace />;
  // UI-level convenience only - the backend enforces this for real on every
  // request, so a STAFF user hitting these routes directly still gets a 403
  // from the API even if they somehow got past this check.
  if (localStorage.getItem('adminRole') !== 'SUPER_ADMIN') return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="bulk-upload" element={<BulkUpload />} />
          <Route path="categories" element={<Categories />} />
          <Route path="banners" element={<Banners />} />
          <Route path="coupons" element={<Coupons />} />
          <Route path="orders" element={<Orders />} />
          <Route path="sales" element={<SalesDashboard />} />
          <Route path="accounting" element={<Accounting />} />
          <Route path="delivery" element={<RequireSuperAdmin><DeliveryZones /></RequireSuperAdmin>} />
          <Route path="gst" element={<RequireSuperAdmin><GstSettings /></RequireSuperAdmin>} />
          <Route path="staff" element={<RequireSuperAdmin><Staff /></RequireSuperAdmin>} />
          <Route path="help-center" element={<HelpCenter />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
