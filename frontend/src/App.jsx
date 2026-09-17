import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RequireAuth from './components/RequireAuth';
import ErrorBoundary from './components/ErrorBoundary';
import OfflineBanner from './components/OfflineBanner';

import Home from './pages/Home';
import CategoryListing from './pages/CategoryListing';
import Search from './pages/Search';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Register from './pages/Register';
import CompleteProfile from './pages/CompleteProfile';
import Profile from './pages/Profile';
import ProfileEdit from './pages/ProfileEdit';
import SavedItems from './pages/SavedItems';
import ChangePassword from './pages/ChangePassword';
import Sessions from './pages/Sessions';
import StaticPage from './pages/StaticPage';
import ContactUs from './pages/ContactUs';
import Careers from './pages/Careers';
import Sitemap from './pages/Sitemap';
import TermsAndConditions from './pages/legal/TermsAndConditions';
import ReturnPolicy from './pages/legal/ReturnPolicy';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import ShippingPolicy from './pages/legal/ShippingPolicy';
import CancellationPolicy from './pages/legal/CancellationPolicy';
import FAQ from './pages/legal/FAQ';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <OfflineBanner />
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <div style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/category/:slug" element={<CategoryListing />} />
                <Route path="/search" element={<Search />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/checkout" element={<RequireAuth><Checkout /></RequireAuth>} />
                <Route path="/order-success" element={<RequireAuth><OrderSuccess /></RequireAuth>} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/register" element={<Register />} />
                <Route path="/complete-profile" element={<RequireAuth><CompleteProfile /></RequireAuth>} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/edit" element={<RequireAuth><ProfileEdit /></RequireAuth>} />
                <Route path="/profile/saved" element={<RequireAuth><SavedItems /></RequireAuth>} />
                <Route path="/profile/change-password" element={<RequireAuth><ChangePassword /></RequireAuth>} />
                <Route path="/profile/sessions" element={<RequireAuth><Sessions /></RequireAuth>} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/about" element={<StaticPage title="About Us" />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/sitemap" element={<Sitemap />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/policies/terms" element={<TermsAndConditions />} />
                <Route path="/policies/return" element={<ReturnPolicy />} />
                <Route path="/policies/privacy" element={<PrivacyPolicy />} />
                <Route path="/policies/shipping" element={<ShippingPolicy />} />
                <Route path="/policies/cancellation" element={<CancellationPolicy />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Footer />
            </div>
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}
