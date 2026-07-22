/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  motion, 
  AnimatePresence, 
  useScroll, 
  useTransform, 
  useSpring,
  useMotionValue 
} from 'motion/react';
import { 
  Search, 
  ShoppingBag, 
  Menu, 
  X, 
  ArrowRight, 
  Instagram, 
  Facebook, 
  Linkedin, 
  Youtube, 
  Play
} from 'lucide-react';

import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link,
  useLocation
} from 'react-router-dom';
import ProductDetail from './pages/ProductDetail';

// --- Scroll to Top on Route Change ---
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-16 transition-all duration-700 ${
        isScrolled ? 'h-20 bg-[#0a0a0a]/90 backdrop-blur-2xl border-b border-white/5' : 'h-28 bg-transparent'
      }`}
    >
      <div className="flex-1">
        <a href="/" className="text-2xl font-serif font-black tracking-[0.3em] hover:text-[#c8860a] transition-all duration-300">
          AYZAR
        </a>
      </div>

      <div className="hidden md:flex items-center gap-12">
        {['COLLECTIONS', 'BESPOKE', 'ABOUT', 'JOURNAL'].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            className="group relative text-[9px] tracking-[0.4em] font-bold py-2 overflow-hidden"
          >
            <span className="relative z-10 transition-colors group-hover:text-[#c8860a]">{item}</span>
            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#c8860a] translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 ease-out"></span>
          </a>
        ))}
      </div>

      <div className="flex-1 flex items-center justify-end gap-10">
        <button className="group relative hover:text-[#c8860a] transition-colors">
          <Search size={18} strokeWidth={1} />
        </button>
        <button className="group relative hover:text-[#c8860a] transition-colors">
          <ShoppingBag size={18} strokeWidth={1} />
          <span className="absolute -top-1.5 -right-2 bg-[#c8860a] text-white text-[7px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
            0
          </span>
        </button>
        <button className="md:hidden">
          <Menu size={20} strokeWidth={1} />
        </button>
      </div>
    </motion.nav>
  );
};

const GoldDust = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            opacity: 0, 
            y: "110%", 
            x: `${Math.random() * 100}%`
          }}
          animate={{ 
            opacity: [0, 0.4, 0], 
            y: "-10%"
          }}
          transition={{ 
            duration: Math.random() * 10 + 20, 
            repeat: Infinity, 
            delay: Math.random() * 20,
            ease: "linear"
          }}
          style={{ willChange: 'transform' }}
          className="absolute w-[1px] h-[1px] bg-[#c8860a]/30 rounded-full"
        />
      ))}
    </div>
  );
};

const CustomCursor = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cursorScale = useMotionValue(1);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 12);
      mouseY.set(e.clientY - 12);
    };
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button, a, .group')) {
        cursorScale.set(2.5);
      } else {
        cursorScale.set(1);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY, cursorScale]);

  const springConfig = { damping: 40, stiffness: 400, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  return (
    <motion.div
      style={{
        x: smoothX,
        y: smoothY,
        scale: cursorScale,
      }}
      className="fixed top-0 left-0 w-6 h-6 border border-[#c8860a]/40 rounded-full pointer-events-none z-[9999] hidden md:block"
    />
  );
};

const Hero = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    x.set((clientX - innerWidth / 2) / 35);
    y.set((clientY - innerHeight / 2) / 35);
  };

  const smoothX = useSpring(x, { damping: 50, stiffness: 300 });
  const smoothY = useSpring(y, { damping: 50, stiffness: 300 });

  return (
    <section 
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#050505]"
    >
      {/* Immersive Atmospheric Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(20,20,20,1),transparent)]"></div>
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.4, 0.3]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 -left-1/4 w-[100vw] h-[100vw] bg-[#c8860a]/5 blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{ 
            scale: [1.1, 1, 1.1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-1/4 -right-1/4 w-[80vw] h-[80vw] bg-[#c8860a]/5 blur-[120px] rounded-full"
        />
      </div>

      <GoldDust />

      {/* Luxury Subtle Lighting */}
      <div className="absolute inset-0 pointer-events-none z-10 bg-[radial-gradient(circle_at_50%_40%,rgba(200,134,10,0.03),transparent)]"></div>

      <div className="container mx-auto px-6 md:px-16 relative z-10 flex flex-col md:flex-row items-center justify-between min-h-screen pt-32 pb-16">
        {/* Left Content - Editorial Layout */}
        <div className="w-full md:w-[32%] flex flex-col items-start text-left relative">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-12"
          >
            <div className="space-y-4">
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-[10px] tracking-[0.6em] text-[#c8860a] uppercase font-bold"
              >
                Luxury Written in Scent
              </motion.span>
              <h2 className="text-4xl md:text-6xl font-serif italic leading-tight text-white/90 font-light">
                Ambition has a <br />
                <span className="text-white font-normal not-italic underline decoration-[#c8860a]/30 underline-offset-8">Signature.</span>
              </h2>
            </div>

            <p className="text-sm md:text-base text-white/60 font-sans leading-loose max-w-sm tracking-wide">
              Ayzar was never meant to be for the ordinary. It was born from the contrast where quiet power meets the golden will to rise.
            </p>

            <div className="flex flex-col gap-10">
              <Link to="/product/mankind">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative inline-flex items-center gap-6"
                >
                  <div className="bg-[#c8860a] text-white px-10 py-5 rounded-full text-[10px] tracking-[0.4em] font-bold shadow-[0_15px_40px_rgba(200,134,10,0.25)] group-hover:bg-[#a66f08] transition-all duration-500">
                    EXPLORE SHOP
                  </div>
                  <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#c8860a] transition-colors">
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.button>
              </Link>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="flex items-center gap-4 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-[#c8860a]/10 group-hover:border-[#c8860a]/30 transition-all">
                  <Play size={12} fill="white" className="ml-0.5" />
                </div>
                <span className="text-[9px] tracking-[0.3em] font-bold text-white/40 group-hover:text-[#c8860a] transition-colors">WATCH FILM</span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Center Display - Grand Scale */}
        <div className="w-full md:w-[60%] relative h-[60vh] md:h-[90vh] flex items-center justify-center">
          {/* Background Brand Text - Split behind product */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden h-full">
            <motion.h1 
              initial={{ opacity: 0, letterSpacing: "1em" }}
              animate={{ opacity: 0.05, letterSpacing: "0.2em" }}
              transition={{ duration: 3, ease: [0.16, 1, 0.3, 1] }}
              className="text-[30vw] font-serif font-black text-white whitespace-nowrap"
            >
              AYZAR
            </motion.h1>
          </div>

          {/* Scent Visualizer Rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="w-[500px] h-[500px] border border-white/5 rounded-full"
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
              className="w-[400px] h-[400px] border border-white/[0.03] rounded-full border-dashed"
            />
          </div>

          {/* Product Centerpiece */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            style={{ 
              x: smoothX, 
              y: smoothY 
            }}
            animate={{ 
              opacity: 1, 
              scale: 1 
            }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-20"
          >
            <div className="relative group">
              <img 
                src="https://res.cloudinary.com/dysmvpq03/image/upload/v1775386200/97d141d1-5fcf-469f-9ce8-36efb21a02c0_czrzdl.png" 
                alt="AYZAR MANKIND" 
                className="w-72 md:w-[420px] h-auto drop-shadow-[0_50px_80px_rgba(0,0,0,0.8)] relative z-10"
                referrerPolicy="no-referrer"
              />
              
              {/* Product Reflection */}
              <div className="absolute -bottom-24 left-10 right-10 aspect-square -z-10 pointer-events-none opacity-40">
                 <img 
                  src="https://res.cloudinary.com/dysmvpq03/image/upload/v1775386200/97d141d1-5fcf-469f-9ce8-36efb21a02c0_czrzdl.png" 
                  alt="" 
                  className="w-full h-full object-contain scale-y-[-1] blur-md h-auto"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent"></div>
              </div>
              
              {/* Product Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-[500px] bg-[#c8860a]/15 blur-[120px] rounded-full -z-10"></div>
            </div>

            {/* Float Label */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-16 top-1/4 backdrop-blur-md bg-white/[0.03] border border-white/10 p-4 rounded-xl hidden md:block"
            >
              <div className="space-y-1">
                <p className="text-[8px] tracking-widest text-[#c8860a] font-bold">EDITION</p>
                <p className="text-xs font-serif italic text-white/90">First Batch 01</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Vertical Rail Text */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col items-center gap-12 pointer-events-none hidden xl:flex">
             <div className="w-px h-24 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
             <p className="writing-vertical-rl rotate-180 text-[9px] tracking-[0.8em] text-white/30 uppercase font-bold">
               ESTD · MMXXIV — THE GOLDEN MOON
             </p>
             <div className="w-px h-24 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
          </div>
        </div>
      </div>

      {/* Styled Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-[#c8860a] to-transparent relative overflow-hidden">
          <motion.div 
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-0 w-full h-1/2 bg-white"
          />
        </div>
      </motion.div>
    </section>
  );
};

const Ticker = () => {
  return (
    <div className="bg-[#050505] border-y border-white/5 py-8 overflow-hidden flex whitespace-nowrap relative">
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#050505] to-transparent z-10"></div>
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#050505] to-transparent z-10"></div>
      <motion.div
        animate={{ x: [0, -1000] }}
        transition={{ 
          duration: 30, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className="flex gap-16 items-center"
      >
        {[...Array(15)].map((_, i) => (
          <div key={i} className="flex items-center gap-16">
            <span className="text-[10px] tracking-[0.8em] font-sans font-black text-white/20 uppercase">SCENT OF AMBITION</span>
            <div className="w-1.5 h-1.5 bg-[#c8860a] rounded-full opacity-40"></div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const AboutUs = () => {
  return (
    <section id="about" className="py-24 md:py-48 bg-[#0a0a0a] relative overflow-hidden">
      {/* Decorative vertical line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/5 hidden lg:block"></div>
      
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10"
          >
            <div className="inline-block px-4 py-1.5 border border-[#c8860a]/30 rounded-full mb-8">
              <span className="text-[9px] tracking-[0.4em] text-[#c8860a] font-bold uppercase">Our Provenance</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-serif mb-12 tracking-tight leading-none text-white/90">
              THE <span className="italic">ALCHEMY</span> <br /> OF POWER
            </h2>
            
            <div className="space-y-8 text-white/60 font-sans leading-relaxed max-w-xl mb-16 text-sm md:text-base tracking-wide">
              <p>
                The name itself carries legacy. <br />
                <span className="text-[#c8860a] font-serif italic mr-2">“Ay”</span> the moon, a symbol of quiet power, mystery, and presence. <br />
                <span className="text-[#c8860a] font-serif italic mr-2">“Zar”</span> gold, the mark of wealth, value, and timeless luxury.
              </p>
              
              <p className="border-l border-[#c8860a]/40 pl-8 italic">
                Together, Ayzar means something rare, something untouchable. But we aren’t just about luxury in the traditional sense. We carry an edge—the kind built from ambition, dedication, and the will to rise from nothing and still demand everything.
              </p>

              <p>
                We craft for individuals who understand both struggle and status. People who can walk through ruin and still smell like power.
              </p>
            </div>

            <motion.button
              whileHover={{ x: 10 }}
              className="group flex items-center gap-6 text-[10px] tracking-[0.5em] font-black text-white/40 hover:text-white transition-colors"
            >
              DISCOVER OUR ETHOS 
              <div className="w-12 h-px bg-white/20 group-hover:bg-[#c8860a] group-hover:w-16 transition-all duration-500"></div>
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="aspect-[4/5] bg-[#111] border border-white/10 p-4 md:p-8 rounded-2xl relative group">
              <div className="w-full h-full overflow-hidden rounded-xl">
                <img 
                  src="https://res.cloudinary.com/dysmvpq03/image/upload/v1779684497/IMG_8682_typ0hr.png"
                  alt="Ayzar Brand Story"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s] opacity-70"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              {/* Floating Decorative Elements */}
              <div className="absolute -top-12 -left-12 w-32 h-32 bg-[radial-gradient(circle,rgba(200,134,10,0.1),transparent)] blur-xl"></div>
              <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-[radial-gradient(circle,rgba(200,134,10,0.05),transparent)] blur-xl"></div>
              
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-10 -left-10 bg-[#050505]/80 backdrop-blur-xl border border-white/5 p-8 rounded-2xl shadow-2xl hidden md:block"
              >
                <div className="space-y-4">
                  <Play fill="#c8860a" size={20} className="text-[#c8860a]" />
                  <p className="text-[10px] tracking-[0.4em] font-bold text-white/40">THE MAKING OF A LEGACY</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const ProductShowcase = () => {
  return (
    <section id="shop" className="relative py-32 md:py-56 overflow-hidden bg-[#050505]">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(200,134,10,0.03),transparent)] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center">
          <div className="text-center mb-24 max-w-2xl">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-[10px] tracking-[0.8em] text-[#c8860a] mb-6 uppercase font-black"
            >
              EAU DE PARFUM
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-9xl font-serif leading-none text-white/90"
            >
              MAN<span className="italic">KIND</span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center w-full">
            {/* Specs Left */}
            <div className="lg:col-span-3 space-y-12 order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-xs tracking-[0.3em] font-black mb-6 text-[#c8860a]">COMPOSITION</h3>
                <p className="text-sm text-white/50 leading-relaxed font-sans tracking-wide">
                  An architected balance of primal energy and modern refinement. Designed to evolve on the skin for over 12 hours.
                </p>
              </motion.div>
              
              <div className="space-y-4">
                {[
                  { label: "TOP NOTES", val: "CITRUS, CARDAMOM" },
                  { label: "HEART NOTES", val: "LEATHER, IRIS" },
                  { label: "BASE NOTES", val: "SANDALWOOD, VETIVER" }
                ].map((note, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * idx }}
                    className="group"
                  >
                    <div className="flex justify-between items-end pb-4 border-b border-white/5 group-hover:border-[#c8860a]/30 transition-colors">
                      <span className="text-[8px] tracking-[0.4em] font-black text-white/30 uppercase">{note.label}</span>
                      <span className="text-[10px] tracking-[0.2em] font-serif italic text-white/80">{note.val}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Main Visual Center */}
            <div className="lg:col-span-6 flex justify-center order-1 lg:order-2">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                <div className="absolute inset-0 bg-[#c8860a]/5 blur-[100px] rounded-full scale-150 -z-10"></div>
                <img 
                  src="https://res.cloudinary.com/dysmvpq03/image/upload/v1775386200/97d141d1-5fcf-469f-9ce8-36efb21a02c0_czrzdl.png" 
                  alt="MANKIND" 
                  className="w-80 md:w-[480px] h-auto drop-shadow-[0_40px_60px_rgba(0,0,0,0.7)]"
                />
              </motion.div>
            </div>

            {/* Details Right */}
            <div className="lg:col-span-3 lg:text-right space-y-12 order-3">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-4xl font-serif text-white/90 mb-4 tracking-tighter">$240.00</h3>
                <p className="text-[10px] tracking-[0.4em] text-[#c8860a] font-black mb-8">EAU DE PARFUM / 100ML</p>
              </motion.div>

              <div className="space-y-6">
                <p className="text-xs text-white/40 leading-loose tracking-wide">
                  Presented in a bespoke laser-etched glass flacon with a magnetic walnut cap. Includes a signature collector's box.
                </p>
                
                <Link to="/product/mankind" className="block w-full">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-white text-black py-5 text-[10px] tracking-[0.5em] font-black hover:bg-[#c8860a] hover:text-white transition-all duration-500 rounded-sm shadow-2xl"
                  >
                    ACQUIRE NOW
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const OfferBanner = () => {
  return (
    <section className="relative py-48 flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
      {/* Immersive background with geometric shapes */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] border border-white/5 rounded-full rotate-45"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] border border-[#c8860a]/10 rounded-full -rotate-12"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="bg-gradient-to-br from-[#111] to-[#050505] border border-white/10 rounded-3xl p-12 md:p-24 flex flex-col items-center text-center relative overflow-hidden group">
          {/* Subtle light leak */}
          <div className="absolute -top-1/2 -right-1/4 w-[80%] h-[150%] bg-[#c8860a]/5 blur-[100px] rounded-full group-hover:bg-[#c8860a]/10 transition-all duration-1000"></div>

          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[10px] tracking-[1em] text-[#c8860a] mb-12 font-black uppercase"
          >
            Limited Acquisition
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-8xl font-serif mb-12 max-w-4xl tracking-tighter leading-[0.9] text-white/90"
          >
            PRECISION <br /> <span className="italic text-[#c8860a]">REDEFINED</span>
          </motion.h2>

          <p className="text-white/40 font-sans tracking-[0.2em] text-[11px] mb-16 uppercase font-bold">
            Acquire MANKIND at 30% Privilege Discount — Code: AYZAR30
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative flex items-center gap-6"
          >
            <div className="bg-[#c8860a] text-white px-14 py-6 rounded-sm text-[10px] tracking-[0.5em] font-black shadow-[0_20px_60px_rgba(200,134,10,0.3)]">
              REDEEM STATUS
            </div>
          </motion.button>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  const instagramUrl = "https://www.instagram.com/ayzarbespoke?igsh=ZnF2Y3A5YWJrbmIy";
  
  const socialLinks = [
    { name: 'FACEBOOK', icon: Facebook, url: '#' },
    { name: 'INSTAGRAM', icon: Instagram, url: instagramUrl },
    { name: 'LINKEDIN', icon: Linkedin, url: '#' },
    { name: 'YOUTUBE', icon: Youtube, url: '#' },
    { name: 'PINTEREST', icon: Play, url: '#' },
  ];

  return (
    <footer className="relative pt-48 pb-12 bg-[#050505] overflow-hidden border-t border-white/5">
      {/* Background Large Text Overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center pointer-events-none select-none opacity-[0.015]">
        <h2 className="text-[30vw] font-serif font-black tracking-tighter whitespace-nowrap">
          AYZAR
        </h2>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-24 mb-32">
          {/* Logo Column */}
          <div className="space-y-8">
            <h2 className="text-2xl font-serif font-black tracking-[0.4em]">AYZAR</h2>
            <p className="text-[10px] tracking-[0.2em] leading-relaxed text-white/30 uppercase font-bold">
              WE CRAFT FOR INDIVIDUALS WHO UNDERSTAND BOTH STRUGGLE AND STATUS. LUXURY WITH A BACKBONE.
            </p>
          </div>

          {/* Nav Column */}
          <div className="space-y-8">
            <h3 className="text-[10px] tracking-[0.4em] font-black text-[#c8860a] uppercase">EXPLORE</h3>
            <ul className="space-y-4">
              {['COLLECTIONS', 'BESPOKE', 'ABOUT', 'JOURNAL'].map(item => (
                <li key={item}>
                  <a href="#" className="text-[10px] tracking-[0.3em] font-bold text-white/50 hover:text-white transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Column */}
          <div className="space-y-8">
            <h3 className="text-[10px] tracking-[0.4em] font-black text-[#c8860a] uppercase">CONNECTED</h3>
            <div className="flex flex-wrap gap-6">
              {socialLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.url}
                  className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center hover:bg-white/5 hover:border-[#c8860a]/50 transition-all group"
                >
                  <link.icon size={16} className="text-white/40 group-hover:text-[#c8860a] transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-8">
            <h3 className="text-[10px] tracking-[0.4em] font-black text-[#c8860a] uppercase">SIGNATURE LIST</h3>
            <div className="relative">
              <input 
                type="email" 
                placeholder="YOUR EMAIL" 
                className="w-full bg-transparent border-b border-white/10 pb-4 text-[10px] tracking-[0.3em] focus:outline-none focus:border-[#c8860a] transition-colors placeholder:text-white/10"
              />
              <button className="absolute right-0 bottom-4 text-[#c8860a]">
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[9px] tracking-[0.4em] text-white/20 font-black uppercase">© 2026 AYZAR BESPOKE — ALL RIGHTS RESERVED</p>
          <div className="flex gap-12">
            <a href="#" className="text-[9px] tracking-[0.4em] text-white/20 font-black uppercase hover:text-white transition-colors">PRIVACY</a>
            <a href="#" className="text-[9px] tracking-[0.4em] text-white/20 font-black uppercase hover:text-white transition-colors">TERMS</a>
          </div>
          <p className="text-[9px] tracking-[0.4em] text-white/20 font-black uppercase italic">DESIGNED FOR POWER</p>
        </div>
      </div>
    </footer>
  );
};

// --- Main App ---

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <Ticker />
      <AboutUs />
      <ProductShowcase />
      <OfferBanner />
      <Footer />
    </>
  );
};

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading sequence
    const timer = setTimeout(() => setIsLoaded(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-[#0a0a0a] text-[#e8e8e8] selection:bg-[#c8860a] selection:text-white">
        <AnimatePresence mode="wait">
          {!isLoaded ? (
            <motion.div
              key="loader"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-[#0a0a0a] flex items-center justify-center px-6"
            >
              <motion.div className="flex flex-col items-center gap-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                  className="text-4xl md:text-6xl font-serif tracking-[0.6em] text-white"
                >
                  AYZAR
                </motion.div>
                <div className="w-48 h-px bg-white/10 relative overflow-hidden">
                   <motion.div 
                    initial={{ left: "-100%" }}
                    animate={{ left: "100%" }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-y-0 w-1/2 bg-[#c8860a]"
                   />
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.main
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <CustomCursor />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/product/mankind" element={<ProductDetail />} />
              </Routes>
            </motion.main>
          )}
        </AnimatePresence>
      </div>
    </Router>
  );
}
