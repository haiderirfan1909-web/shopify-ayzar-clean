import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ShoppingBag } from 'lucide-react';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "";
const API = BACKEND_URL ? `${BACKEND_URL}/api` : '/api';

const formatPrice = (price, currency) => {
  if (currency === 'PKR') return `Rs.${parseFloat(price).toFixed(0)}`;
  if (currency === 'USD') return `$${parseFloat(price).toFixed(2)}`;
  return `${currency} ${parseFloat(price).toFixed(2)}`;
};

const Collections = () => {
  const { openCart, getTotalItems } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API}/shopify/products?limit=50`);
        if (response.data.success) {
          setProducts(response.data.products);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl md:text-6xl font-serif tracking-[0.6em] text-white"
        >
          AYZAR
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#c8860a]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[60] h-20 flex items-center justify-between px-6 md:px-16 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
        <Link to="/" className="group flex items-center gap-3 text-[10px] tracking-[0.4em] font-black text-white/40 hover:text-white transition-colors">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          BACK TO ATELIER
        </Link>
        <Link to="/" className="text-xl font-serif font-black tracking-[0.3em]">AYZAR</Link>
        <div className="flex items-center gap-8">
          <button 
            onClick={openCart}
            className="relative hover:text-[#c8860a] transition-colors"
            data-testid="collections-cart-btn"
          >
            <ShoppingBag size={18} strokeWidth={1} className="text-white/60" />
            {getTotalItems() > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#c8860a] text-white text-[7px] min-w-[16px] h-4 rounded-full flex items-center justify-center font-bold px-1">
                {getTotalItems()}
              </span>
            )}
          </button>
        </div>
      </nav>

      <main className="pt-40 pb-32">
        <div className="container mx-auto px-6 md:px-16">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-24"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-[10px] tracking-[0.8em] text-[#c8860a] mb-6 uppercase font-black"
            >
              THE ATELIER
            </motion.p>
            <h1 className="text-6xl md:text-9xl font-serif leading-none text-white/90 tracking-tighter mb-8">
              COLLEC<span className="italic text-[#c8860a]">TIONS</span>
            </h1>
            <p className="text-sm md:text-base text-white/40 max-w-xl mx-auto font-sans leading-loose tracking-wide">
              Discover the full Ayzar Bespoke collection. Each fragrance, a masterpiece crafted for those who command presence.
            </p>
          </motion.div>

          {/* Products Grid */}
          {products.length === 0 ? (
            <div className="text-center py-32 text-white/40">No products available at the moment.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
              {products.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  data-testid={`product-card-${product.handle}`}
                >
                  <Link to={`/product/${product.handle}`} className="group block">
                    {/* Image Container */}
                    <div className="relative aspect-[3/4] bg-gradient-to-br from-[#0a0a0a] to-[#0f0f0f] rounded-3xl overflow-hidden border border-white/5 p-8 mb-8 group-hover:border-[#c8860a]/30 transition-all duration-700">
                      {/* Background glow */}
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(200,134,10,0.05),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                      
                      {/* Product Image */}
                      <div className="relative h-full w-full flex items-center justify-center">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            className="max-h-full max-w-full object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.7)] group-hover:scale-105 transition-transform duration-700"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="text-white/20 text-xs tracking-widest">NO IMAGE</div>
                        )}
                      </div>

                      {/* Hover Reveal Button */}
                      <div className="absolute inset-x-8 bottom-8 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                        <div className="bg-white text-black py-4 text-center text-[9px] tracking-[0.4em] font-black rounded-sm">
                          DISCOVER
                        </div>
                      </div>

                      {/* Stock Badge */}
                      {!product.availableForSale && (
                        <div className="absolute top-6 right-6 bg-black/80 backdrop-blur-md text-white/60 text-[8px] tracking-[0.3em] font-black px-3 py-1.5 rounded-full">
                          SOLD OUT
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="px-2">
                      <p className="text-[9px] tracking-[0.5em] text-[#c8860a] uppercase font-black mb-3">
                        EAU DE PARFUM
                      </p>
                      <h3 className="text-2xl md:text-3xl font-serif text-white/90 mb-3 group-hover:text-[#c8860a] transition-colors duration-500">
                        {product.title}
                      </h3>
                      <div className="flex items-center justify-between pt-3 border-t border-white/5">
                        <span className="text-lg font-serif text-white/70 tracking-wide">
                          {formatPrice(product.price, product.currencyCode)}
                        </span>
                        <div className="flex items-center gap-2 text-[9px] tracking-[0.4em] font-black text-white/30 group-hover:text-[#c8860a] transition-colors">
                          VIEW <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Collections;
