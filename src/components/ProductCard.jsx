import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Star, ShoppingBag } from 'lucide-react';

export default function ProductCard({ product }) {
  const { quickAdd } = useCart();
  
  return (
    <div className="group flex flex-col h-full bg-white rounded-lg overflow-hidden border border-slate-200/40 shadow-sm hover:shadow-md transition-all duration-300">
      {/* Product Image Holder */}
      <div className="relative aspect-[3/4] bg-slate-50 overflow-hidden">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
        </Link>

        {product.badge && (
          <span className="absolute top-3 left-3 bg-black text-white text-[10px] tracking-widest font-bold uppercase px-2.5 py-1 rounded">
            {product.badge}
          </span>
        )}

        {/* Floating actions */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 px-4 gap-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              quickAdd(product);
            }}
            className="w-full bg-white/95 hover:bg-black hover:text-white text-[#0b1c30] text-xs font-bold tracking-wider uppercase py-2.5 rounded shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            Quick Add
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start gap-2 mb-1">
          <span className="text-xs uppercase tracking-widest text-slate-400 font-medium">
            {product.category}
          </span>
          <div className="flex items-center gap-0.5 text-amber-500">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="text-xs font-bold text-slate-600 font-sans">{product.rating}</span>
          </div>
        </div>

        <Link
          to={`/product/${product.id}`}
          className="font-sans font-semibold text-sm text-slate-800 hover:text-black hover:underline underline-offset-4 cursor-pointer line-clamp-2 transition-all"
        >
          {product.name}
        </Link>

        {/* Pricing & swatches */}
        <div className="mt-auto pt-3 flex items-center justify-between border-t border-slate-100/50">
          <span className="text-sm font-semibold text-slate-900 font-sans">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          
          {product.colors && product.colors.length > 0 && (
            <div className="flex gap-1.5">
              {product.colors.map((color) => (
                <span
                  key={color.name}
                  title={color.name}
                  className="w-3 h-3 rounded-full border border-slate-350 pointer-events-none"
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
