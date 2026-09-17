import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import DeleteAccount from '../components/DeleteAccount';
import ReferralCard from '../components/ReferralCard';

export default function Profile() {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [cancellingId, setCancellingId] = useState(null);
  const [returningId, setReturningId] = useState(null);
  const navigate = useNavigate();

  const loadOrders = () => {
    if (user) api.get('/orders').then((r) => setOrders(r.data.orders));
  };
  useEffect(loadOrders, [user]);

  const cancelOrder = async (order) => {
    if (!window.confirm(`Cancel order ${order.orderId}?`)) return;
    setCancellingId(order._id);
    try {
      await api.patch(`/orders/${order._id}/cancel`);
      loadOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not cancel this order');
    } finally {
      setCancellingId(null);
    }
  };

  const requestReturn = async (order) => {
    const reason = window.prompt(`Why are you returning ${order.orderId}? (optional)`);
    if (reason === null) return; // cancelled
    setReturningId(order._id);
    try {
      await api.post(`/orders/${order._id}/request-return`, { reason });
      loadOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not submit return request');
    } finally {
      setReturningId(null);
    }
  };

  if (!user) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px', fontFamily: 'sans-serif' }}>
        <div style={{ maxWidth: 440, width: '100%', background: '#FFFFFF', border: '1px solid #EAE2D6', borderRadius: 24, padding: '40px 32px', textAlign: 'center', boxShadow: '0 12px 32px rgba(0,0,0,0.03)' }}>
          <div style={{ width: 56, height: 56, background: '#F7F2EB', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', fontSize: 24, border: '1px solid #EAE2D6' }}>
            🔒
          </div>
          <h2 style={{ fontSize: 22, color: '#2D2D2D', margin: '0 0 8px 0', fontWeight: 800 }}>Account Access</h2>
          <p style={{ color: '#666666', fontSize: 14, margin: '0 0 24px 0', lineHeight: 1.5 }}>
            Log in to see your order history, saved items, and account settings.
          </p>
          <Link 
            to="/login" 
            style={{ 
              display: 'block', width: '100%', backgroundColor: '#8B9A6E', color: '#FFFFFF', padding: '14px 24px', 
              borderRadius: 12, fontSize: 15, fontWeight: 800, textDecoration: 'none', boxSizing: 'border-box',
              boxShadow: '0 4px 14px rgba(139, 154, 110, 0.25)', marginBottom: 28 
            }}
          >
            Login to Profile
          </Link>
          
          <div style={{ borderTop: '1px solid #EAE2D6', paddingTop: 20, textAlign: 'left' }}>
            <h4 style={{ fontSize: 12, fontWeight: 800, color: '#8B9A6E', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 12px 0' }}>
              Legal & Policies
            </h4>
            <PolicyLinks />
          </div>
        </div>
      </div>
    );
  }

  const logoutAll = async () => {
    await api.post('/auth/logout-all');
    await logout();
    navigate('/login');
  };

  const sectionHeaderStyle = {
    fontSize: 14,
    fontWeight: 800,
    color: '#8B9A6E',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    margin: '32px 0 14px 0',
  };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '32px 16px 64px 16px', fontFamily: 'sans-serif', boxSizing: 'border-box' }}>
      
      {/* User Header Profile Card */}
      <div style={{ background: '#FFFFFF', border: '1px solid #EAE2D6', borderRadius: 24, padding: '24px', display: 'flex', gap: 20, alignItems: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.02)' }}>
        <img 
          src={user.profilePic || '/default-avatar.png'} 
          alt={user.name} 
          style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '2px solid #8B9A6E', flexShrink: 0 }} 
        />
        <div style={{ overflow: 'hidden' }}>
          <div style={{ fontWeight: 800, fontSize: 20, color: '#2D2D2D', marginBottom: 4, letterSpacing: '-0.5px' }}>
            {user.name}
          </div>
          <div style={{ color: '#666666', fontSize: 14, fontWeight: 600 }}>
            {user.mobile || user.email}
          </div>
        </div>
      </div>

      {/* Order History Section */}
      <h3 style={sectionHeaderStyle}>Order History</h3>
      {orders.length === 0 && (
        <div style={{ background: '#F7F2EB', border: '1px solid #EAE2D6', borderRadius: 16, padding: '20px', color: '#666666', fontSize: 14, textAlign: 'center', fontWeight: 600 }}>
          No orders placed yet. Start exploring our collection!
        </div>
      )}
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {orders.map((o) => (
          <div key={o.orderId} style={{ background: '#FFFFFF', border: '1px solid #EAE2D6', borderRadius: 16, padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.01)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontWeight: 800, fontSize: 15, color: '#2D2D2D' }}>
                Order #{o.orderId}
              </div>
              <span style={{ 
                background: o.status === 'DELIVERED' ? '#EBF5EB' : '#F7F2EB', 
                color: o.status === 'DELIVERED' ? '#2E7D32' : '#8B9A6E', 
                padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 800, letterSpacing: '0.5px' 
              }}>
                {o.status}
              </span>
            </div>

            {o.invoiceUrl && (
              <div style={{ marginBottom: 12 }}>
                <a 
                  href={o.invoiceUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ fontSize: 13, color: '#8B9A6E', fontWeight: 700, textDecoration: 'none' }}
                >
                  📄 Download Invoice (PDF)
                </a>
              </div>
            )}

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              {['PLACED', 'PACKED'].includes(o.status) && (
                <button
                  onClick={() => cancelOrder(o)}
                  disabled={cancellingId === o._id}
                  style={{ background: '#FDF2F2', border: '1px solid #F8B4B4', color: '#9B1C1C', padding: '8px 14px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                >
                  {cancellingId === o._id ? 'Cancelling...' : 'Cancel Order'}
                </button>
              )}
              {o.status === 'DELIVERED' && !o.returnRequested && o.items?.every((it) => it.isReturnable !== false) && (
                <button
                  onClick={() => requestReturn(o)}
                  disabled={returningId === o._id}
                  style={{ background: '#F7F2EB', border: '1px solid #EAE2D6', color: '#555555', padding: '8px 14px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                >
                  {returningId === o._id ? 'Submitting...' : 'Return this item'}
                </button>
              )}
            </div>

            {o.returnRequested && (
              <div style={{ fontSize: 13, color: '#8B9A6E', fontWeight: 600, marginTop: 10 }}>
                ✓ Return requested - we'll be in touch soon.
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Account Settings Menu */}
      <h3 style={sectionHeaderStyle}>Account Settings</h3>
      <div style={{ background: '#FFFFFF', border: '1px solid #EAE2D6', borderRadius: 16, overflow: 'hidden' }}>
        <AccountNavLink to="/profile/edit" title="Change profile picture / mobile number" />
        <AccountNavLink to="/profile/saved" title="Saved items" />
        <AccountNavLink to="/profile/change-password" title="Change password" />
        <AccountNavLink to="/profile/sessions" title="Manage logged-in devices" isLast />
      </div>

      {/* Referral Card */}
      <div style={{ marginTop: 24 }}>
        <ReferralCard referralCode={user.referralCode} />
      </div>

      {/* Legal & Policies */}
      <h3 style={sectionHeaderStyle}>Legal & Policies</h3>
      <div style={{ background: '#FFFFFF', border: '1px solid #EAE2D6', borderRadius: 16, padding: '16px 20px' }}>
        <PolicyLinks />
      </div>

      {/* Authentication Controls */}
      <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
        <button 
          onClick={logout} 
          style={{ 
            background: '#F7F2EB', border: '1px solid #EAE2D6', color: '#2D2D2D', padding: '12px 20px', 
            borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer' 
          }}
        >
          Log out
        </button>
        <button 
          onClick={logoutAll} 
          style={{ 
            background: '#FDF2F2', border: '1px solid #F8B4B4', color: '#9B1C1C', padding: '12px 20px', 
            borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer' 
          }}
        >
          Log out of all devices
        </button>
      </div>

      {/* Danger Zone */}
      <h3 style={{ ...sectionHeaderStyle, color: '#9B1C1C' }}>Danger Zone</h3>
      <div style={{ background: '#FFF5F5', border: '1px solid #F8B4B4', borderRadius: 16, padding: '20px' }}>
        <DeleteAccount hasPassword={user.hasPassword} />
      </div>

    </div>
  );
}

function AccountNavLink({ to, title, isLast }) {
  return (
    <Link 
      to={to} 
      style={{ 
        display: 'block', padding: '14px 20px', color: '#2D2D2D', fontSize: 14, fontWeight: 700, 
        textDecoration: 'none', borderBottom: isLast ? 'none' : '1px solid #EAE2D6',
        transition: 'background 0.15s ease'
      }}
    >
      {title} →
    </Link>
  );
}

function PolicyLinks() {
  return (
    <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <li><Link to="/faq" style={{ color: '#555555', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>FAQ</Link></li>
      <li><Link to="/policies/shipping" style={{ color: '#555555', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>Shipping Policy</Link></li>
      <li><Link to="/policies/return" style={{ color: '#555555', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>Return & Refund Policy</Link></li>
      <li><Link to="/policies/cancellation" style={{ color: '#555555', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>Cancellation Policy</Link></li>
      <li><Link to="/policies/terms" style={{ color: '#555555', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>Terms & Conditions</Link></li>
      <li><Link to="/policies/privacy" style={{ color: '#555555', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>Privacy Policy</Link></li>
    </ul>
  );
}