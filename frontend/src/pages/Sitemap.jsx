import { Link } from 'react-router-dom';

const SECTIONS = [
  {
    title: 'Shop',
    links: [
      { to: '/', label: 'Home' },
      { to: '/search', label: 'Search Products' },
    ],
  },
  {
    title: 'Account',
    links: [
      { to: '/login', label: 'Login' },
      { to: '/register', label: 'Register' },
      { to: '/profile', label: 'Profile' },
      { to: '/profile/saved', label: 'Saved Items' },
    ],
  },
  {
    title: 'Company',
    links: [
      { to: '/about', label: 'About Us' },
      { to: '/contact', label: 'Contact Us / Help Center' },
      { to: '/careers', label: 'Careers' },
    ],
  },
  {
    title: 'Policies',
    links: [
      { to: '/faq', label: 'FAQ' },
      { to: '/policies/shipping', label: 'Shipping Policy' },
      { to: '/policies/return', label: 'Return & Refund Policy' },
      { to: '/policies/cancellation', label: 'Cancellation Policy' },
      { to: '/policies/privacy', label: 'Privacy Policy' },
      { to: '/policies/terms', label: 'Terms & Conditions' },
    ],
  },
];

export default function Sitemap() {
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 16px 64px 16px', fontFamily: 'sans-serif', boxSizing: 'border-box' }}>
      
      {/* Header */}
      <div style={{ marginBottom: 36, textAlign: 'center' }}>
        <h2 style={{ fontSize: 32, color: '#2D2D2D', margin: '0 0 8px 0', fontWeight: 800, letterSpacing: '-0.5px' }}>
          Sitemap
        </h2>
        <p style={{ color: '#666666', fontSize: 15, margin: 0 }}>
          Quickly navigate to any page across our store.
        </p>
      </div>

      {/* Sections Grid Container */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
        {SECTIONS.map((section) => (
          <div 
            key={section.title} 
            style={{ 
              background: '#FFFFFF', 
              border: '1px solid #EAE2D6', 
              borderRadius: 20, 
              padding: '24px', 
              boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <h4 style={{ 
              fontSize: 14, 
              fontWeight: 800, 
              color: '#8B9A6E', 
              margin: '0 0 16px 0', 
              textTransform: 'uppercase', 
              letterSpacing: '0.5px',
              borderBottom: '1px solid #EAE2D6',
              paddingBottom: 10
            }}>
              {section.title}
            </h4>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {section.links.map((l) => (
                <li key={l.to}>
                  <Link 
                    to={l.to} 
                    style={{ 
                      color: '#2D2D2D', 
                      fontSize: 14, 
                      fontWeight: 600, 
                      textDecoration: 'none',
                      display: 'inline-block',
                      transition: 'color 0.15s ease, transform 0.15s ease'
                    }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

    </div>
  );
}