import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';

export default function SavedItems() {
  const [items, setItems] = useState(null);

  useEffect(() => {
    api.get('/users/me/saved-items')
      .then((r) => setItems(r.data.savedItems))
      .catch(() => setItems([]));
  }, []);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 16px 64px 16px', fontFamily: 'sans-serif', boxSizing: 'border-box' }}>
      
      {/* Header */}
      <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: 26, color: '#2D2D2D', margin: '0 0 4px 0', fontWeight: 800, letterSpacing: '-0.5px' }}>
            Saved Items
          </h2>
          <p style={{ color: '#666666', fontSize: 14, margin: 0 }}>
            Quick access to products you've bookmarked for later.
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
      {items === null && (
        <div style={{ minHeight: '40vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B9A6E', fontWeight: 600, fontSize: 15 }}>
          Loading your saved items...
        </div>
      )}

      {/* Empty State */}
      {items?.length === 0 && (
        <div style={{ background: '#FFFFFF', border: '1px solid #EAE2D6', borderRadius: 24, padding: '48px 24px', textAlign: 'center', maxWidth: 440, margin: '40px auto', boxShadow: '0 8px 24px rgba(0,0,0,0.02)' }}>
          <div style={{ width: 64, height: 64, background: '#F7F2EB', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', fontSize: 26, border: '1px solid #EAE2D6' }}>
            🤍
          </div>
          <h3 style={{ fontSize: 20, color: '#2D2D2D', margin: '0 0 8px 0', fontWeight: 800 }}>No saved items yet</h3>
          <p style={{ color: '#666666', fontSize: 14, margin: '0 0 24px 0', lineHeight: 1.5 }}>
            Explore our collection and tap save on items you love to find them here.
          </p>
          <Link 
            to="/" 
            style={{ 
              display: 'inline-block', backgroundColor: '#8B9A6E', color: '#FFFFFF', padding: '12px 24px', 
              borderRadius: 12, fontSize: 14, fontWeight: 800, textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(139, 154, 110, 0.25)' 
            }}
          >
            Explore Collection
          </Link>
        </div>
      )}

      {/* Product Grid */}
      {items?.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 24 }}>
          {items.map((p) => (
            <Link 
              key={p._id} 
              to={`/product/${p._id}`} 
              style={{ 
                background: '#FFFFFF',
                border: '1px solid #EAE2D6',
                borderRadius: 20,
                overflow: 'hidden',
                textDecoration: 'none',
                boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease, boxShadow 0.2s ease'
              }}
            >
              <div style={{ width: '100%', aspectRatio: '4/5', background: '#F7F2EB', overflow: 'hidden' }}>
                <img 
                  src={p.images?.[0] || '/placeholder.png'} 
                  alt={p.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
                />
              </div>
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#2D2D2D', marginBottom: 8, lineHeight: 1.3 }}>
                  {p.name}
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#8B9A6E' }}>
                  Rs. {p.basePrice}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

    </div>
  );
}