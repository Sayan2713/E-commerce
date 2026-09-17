import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/client';

export default function CategoryListing() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get('/categories')
      .then((r) => {
        const cat = r.data.categories.find((c) => c.slug === slug);
        if (cat) {
          return api.get('/products', { params: { category: cat._id } });
        }
        return Promise.reject(new Error('Category not found'));
      })
      .then((res) => {
        setProducts(res.data.products || []);
      })
      .catch(() => {
        setProducts([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  const formattedCategoryTitle = slug ? slug.replace(/-/g, ' ') : 'Collection';

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '32px 20px 60px 20px',
        fontFamily: 'sans-serif',
        boxSizing: 'border-box',
      }}
    >
      {/* Category Header */}
      <div style={{ marginBottom: 32, borderBottom: '1px solid #EAE2D6', paddingBottom: 16 }}>
        <h1
          style={{
            fontSize: 32,
            fontWeight: 800,
            color: '#2D2D2D',
            textTransform: 'capitalize',
            margin: '0 0 8px 0',
            letterSpacing: '-0.5px',
          }}
        >
          {formattedCategoryTitle}
        </h1>
        <p style={{ color: '#666666', margin: 0, fontSize: 14 }}>
          Explore our curated selection of high-quality items in this collection.
        </p>
      </div>

      {/* Loading Skeleton Grid */}
      {loading ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 24,
          }}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div
              key={n}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 12,
                border: '1px solid #EAE2D6',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: 260,
                  backgroundColor: '#F7F2EB',
                }}
              />
              <div style={{ padding: 16 }}>
                <div
                  style={{
                    height: 16,
                    backgroundColor: '#F7F2EB',
                    borderRadius: 4,
                    marginBottom: 8,
                    width: '80%',
                  }}
                />
                <div
                  style={{
                    height: 18,
                    backgroundColor: '#F7F2EB',
                    borderRadius: 4,
                    width: '40%',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        /* Empty State */
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            border: '1px solid #EAE2D6',
            padding: '60px 20px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>🛍️</div>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: '#2D2D2D', margin: '0 0 8px 0' }}>
            No products found
          </h3>
          <p style={{ color: '#666666', fontSize: 14, margin: '0 0 20px 0' }}>
            There are currently no items available in this category.
          </p>
          <Link
            to="/"
            style={{
              display: 'inline-block',
              backgroundColor: '#8B9A6E',
              color: '#FFFFFF',
              padding: '10px 24px',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Explore Other Collections
          </Link>
        </div>
      ) : (
        /* Product Cards Grid */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 24,
          }}
        >
          {products.map((p) => (
            <Link
              key={p._id}
              to={`/product/${p._id}`}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 12,
                border: '1px solid #EAE2D6',
                overflow: 'hidden',
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ width: '100%', height: 260, backgroundColor: '#F7F2EB', overflow: 'hidden' }}>
                <img
                  src={p.images?.[0] || 'https://via.placeholder.com/300x300?text=No+Image'}
                  alt={p.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>

              <div style={{ padding: 16, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <div
                  style={{
                    color: '#2D2D2D',
                    fontWeight: 600,
                    fontSize: 15,
                    marginBottom: 8,
                    lineHeight: 1.4,
                  }}
                >
                  {p.name}
                </div>
                <div style={{ marginTop: 'auto', color: '#8B9A6E', fontWeight: 800, fontSize: 16 }}>
                  ₹{Number(p.basePrice).toLocaleString('en-IN')}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}