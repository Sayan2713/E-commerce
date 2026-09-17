import { useState } from 'react';
import api from '../api/client';

export default function ContactSupport() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setError('');
    try {
      await api.post('/support', form);
      setStatus('sent');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setStatus('error');
      setError(err.response?.data?.message || 'Failed to submit ticket');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 8,
    border: '1px solid #EAE2D6',
    backgroundColor: '#F7F2EB',
    color: '#2D2D2D',
    fontSize: 13,
    outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <div
      style={{
        maxWidth: 900,
        margin: '0 auto',
        padding: '20px 16px 40px 16px',
        fontFamily: 'sans-serif',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <span
          style={{
            backgroundColor: '#EAE2D6',
            color: '#8B9A6E',
            padding: '4px 12px',
            borderRadius: 16,
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            display: 'inline-block',
            marginBottom: 8,
          }}
        >
          CONTACT US
        </span>
        <h1
          style={{
            fontSize: 24,
            fontWeight: 800,
            color: '#2D2D2D',
            margin: '0 0 6px 0',
          }}
        >
          We're Here to Help
        </h1>
        <p style={{ color: '#666666', fontSize: 13, margin: 0 }}>
          Have a question about an order, product details, or returns? Send us a message below.
        </p>
      </div>

      {/* Main Container - Flexbox Auto-wrap for Mobile */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          border: '1px solid #EAE2D6',
          padding: 16,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 20,
          boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
        }}
      >
        {/* Left Column Info Card */}
        <div
          style={{
            flex: '1 1 260px',
            backgroundColor: '#F7F2EB',
            borderRadius: 12,
            padding: 20,
            border: '1px solid #EAE2D6',
            boxSizing: 'border-box',
          }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#2D2D2D', margin: '0 0 8px 0' }}>
            Get in Touch
          </h2>
          <p style={{ fontSize: 12, color: '#666666', lineHeight: 1.5, margin: '0 0 20px 0' }}>
            Fill out the form and our customer support team will respond within 24 hours.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 12 }}>
            <div>
              <div style={{ fontWeight: 700, color: '#2D2D2D', fontSize: 10, textTransform: 'uppercase', marginBottom: 2 }}>
                EMAIL SUPPORT
              </div>
              <div style={{ color: '#666666' }}>support@clothstore.com</div>
            </div>

            <div>
              <div style={{ fontWeight: 700, color: '#2D2D2D', fontSize: 10, textTransform: 'uppercase', marginBottom: 2 }}>
                CUSTOMER CARE LINE
              </div>
              <div style={{ color: '#666666' }}>+91 98765 43210</div>
            </div>

            <div>
              <div style={{ fontWeight: 700, color: '#2D2D2D', fontSize: 10, textTransform: 'uppercase', marginBottom: 2 }}>
                WORKING HOURS
              </div>
              <div style={{ color: '#666666' }}>Mon - Sat: 10:00 AM - 7:00 PM</div>
            </div>
          </div>

          <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #EAE2D6', fontSize: 11, color: '#8B9A6E', fontWeight: 600 }}>
            ⚡ Cash on Delivery available nationwide
          </div>
        </div>

        {/* Right Column Form */}
        <div style={{ flex: '2 1 280px', boxSizing: 'border-box' }}>
          {status === 'sent' ? (
            <div
              style={{
                backgroundColor: '#F7F2EB',
                borderRadius: 12,
                padding: 32,
                textAlign: 'center',
                border: '1px solid #8B9A6E',
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
              <h3 style={{ fontSize: 18, color: '#2D2D2D', margin: '0 0 6px 0' }}>Message Sent!</h3>
              <p style={{ fontSize: 13, color: '#666666', margin: '0 0 16px 0' }}>
                We'll review your query and respond shortly.
              </p>
              <button
                onClick={() => setStatus('')}
                style={{
                  backgroundColor: '#8B9A6E',
                  color: '#FFFFFF',
                  padding: '8px 18px',
                  borderRadius: 6,
                  border: 'none',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ flex: '1 1 130px' }}>
                  <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#2D2D2D', marginBottom: 4 }}>
                    YOUR NAME *
                  </label>
                  <input
                    placeholder="John Doe"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    style={inputStyle}
                  />
                </div>
                <div style={{ flex: '1 1 130px' }}>
                  <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#2D2D2D', marginBottom: 4 }}>
                    EMAIL ADDRESS *
                  </label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#2D2D2D', marginBottom: 4 }}>
                  PHONE (OPTIONAL)
                </label>
                <input
                  placeholder="+91 00000 00000"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#2D2D2D', marginBottom: 4 }}>
                  HOW CAN WE HELP? *
                </label>
                <textarea
                  placeholder="Type your message here..."
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>

              {error && (
                <div style={{ color: '#9B1C1C', backgroundColor: '#FDF2F2', padding: 8, borderRadius: 6, fontSize: 12 }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                style={{
                  width: '100%',
                  backgroundColor: status === 'sending' ? '#C4CBB7' : '#8B9A6E',
                  color: '#FFFFFF',
                  padding: '12px',
                  borderRadius: 8,
                  border: 'none',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                  marginTop: 4,
                }}
              >
                {status === 'sending' ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}