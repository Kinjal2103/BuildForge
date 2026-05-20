import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import ProductCard from '../components/ProductCard';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Home() {
  const carouselRef = useRef(null);

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmt = 340;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmt : scrollAmt,
        behavior: 'smooth'
      });
    }
  };

  const trendingProducts = PRODUCTS.filter(
    (p) => p.isTrending || p.id === 'sculptural-wool-overcoat' || p.id === 'heavyweight-organic-tee'
  );
  const featuredFurniture = PRODUCTS.filter((p) => p.category === 'Home').slice(0, 3);

  return (
    <div className="space-y-16 pb-12 font-sans">
      {/* 1. HERO BANNER SECTION */}
      <section className="relative h-[80vh] bg-slate-900 text-white flex items-center overflow-hidden rounded-2xl mx-4 md:mx-0 shadow-lg">
        {/* Absolute Background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=2070&auto=format&fit=crop"
            alt="Lumina Collection background"
            className="w-full h-full object-cover opacity-45 mix-blend-overlay scale-105 duration-700 hover:scale-100 transition-transform"
          />
        </div>

        {/* Hero Copy overlay */}
        <div className="relative z-10 max-w-[1280px] mx-auto w-full px-8 md:px-12 flex flex-col items-start gap-4">
          <span className="text-xs uppercase tracking-[0.3em] font-bold text-slate-350">
            Lumina Autumn / Winter Collection
          </span>
          
          <h1 className="font-sans font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white max-w-2xl leading-tight">
            Quiet luxury, sculptural tailoring, architectural forms.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-lg leading-relaxed mt-2">
            A celebration of soft textiles, high-contrast concrete and glass lines, and minimalist design. Discover pieces made to last.
          </p>

          <div className="flex flex-wrap gap-4 mt-6">
            <Link
              to="/products"
              className="bg-white hover:bg-slate-100 text-[#0b1c30] font-bold tracking-widest text-xs uppercase px-8 py-3.5 rounded shadow-lg transition-transform hover:-translate-y-0.5 cursor-pointer text-center"
            >
              Explore Shop
            </Link>
            <Link
              to="/collections"
              className="border border-white/60 hover:bg-white/10 text-white font-bold tracking-widest text-xs uppercase px-8 py-3.5 rounded transition-transform hover:-translate-y-0.5 cursor-pointer text-center"
            >
              Curated Living
            </Link>
          </div>
        </div>

        {/* Bottom subtle layout marker */}
        <div className="absolute bottom-6 left-8 right-8 flex justify-between items-center text-[10px] tracking-widest text-white/50 uppercase z-10">
          <span>CURATED SERIES 04 / EDITION 01</span>
          <span>EST. MCMLXXV</span>
        </div>
      </section>

      {/* 2. CHOOSE BY CURATED CATEGORY BLOCKS */}
      <section className="max-w-[1280px] mx-auto px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
          <div>
            <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">Collections</span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#0b1c30] mt-1">Shop by Category</h2>
          </div>
          <Link
            to="/products"
            className="text-xs font-bold uppercase tracking-widest text-blue-900 border-b border-blue-900/60 pb-0.5 hover:opacity-80 transition-all flex items-center gap-1 cursor-pointer"
          >
            See all collections <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 3 Interactive Grid blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* APPAREL CARD */}
          <Link
            to="/products?category=Apparel"
            className="group relative h-[380px] bg-slate-100 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer block"
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhbpiZYGfxQWx7yqgLTk4OoztR7yx9ee0Nu7l5WhpBOwHjGQRBYsFTPp2VW2NDIeVTZjbPFkpVzivEHTfkppgFarSBS2rs_zEUkJzt8JIMmi7uarGrLUaI4hIq1SIr_uM7GbO_W83IraamteGbgBKrigcA4sRoIRXmpbmBslJfgasOMnBrCTQHjYGnQXlULy5qKcFaXaZnbo7n6mGCjz4dFn8TVk2CwRMIrQthYvcm4yrGQAjqkK-Q6Nc8PrlomeIc_42osjqEiwQ"
              alt="Premium Apparel"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent flex flex-col justify-end p-6 text-white">
              <span className="text-[10px] uppercase tracking-wider text-slate-350 font-bold mb-1">Vol. 4 Apparel</span>
              <h3 className="text-lg font-bold">Tailored Outerwear &amp; Knits</h3>
              <p className="text-xs text-slate-300 mt-1 line-clamp-2 max-w-xs opacity-80">
                Premium cashmere blends and architectural double-breasted overcoats designed for refined ease.
              </p>
            </div>
          </Link>

          {/* ACCESSORIES CARD */}
          <Link
            to="/products?category=Accessories"
            className="group relative h-[380px] bg-slate-100 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer block"
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7zeXdi3NTg4dBr5a7Ic8HJY18EKt_oxGzOVhyru4vLuT_bDrawiLfiZ8Q22EPGZBRoli0Hjrvwm6pwF5BERwFup9rRTId_Wmi8JcDuxD8hyH58ZP9XsAQmkG1m9mz7JhjD0uEp6W48WmGEinKZ9EUtx97sWjIq9Kkky-FrHi3GuWO8SSRXZfJpFjshjdrtn-C8w-B0xPItH9SLRr09DxwLFt_97aLmQQiEijia6h1iu5BIlEdveOq1O-hBZqk9ilbJiih2-iExgI"
              alt="Sculpted Accessories"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent flex flex-col justify-end p-6 text-white">
              <span className="text-[10px] uppercase tracking-wider text-slate-350 font-bold mb-1">Essential Accents</span>
              <h3 className="text-lg font-bold">Architectural Leather &amp; Optics</h3>
              <p className="text-xs text-slate-300 mt-1 line-clamp-2 max-w-xs opacity-80">
                Fine leather totes and geometric titanium spectacles focusing purely on essential curves.
              </p>
            </div>
          </Link>

          {/* HOME CARD */}
          <Link
            to="/collections?zone=living"
            className="group relative h-[380px] bg-slate-100 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer block"
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDR__-aysc0WmVxhcUE4NfOlPodlobhEU7jqm8JYDGUSIUcn99tt41i5xgHURXEmmkMLCj7-x57bTups8CSnW0zfcuzBACe9e50QxCbZETE6OSwaUua0PDUXpDdxdimEoPqU6INKOV6k9y2_n_eIIzXKHS4mp4-wV7MfriVSlKaEXtRjK0plRm-1TNp8Q29Ayx_TXwtFugJBcym0V5VNQjxP9IY0XpkKZZR1XEFlrXfg1PxJH9bnQZah4BURB068OqyPR34EN21gJY"
              alt="Curated Living Space"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent flex flex-col justify-end p-6 text-white">
              <span className="text-[10px] uppercase tracking-wider text-slate-350 font-bold mb-1">Design Studio</span>
              <h3 className="text-lg font-bold">The Home Living Series</h3>
              <p className="text-xs text-slate-300 mt-1 line-clamp-2 max-w-xs opacity-80">
                Sculptural ceramic furniture, modern lighting fixtures, and modular sofa pairings.
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* 3. TRENDING SLIDER CAROUSEL */}
      <section className="bg-slate-55 border-y border-slate-200/50 py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex justify-between items-end mb-8">
            <div>
              <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">Trending Now</span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0b1c30] mt-1">Sought-after Pieces</h2>
            </div>

            {/* Carousel navigation triggers */}
            <div className="flex gap-2">
              <button
                onClick={() => scrollCarousel('left')}
                className="w-10 h-10 border border-slate-200 hover:bg-white text-[#0b1c30] flex items-center justify-center rounded-full transition-all cursor-pointer shadow-xs bg-white/50"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5 text-slate-700" />
              </button>
              <button
                onClick={() => scrollCarousel('right')}
                className="w-10 h-10 border border-slate-200 hover:bg-white text-[#0b1c30] flex items-center justify-center rounded-full transition-all cursor-pointer shadow-xs bg-white/50"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5 text-slate-700" />
              </button>
            </div>
          </div>

          {/* Actual swiper row */}
          <div
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory no-scrollbar"
          >
            {trendingProducts.map((product) => (
              <div key={product.id} className="w-[280px] sm:w-[310px] flex-shrink-0 snap-start">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. THE HOME ACCENTS EXHIBITION (FURNITURE SPEC) */}
      <section className="max-w-[1280px] mx-auto px-6">
        <div className="bg-white rounded-xl border border-slate-200/50 p-6 md:p-12 shadow-xs grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-widest text-[#0b1c30] font-bold py-1 px-3 bg-[#FAF9F5] border border-slate-200/40 rounded-full">
              Featured Exhibition
            </span>
            
            <h2 className="font-sans font-extrabold text-3xl sm:text-4xl tracking-tight text-[#0b1c30] leading-tight">
              Design Aesthetics: The Living Space Curated
            </h2>

            <p className="text-sm text-slate-500 leading-relaxed">
              Explore dynamic forms where design acts as silence. Featuring the solid bone-white lines of the <strong className="text-black">Arc Chair</strong> paired with aluminum light accents and modular storage layouts. Made from raw earthen materials processed manually.
            </p>

            <div className="grid grid-cols-3 gap-4 py-4 border-y border-slate-100 text-[#0b1c30]">
              <div>
                <span className="block font-bold text-lg">9</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Unique Categories</span>
              </div>
              <div>
                <span className="block font-bold text-lg">100%</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Sustainable Materials</span>
              </div>
              <div>
                <span className="block font-bold text-lg">Lifetime</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Repair Warranty</span>
              </div>
            </div>

            <Link
              to="/collections?zone=living"
              className="bg-black hover:bg-slate-800 text-white text-xs font-bold tracking-widest uppercase py-3.5 px-8 rounded shadow-sm transition-all cursor-pointer inline-block text-center"
            >
              Browse Living Spaces
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="h-[210px] bg-slate-50 rounded-lg overflow-hidden border border-slate-100">
                <img
                  src={featuredFurniture[0]?.imageUrl}
                  alt="Feature 1"
                  className="w-full h-full object-cover float-none"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="h-[140px] bg-slate-50 rounded-lg overflow-hidden border border-slate-100">
                <img
                  src={featuredFurniture[1]?.imageUrl}
                  alt="Feature 2"
                  className="w-full h-full object-cover float-none"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <div className="pt-8 space-y-4">
              <div className="h-[140px] bg-slate-50 rounded-lg overflow-hidden border border-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=600&auto=format&fit=crop"
                  alt="Curated details"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="h-[210px] bg-slate-50 rounded-lg overflow-hidden border border-slate-100">
                <img
                  src={featuredFurniture[2]?.imageUrl}
                  alt="Feature 3"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. THE LUMINA JOURNAL: EDITORIALS */}
      <section className="max-w-[1280px] mx-auto px-6 border-t border-slate-200/50 pt-16">
        <div className="text-center max-w-lg mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">Lumina Journal</span>
          <h2 className="text-2xl font-extrabold text-[#0b1c30] mt-1">Aesthetic Editorial Stories</h2>
          <p className="text-slate-500 text-xs mt-2 leading-relaxed">
            Delving deeper into manufacturing processes, minimalist interior architecture, and sustainable craftsmanship.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* ARTICLE 1 */}
          <article className="space-y-4 group">
            <div className="aspect-[16/10] bg-slate-200 overflow-hidden rounded-lg cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=600&auto=format&fit=crop"
                alt="Story 1"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <span className="text-[10px] text-slate-450 font-bold uppercase tracking-widest block font-mono">
              JOURNAL • ISSUE 04
            </span>
            <h3 className="font-bold text-base text-slate-800 group-hover:text-black cursor-pointer group-hover:underline decoration-1 underline-offset-4">
              The Art of Hand-Stitched Cashmere and Wool Layers
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
              Inside our Florentine workshop, each double-faced overcoat is stitched manual frame-by-frame, taking up to 18 hours to shape accurately.
            </p>
          </article>

          {/* ARTICLE 2 */}
          <article className="space-y-4 group">
            <div className="aspect-[16/10] bg-slate-200 overflow-hidden rounded-lg cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=600&auto=format&fit=crop"
                alt="Story 2"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <span className="text-[10px] text-slate-450 font-bold uppercase tracking-widest block font-mono">
              ARCHITECTURE • Curated
            </span>
            <h3 className="font-bold text-base text-slate-800 group-hover:text-black cursor-pointer group-hover:underline decoration-1 underline-offset-4">
              Modernism at Home: Balancing Concrete, Glass, and Linens
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
              How Scandinavian architects use raw earth textures and floor-to-ceiling daylight apertures to establish calm interiors.
            </p>
          </article>

          {/* ARTICLE 3 */}
          <article className="space-y-4 group">
            <div className="aspect-[16/10] bg-slate-200 overflow-hidden rounded-lg cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=600&auto=format&fit=crop"
                alt="Story 3"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <span className="text-[10px] text-slate-450 font-bold uppercase tracking-widest block font-mono">
              DESIGNERS • INTERVIEW
            </span>
            <h3 className="font-bold text-base text-slate-800 group-hover:text-black cursor-pointer group-hover:underline decoration-1 underline-offset-4">
              Sustainable Luxury: Handlooms and GOTS Organic Heavyweight Standards
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
              A deep conversation with cotton growers about heavy knit compositions and minimizing clean water consumption footprints.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}
