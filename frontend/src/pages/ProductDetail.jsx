import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/StarRating';
import ReviewsSection from '../components/ReviewsSection';
import RelatedProducts from '../components/RelatedProducts';
import RecentlyViewed from '../components/RecentlyViewed';
import { recordView } from '../utils/recentlyViewed';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [sizeError, setSizeError] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setProduct(null);
    setNotFound(false);
    api.get(`/products/${id}`)
      .then((r) => { setProduct(r.data.product); recordView(id); })
      .catch(() => setNotFound(true));
  }, [id]);

  if (notFound) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
        <div style={{ textAlign: 'center', padding: 40, background: '#FFFFFF', border: '1px solid #EAE2D6', borderRadius: 20, maxWidth: 400, width: '100%' }}>
          <p style={{ color: '#666666', fontSize: 15, margin: 0 }}>We couldn't find this product. It may have been removed.</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B9A6E', fontWeight: 600, fontSize: 16 }}>
        Loading product details...
      </div>
    );
  }

  const guardedAction = (action) => {
    if (!user) {
      navigate('/login', { state: { from: `/product/${id}` } });
      return;
    }
    action();
  };

  const handleSave = () => guardedAction(async () => {
    setSaving(true);
    try {
      await api.post(`/users/me/saved-items/${id}`);
      setSaved((s) => !s);
    } finally {
      setSaving(false);
    }
  });

  const handleBuyNow = () => guardedAction(() => {
    if (!selectedSize) { setSizeError('Please select a size to continue'); return; }
    setSizeError('');
    navigate('/checkout', { state: { productId: id, size: selectedSize, product } });
  });

  const allOutOfStock = product.variants.every((v) => v.outOfStock);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 16px 64px 16px', fontFamily: 'sans-serif', boxSizing: 'border-box' }}>
      
      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 40, alignItems: 'start' }}>
        
        {/* Left: Product Image */}
        <div style={{ position: 'sticky', top: 24 }}>
          {product.images?.[0] ? (
            <div style={{ background: '#FFFFFF', border: '1px solid #EAE2D6', borderRadius: 24, overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.02)' }}>
              <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: 'auto', display: 'block', aspectRatio: '4/5', objectFit: 'cover' }} />
            </div>
          ) : (
            <div style={{ background: '#F7F2EB', border: '1px solid #EAE2D6', borderRadius: 24, width: '100%', aspectRatio: '4/5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888888', fontWeight: 600 }}>
              No image available
            </div>
          )}
        </div>

        {/* Right: Product Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* Title & Share */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
            <h1 style={{ fontSize: 28, color: '#2D2D2D', margin: 0, fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1.2 }}>
              {product.name}
            </h1>
            <button 
              onClick={() => navigator.share?.({ title: product.name, url: window.location.href })}
              style={{
                background: '#F7F2EB', border: '1px solid #EAE2D6', padding: '8px 14px', borderRadius: 10,
                cursor: 'pointer', fontSize: 13, fontWeight: 700, color: '#555555', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0
              }}
            >
              share 🔗
            </button>
          </div>

          {/* Rating */}
          {product.ratingCount > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <StarRating value={product.ratingAvg} />
              <span style={{ fontSize: 13, color: '#666666', fontWeight: 600 }}>
                {product.ratingAvg} ({product.ratingCount} reviews)
              </span>
            </div>
          )}

          {/* Pricing & Delivery Info */}
          <div style={{ background: '#F7F2EB', border: '1px solid #EAE2D6', borderRadius: 16, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#8B9A6E', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>Price</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#2D2D2D' }}>Rs. {product.basePrice}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#8B9A6E', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>Delivery</div>
              <div style={{ fontSize: 13, color: '#666666', fontWeight: 600 }}>🚚 4-7 days</div>
            </div>
          </div>

          {/* Sizes Selection */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#8B9A6E', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Select Size
              </span>
            </div>

            {allOutOfStock ? (
              <div style={{ color: '#9B1C1C', background: '#FDF2F2', padding: '12px 16px', borderRadius: 12, fontWeight: 700, fontSize: 14, border: '1px solid #F8B4B4' }}>
                Currently Out of Stock
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {product.variants.map((v) => {
                    const isSelected = selectedSize === v.size;
                    return (
                      <button
                        key={v.size}
                        disabled={v.outOfStock}
                        onClick={() => { setSelectedSize(v.size); setSizeError(''); }}
                        style={{
                          padding: '10px 18px',
                          borderRadius: 12,
                          border: `1px solid ${isSelected ? '#8B9A6E' : '#EAE2D6'}`,
                          background: isSelected ? '#8B9A6E' : (v.outOfStock ? '#F3F3F3' : '#FFFFFF'),
                          color: isSelected ? '#FFFFFF' : (v.outOfStock ? '#AAAAAA' : '#2D2D2D'),
                          fontSize: 14,
                          fontWeight: 700,
                          cursor: v.outOfStock ? 'not-allowed' : 'pointer',
                          opacity: v.outOfStock ? 0.5 : 1,
                          boxShadow: isSelected ? '0 4px 12px rgba(139, 154, 110, 0.25)' : 'none',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {v.size} {v.outOfStock ? '(Sold out)' : ''}
                      </button>
                    );
                  })}
                </div>
                {sizeError && <div style={{ color: '#9B1C1C', fontSize: 13, marginTop: 8, fontWeight: 600 }}>{sizeError}</div>}
              </>
            )}
          </div>

          {/* Product Highlights */}
          {product.highlights?.length > 0 && (
            <div style={{ borderTop: '1px solid #EAE2D6', paddingTop: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#8B9A6E', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
                Product Highlights
              </div>
              <ul style={{ margin: 0, paddingLeft: 20, color: '#555555', fontSize: 14, lineHeight: 1.6 }}>
                {product.highlights.map((h, i) => <li key={i}>{h}</li>)}
              </ul>
            </div>
          )}

          {/* Description */}
          <div style={{ borderTop: '1px solid #EAE2D6', paddingTop: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#8B9A6E', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
              Description
            </div>
            <p style={{ color: '#555555', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
              {product.description}
            </p>
          </div>

          {/* Action Buttons Footer */}
          <div style={{ display: 'flex', gap: 12, marginTop: 10, paddingTop: 16, borderTop: '1px solid #EAE2D6' }}>
            <button 
              onClick={handleSave} 
              disabled={saving} 
              style={{
                padding: '14px 20px', borderRadius: 12, background: saved ? '#8B9A6E' : '#FFFFFF',
                color: saved ? '#FFFFFF' : '#2D2D2D', border: '1px solid #EAE2D6', fontSize: 14, fontWeight: 700,
                cursor: 'pointer', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
              }}
            >
              {saved ? 'Saved ✓' : '🤍 Save'}
            </button>
            <button 
              onClick={handleBuyNow} 
              disabled={allOutOfStock} 
              style={{
                flex: 1, padding: '14px 24px', borderRadius: 12, background: allOutOfStock ? '#C4CBB7' : '#8B9A6E',
                color: '#FFFFFF', border: 'none', fontSize: 15, fontWeight: 800, letterSpacing: '0.5px',
                cursor: allOutOfStock ? 'not-allowed' : 'pointer', boxShadow: '0 4px 14px rgba(139, 154, 110, 0.25)',
                transition: 'background 0.2s ease'
              }}
            >
              {allOutOfStock ? 'Out of Stock' : 'Buy Now'}
            </button>
          </div>

          {/* Reviews Component Wrapper */}
          <div style={{ marginTop: 24, borderTop: '1px solid #EAE2D6', paddingTop: 24 }}>
            <ReviewsSection productId={id} ratingAvg={product.ratingAvg} ratingCount={product.ratingCount} />
          </div>

        </div>
      </div>

      {/* Bottom Recommendations */}
      <div style={{ marginTop: 64, borderTop: '1px solid #EAE2D6', paddingTop: 40 }}>
        <RelatedProducts productId={id} categoryId={product.category} />
      </div>

      <div style={{ marginTop: 40 }}>
        <RecentlyViewed excludeId={id} />
      </div>

    </div>
  );
}