import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, Video, Sparkles, PenTool, 
  CheckCircle, ArrowRight, Zap, Target, MousePointer2 
} from 'lucide-react';

// ── Custom Intersection Observer hook ──────────────────────────────
function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.1, ...options }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [options]);

  return { ref, inView };
}

// ── Workflow Card ──
function WorkflowCard({ 
  step, 
  title, 
  desc, 
  icon, 
  index, 
  total 
}: { 
  step: string; 
  title: string; 
  desc: string; 
  icon: React.ReactNode; 
  index: number; 
  total: number;
}) {
  const { ref, inView } = useInView({ threshold: 0.1 });
  const delay = index * 0.1;

  return (
    <div className="relative flex justify-center">
      <motion.div
        ref={ref}
        style={{ containerType: 'inline-size' }}
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay }}
        className="brutalist-card bg-white text-center w-full max-w-none min-h-[280px] flex flex-col justify-between p-6 sm:p-7 relative z-20"
      >
        <div 
          className="absolute top-5 left-5 border-[3px] border-black px-3 rounded-lg bg-white shadow-[3px_3px_0px_#000] font-black text-black"
          style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)' }}
        >
          {step}
        </div>

        <div className="flex justify-center pt-14 text-retro-pink">
          <div className="p-3 border-[2px] border-black rounded-full bg-white">
            {icon}
          </div>
        </div>

        {/* Title now scales with the card’s own width */}
        <h4 
          className="font-black uppercase whitespace-nowrap leading-none tracking-tight"
          style={{ fontSize: 'clamp(0.95rem, 6cqi, 1.5rem)' }}
        >
          {title}
        </h4>

        <p 
          className="text-slate-500 font-medium mt-2"
          style={{ fontSize: 'clamp(0.85rem, 1.2vw, 1rem)' }}
        >
          {desc}
        </p>
      </motion.div>

      {index < total - 1 && (
        <div className="hidden 2xl:flex absolute top-1/2 left-full ml-4 -translate-y-1/2 z-30 items-center justify-center">
          <ArrowRight className="w-8 h-8 text-black" />
        </div>
      )}
    </div>
  );
}

