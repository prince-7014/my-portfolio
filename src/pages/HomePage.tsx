import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, FileText, Sparkles, Zap, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

// ------------------------------------------------------------------
// Marquee Component – true seamless infinite loop
// ------------------------------------------------------------------
const Marquee = () => {
  const items = [
    { text: 'Motion Graphics', icon: Star, color: 'text-yellow-400 fill-yellow-400' },
    { text: 'Video Editing', icon: Sparkles, color: 'text-pink-400' },
    { text: 'Scriptwriting', icon: Zap, color: 'text-blue-400' },
  ];

  // Repeat the sequence inside each group so one group is wider than any viewport
  const groupContent = (
    <div className="marquee-group">
      {Array.from({ length: 4 }).map((_, repeatIdx) =>
        items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={`${item.text}-${repeatIdx}`} className="marquee-item">
              <span>{item.text}</span>
              <Icon className={item.color} aria-hidden="true" />
            </div>
          );
        })
      )}
    </div>
  );

  return (
    <div
      className="marquee-container"
      aria-label="Services: motion graphics, video editing, scriptwriting"
    >
      <div className="marquee-track">
        {groupContent}
        {groupContent}
      </div>

      {/* Inline CSS for a bulletproof, seamless marquee */}
      <style>{`
        .marquee-container {
          overflow: hidden;
          width: 100%;
          position: relative;
        }
        .marquee-track {
          display: flex;
          align-items: center;
          gap: 0;
          width: max-content;
          animation: marquee-scroll 20s linear infinite;
        }
        .marquee-group {
          display: flex;
          align-items: center;
          gap: 2.5rem;          /* match the spacing between items */
          flex-shrink: 0;
          white-space: nowrap;
        }
        .marquee-item {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 900;
          text-transform: uppercase;
          white-space: nowrap;
          flex-shrink: 0;
        }
        /* Seamless loop: move exactly one full group width to the left */
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        /* Reduce motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          .marquee-track {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
};

// ------------------------------------------------------------------
// Badge Component – original styling + gentle floating
// ------------------------------------------------------------------
const Badge = ({ text, color, delay }: { text: string; color: string; delay: number }) => {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -20 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', delay, stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.1, rotate: 5 }}
      className={`absolute px-6 py-3 border-[3px] border-black shadow-[4px_4px_0px_#000] font-black text-xl uppercase ${color}`}
    >
      {text}
    </motion.div>
  );
};

// ------------------------------------------------------------------
// Button with ripple effect
// ------------------------------------------------------------------
const RippleButton = ({
  children,
  to,
  className,
  ...props
}: {
  children: React.ReactNode;
  to: string;
  className?: string;
  [key: string]: any;
}) => {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((prev) => [...prev, { x, y, id }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600);
  };

  return (
    <motion.a
      href={to.startsWith('mailto:') ? to : `#${to}`}
      className={`relative overflow-hidden brutalist-btn text-xl w-full sm:w-auto ${className}`}
      whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(251, 191, 36, 0.5)' }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      {...props}
    >
      {children}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full bg-white/30"
          style={{
            left: ripple.x - 20,
            top: ripple.y - 20,
            width: 40,
            height: 40,
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      ))}
    </motion.a>
  );
};

// ------------------------------------------------------------------
// Section wrapper – fades in when entering viewport
// ------------------------------------------------------------------
const Section = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <motion.section
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.1 }}
    transition={{ duration: 0.6 }}
    className={className}
  >
    {children}
  </motion.section>
);

