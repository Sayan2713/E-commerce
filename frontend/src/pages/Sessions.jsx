import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Sessions() {
  const [sessions, setSessions] = useState(null);
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/auth/sessions')
      .then((r) => setSessions(r.data.sessions))
      .catch(() => setSessions([]));
  }, []);

  const logoutAll = async () => {
    if (!window.confirm('Are you sure you want to log out of all active devices?')) return;
    setLoading(true);
    try {
      await api.post('/auth/logout-all');
      await logout();
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to log out of all devices');
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '32px 16px 64px 16px', fontFamily: 'sans-serif', boxSizing: 'border-box' }}>
      
      {/* Header */}
      <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: 26, color: '#2D2D2D', margin: '0 0 4px 0', fontWeight: 800, letterSpacing: '-0.5px' }}>
            Logged-in Devices
          </h2>
          <p style={{ color: '#666666', fontSize: 14, margin: 0 }}>
            Manage the active browsers and devices currently signed into your account.
          </p>
        </div>
        <Link 
          to="/profile" 
          style={{ fontSize: 14, color: '#8B9A6E', fontWeight: 700, textDecoration: 'none' }}
        >
          ← Back to Profile
        </Link>
      </div>

      {/* Loading State */}
      {sessions === null && (
        <div style={{ minHeight: '30vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B9A6E', fontWeight: 600, fontSize: 15 }}>
          Loading active sessions...
        </div>
      )}

      {/* Empty State */}
      {sessions?.length === 0 && (
        <div style={{ background: '#FFFFFF', border: '1px solid #EAE2D6', borderRadius: 24, padding: '40px 24px', textAlign: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.02)' }}>
          <div style={{ width: 56, height: 56, background: '#F7F2EB', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', border: '1px solid #EAE2D6' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8B9A6E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
              <line x1="12" y1="18" x2="12.01" y2="18" />
            </svg>
          </div>
          <p style={{ color: '#666666', fontSize: 14, margin: 0, fontWeight: 600 }}>No active sessions found.</p>
        </div>
      )}

      {/* Sessions List Container */}
      {sessions?.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
          {sessions.map((s) => (
            <div 
              key={s._id} 
              style={{ 
                background: '#FFFFFF', 
                border: '1px solid #EAE2D6', 
                borderRadius: 16, 
                padding: '20px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: 16,
                boxShadow: '0 4px 12px rgba(0,0,0,0.01)' 
              }}
            >
              <div style={{ width: 44, height: 44, background: '#F7F2EB', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #EAE2D6', flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B9A6E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                  <line x1="12" y1="18" x2="12.01" y2="18" />
                </svg>
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ fontWeight: 800, fontSize: 15, color: '#2D2D2D', marginBottom: 4 }}>
                  {s.deviceLabel || 'Unknown device'}
                </div>
                <div style={{ fontSize: 13, color: '#666666', fontWeight: 600 }}>
                  Last active: {new Date(s.lastUsedAt).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action Button */}
      {sessions?.length > 0 && (
        <button 
          onClick={logoutAll} 
          disabled={loading}
          style={{ 
            width: '100%', 
            backgroundColor: '#FDF2F2', 
            color: '#9B1C1C', 
            border: '1px solid #F8B4B4', 
            padding: '14px 24px', 
            borderRadius: 12, 
            fontSize: 15, 
            fontWeight: 800, 
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            transition: 'background 0.2s ease'
          }}
        >
          {loading ? 'Logging out of all devices...' : 'Log out of all devices'}
        </button>
      )}

    </div>
  );
}