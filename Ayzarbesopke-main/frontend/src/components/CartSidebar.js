import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "";
const API = BACKEND_URL ? `${BACKEND_URL}/api` : '/api';

const formatPrice = (price, currency) => {
  if (currency === 'PKR') return `Rs.${parseFloat(price).toFixed(0)}`;
  if (currency === 'USD') return `$${parseFloat(price).toFixed(2)}`;
  return `${currency} ${parseFloat(price).toFixed(2)}`;
};

const CartSidebar = () => {
  const {
    cartItems,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    getSubtotal,
    getCurrencyCode,
    getTotalItems,
    isCheckingOut,
    setIsCheckingOut,
  } = useCart();

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    setIsCheckingOut(true);
    try {
      const lineItems = cartItems.map((item) => ({
        variantId: item.variantId,
        quantity: item.quantity,
      }));

      const response = await axios.post(`${API}/shopify/checkout`, {
        lineItems,
      });

      if (response.data.success && response.data.checkout.webUrl) {
        // Redirect to Shopify hosted checkout
        window.location.href = response.data.checkout.webUrl;
      } else {
        alert('Failed to create checkout. Please try again.');
        setIsCheckingOut(false);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to proceed to checkout. Please try again.');
      setIsCheckingOut(false);
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCart}
            className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md"
            data-testid="cart-backdrop"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 right-0 bottom-0 z-[201] w-full sm:w-[480px] bg-[#050505] border-l border-white/10 flex flex-col"
            data-testid="cart-sidebar"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-8 border-b border-white/5">
              <div>
                <p className="text-[9px] tracking-[0.5em] text-[#c8860a] font-black mb-1 uppercase">
                  Your Atelier
                </p>
                <h2 className="text-2xl font-serif text-white tracking-tight">
                  THE <span className="italic text-[#c8860a]">BAG</span>
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-[#c8860a]/50 hover:bg-white/5 transition-all"
                data-testid="cart-close-btn"
              >
                <X size={16} className="text-white/60" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-8">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16">
                  <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center mb-8">
                    <ShoppingBag size={28} className="text-white/30" strokeWidth={1} />
                  </div>
                  <p className="text-white/60 text-sm mb-3 font-serif italic">Your bag is empty</p>
                  <p className="text-[9px] tracking-[0.4em] text-white/30 font-bold uppercase mb-10">
                    Discover Our Atelier
                  </p>
                  <Link to="/collections" onClick={closeCart}>
                    <button
                      className="px-10 py-4 bg-[#c8860a] hover:bg-[#a66f08] text-white text-[10px] tracking-[0.4em] font-black uppercase transition-colors rounded-sm shadow-[0_15px_40px_rgba(200,134,10,0.25)]"
                      data-testid="cart-explore-btn"
                    >
                      EXPLORE COLLECTION
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-8">
                  {cartItems.map((item, idx) => (
                    <motion.div
                      key={item.variantId}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex gap-5 pb-8 border-b border-white/5 last:border-b-0"
                      data-testid={`cart-item-${item.handle}`}
                    >
                      {/* Image */}
                      <div className="w-24 h-32 bg-[#0a0a0a] rounded-xl overflow-hidden border border-white/5 flex-shrink-0 p-3">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-contain"
                            referrerPolicy="no-referrer"
                          />
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <h3 className="text-lg font-serif text-white/90 mb-1 truncate">
                            {item.title}
                          </h3>
                          {item.variantTitle && item.variantTitle !== 'Default Title' && (
                            <p className="text-[9px] tracking-[0.3em] text-white/40 uppercase font-bold mb-2">
                              {item.variantTitle}
                            </p>
                          )}
                          <p className="text-sm font-serif text-[#c8860a] tracking-wide">
                            {formatPrice(item.price, item.currencyCode)}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          {/* Quantity Selector */}
                          <div className="flex items-center gap-3 border border-white/10 px-3 py-1.5 rounded-sm">
                            <button
                              onClick={() =>
                                updateQuantity(item.variantId, item.quantity - 1)
                              }
                              className="text-white/40 hover:text-white transition-colors"
                              data-testid={`cart-qty-decrease-${item.handle}`}
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-xs font-bold min-w-[16px] text-center text-white/80">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.variantId, item.quantity + 1)
                              }
                              className="text-white/40 hover:text-white transition-colors"
                              data-testid={`cart-qty-increase-${item.handle}`}
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          {/* Remove */}
                          <button
                            onClick={() => removeFromCart(item.variantId)}
                            className="text-white/30 hover:text-[#c8860a] transition-colors"
                            data-testid={`cart-remove-${item.handle}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer / Checkout */}
            {cartItems.length > 0 && (
              <div className="p-8 border-t border-white/5 bg-[#050505] space-y-6">
                {/* Subtotal */}
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] tracking-[0.4em] text-white/40 font-black uppercase">
                      Subtotal ({getTotalItems()} items)
                    </span>
                    <span className="text-2xl font-serif text-white/90">
                      {formatPrice(getSubtotal(), getCurrencyCode())}
                    </span>
                  </div>
                  <p className="text-[9px] tracking-[0.3em] text-white/30 uppercase font-bold">
                    Taxes & shipping calculated at checkout
                  </p>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full h-16 bg-[#c8860a] hover:bg-[#a66f08] text-white flex items-center justify-center gap-4 group transition-all duration-500 rounded-sm shadow-[0_20px_50px_rgba(200,134,10,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="cart-checkout-btn"
                >
                  {isCheckingOut ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span className="text-[10px] tracking-[0.4em] font-black uppercase">
                        REDIRECTING...
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-[10px] tracking-[0.4em] font-black uppercase">
                        PROCEED TO CHECKOUT
                      </span>
                      <ArrowRight
                        size={16}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </>
                  )}
                </button>

                <p className="text-center text-[8px] tracking-[0.3em] text-white/30 uppercase font-bold">
                  Secure Checkout · Powered by Shopify
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
