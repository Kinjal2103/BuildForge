import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';

export default function SearchBar({
  value,
  onChange,
  onClear,
  placeholder = 'Search items, categories, collections...',
  className = '',
  isGlobal = false,
  onSearchComplete
}) {
  const [localQuery, setLocalQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = isGlobal ? localQuery : value;
    if (!query) return;

    if (isGlobal) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
      if (onSearchComplete) onSearchComplete();
    }
  };

  const handleClear = () => {
    if (isGlobal) {
      setLocalQuery('');
    } else if (onClear) {
      onClear();
    }
  };

  return (
    <form
      onSubmit={handleSearchSubmit}
      className={`relative flex items-center w-full ${className}`}
    >
      <input
        type="text"
        placeholder={placeholder}
        value={isGlobal ? localQuery : value}
        onChange={(e) => {
          if (isGlobal) {
            setLocalQuery(e.target.value);
          } else if (onChange) {
            onChange(e.target.value);
          }
        }}
        className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs pl-9 pr-8 py-2.5 rounded focus:outline-none focus:border-black focus:bg-white transition-all shadow-inner"
      />
      
      <Search className="text-slate-400 w-4 h-4 absolute left-3 pointer-events-none" />

      {((isGlobal && localQuery) || (!isGlobal && value)) && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 text-slate-400 hover:text-black transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </form>
  );
}
