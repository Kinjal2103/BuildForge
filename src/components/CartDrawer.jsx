import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { X, ShoppingBag, Trash2, Plus, Minus, Truck, Lock, CheckCircle } from 'lucide-react';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeItem,
    clearCart
  } = useCart();

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  // Financial calculations
  const rawSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = rawSubtotal * (discountPercent / 100);
  const subtotal = rawSubtotal - discountAmount;
  const shippingThreshold = 15000;
  const shippingCost = subtotal >= shippingThreshold || subtotal === 0 ? 0 : 999.00;
  const salesTax = subtotal * 0.18; // 18% GST (Standard on connected interiors in India)
  const total = subtotal + shippingCost + salesTax;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');
    const code = promoCode.trim().toUpperCase();
    if (code === 'LUMINA10') {
      setDiscountPercent(10);
      setPromoSuccess('10% discount applied successfully!');
    } else if (code === 'LUMINA20') {
      setDiscountPercent(20);
      setPromoSuccess('Premium 20% discount applied successfully!');
    } else {
      setPromoError('Invalid coupon code. Try LUMINA10 or LUMINA20');
      setDiscountPercent(0);
    }
  };

  const handleStartCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setCheckoutComplete(true);
      clearCart();
    }, 2200);
  };

  const handleCloseSuccess = () => {
    setCheckoutComplete(false);
    setIsCartOpen(false);
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-50 transition-transform duration-500 ease-out ${
          isCartOpen ? 'translate-x-0' : 'pointer-events-none'
        }`}
      >
        {/* Dark drop background */}
        <div
          onClick={() => setIsCartOpen(false)}
          className={`absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300 ${
            isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        />

        {/* Sliding Panel */}
        <div
          className={`absolute right-0 top-0 w-full max-w-[440px] h-full bg-white flex flex-col shadow-2xl transition-transform duration-500 ease-out ${
            isCartOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#0b1c30]" />
              <h2 className="font-sans font-bold text-lg text-[#0b1c30]">Your Cart</h2>
              <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-bold">
                {cart.length}
              </span>
            </div>
            
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors flex items-center justify-center cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* Delivery threshold signal */}
          {cart.length > 0 && (
            <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 flex items-center gap-2 text-xs">
              {subtotal >= shippingThreshold ? (
                <>
                  <Truck className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="text-slate-600 font-medium">
                    Congratulations! Your order qualifies for <strong className="text-black">Free Standard Delivery</strong>.
                  </span>
                </>
              ) : (
                <>
                  <Truck className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span className="text-slate-500">
                    Add <strong className="text-black">₹{(shippingThreshold - subtotal).toLocaleString('en-IN')}</strong> more for <strong className="text-black">Free Delivery</strong>.
                  </span>
                </>
              )}
            </div>
          )}

          {/* Cart Contents list */}
          <div className="flex-grow overflow-y-auto p-6 space-y-4 no-scrollbar">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[60%] text-center font-sans">
                <ShoppingBag className="w-16 h-16 text-slate-200 mb-4 stroke-[1.2]" />
                <h3 className="text-base font-semibold text-slate-800">Your cart is empty</h3>
                <p className="text-xs text-slate-500 max-w-[220px] mt-2 leading-relaxed">
                  Add some high-quality sculptural architectural items to find luxury.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-6 bg-black text-white text-xs font-bold tracking-widest uppercase py-3.5 px-6 hover:bg-slate-800 transition-colors cursor-pointer rounded"
                >
                  Continue Browsing
                </button>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div
                  key={`${item.product.id}-${idx}`}
                  className="flex gap-4 p-3 border border-slate-100 rounded-lg bg-[#FAF9F5]/40 hover:bg-[#FAF9F5] transition-colors relative group font-sans"
                >
                  {/* Item Image */}
                  <div className="w-16 h-20 bg-slate-105 rounded overflow-hidden flex-shrink-0">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Descriptions */}
                  <div className="flex-grow min-w-0 pr-4">
                    <h4 className="font-semibold text-xs text-slate-900 truncate">
                      {item.product.name}
                    </h4>
                    
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-[11px] text-slate-500">
                      {item.selectedColor && (
                        <span className="flex items-center gap-1">
                          Style: <strong>{item.selectedColor}</strong>
                        </span>
                      )}
                      {item.selectedSize && (
                        <span>| Size: <strong>{item.selectedSize}</strong></span>
                      )}
                    </div>

                    <div className="flex justify-between items-center mt-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-slate-200 rounded-md bg-white">
                        <button
                          onClick={() => updateQuantity(idx, item.quantity - 1)}
                          className="px-2 py-0.5 text-slate-500 hover:text-black font-semibold text-sm cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs text-slate-800 font-bold font-mono">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(idx, item.quantity + 1)}
                          className="px-2 py-0.5 text-slate-500 hover:text-black font-semibold text-sm cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Total Price */}
                      <span className="text-xs font-bold text-slate-900 font-sans">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(idx)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-red-500 opacity-60 hover:opacity-100 transition-all cursor-pointer"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Checkout & Coupons */}
          {cart.length > 0 && (
            <div className="border-t border-slate-200 p-6 space-y-4 bg-slate-50/70">
              {/* Promo code form */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo (LUMINA10 / LUMINA20)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-slate-800 text-xs px-3 py-2 rounded focus:outline-none focus:border-black transition-colors uppercase font-mono"
                />
                <button
                  type="submit"
                  className="bg-[#0b1c30] text-white font-semibold text-xs px-4 py-2 hover:bg-black rounded transition-all cursor-pointer flex-shrink-0"
                >
                  Apply
                </button>
              </form>

              {promoError && <p className="text-[11px] text-red-600 font-semibold">{promoError}</p>}
              {promoSuccess && <p className="text-[11px] text-green-700 font-semibold font-sans">✓ {promoSuccess}</p>}

              {/* pricing table */}
              <div className="space-y-2 text-xs text-slate-600 font-sans">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900 font-sans">₹{rawSubtotal.toLocaleString('en-IN')}</span>
                </div>
                
                {discountPercent > 0 && (
                  <div className="flex justify-between text-green-700">
                    <span>Discount ({discountPercent}%)</span>
                    <span className="font-bold">-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping &amp; Handling</span>
                  {shippingCost === 0 ? (
                    <span className="text-green-700 font-bold uppercase text-[11px]">Free</span>
                  ) : (
                    <span className="font-semibold text-slate-900 font-sans">₹{shippingCost.toLocaleString('en-IN')}</span>
                  )}
                </div>

                <div className="flex justify-between">
                  <span>Est. GST (18%)</span>
                  <span className="font-semibold text-slate-900 font-sans">₹{salesTax.toLocaleString('en-IN')}</span>
                </div>

                <div className="border-t border-slate-200 pt-3 flex justify-between text-sm text-black font-bold">
                  <span>Total Amount</span>
                  <span className="text-base text-slate-900 font-sans">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Action buttons (Dedicated Cart Page + Checkout overlay) */}
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full border border-slate-300 bg-white hover:bg-slate-50 text-black text-center font-bold tracking-wider text-[10px] uppercase py-3.5 rounded transition-all cursor-pointer shadow-xs flex items-center justify-center"
                >
                  View Full Cart
                </Link>
                <button
                  onClick={handleStartCheckout}
                  disabled={isCheckingOut}
                  className="w-full bg-black hover:bg-slate-800 disabled:bg-slate-350 text-white font-bold tracking-wider text-[10px] uppercase py-3.5 rounded transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  {isCheckingOut ? (
                    <>
                      <svg className="animate-spin h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      Checkout
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Success Modal Overlay */}
      {checkoutComplete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={handleCloseSuccess} />
          
          <div className="relative bg-white max-w-md w-full rounded-2xl p-8 text-center shadow-2xl animate-in fade-in zoom-in-95 duration-200 font-sans">
            <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-10 h-10" />
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 mb-2">Order Confirmed!</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              Thank you for shopping with Lumina. We have processed your payment securely. A confirmation receipt and tracking code have been dispatched to your email address.
            </p>

            <div className="bg-slate-50 rounded-lg p-4 mb-6 text-left border border-slate-100 text-[11px] leading-relaxed space-y-1.5 text-slate-600 font-mono">
              <div className="flex justify-between">
                <span>Receipt Ref:</span>
                <span className="font-semibold text-black">#LMN-{(Math.floor(Math.random() * 900000) + 100000)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipment Class:</span>
                <span className="font-semibold text-black">Lumina White-Glove Standard</span>
              </div>
              <div className="flex justify-between">
                <span>Est. Dispatch:</span>
                <span className="font-semibold text-black">Within 24 Hours</span>
              </div>
            </div>

            <button
              onClick={handleCloseSuccess}
              className="w-full bg-black hover:bg-slate-800 text-white font-bold tracking-widest text-[#f8f9ff] text-xs uppercase py-3 rounded transition-colors cursor-pointer"
            >
              Continue Exploring
            </button>
          </div>
        </div>
      )}
    </>
  );
}
