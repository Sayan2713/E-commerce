import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api/client';
import StarRating from '../components/StarRating';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState(null);
  const [filters, setFilters] = useState({ sizes: [], colors: [], priceRange: { min: 0, max: 5000 } });
  const [query, setQuery] = useState(searchParams.get('q') || '');

  const size = searchParams.get('size') || '';
  const color = searchParams.get('color') || '';
  const sort = searchParams.get('sort') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  useEffect(() => {
    api.get('/products/filters').then((r) => setFilters(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setProducts(null);
    const params = Object.fromEntries(searchParams.entries());
    if (params.q) params.search = params.q;
    api.get('/products', { params }).then((r) => setProducts(r.data.products)).catch(() => setProducts([]));
  }, [searchParams]);

  const updateFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    setSearchParams(next);
  };

  const submitSearch = (e) => {
    e.preventDefault();
    updateFilter('q', query);
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
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 16px 64px 16px', fontFamily: 'sans-serif', boxSizing: 'border-box' }}>
      
      {/* Search Input Header Bar */}
      <form onSubmit={submitSearch} style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
        <input
          placeholder="Search for kurta, saree, jeans..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ ...inputStyle, flex: 1, backgroundColor: '#FFFFFF' }}
        />
        <button 
          type="submit" 
          style={{ 
            backgroundColor: '#8B9A6E', color: '#FFFFFF', padding: '13px 24px', 
            borderRadius: 12, fontSize: 14, fontWeight: 800, border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(139, 154, 110, 0.25)', flexShrink: 0
          }}
        >
          Search
        </button>
      </form>

      {/* Main Grid Layout (Filters Sidebar & Products) */}
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 32, alignItems: 'start' }}>
        
        {/* Filters Sidebar */}
        <aside style={{ background: '#FFFFFF', border: '1px solid #EAE2D6', borderRadius: 20, padding: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, borderBottom: '1px solid #EAE2D6', paddingBottom: 12 }}>
            <h4 style={{ fontSize: 15, fontWeight: 800, color: '#2D2D2D', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Filters
            </h4>
            <button 
              onClick={() => setSearchParams(query ? { q: query } : {})} 
              style={{ fontSize: 12, fontWeight: 700, color: '#8B9A6E', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              Clear all
            </button>
          </div>

          {/* Price Range */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#8B9A6E', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Price Range</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input 
                type="number" 
                placeholder="Min" 
                defaultValue={minPrice} 
                onBlur={(e) => updateFilter('minPrice', e.target.value)} 
                style={{ ...inputStyle, padding: '10px 12px', fontSize: 13 }} 
              />
              <span style={{ color: '#888' }}>-</span>
              <input 
                type="number" 
                placeholder="Max" 
                defaultValue={maxPrice} 
                onBlur={(e) => updateFilter('maxPrice', e.target.value)} 
                style={{ ...inputStyle, padding: '10px 12px', fontSize: 13 }} 
              />
            </div>
          </div>

          {/* Size Filter */}
          {filters.sizes.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#8B9A6E', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Size</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {filters.sizes.map((s) => {
                  const isSelected = size === s;
                  return (
                    <button
                      key={s}
                      onClick={() => updateFilter('size', isSelected ? '' : s)}
                      style={{ 
                        padding: '8px 14px', fontSize: 13, fontWeight: 700, borderRadius: 10,
                        border: `1px solid ${isSelected ? '#8B9A6E' : '#EAE2D6'}`, 
                        background: isSelected ? '#8B9A6E' : '#F7F2EB', 
                        color: isSelected ? '#FFFFFF' : '#2D2D2D',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Color Filter */}
          {filters.colors.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#8B9A6E', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Color</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {filters.colors.map((c) => {
                  const isSelected = color === c;
                  return (
                    <label key={c} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: '#555', cursor: 'pointer' }}>
                      <input 
                        type="radio" 
                        name="color" 
                        checked={isSelected} 
                        onChange={() => updateFilter('color', isSelected ? '' : c)} 
                        style={{ accentColor: '#8B9A6E' }}
                      /> 
                      {c}
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </aside>

        {/* Products Results Container */}
        <div>
          {/* Sorting Header Bar */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
            <select 
              value={sort} 
              onChange={(e) => updateFilter('sort', e.target.value)}
              style={{ 
                padding: '10px 16px', borderRadius: 12, border: '1px solid #EAE2D6', 
                backgroundColor: '#FFFFFF', color: '#2D2D2D', fontSize: 14, fontWeight: 700, outline: 'none', cursor: 'pointer'
              }}
            >
              <option value="">Sort: Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {/* Loading / Empty States */}
          {products === null && (
            <div style={{ minHeight: '40vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B9A6E', fontWeight: 600, fontSize: 15 }}>
              Loading products...
            </div>
          )}
          {products?.length === 0 && (
            <div style={{ background: '#FFFFFF', border: '1px solid #EAE2D6', borderRadius: 24, padding: '48px 24px', textAlign: 'center', color: '#666666', fontSize: 15, fontWeight: 600 }}>
              No products match your filters. Try adjusting your search or filters.
            </div>
          )}

          {/* Products Grid */}
          {products?.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 20 }}>
              {products.map((p) => (
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
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#8B9A6E', marginBottom: 4 }}>
                      Rs. {p.basePrice}
                    </div>
                    {p.ratingCount > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <StarRating value={p.ratingAvg} size={12} />
                        <span style={{ fontSize: 11, color: '#666666', fontWeight: 600 }}>({p.ratingCount})</span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}