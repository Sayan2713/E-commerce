import { useEffect, useState } from 'react';

export default function BannerSlider({ banners = [] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % banners.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (!banners || banners.length === 0) return null;

  const handlePrev = () => {
    setIndex((i) => (i === 0 ? banners.length - 1 : i - 1));
  };

  const handleNext = () => {
    setIndex((i) => (i + 1) % banners.length);
  };

  return (
    <div className="relative w-full h-[280px] sm:h-[360px] md:h-[420px] rounded-2xl overflow-hidden shadow-lg border border-surface group mb-8 bg-surface">
      {/* Banner Slides */}
      {banners.map((b, i) => (
        <div
          key={b._id || i}
          className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
            i === index ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          {/* Main Background Image */}
          <img
            src={b.image}
            alt={b.title || 'Collection Banner'}
            className="w-full h-full object-cover object-center transform transition-transform duration-1000 scale-100 group-hover:scale-105"
          />

          {/* Editorial Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-text-main/70 via-text-main/20 to-transparent flex flex-col justify-end p-6 sm:p-10 md:p-12">
            {b.title && (
              <div className="max-w-xl space-y-2 transform translate-y-0 transition-all duration-500">
                <span className="inline-block px-3 py-1 bg-primary/90 text-white rounded-full text-xs font-semibold tracking-wider uppercase backdrop-blur-md">
                  Featured Collection
                </span>
                <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-wide leading-tight drop-shadow-sm">
                  {b.title}
                </h2>
                {b.subtitle && (
                  <p className="text-white/90 text-xs sm:text-sm font-light line-clamp-2">
                    {b.subtitle}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Interactive Arrows (Visible on Hover) */}
      {banners.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            aria-label="Previous Slide"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/70 hover:bg-white text-text-main backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-md cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={handleNext}
            aria-label="Next Slide"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/70 hover:bg-white text-text-main backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-md cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Modern Active Pill Indicators */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center items-center gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                i === index
                  ? 'w-8 bg-primary shadow-sm'
                  : 'w-2 bg-white/60 hover:bg-white'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}