import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import StarRating from './StarRating';

export default function RelatedProducts({ productId, categoryId }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!categoryId) return;
    api.get('/products', { params: { category: categoryId, exclude: productId } })
      .then((r) => setProducts(r.data.products.slice(0, 8)))
      .catch(() => setProducts([]));
  }, [productId, categoryId]);

  if (products.length === 0) return null;

  return (
    <div style={{ marginTop: 48, fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h3 style={{ fontSize: 22, fontWeight: 700, color: '#2D2D2D', margin: 0, letterSpacing: '-0.3px' }}>
          Related Products
        </h3>
        <span style={{ fontSize: 13, color: '#8B9A6E', fontWeight: 600 }}>
          You might also like
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: 20,
        }}
      >
        {products.map((p) => (
          <RelatedProductCard key={p._id} product={p} />
        ))}
      </div>
    </div>
  );
}

function RelatedProductCard({ product }) {
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
        borderRadius: 14,
        border: '1px solid #EAE2D6',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: hovered ? '0 8px 20px rgba(0,0,0,0.06)' : '0 2px 8px rgba(0,0,0,0.02)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'all 0.25s ease',
      }}
    >
      <div style={{ width: '100%', height: 220, backgroundColor: '#F7F2EB', overflow: 'hidden' }}>
        <img
          src={product.images?.[0] || 'https://via.placeholder.com/200x220?text=No+Image'}
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
          }}
        />
      </div>

      <div style={{ padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
        <div
          style={{
            fontSize: 14,
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

        <div style={{ fontWeight: 800, fontSize: 15, color: '#8B9A6E' }}>
          ₹{product.basePrice}
        </div>

        {product.ratingCount > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
            <StarRating value={product.ratingAvg} size={12} />
            <span style={{ fontSize: 11, color: '#666666' }}>({product.ratingCount})</span>
          </div>
        )}
      </div>
    </Link>
  );
}