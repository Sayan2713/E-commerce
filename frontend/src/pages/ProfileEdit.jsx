import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function ProfileEdit() {
  const { user, setUser } = useAuth();
  const [mobile, setMobile] = useState(user?.mobile || '');
  const [uploading, setUploading] = useState(false);
  const [profilePic, setProfilePic] = useState(user?.profilePic || '');
  const navigate = useNavigate();

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const { data } = await api.post('/upload/profile-pic', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProfilePic(data.url);
    } finally {
      setUploading(false);
    }
  };

  const save = async (e) => {
    e.preventDefault();
    const { data } = await api.patch('/users/me', { mobile, profilePic });
    setUser(data.user);
    navigate('/profile');
  };

  const labelStyle = {
    display: 'block',
    fontSize: 11,
    fontWeight: 800,
    color: '#8B9A6E',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    textAlign: 'left',
  };

  const inputStyle = {
    width: '100%',
    padding: '13px 16px',
    borderRadius: 12,
    border: '1px solid #EAE2D6',
    backgroundColor: '#F7F2EB',
    color: '#2D2D2D',
    fontSize: 14,
    fontWeight: 500,
    outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <div 
      style={{ 
        minHeight: '75vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '40px 16px',
        fontFamily: 'sans-serif',
        boxSizing: 'border-box'
      }}
    >
      <div 
        style={{ 
          maxWidth: 420, 
          width: '100%', 
          background: '#FFFFFF', 
          border: '1px solid #EAE2D6', 
          borderRadius: 24, 
          padding: '40px 32px', 
          boxShadow: '0 12px 32px rgba(0,0,0,0.03)',
          textAlign: 'center'
        }}
      >
        <h2 style={{ fontSize: 24, color: '#2D2D2D', margin: '0 0 6px 0', fontWeight: 800, letterSpacing: '-0.5px' }}>
          Edit Profile
        </h2>
        <p style={{ color: '#666666', fontSize: 14, margin: '0 0 28px 0', lineHeight: 1.4 }}>
          Update your profile picture or mobile number.
        </p>

        <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: 20, textAlign: 'left' }}>
          
          {/* Avatar Preview & Upload */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, marginBottom: 4 }}>
            <img 
              src={profilePic || '/default-avatar.png'} 
              alt="Profile Avatar" 
              style={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'cover', border: '2px solid #8B9A6E', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} 
            />
            <label 
              style={{ 
                background: '#F7F2EB', border: '1px solid #EAE2D6', padding: '8px 16px', borderRadius: 10,
                fontSize: 13, fontWeight: 700, color: '#555555', cursor: 'pointer', textAlign: 'center'
              }}
            >
              {uploading ? 'Uploading...' : '📷 Change Photo'}
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleUpload} 
                disabled={uploading} 
                style={{ display: 'none' }} 
              />
            </label>
          </div>

          {/* Mobile Number Input */}
          <div>
            <label htmlFor="mobile" style={labelStyle}>Mobile Number</label>
            <input
              id="mobile"
              placeholder="Enter 10 digit mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
              maxLength={10}
              style={inputStyle}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
            <button 
              type="submit" 
              disabled={uploading}
              style={{ 
                flex: 1,
                backgroundColor: uploading ? '#C4CBB7' : '#8B9A6E', 
                color: '#FFFFFF', 
                padding: '14px 24px', 
                border: 'none', 
                borderRadius: 12, 
                fontSize: 15, 
                fontWeight: 800, 
                letterSpacing: '0.5px',
                cursor: uploading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 14px rgba(139, 154, 110, 0.25)',
                transition: 'background 0.2s ease'
              }}
            >
              {uploading ? 'Please wait...' : 'Save Changes'}
            </button>
          </div>
        </form>

        <div style={{ marginTop: 24, fontSize: 14 }}>
          <Link to="/profile" style={{ color: '#8B9A6E', fontWeight: 700, textDecoration: 'none' }}>
            ← Cancel & Back to Profile
          </Link>
        </div>

      </div>
    </div>
  );
}