// ------------------------------------------------------------------
// Main HomePage Component
// ------------------------------------------------------------------
export default function HomePage() {
  return (
    <div className="overflow-hidden relative">
      {/* Hero Section */}
      <Section className="relative pt-12 pb-20 sm:pt-20 sm:pb-32 container-custom">
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-2 bg-purple-200 border-[2px] border-black font-bold mb-8 uppercase tracking-widest"
          >
            Creative Storyteller & Visual Artist
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[clamp(3.25rem,15vw,6rem)] md:text-8xl lg:text-9xl font-black mb-6 sm:mb-8 leading-[0.9] uppercase tracking-tighter"
          >
            PRINCE <span className="text-pink-500">KUMAR</span> YADAV
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg sm:text-xl md:text-2xl font-medium text-slate-700 mb-8 sm:mb-12 max-w-2xl mx-auto"
          >
            Scriptwriter, Video Editor & Motion Artist. Turning complex ideas into high-retention visual experiences.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 sm:gap-6"
          >
            <RippleButton to="/portfolio" className="bg-yellow-400">
              VIEW MY WORK <ArrowRight className="ml-2 inline" />
            </RippleButton>
            <RippleButton to="mailto:prinzemedia19@gmail.com" className="bg-white">
              HIRE ME
            </RippleButton>
          </motion.div>
        </div>

        {/* Floating Badges */}
        <div className="hidden lg:block">
          <div className="absolute top-1/4 -left-10">
            <Badge text="Scriptwriter" color="bg-purple-300" delay={0.5} />
          </div>
          <div className="absolute top-1/2 -right-10">
            <Badge text="Video Editor" color="bg-pink-300" delay={0.7} />
          </div>
          <div className="absolute bottom-10 left-1/4">
            <Badge text="Motion Artist" color="bg-yellow-300" delay={0.9} />
          </div>
        </div>
      </Section>

      {/* Seamless Marquee Bar */}
      <div className="bg-black text-white py-4 sm:py-6 border-y-[4px] border-black -rotate-[0.5deg] sm:-rotate-1 scale-[1.01] sm:scale-105 mb-12 sm:mb-20">
        <Marquee />
      </div>

      {/* Featured Section */}
      <Section className="container-custom py-12 sm:py-20">
        <div className="flex flex-col md:flex-row justify-between md:items-end mb-10 sm:mb-16 gap-6 sm:gap-8">
          <div className="max-w-xl">
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase mb-4 sm:mb-6 leading-none">
              Featured <span className="text-purple-500">Creations</span>
            </h2>
            <p className="text-lg sm:text-xl font-medium text-slate-600">
              A glimpse into some of my favorite projects where I've combined scriptwriting with dynamic visual storytelling.
            </p>
          </div>
          <Link to="/portfolio" className="brutalist-btn bg-white shrink-0">
            EXPLORE ALL
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-12">
          {/* Card 1 */}
          <motion.div
            whileHover={{ y: -10 }}
            className="brutalist-card overflow-hidden group"
          >
            <div className="aspect-video bg-slate-200 relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=800"
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                alt="Project Preview"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-16 h-16 rounded-full bg-yellow-400 border-[3px] border-black flex items-center justify-center">
                  <Play className="fill-black ml-1" />
                </div>
              </div>
            </div>
            <div className="p-5 sm:p-8">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-pink-200 border-[2px] border-black text-xs font-bold uppercase">Video Editing</span>
                <span className="px-3 py-1 bg-blue-200 border-[2px] border-black text-xs font-bold uppercase">Motion</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black uppercase mb-4">Documentary Style Storytelling</h3>
              <p className="text-slate-600 font-medium mb-6">High-retention editing style for educational YouTube channels.</p>
              <Link to="/portfolio" className="font-bold flex items-center gap-2 hover:text-pink-500 transition-colors">
                CASE STUDY <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            whileHover={{ y: -10 }}
            className="brutalist-card overflow-hidden group"
          >
            <div className="aspect-video bg-purple-100 flex flex-col items-center justify-center p-12 text-center">
              <FileText className="w-20 h-20 mb-6 text-purple-600" />
              <h4 className="text-2xl font-black uppercase">Viral Script Structure</h4>
              <p className="text-slate-500 font-bold mt-2 italic">No Thumbnail Needed for Scripts</p>
            </div>
            <div className="p-5 sm:p-8">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-purple-200 border-[2px] border-black text-xs font-bold uppercase">Scriptwriting</span>
                <span className="px-3 py-1 bg-green-200 border-[2px] border-black text-xs font-bold uppercase">Viral Strategy</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black uppercase mb-4">10-Minute Narrative Script</h3>
              <p className="text-slate-600 font-medium mb-6">Focusing on hook-retention and emotional resonance.</p>
              <Link to="/portfolio" className="font-bold flex items-center gap-2 hover:text-pink-500 transition-colors">
                READ SCRIPT <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </Section>
    </div>
  );
}
