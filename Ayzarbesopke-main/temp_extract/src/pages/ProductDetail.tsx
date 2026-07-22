import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
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
import { Link } from 'react-router-dom';

const ProductDetail = () => {
  const [selectedSize, setSelectedSize] = useState('100ML');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

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

  const images = [
    "https://res.cloudinary.com/dysmvpq03/image/upload/v1775386200/97d141d1-5fcf-469f-9ce8-36efb21a02c0_czrzdl.png",
    "https://images.unsplash.com/photo-1594125350389-3b9319b4c1ca?q=80&w=1000&auto=format&fit=crop", // detail/liquid
    "https://images.unsplash.com/photo-1583445013765-d3c21d720219?q=80&w=1000&auto=format&fit=crop", // wood/luxury vibe
    "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000&auto=format&fit=crop" // product vibe
  ];

  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 200], [1, 0]);

  const handleAddToCart = () => {
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#c8860a]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[60] h-20 flex items-center justify-between px-6 md:px-16 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
        <Link to="/" className="group flex items-center gap-3 text-[10px] tracking-[0.4em] font-black text-white/40 hover:text-white transition-colors">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          BACK TO ATELIER
        </Link>
        <div className="text-xl font-serif font-black tracking-[0.3em]">AYZAR</div>
        <div className="flex items-center gap-8">
           <ShoppingBag size={18} strokeWidth={1} className="text-white/40" />
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
                  src={images[activeImage]} 
                  alt="MANKIND Details" 
                  className="w-full h-full object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.6)]"
                  referrerPolicy="no-referrer"
                />
                
                {/* Floating Badge */}
                <div className="absolute top-8 left-8 bg-[#c8860a] text-white text-[8px] tracking-[0.3em] font-black px-4 py-2 rounded-full shadow-2xl">
                  SIGNATURE PIECE
                </div>
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-4 gap-4">
                {images.map((img, idx) => (
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
                  MAN<span className="italic text-[#c8860a]">KIND</span>
                </h1>
                <p className="text-[10px] tracking-[0.5em] text-white/40 mb-10 font-black uppercase">Extrait de Parfum / Masculine</p>
                
                <div className="flex items-baseline gap-6 mb-12">
                  <span className="text-4xl font-serif text-white/90">$240.00</span>
                  <span className="text-xs text-white/20 line-through tracking-widest">$320.00</span>
                </div>

                <div className="space-y-8 text-sm text-white/50 leading-loose tracking-wide font-light mb-12">
                  <p>
                    MANKIND is the ultimate olfactory statement of the Ayzar legacy. A fragrance that doesn't ask for permission, but commands the entire room with a whisper of shadow and a glow of gold.
                  </p>
                  <p>
                   Crafted for the visionary who has built their own world. It opens with the brutal clarity of Sicilian Bergamot and Cardamom, before descending into a heart of raw leather and nocturnal iris. The dry-down is an eternal embrace of Sandalwood and Haitian Vetiver.
                  </p>
                </div>

                {/* Options */}
                <div className="space-y-10 mb-12">
                  <div>
                    <h4 className="text-[9px] tracking-[0.4em] font-black text-white/20 uppercase mb-4">Select Volume</h4>
                    <div className="flex gap-4">
                      {['50ML', '100ML', '200ML'].map(size => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-8 py-3 rounded-sm text-[9px] tracking-[0.3em] font-bold border transition-all duration-500 ${
                            selectedSize === size 
                              ? 'bg-white text-black border-white' 
                              : 'border-white/10 text-white/40 hover:border-white/30'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

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
                  disabled={isAdded}
                  className="w-full h-20 bg-[#c8860a] hover:bg-[#a66f08] text-white flex items-center justify-center gap-6 group transition-all duration-500 rounded-sm overflow-hidden relative shadow-[0_20px_50px_rgba(200,134,10,0.3)]"
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
                        <span className="text-[10px] tracking-[0.4em] font-black uppercase">ADD TO COLLECTION</span>
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
                    <p className="text-[7px] tracking-[0.2em] text-white/30 uppercase font-black uppercase">{s.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Detailed Tabs / Bottom Sections */}
          <div className="mt-32 border-t border-white/5 pt-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
              <div>
                <h3 className="text-3xl font-serif mb-12 text-white/90">IN THE <span className="italic">FORMULATION</span></h3>
                <div className="space-y-6">
                   <div className="space-y-4">
                      <h4 className="text-[9px] tracking-[0.4em] font-black text-[#c8860a] uppercase">Ingredients List</h4>
                      <p className="text-[10px] text-white/30 leading-loose tracking-[0.1em] font-sans">
                        ALCOHOL DENAT. • PARFUM (FRAGRANCE) • AQUA (WATER) • LIMONENE • LINALOOL • CITRONELLOL • COUMARIN • CITRAL • GERANIOL • ISOEUGENOL • BENZYL BENZOATE • FARNESOL.
                      </p>
                   </div>
                   <p className="text-xs text-white/40 italic leading-relaxed">
                     *Ingredients may change over time. Please refer to the packaging of the product you receive for the most up-to-date list of ingredients.
                   </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="p-8 bg-white/5 rounded-3xl border border-white/5">
                  <h4 className="text-[9px] tracking-[0.4em] font-black text-white/20 uppercase mb-6">Intensity</h4>
                  <div className="h-1 bg-white/10 rounded-full relative">
                    <div className="absolute inset-y-0 left-0 w-4/5 bg-[#c8860a] rounded-full"></div>
                  </div>
                  <p className="text-[10px] tracking-widest text-white/60 mt-4 font-bold">LEGENDARY</p>
                </div>
                <div className="p-8 bg-white/5 rounded-3xl border border-white/5">
                  <h4 className="text-[9px] tracking-[0.4em] font-black text-white/20 uppercase mb-6">Longevity</h4>
                  <div className="h-1 bg-white/10 rounded-full relative">
                    <div className="absolute inset-y-0 left-0 w-[95%] bg-[#c8860a] rounded-full"></div>
                  </div>
                  <p className="text-[10px] tracking-widest text-white/60 mt-4 font-bold">ETERNAL</p>
                </div>
              </div>
            </div>
          </div>
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

      {/* Write a Review Modal (Simulation) */}
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

      {/* Recommended Section */}
      <section className="py-32 bg-[#0a0a0a]">
        <div className="container mx-auto px-6">
          <h2 className="text-[10px] tracking-[0.6em] text-white/20 font-black uppercase mb-16 text-center">THE CURATED COLLECTION</h2>
          <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
             <div className="w-full md:w-1/3 group cursor-pointer">
                <div className="aspect-[3/4] bg-[#050505] rounded-3xl border border-white/5 overflow-hidden p-8 flex items-center justify-center relative">
                   <img src="https://res.cloudinary.com/dysmvpq03/image/upload/v1775386200/97d141d1-5fcf-469f-9ce8-36efb21a02c0_czrzdl.png" className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
                   <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors"></div>
                </div>
                <div className="mt-8 text-center">
                   <p className="text-[9px] tracking-[0.4em] text-[#c8860a] font-black mb-2 uppercase">DISCOVERY</p>
                   <p className="text-xl font-serif">AYZAR SAMPLE SET</p>
                </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
