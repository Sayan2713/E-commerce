import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you! Your message has been sent.');
  };

  return (
    <div style={{ maxWidth: 1100, margin: '20px auto', padding: '0 16px', fontFamily: 'sans-serif', boxSizing: 'border-box' }}>
      
      {/* Page Header */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <span style={{ 
          background: '#EAE2D6', 
          color: '#8B9A6E', 
          padding: '4px 12px', 
          borderRadius: 20, 
          fontSize: 12, 
          fontWeight: 700, 
          letterSpacing: '1px',
          textTransform: 'uppercase',
          display: 'inline-block' 
        }}>
          Contact Us
        </span>
        <h1 style={{ fontSize: 26, color: '#2D2D2D', marginTop: 10, marginBottom: 6, fontWeight: 700 }}>
          We&apos;re Here to Help
        </h1>
        <p style={{ color: '#666666', fontSize: 14, maxWidth: 500, margin: '0 auto', lineHeight: 1.5 }}>
          Have a question about an order, product details, or returns? Send us a message below.
        </p>
      </div>

      {/* Main Form Layout Container - Auto-stacks on Mobile */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: 24, 
        background: '#FFFFFF', 
        padding: '24px 16px', 
        borderRadius: 16, 
        border: '1px solid #EAE2D6', 
        boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
        boxSizing: 'border-box'
      }}>
        
        {/* Left Box: Store Information */}
        <div style={{ 
          background: '#F7F2EB', 
          padding: 20, 
          borderRadius: 12, 
          border: '1px solid #EAE2D6',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxSizing: 'border-box'
        }}>
          <div>
            <h3 style={{ marginTop: 0, color: '#2D2D2D', fontSize: 18, fontWeight: 700 }}>
              Get in Touch
            </h3>
            <p style={{ fontSize: 13, color: '#666666', lineHeight: 1.5, marginBottom: 20 }}>
              Fill out the form and our customer support team will respond within 24 hours.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 13, color: '#2D2D2D' }}>
              <div>
                <strong style={{ display: 'block', fontSize: 11, color: '#8B9A6E', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Email Support
                </strong>
                <span style={{ wordBreak: 'break-all' }}>support@clothstore.com</span>
              </div>

              <div>
                <strong style={{ display: 'block', fontSize: 11, color: '#8B9A6E', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Customer Care Line
                </strong>
                <span>+91 98765 43210</span>
              </div>

              <div>
                <strong style={{ display: 'block', fontSize: 11, color: '#8B9A6E', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Working Hours
                </strong>
                <span>Mon - Sat: 10:00 AM - 7:00 PM</span>
              </div>
            </div>
          </div>

          <div style={{ paddingTop: 16, borderTop: '1px solid #EAE2D6', marginTop: 20, fontSize: 12, color: '#666666' }}>
            ⚡ Cash on Delivery available nationwide.
          </div>
        </div>

        {/* Right Box: Form Inputs */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%', boxSizing: 'border-box' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#2D2D2D', marginBottom: 6 }}>
                YOUR NAME *
              </label>
              <input
                type="text"
                required
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 8,
                  border: '1px solid #EAE2D6',
                  backgroundColor: '#F7F2EB',
                  fontSize: 14,
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#2D2D2D', marginBottom: 6 }}>
                EMAIL ADDRESS *
              </label>
              <input
                type="email"
                required
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 8,
                  border: '1px solid #EAE2D6',
                  backgroundColor: '#F7F2EB',
                  fontSize: 14,
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#2D2D2D', marginBottom: 6 }}>
                PHONE (OPTIONAL)
              </label>
              <input
                type="tel"
                placeholder="+91 00000 00000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 8,
                  border: '1px solid #EAE2D6',
                  backgroundColor: '#F7F2EB',
                  fontSize: 14,
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#2D2D2D', marginBottom: 6 }}>
                SUBJECT
              </label>
              <input
                type="text"
                placeholder="Order / Sizing Inquiry"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 8,
                  border: '1px solid #EAE2D6',
                  backgroundColor: '#F7F2EB',
                  fontSize: 14,
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#2D2D2D', marginBottom: 6 }}>
              HOW CAN WE HELP? *
            </label>
            <textarea
              rows={4}
              required
              placeholder="Type your message here..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 8,
                border: '1px solid #EAE2D6',
                backgroundColor: '#F7F2EB',
                fontSize: 14,
                boxSizing: 'border-box',
                outline: 'none',
                resize: 'vertical'
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              backgroundColor: '#8B9A6E',
              color: '#FFFFFF',
              padding: '12px 20px',
              border: 'none',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              boxSizing: 'border-box'
            }}
          >
            Send Message
          </button>
        </form>

      </div>
    </div>
  );
}