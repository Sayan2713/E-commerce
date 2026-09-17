export default function BrandStory() {
  return (
    <section className="my-12 py-10 px-6 sm:px-10 bg-surface/50 border border-surface rounded-2xl relative overflow-hidden">
      {/* Background Decorative Accent */}
      <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-stretch relative z-10">
        
        {/* Story Card */}
        <div className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-xl border border-muted flex flex-col justify-between shadow-xs hover:border-primary/40 transition-colors">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-xs font-semibold tracking-widest text-primary uppercase">
                Craft & Passion
              </span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-text-main">
              Our Story
            </h3>
            <p className="text-text-soft text-sm sm:text-base leading-relaxed font-light">
              ClothStore started with a simple idea: everyday clothing shouldn&apos;t be complicated to shop for. We handpick every piece for quality and comfort, shipping directly to your doorstep with Cash on Delivery so you can check it out before you pay a rupee.
            </p>
          </div>
          
          <div className="mt-6 pt-4 border-t border-muted/60 flex items-center gap-4 text-xs font-medium text-text-main">
            <span>✨ Premium Fabrics</span>
            <span>•</span>
            <span>📍 Local Heritage</span>
          </div>
        </div>

        {/* Value Proposition Card */}
        <div className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-xl border border-muted flex flex-col justify-between shadow-xs hover:border-primary/40 transition-colors">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-xs font-semibold tracking-widest text-primary uppercase">
                The Standard
              </span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-text-main">
              Why Choose Us
            </h3>
            <p className="text-text-soft text-sm sm:text-base leading-relaxed font-light">
              No middlemen markups, no surprise fees—just honest pricing, quality fabrics, and a return policy that actually works in your favor. We are a dedicated team that reads every review and treats your wardrobe like our own.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-muted/60 flex items-center gap-4 text-xs font-medium text-text-main">
            <span>🤝 Honest Pricing</span>
            <span>•</span>
            <span>🔄 Hassle-free Returns</span>
          </div>
        </div>

      </div>
    </section>
  );
}