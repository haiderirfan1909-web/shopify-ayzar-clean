import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ShoppingBag, 
  Plus, 
  Minus, 
  Star, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  Check
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "";
const API = BACKEND_URL ? `${BACKEND_URL}/api` : '/api';

const ProductDetail = () => {
  const { handle } = useParams();
  const { addToCart, openCart, getTotalItems } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API}/shopify/product/${handle}`);
        if (response.data.success) {
          const productData = response.data.product;
          setProduct(productData);
          if (productData.variants && productData.variants.length > 0) {
            setSelectedVariant(productData.variants[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (handle) {
      fetchProduct();
    }
  }, [handle]);

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;
    
    addToCart(product, selectedVariant, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      openCart(); // Open cart sidebar after adding
    }, 1200);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <div className="text-2xl font-serif tracking-[0.6em] text-white animate-pulse">
          AYZAR
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">Product not found</p>
          <Link to="/" className="text-[#c8860a] hover:underline">Return Home</Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price, currency) => {
    if (currency === 'PKR') return `Rs.${parseFloat(price).toFixed(0)}`;
    if (currency === 'USD') return `$${parseFloat(price).toFixed(2)}`;
    return `${currency} ${parseFloat(price).toFixed(2)}`;
  };

  const reviews = [
    {
      name: "ALEXANDER V.",
      rating: 5,
      date: "MARCH 12, 2026",
      text: "The projection is unlike anything I've experienced. It doesn't just fill a room; it defines it. The leather notes are incredibly raw yet refined."
    },
    {
      name: "JULIAN R.",
      rating: 5,
      date: "FEBRUARY 28, 2026",
      text: "Total power. I wore this to a high-stakes meeting and felt untouchable. The longevity is eternal—I could still smell it 14 hours later."
    },
    {
      name: "MARCUS T.",
      rating: 4,
      date: "JANUARY 15, 2026",
      text: "A masterpiece of contrast. The metallic sharpness of the opening is addictive. Only reason for 4 stars is it might be too heavy for smaller offices."
    }
  ];

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
            data-testid="product-page-cart-btn"
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

      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
            
            {/* Gallery Section */}
            <div className="lg:col-span-7 space-y-8">
              <div className="relative aspect-[4/5] bg-[#0a0a0a] rounded-3xl overflow-hidden border border-white/5 flex items-center justify-center p-12 group">
                 <motion.img 
                  key={activeImage}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  src={product.images[activeImage] || product.images[0]} 
                  alt={product.title}
                  className="w-full h-full object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.6)]"
                  referrerPolicy="no-referrer"
                />
                
                {/* Floating Badge */}
                <div className="absolute top-8 left-8 bg-[#c8860a] text-white text-[8px] tracking-[0.3em] font-black px-4 py-2 rounded-full shadow-2xl">
                  SIGNATURE PIECE
                </div>
              </div>

              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.images.slice(0, 4).map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`aspect-square rounded-2xl border transition-all duration-500 overflow-hidden bg-[#0a0a0a] p-2 ${
                        activeImage === idx ? 'border-[#c8860a] bg-[#111]' : 'border-white/5 hover:border-white/20'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-contain opacity-60 group-hover:opacity-100" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="lg:col-span-5 flex flex-col pt-4">
              <div className="mb-12">
                <div className="flex items-center gap-4 mb-6">
                   <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => <Star key={i} size={10} className="fill-[#c8860a] text-[#c8860a]" />)}
                   </div>
                   <span className="text-[10px] tracking-widest text-white/30 uppercase font-bold">Verified Status</span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-serif mb-6 leading-[0.9] tracking-tighter">
                  {product.title.split(' ')[0]}<span className="italic text-[#c8860a]">{product.title.split(' ').slice(1).join(' ')}</span>
                </h1>
                <p className="text-[10px] tracking-[0.5em] text-white/40 mb-10 font-black uppercase">Extrait de Parfum / Masculine</p>
                
                <div className="flex items-baseline gap-6 mb-12">
                  <span className="text-4xl font-serif text-white/90">
                    {formatPrice(selectedVariant?.price || product.price, product.currencyCode)}
                  </span>
                </div>

                <div className="space-y-8 text-sm text-white/50 leading-loose tracking-wide font-light mb-12">
                  <p>{product.description || "A signature fragrance from AYZAR collection."}</p>
                </div>

                {/* Options */}
                <div className="space-y-10 mb-12">
                  {product.variants && product.variants.length > 1 && (
                    <div>
                      <h4 className="text-[9px] tracking-[0.4em] font-black text-white/20 uppercase mb-4">Select Variant</h4>
                      <div className="flex gap-4 flex-wrap">
                        {product.variants.map((variant, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedVariant(variant)}
                            className={`px-8 py-3 rounded-sm text-[9px] tracking-[0.3em] font-bold border transition-all duration-500 ${
                              selectedVariant?.id === variant.id
                                ? 'bg-white text-black border-white' 
                                : 'border-white/10 text-white/40 hover:border-white/30'
                            }`}
                          >
                            {variant.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="text-[9px] tracking-[0.4em] font-black text-white/20 uppercase mb-4">Quantity</h4>
                    <div className="flex items-center gap-6 border border-white/10 w-fit px-4 py-2 rounded-sm">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-white/40 hover:text-white transition-colors">
                        <Minus size={14} />
                      </button>
                      <span className="text-sm font-bold min-w-[20px] text-center">{quantity}</span>
                      <button onClick={() => setQuantity(quantity + 1)} className="text-white/40 hover:text-white transition-colors">
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action */}
                <button
                  onClick={handleAddToCart}
                  disabled={isAdded || !product.availableForSale}
                  className="w-full h-20 bg-[#c8860a] hover:bg-[#a66f08] text-white flex items-center justify-center gap-6 group transition-all duration-500 rounded-sm overflow-hidden relative shadow-[0_20px_50px_rgba(200,134,10,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="product-add-to-cart-btn"
                >
                  <AnimatePresence mode="wait">
                    {isAdded ? (
                      <motion.div 
                        key="added"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        className="flex items-center gap-4"
                      >
                        <Check size={20} />
                        <span className="text-[10px] tracking-[0.4em] font-black uppercase">ADDED TO BAG</span>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="add"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        className="flex items-center gap-6"
                      >
                        <ShoppingBag size={20} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] tracking-[0.4em] font-black uppercase">
                          {product.availableForSale ? 'ADD TO COLLECTION' : 'OUT OF STOCK'}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </div>

              {/* Service Features */}
              <div className="grid grid-cols-3 gap-4 pt-10 border-t border-white/5">
                {[
                  { icon: Truck, text: "Complimentary Express" },
                  { icon: ShieldCheck, text: "Secure Authenticity" },
                  { icon: RotateCcw, text: "Bespoke Returns" }
                ].map((s, i) => (
                  <div key={i} className="flex flex-col items-center text-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                      <s.icon size={16} className="text-[#c8860a]" />
                    </div>
                    <p className="text-[7px] tracking-[0.2em] text-white/30 uppercase font-black">{s.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Product Description HTML */}
          {product.descriptionHtml && (
            <div className="mt-32 border-t border-white/5 pt-24">
              <div className="max-w-4xl">
                <h3 className="text-3xl font-serif mb-12 text-white/90">PRODUCT <span className="italic">DETAILS</span></h3>
                <div 
                  className="text-sm text-white/60 leading-loose tracking-wide prose prose-invert"
                  dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Reviews Section */}
      <section className="py-32 bg-[#050505] border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-6xl font-serif mb-6 tracking-tighter leading-none text-white/90">
                THE <span className="italic text-[#c8860a]">VERDICT</span>
              </h2>
              <div className="flex items-center gap-6">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-[#c8860a] text-[#c8860a]" />
                  ))}
                </div>
                <p className="text-[10px] tracking-[0.5em] text-white/40 uppercase font-black">
                  4.9 AVERAGE RATING / 124 REVIEWS
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsReviewOpen(true)}
              className="px-10 py-5 border border-[#c8860a]/30 rounded-full text-[9px] tracking-[0.4em] font-black text-[#c8860a] hover:bg-[#c8860a] hover:text-white transition-all duration-500 shadow-[0_10px_30px_rgba(200,134,10,0.1)]"
            >
              WRITE A REVIEW
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-10 bg-white/[0.02] border border-white/5 rounded-3xl group hover:border-[#c8860a]/20 transition-all duration-500"
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, starIdx) => (
                    <Star 
                      key={starIdx} 
                      size={10} 
                      className={`${starIdx < review.rating ? 'fill-[#c8860a] text-[#c8860a]' : 'text-white/10'}`} 
                    />
                  ))}
                </div>
                <p className="text-white/80 font-sans text-sm leading-relaxed tracking-wide mb-10 min-h-[80px]">
                  "{review.text}"
                </p>
                <div className="pt-8 border-t border-white/5 flex justify-between items-center">
                   <div>
                     <p className="text-[10px] tracking-[0.3em] font-black text-white/90 mb-1">{review.name}</p>
                     <p className="text-[8px] tracking-[0.2em] text-white/20 font-bold">{review.date}</p>
                   </div>
                   <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center">
                      <Star size={10} className="text-white/20" />
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Write a Review Modal */}
      <AnimatePresence>
        {isReviewOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6"
          >
            <div className="absolute inset-0 bg-[#050505]/95 backdrop-blur-md" onClick={() => setIsReviewOpen(false)}></div>
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative bg-[#0a0a0a] border border-white/10 p-12 rounded-3xl max-w-lg w-full shadow-2xl"
            >
              <h3 className="text-2xl font-serif mb-8 text-white">SUBMIT <span className="italic text-[#c8860a]">REVIEW</span></h3>
              <div className="space-y-6">
                <div className="space-y-2">
                   <p className="text-[9px] tracking-[0.3em] text-white/30 font-bold uppercase">Rating</p>
                   <div className="flex gap-2">
                      {[...Array(5)].map((_, i) => <Star key={i} size={18} className="text-white/10 cursor-pointer hover:text-[#c8860a] transition-colors" />)}
                   </div>
                </div>
                <div className="space-y-4">
                  <input type="text" placeholder="NAME" className="w-full bg-white/5 border border-white/10 p-4 text-[10px] tracking-[0.3em] focus:outline-none focus:border-[#c8860a] transition-colors" />
                  <textarea placeholder="YOUR EXPERIENCE..." rows={4} className="w-full bg-white/5 border border-white/10 p-4 text-[10px] tracking-[0.3em] focus:outline-none focus:border-[#c8860a] transition-colors resize-none"></textarea>
                </div>
                <button 
                  onClick={() => setIsReviewOpen(false)}
                  className="w-full bg-[#c8860a] text-white py-5 text-[10px] tracking-[0.4em] font-black uppercase shadow-xl"
                >
                  PUBLISH VERDICT
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetail;