// ── Service Card (with container‑based typography fix) ──
function ServiceCard({ service, index }: { 
  service: { 
    title: string; 
    icon: React.ReactNode; 
    color: string; 
    description: string; 
    features: string[] 
  }; 
  index: number 
}) {
  const { ref, inView } = useInView({ threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      style={{ containerType: 'inline-size' }}   // ← makes this card a sizing container
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="brutalist-card p-6 sm:p-8 lg:p-9 flex flex-col items-start gap-6 bg-white h-full"
    >
      <div className="w-full">
        <div className={`w-16 h-16 sm:w-20 sm:h-20 shrink-0 border-[3px] border-black shadow-[4px_4px_0px_#000] flex items-center justify-center ${service.color}`}>
          {service.icon}
        </div>

        {/* 
          Title now sizes itself according to the card’s width (cqi),
          not the viewport. No overflow possible.
        */}
        <h3 
          className="mt-5 font-black uppercase whitespace-nowrap leading-none tracking-tight" 
          style={{ fontSize: 'clamp(1.1rem, 6cqi, 1.9rem)' }}
        >
          {service.title}
        </h3>

        <p 
          className="mt-3 text-slate-600 font-medium leading-relaxed" 
          style={{ fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)' }}
        >
          {service.description}
        </p>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full pl-0 mt-2">
        {service.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2 font-bold">
            <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
            <span style={{ fontSize: 'clamp(0.8rem, 1.2vw, 1rem)' }}>{feature}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

// ── Main page (unchanged) ──
export default function ServicesPage() {
  const services = [
    {
      title: 'Scriptwriting',
      icon: <FileText className="w-12 h-12" />,
      color: 'bg-purple-300',
      description: 'Engaging, research-backed scripts for documentaries, tech reviews, and story-driven content.',
      features: ['High-retention hooks', 'Storytelling framework', 'Viral concept research', 'SEO optimization']
    },
    {
      title: 'Video Editing',
      icon: <Video className="w-12 h-12" />,
      color: 'bg-pink-300',
      description: 'Professional high-energy or documentary-style editing with focus on pacing and viewer retention.',
      features: ['Sound design', 'Dynamic transitions', 'Color grading', 'Multi-cam sync']
    },
    {
      title: 'Motion Graphics',
      icon: <Sparkles className="w-12 h-12" />,
      color: 'bg-yellow-300',
      description: 'Custom animations, text overlays, and 2D elements that elevate the visual quality of your videos.',
      features: ['Lower thirds', 'Animated intros', 'Infographic animations', 'VFX touch-ups']
    },
    {
      title: 'Thumbnails',
      icon: <PenTool className="w-12 h-12" />,
      color: 'bg-blue-300',
      description: 'Eye-catching, high CTR thumbnails designed to stop the scroll and drive more clicks.',
      features: ['A/B testing ready', 'Color theory', 'Typography design', 'Photoshop mastery']
    }
  ];

  const process = [
    { step: '01', title: 'Concept', desc: 'Brainstorming hooks and story arcs.', icon: <Target /> },
    { step: '02', title: 'Scripting', desc: 'Drafting retention-focused narratives.', icon: <FileText /> },
    { step: '03', title: 'Editing', desc: 'Crafting the visual flow and pacing.', icon: <Zap /> },
    { step: '04', title: 'Polishing', desc: 'Adding sound and motion graphics.', icon: <Sparkles /> }
  ];

  const { ref: headerRef, inView: headerInView } = useInView({ threshold: 0.1 });
  const { ref: ctaRef, inView: ctaInView } = useInView({ threshold: 0.1 });

  return (
    <div className="container-custom py-20 relative overflow-hidden">
      {/* Background décor unchanged */}
      <div className="absolute inset-0 pointer-events-none -z-10" aria-hidden="true">
        <div className="absolute top-[5%] left-[2%] w-20 h-20 border-2 border-slate-300 opacity-10 rounded-full animate-float-slow" />
        <div className="absolute top-[20%] right-[5%] w-32 h-32 border-2 border-slate-300 opacity-10 rotate-12 animate-float-slow-reverse" />
        <div className="absolute bottom-[15%] left-[8%] w-24 h-24 border-2 border-slate-300 opacity-10 rotate-45 animate-float-slow" />
        <div className="absolute top-[60%] right-[10%] w-16 h-16 border-2 border-slate-300 opacity-10 rounded-full animate-float-slow-reverse" />
        <div className="absolute top-[80%] left-[30%] w-28 h-28 border-2 border-slate-300 opacity-10 rotate-12 animate-float-slow" />
        <div className="absolute top-[40%] left-[60%] w-12 h-12 border-2 border-slate-300 opacity-10 rounded-full animate-float-slow" />
      </div>

      {/* ═══ Header ═══ */}
      <div
        ref={headerRef}
        className={`text-center mb-24 max-w-3xl mx-auto transition-all duration-700 ${
          headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <h1 
          className="font-black mb-8 uppercase leading-tight"
          style={{ fontSize: 'clamp(2.8rem, 8vw, 6rem)' }}
        >
          SERVICES <span className="text-retro-pink">&</span> PROCESS
        </h1>
        <p 
          className="font-medium text-slate-600 italic"
          style={{ fontSize: 'clamp(1rem, 2.5vw, 1.4rem)' }}
        >
          "The difference between a good video and a great one is in the details of the script and the precision of the edit."
        </p>
      </div>

      {/* ═══ Services Grid ═══ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-32">
        {services.map((service, index) => (
          <ServiceCard key={service.title} service={service} index={index} />
        ))}
      </div>

      {/* ═══ Workflow Section ═══ */}
      <section className="mb-32 relative">
        <div className="text-center mb-16">
          <h2 
            className="font-black uppercase"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
          >
            MY <span className="text-retro-yellow">WORKFLOW</span>
          </h2>
          <p 
            className="text-slate-500 font-medium mt-2"
            style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.2rem)' }}
          >
            From concept to completion – my creative process
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 xl:gap-8 relative z-10">
          {process.map((item, index) => (
            <WorkflowCard
              key={item.step}
              step={item.step}
              title={item.title}
              desc={item.desc}
              icon={item.icon}
              index={index}
              total={process.length}
            />
          ))}
        </div>

        <div className="hidden 2xl:block absolute top-[55%] left-[12%] right-[12%] h-[3px] bg-black z-0 border-t-[3px] border-black border-dashed opacity-20" />
      </section>

      {/* ═══ CTA ═══ */}
      <div
        ref={ctaRef}
        className={`brutalist-card bg-black text-white p-8 sm:p-12 md:p-20 text-center relative overflow-hidden transition-all duration-700 ${
          ctaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="absolute top-10 right-10 rotate-12 opacity-50" aria-hidden="true">
          <MousePointer2 className="w-20 h-20 text-yellow-400" />
        </div>
        <div className="relative z-10">
          <h2 
            className="font-black uppercase mb-6"
            style={{ fontSize: 'clamp(2.2rem, 6vw, 4.5rem)' }}
          >
            Ready to start your next project?
          </h2>
          <p 
            className="font-medium text-slate-400 mb-10 max-w-2xl mx-auto"
            style={{ fontSize: 'clamp(1rem, 2vw, 1.4rem)' }}
          >
            I'm currently accepting new projects. Let's build something that stands out.
          </p>
          <a 
            href="mailto:prinzemedia19@gmail.com" 
            className="brutalist-btn bg-retro-yellow text-black inline-block transition-all duration-200 hover:scale-105 hover:shadow-[6px_6px_0px_#000]"
            style={{ fontSize: 'clamp(1rem, 2vw, 1.6rem)', padding: 'clamp(0.8rem, 2vw, 1.5rem) clamp(2rem, 4vw, 3rem)' }}
          >
            START A CONVERSATION
          </a>
        </div>
      </div>

      {/* ═══ Animations ═══ */}
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(1deg); }
        }
        @keyframes float-slow-reverse {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(-1deg); }
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        .animate-float-slow-reverse {
          animation: float-slow-reverse 10s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-float-slow,
          .animate-float-slow-reverse {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
