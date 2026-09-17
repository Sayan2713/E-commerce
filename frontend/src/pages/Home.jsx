import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import StarRating from '../components/StarRating';
import BannerSlider from '../components/BannerSlider';
import TrustBadges from '../components/TrustBadges';
import WhyShopWithUs from '../components/WhyShopWithUs';
import RecentlyViewed from '../components/RecentlyViewed';
import BrandStory from '../components/BrandStory';
import StatsSection from '../components/StatsSection';
import ContactSupport from '../components/ContactSupport';

export default function Home() {
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState(null); // null = loading

  useEffect(() => {
    let isMounted = true;

    // Fetch all home data concurrently to reduce network request waterfall
    Promise.allSettled([
      api.get('/banners'),
      api.get('/categories'),
      api.get('/products'),
    ]).then(([bannersRes, categoriesRes, productsRes]) => {
      if (!isMounted) return;

      if (bannersRes.status === 'fulfilled') {
        setBanners(bannersRes.value.data.banners || []);
      }

      if (categoriesRes.status === 'fulfilled') {
        const topCategories = (categoriesRes.value.data.categories || []).filter(
          (c) => !c.parent
        );
        setCategories(topCategories);
      }

      if (productsRes.status === 'fulfilled') {
        setProducts(productsRes.value.data.products || []);
      } else {
        setProducts([]);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="max-w-[1200px] mx-auto px-4 pt-4 pb-10 space-y-10">
      
      {/* Hero Banner Section */}
      {banners.length > 0 ? (
        <BannerSlider banners={banners} />
      ) : (
        <div className="h-[220px] rounded-[10px] mb-6 bg-gradient-to-br from-primary to-[#6d7a56] text-white flex flex-col items-center justify-center text-center p-4 shadow-sm">
          <div className="text-3xl font-bold tracking-wide">ClothStore</div>
          <div className="mt-1.5 opacity-90 text-sm md:text-base">
            Quality clothing, delivered with Cash on Delivery
          </div>
        </div>
      )}

      <TrustBadges />

      <RecentlyViewed />

      {/* Categories Section */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-text-main tracking-tight">Shop by Category</h3>
        {categories.length > 0 ? (
          <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((c) => (
              <Link 
                key={c._id || c.slug} 
                to={`/category/${c.slug}`} 
                className="group text-center min-w-[90px] flex flex-col items-center"
                aria-label={`Browse category ${c.name}`}
              >
                <div className="w-[72px] h-[72px] rounded-full overflow-hidden bg-surface flex items-center justify-center transition-transform duration-300 group-hover:scale-105 group-hover:shadow-md">
                  {c.image ? (
                    <img 
                      src={c.image} 
                      alt={c.name} 
                      className="w-full h-full object-cover" 
                      loading="lazy"
                    />
                  ) : (
                    <div className="text-text-soft text-xs font-semibold">
                      {c.name?.[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="text-xs font-medium text-text-main mt-2 group-hover:text-primary transition-colors">
                  {c.name}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-text-soft py-2 text-sm">
            No categories yet - add some from the admin panel.
          </div>
        )}
      </section>

      {/* Trending Products Section */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-text-main tracking-tight">Trending Now</h3>
        
        {/* Skeleton Loaders */}
        {products === null ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-[270px] bg-muted animate-pulse rounded-[10px]" />
            ))}
          </div>
        ) : products.length === 0 ? (
          /* Empty State */
          <div className="text-text-soft py-5 text-sm">
            No products yet - check back soon.
          </div>
        ) : (
          /* Product Cards Grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {products.map((p) => (
              <Link 
                key={p._id} 
                to={`/product/${p._id}`} 
                className="group bg-white border border-muted rounded-[10px] overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                aria-label={`View ${p.name}`}
              >
                <div className="w-full h-[220px] overflow-hidden bg-surface">
                  <img 
                    src={p.images?.[0] || '/placeholder-product.png'} 
                    alt={p.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    loading="lazy"
                  />
                </div>
                <div className="p-2.5 flex flex-col justify-between flex-grow">
                  <div>
                    <div className="text-sm font-medium text-text-main line-clamp-1 group-hover:text-primary transition-colors">
                      {p.name}
                    </div>
                    <div className="font-bold text-text-main text-base mt-1">
                      ₹{p.basePrice ? p.basePrice.toLocaleString('en-IN') : '0'}
                    </div>
                  </div>

                  {p.ratingCount > 0 && (
                    <div className="flex items-center gap-1 mt-1.5">
                      <StarRating value={p.ratingAvg} size={12} />
                      <span className="text-[11px] text-text-soft">({p.ratingCount})</span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Secondary Sections */}
      {products !== null && products.length < 4 && <WhyShopWithUs />}

      <StatsSection />
      <BrandStory />
      <ContactSupport />
    </div>
  );
}