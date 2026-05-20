import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import { Star, ChevronUp, ChevronDown, Sparkles } from 'lucide-react';

export default function Collections() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeZone, setActiveZone] = useState('living');
  const [expandedSpec, setExpandedSpec] = useState('materials');

  // Sync activeZone with URL params (e.g. /collections?zone=workspace)
  useEffect(() => {
    const zoneParam = searchParams.get('zone');
    if (zoneParam && ['living', 'workspace', 'bedroom'].includes(zoneParam)) {
      setActiveZone(zoneParam);
    }
  }, [searchParams]);

  const handleZoneSwitch = (zone) => {
    setActiveZone(zone);
    setSearchParams({ zone });
    setExpandedSpec('materials'); // reset spec accordion
  };

  const collections = {
    living: {
      title: 'Living Room Architecture',
      subtitle: 'Sculptural forms serving everyday conversation comfort.',
      story: 'Balanced around organic silhouettes, concrete, and woven fibers. Designed to celebrate light shadows and quiet, open spacing.',
      products: PRODUCTS.filter(p => p.category === 'Home' && p.id !== 'axis-desk-lamp'),
      specs: [
        { id: 'materials', title: 'Solid-Core Clay & Fibers', text: 'Earthen materials are molded in manual workshops before being fired in kiln modules. Cushions utilize organic duck feathers.' },
        { id: 'dimensions', title: 'Proportions & Scale', text: 'Arc Chair represents structural 84cm width with soft 44cm seat heights. Perfect match for low-key coffee layouts.' },
        { id: 'designers', title: 'Studio Lumina Florentine', text: 'Curated by design architect Beatrice Rossi in collaboration with sustainable workshops in Tuscany, Italy.' }
      ]
    },
    workspace: {
      title: 'Monolithic Workspace',
      subtitle: 'Quiet concentration driven by brushed metallurgy and fine optics.',
      story: 'Crafted for focused clarity. Utilizing anodized aluminum, linear pen decks, and crisp warm lighting angles.',
      products: PRODUCTS.filter(p => p.id === 'axis-desk-lamp' || p.id === 'architect-series-pen' || p.id === 'modular-key-deck' || p.id === 'linear-titanium-frames'),
      specs: [
        { id: 'materials', title: 'Anodized 6061 Aluminum', text: 'Stiff, lightweight materials manufactured through high-precision water jet mills and finished in clean bead blasts.' },
        { id: 'dimensions', title: 'Productive Workspace Proportions', text: 'All task assets are designed with zero-noise physical footprints to minimize active table clutter.' },
        { id: 'designers', title: 'Aalto-Müller Team', text: 'Drawn in Copenhagen following German functionalist guidelines for micro ergonomics.' }
      ]
    },
    bedroom: {
      title: 'The Sanctuary Retreat',
      subtitle: 'Quiet layers and dim ambient temperatures.',
      story: 'A space of soft, high-yarn count linens, quiet warm grays, and comfortable apparel layers designed for relaxation.',
      products: PRODUCTS.filter(p => p.id === 'ultrafine-cashmere-crew' || p.id === 'lumina-journal-vol4' || p.id === 'heavyweight-organic-tee'),
      specs: [
        { id: 'materials', title: 'Long-staple Organic Flax & Cashmere', text: 'Yarns are picked ethically from premium partners in Inner Mongolia and spun loosely for cloud-soft breathability.' },
        { id: 'dimensions', title: 'Bedding Spec Matrix', text: 'Sheets available in full California King and standard Queen outlines with 400 thread counts.' },
        { id: 'designers', title: 'Lumina Design Lab', text: 'Conceived in-house to bridge the gap between architectural structures and bedtime textile ease.' }
      ]
    }
  };

  const activeCollection = collections[activeZone];

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-6 space-y-12 font-sans">
      {/* 1. SECTOR CHOSEN BANNER */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">CURATED HOUSES</span>
        <h1 className="text-3xl font-extrabold text-[#0b1c30]">Curated Collections Showcase</h1>
        <p className="text-xs text-slate-500 leading-relaxed">
          Switch between spatial zones to explore custom bento grids, tactile material specs, and spatial design stories.
        </p>

        {/* Triple switches tabs */}
        <div className="flex justify-center gap-2 pt-4">
          {['living', 'workspace', 'bedroom'].map((zone) => (
            <button
              key={zone}
              onClick={() => handleZoneSwitch(zone)}
              className={`px-5 py-2 rounded text-xs uppercase tracking-wider font-bold transition-all cursor-pointer ${
                activeZone === zone
                  ? 'bg-black text-white shadow-sm'
                  : 'bg-white text-slate-500 hover:text-black border border-slate-200'
              }`}
            >
              {zone === 'living' ? 'Living Room' : zone === 'workspace' ? 'Workspace' : 'Bedroom'}
            </button>
          ))}
        </div>
      </div>

      {/* 2. SPLIT STORY AND PHOTO PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Side: Editorial breakdown (Lg: col-span-5) */}
        <div className="lg:col-span-5 space-y-6 bg-white p-6 md:p-8 rounded-xl border border-slate-200/50 shadow-xs">
          <div>
            <span className="text-[10px] text-black font-extrabold uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              AESTHETIC PORTFOLIO
            </span>
            <h2 className="text-2xl font-extrabold text-[#0b1c30] mt-1">
              {activeCollection.title}
            </h2>
            <p className="text-xs text-slate-450 font-medium italic mt-1 leading-relaxed">
              "{activeCollection.subtitle}"
            </p>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            {activeCollection.story}
          </p>

          {/* Interactive Specifications Accordion */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h3 className="text-xs uppercase tracking-wider text-black font-bold mb-1">
              Design Specifications:
            </h3>

            {activeCollection.specs.map((spec) => {
              const isOpen = expandedSpec === spec.id;
              return (
                <div
                  key={spec.id}
                  className="border border-slate-100/80 rounded bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  <button
                    onClick={() => setExpandedSpec(isOpen ? null : spec.id)}
                    className="w-full text-left px-4 py-3 text-xs font-bold text-slate-800 flex justify-between items-center cursor-pointer"
                  >
                    <span>{spec.title}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-3 text-xs text-slate-500 leading-relaxed font-sans border-t border-slate-100/50 pt-2 animate-in fade-in duration-200">
                      {spec.text}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Matching Product list bento-grid (Lg: col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-xs uppercase tracking-widest text-[#0b1c30] font-bold">
              Matching Design Artifacts
            </h3>
            <span className="text-xs font-mono text-slate-400">
              {activeCollection.products.length} Items Listed
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {activeCollection.products.map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                className="group cursor-pointer bg-white rounded-lg border border-slate-200/50 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 block"
              >
                {/* Images */}
                <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3">
                    <span className="bg-white/90 text-black text-[10px] font-bold tracking-wider uppercase px-4 py-2 rounded shadow-md">
                      Interactive Overview
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-1 bg-white">
                  <div className="flex justify-between text-[11px] text-slate-450 font-bold uppercase tracking-wider">
                    <span>{p.category}</span>
                    <span className="flex items-center text-amber-500 gap-0.5"><Star className="w-3 h-3 fill-current" /> {p.rating}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-805 group-hover:underline">
                    {p.name}
                  </h4>
                  <p className="text-xs font-extrabold text-[#0b1c30] pt-1">
                    ${p.price.toFixed(2)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
