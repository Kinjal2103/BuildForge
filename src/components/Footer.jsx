import { useState } from 'react';
import { Globe } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000); // clear after 5s
    }
  };

  return (
    <footer className="bg-white border-t border-slate-200 mt-20">
      <div className="max-w-[1280px] mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-10">
          {/* Logo & About */}
          <div className="md:col-span-1 lg:col-span-2">
            <span className="font-extrabold text-2xl tracking-widest text-[#0b1c30] select-none">LUMINA</span>
            <p className="mt-4 text-slate-500 text-sm max-w-xs leading-relaxed">
              Quiet elegance, architectural forms, and sustainable design. Curating curated luxury for modern living.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-[#0b1c30] font-bold mb-4">Shop</h3>
            <ul className="space-y-3 font-sans">
              <li><a href="#" className="text-slate-500 hover:text-[#0b1c30] text-sm transition-colors">Apparel</a></li>
              <li><a href="#" className="text-slate-500 hover:text-[#0b1c30] text-sm transition-colors">Accessories</a></li>
              <li><a href="#" className="text-slate-500 hover:text-[#0b1c30] text-sm transition-colors">Home &amp; Design</a></li>
              <li><a href="#" className="text-slate-500 hover:text-[#0b1c30] text-sm transition-colors">New Arrivals</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-[#0b1c30] font-bold mb-4">Services</h3>
            <ul className="space-y-3 font-sans">
              <li><a href="#" className="text-slate-500 hover:text-[#0b1c30] text-sm transition-colors">Help &amp; FAQs</a></li>
              <li><a href="#" className="text-slate-500 hover:text-[#0b1c30] text-sm transition-colors">Returns &amp; Exchanges</a></li>
              <li><a href="#" className="text-slate-500 hover:text-[#0b1c30] text-sm transition-colors">Shipping Information</a></li>
              <li><a href="#" className="text-slate-500 hover:text-[#0b1c30] text-sm transition-colors">Care Instructions</a></li>
            </ul>
          </div>

          {/* Subscribe */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-[#0b1c30] font-bold mb-4">Newsletter</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-4">
              Sign up for early preview releases and dynamic editorial contents.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3 font-sans">
              <div className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  required
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm px-4 py-2 focus:outline-none focus:border-black transition-colors"
                />
                <button
                  type="submit"
                  className="bg-black hover:bg-slate-800 text-white font-semibold text-sm px-4 py-2 transition-all flex items-center justify-center cursor-pointer"
                >
                  Join
                </button>
              </div>
              {subscribed && (
                <p className="text-xs text-green-600 font-medium">
                  ✓ Welcome to the Lumina editorial. Check your inbox soon!
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Horizontal separator */}
        <div className="border-t border-slate-100 my-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Lumina Studio Inc. All rights reserved.</p>
          <div className="flex gap-6 items-center">
            <a href="#" className="hover:text-slate-600">Privacy Policy</a>
            <a href="#" className="hover:text-slate-600">Terms of Service</a>
            <a href="#" className="hover:text-slate-600 font-semibold text-slate-550 flex items-center gap-1 cursor-pointer">
              <Globe className="w-3.5 h-3.5 text-slate-400" /> USD ($, United States)
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
