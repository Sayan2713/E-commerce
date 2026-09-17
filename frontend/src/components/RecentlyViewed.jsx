import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { getRecentlyViewed } from '../utils/recentlyViewed';
import StarRating from './StarRating';

export default function RecentlyViewed({ excludeId, title = 'Recently Viewed' }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const ids = getRecentlyViewed().filter((id) => id !== excludeId);
    if (ids.length === 0) {
      setProducts([]);
      return;
    }
    api
      .get('/products', { params: { ids: ids.join(',') } })
      .then((r) => {
        // preserve the most-recent-first order from localStorage
        const byId = Object.fromEntries(r.data.products.map((p) => [p._id, p]));
        setProducts(ids.map((id) => byId[id]).filter(Boolean));
      })
      .catch(() => setProducts([]));
  }, [excludeId]);

  if (products.length === 0) return null;

  return (
    <div style={{ marginTop: 40, fontFamily: 'sans-serif' }}>
      <h3
        style={{
          fontSize: 20,
          fontWeight: 700,
          color: '#2D2D2D',
          marginBottom: 16,
          letterSpacing: '-0.3px',
        }}
      >
        {title}
      </h3>

      {/* Horizontal Carousel */}
      <div
        style={{
          display: 'flex',
          gap: 16,
          overflowX: 'auto',
          paddingBottom: 12,
          scrollBehavior: 'smooth',
        }}
      >
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={`/product/${product._id}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        textDecoration: 'none',
        color: 'inherit',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        border: '1px solid #EAE2D6',
        overflow: 'hidden',
        minWidth: 170,
        flex: '0 0 170px',
        boxShadow: hovered ? '0 6px 16px rgba(0,0,0,0.06)' : '0 2px 8px rgba(0,0,0,0.02)',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        transition: 'all 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ width: '100%', height: 180, backgroundColor: '#F7F2EB', overflow: 'hidden' }}>
        <img
          src={product.images?.[0] || 'https://via.placeholder.com/170x180?text=No+Image'}
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
            transform: hovered ? 'scale(1.04)' : 'scale(1)',
          }}
        />
      </div>

      <div style={{ padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: '#2D2D2D',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          title={product.name}
        >
          {product.name}
        </div>

        <div style={{ fontWeight: 800, fontSize: 14, color: '#8B9A6E' }}>
          ₹{product.basePrice}
        </div>

        {product.ratingCount > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
            <StarRating value={product.ratingAvg} size={11} />
            <span style={{ fontSize: 10, color: '#666666' }}>({product.ratingCount})</span>
          </div>
        )}
      </div>
    </Link>
  );
}