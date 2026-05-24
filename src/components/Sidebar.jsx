import { SlidersHorizontal, RotateCcw, Home, Sparkles, Folder, DollarSign } from 'lucide-react';
import SearchBar from './SearchBar';

export default function Sidebar({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedColor,
  setSelectedColor,
  selectedSize,
  setSelectedSize,
  maxPrice,
  setMaxPrice,
  onClear,
  activeFiltersCount,
  CATEGORIES,
  AVAILABLE_COLORS,
  AVAILABLE_SIZES,
  selectedRoom,
  setSelectedRoom,
  ROOMS,
  selectedAesthetic,
  setSelectedAesthetic,
  AESTHETICS
}) {
  return (
    <div className="space-y-6 lg:border-r lg:border-slate-100 lg:pr-6 font-sans">
      {/* Title block */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-slate-700" />
          <h2 className="text-xs uppercase tracking-widest font-extrabold text-[#0b1c30]">
            Refine Selection
          </h2>
        </div>
        {activeFiltersCount > 0 && (
          <button
            onClick={onClear}
            className="text-[10px] uppercase tracking-wider font-extrabold text-red-500 hover:text-red-700 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Quick Search Block */}
      <div className="space-y-2">
        <h3 className="text-[10px] uppercase tracking-widest font-extrabold text-slate-400">Search Items</h3>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={() => setSearchTerm('')}
          placeholder="e.g. aroma, chair, mirror..."
        />
      </div>

      {/* Categories Selector */}
      <div className="space-y-2 pt-2">
        <h3 className="text-[10px] uppercase tracking-widest font-extrabold text-slate-400 flex items-center gap-1">
          <Folder className="w-3.5 h-3.5 text-slate-400" />
          <span>Category Type</span>
        </h3>
        <div className="flex flex-wrap lg:flex-col gap-1.5 max-h-48 overflow-y-auto pr-1 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-left text-xs uppercase tracking-wider px-3 py-2 rounded transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-black text-white font-bold'
                  : 'bg-white hover:bg-slate-100/60 border border-slate-200/40 text-slate-500 hover:text-black'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Shop By Room */}
      <div className="space-y-2 pt-2">
        <h3 className="text-[10px] uppercase tracking-widest font-extrabold text-slate-400 flex items-center gap-1">
          <Home className="w-3.5 h-3.5 text-slate-400" />
          <span>Shop By Room</span>
        </h3>
        <div className="flex flex-wrap lg:flex-col gap-1.5 max-h-48 overflow-y-auto pr-1 no-scrollbar">
          {ROOMS.map((room) => (
            <button
              key={room}
              onClick={() => setSelectedRoom(room)}
              className={`text-left text-xs uppercase tracking-wider px-3 py-2 rounded transition-all cursor-pointer ${
                selectedRoom === room
                  ? 'bg-black text-white font-bold'
                  : 'bg-white hover:bg-slate-100/60 border border-slate-200/40 text-slate-500 hover:text-black'
              }`}
            >
              {room === 'All' ? 'All Rooms' : room}
            </button>
          ))}
        </div>
      </div>

      {/* Shop By Aesthetic */}
      <div className="space-y-2 pt-2">
        <h3 className="text-[10px] uppercase tracking-widest font-extrabold text-slate-400 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-slate-400" />
          <span>Shop By Aesthetic</span>
        </h3>
        <div className="flex flex-wrap lg:flex-col gap-1.5 max-h-48 overflow-y-auto pr-1 no-scrollbar">
          {AESTHETICS.map((aes) => (
            <button
              key={aes}
              onClick={() => setSelectedAesthetic(aes)}
              className={`text-left text-xs uppercase tracking-wider px-3 py-2 rounded transition-all cursor-pointer ${
                selectedAesthetic === aes
                  ? 'bg-black text-white font-bold'
                  : 'bg-white hover:bg-slate-100/60 border border-slate-200/40 text-slate-500 hover:text-black'
              }`}
            >
              {aes === 'All' ? 'All Aesthetics' : aes}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Price Range */}
      <div className="space-y-3 pt-2">
        <div className="flex justify-between items-center">
          <h3 className="text-[10px] uppercase tracking-widest font-extrabold text-slate-400 flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-slate-400" />
            <span>Max Budget</span>
          </h3>
          <span className="text-xs font-bold font-mono text-slate-800">${maxPrice}</span>
        </div>
        <input
          type="range"
          min="30"
          max="1000"
          step="10"
          value={maxPrice}
          onChange={(e) => setMaxPrice(parseInt(e.target.value))}
          className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-black focus:outline-none"
          id="price-range-slider"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
          <span>$30</span>
          <span>$1,000</span>
        </div>
      </div>

      {/* Colors swatches filter */}
      <div className="space-y-2 pt-2">
        <h3 className="text-[10px] uppercase tracking-widest font-extrabold text-slate-400">Refine Color</h3>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => setSelectedColor('All')}
            className={`text-left text-xs px-2 py-1.5 rounded transition-colors flex items-center gap-2 cursor-pointer ${
              selectedColor === 'All' ? 'bg-black/5 font-bold text-black' : 'text-slate-500 hover:text-black'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full border border-slate-350 bg-gradient-to-r from-red-400 via-green-500 to-blue-500" />
            All Colors
          </button>
          
          {AVAILABLE_COLORS.map((color) => (
            <button
              key={color.name}
              onClick={() => setSelectedColor(color.name)}
              className={`text-left text-xs px-2 py-1.5 rounded transition-colors flex items-center gap-2 cursor-pointer ${
                selectedColor === color.name ? 'bg-black/5 font-bold text-black' : 'text-slate-500 hover:text-black'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full border border-slate-400"
                style={{
                  backgroundColor:
                    color.matches[0] === 'white'
                      ? '#ffffff'
                      : color.matches[0] === 'black'
                      ? '#111827'
                      : color.matches[0] === 'gray'
                      ? '#94A3B8'
                      : color.matches[0] === 'blue'
                      ? '#1E3A8A'
                      : color.matches[0] === 'tan'
                      ? '#B45309'
                      : '#000000'
                }}
              />
              {color.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sizes badges filter */}
      <div className="space-y-2 pt-2">
        <h3 className="text-[10px] uppercase tracking-widest font-extrabold text-slate-400">Refine Spec</h3>
        <div className="flex flex-wrap gap-1 max-h-40 overflow-y-auto pr-1 no-scrollbar">
          <button
            onClick={() => setSelectedSize('All')}
            className={`text-[9px] uppercase font-bold tracking-wider px-2 py-1 rounded border transition-all cursor-pointer ${
              selectedSize === 'All'
                ? 'border-black bg-black text-white'
                : 'border-slate-200 text-slate-500 hover:border-slate-400 hover:text-black'
            }`}
          >
            All Specs
          </button>
          {AVAILABLE_SIZES.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`text-[9px] uppercase font-bold tracking-wider px-2 py-1 rounded border transition-all cursor-pointer ${
                selectedSize === size
                  ? 'border-black bg-black text-white'
                  : 'border-slate-200 text-slate-500 hover:border-slate-400 hover:text-black'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
