import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

export default function CompleteProfile() {
  const [mobile, setMobile] = useState('');
  const [dob, setDob] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await api.post('/auth/complete-profile', { mobile, dob });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: 12,
    border: '1px solid #EAE2D6',
    backgroundColor: '#F7F2EB',
    color: '#2D2D2D',
    fontSize: 15,
    fontWeight: 500,
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease',
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

  return (
    <div 
      style={{ 
        minHeight: '80vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: 20,
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
          boxShadow: '0 12px 40px rgba(0,0,0,0.03)',
          textAlign: 'center'
        }}
      >
        
        {/* Welcome Icon / Badge */}
        <div 
          style={{ 
            width: 64, 
            height: 64, 
            background: '#F7F2EB', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 20px auto',
            fontSize: 28,
            border: '1px solid #EAE2D6'
          }}
        >
          🌱
        </div>

        <h2 style={{ fontSize: 24, color: '#2D2D2D', margin: '0 0 10px 0', fontWeight: 800, letterSpacing: '-0.5px' }}>
          Just one more step
        </h2>
        <p style={{ color: '#666666', fontSize: 14, lineHeight: 1.5, margin: '0 0 32px 0' }}>
          Please add your mobile number and date of birth to finish setting up your account.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          <div>
            <label style={labelStyle}>Mobile Number *</label>
            <input 
              placeholder="10-digit mobile number" 
              value={mobile} 
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))} 
              maxLength={10}
              required 
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Date of Birth *</label>
            <input 
              type="date" 
              value={dob} 
              onChange={(e) => setDob(e.target.value)} 
              required 
              style={{
                ...inputStyle,
                color: dob ? '#2D2D2D' : '#999999', // Dim color if empty placeholder
                fontFamily: 'sans-serif'
              }}
            />
          </div>

          {error && (
            <div style={{ 
              color: '#9B1C1C', 
              background: '#FDF2F2', 
              padding: '10px 14px', 
              borderRadius: 10, 
              fontSize: 13, 
              border: '1px solid #F8B4B4',
              textAlign: 'left'
            }}>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading || mobile.length < 10 || !dob}
            style={{ 
              width: '100%', 
              backgroundColor: (loading || mobile.length < 10 || !dob) ? '#C4CBB7' : '#8B9A6E', 
              color: '#FFFFFF', 
              padding: '16px 24px', 
              border: 'none', 
              borderRadius: 14, 
              fontSize: 16, 
              fontWeight: 800, 
              letterSpacing: '0.5px',
              marginTop: 8,
              cursor: (loading || mobile.length < 10 || !dob) ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 14px rgba(139, 154, 110, 0.25)',
              transition: 'background 0.2s ease, transform 0.1s ease',
            }}
          >
            {loading ? 'Saving details...' : 'Continue to Store'}
          </button>
        </form>
      </div>
    </div>
  );
}