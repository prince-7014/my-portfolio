import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function Background() {
  const shouldReduceMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ── Wave canvas (unchanged smooth sine‑wave logic) ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const devicePixelRatio = window.devicePixelRatio || 1;
    const backingStoreRatio =
      (ctx as any).webkitBackingStorePixelRatio ||
      (ctx as any).mozBackingStorePixelRatio ||
      (ctx as any).msBackingStorePixelRatio ||
      (ctx as any).oBackingStorePixelRatio ||
      (ctx as any).backingStorePixelRatio ||
      1;
    const ratio = devicePixelRatio / backingStoreRatio;

    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(ratio, ratio);

    const colors = ['#FDE68A', '#C084FC', '#F472B6', '#6EE7B7', '#FB923C'];

    const draw = (timestamp: number) => {
      const t = timestamp / 1000;
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 2;

      colors.forEach((color, i) => {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.3;
        const offset = i * 40;
        const amplitude = 50;
        const frequency = 0.002;
        const phase = i * 1.2;
        const speed = 0.6;

        ctx.moveTo(0, height / 2 + offset);
        for (let x = 0; x < width; x++) {
          const y =
            height / 2 +
            Math.sin(x * frequency + t * speed + phase) * amplitude +
            offset;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      });

      if (shouldReduceMotion) return;
      animationFrameId = requestAnimationFrame(draw);
    };

    if (!shouldReduceMotion) {
      animationFrameId = requestAnimationFrame(draw);
    } else {
      draw(0);
    }

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [shouldReduceMotion]);

  // ── Additional small decorative shapes (from FloatingShapes) ──
  const smallShapes = [
    { type: 'circle', size: 60, left: '5%', top: '15%', delay: 0 },
    { type: 'square', size: 40, left: '85%', top: '25%', delay: 0.5 },
    { type: 'circle', size: 30, left: '10%', top: '75%', delay: 1 },
    { type: 'square', size: 50, left: '80%', top: '70%', delay: 1.5 },
    { type: 'circle', size: 45, left: '45%', top: '10%', delay: 2 },
    { type: 'square', size: 35, left: '20%', top: '45%', delay: 0.8 },
    { type: 'circle', size: 25, left: '70%', top: '50%', delay: 1.2 },
    { type: 'square', size: 55, left: '60%', top: '85%', delay: 0.3 },
  ];

  return (
    <div
      className="site-background fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* Smooth wave canvas */}
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* ======================================================================== */}
      {/*   Original big shapes (circle, square, dot) – now explicitly restored   */}
      {/* ======================================================================== */}

      {/* Big Circle – original size & position */}
      <motion.span
        className="site-shape site-shape--circle absolute top-[10%] left-[5%] w-24 h-24 border-[3px] border-black rounded-full opacity-20"
        animate={
          shouldReduceMotion
            ? {}
            : {
                y: [0, -18, 0, 12, 0],
                rotate: [0, 8, 0, -6, 0],
              }
        }
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'easeInOut',
        }}
      />

      {/* Big Square – original size & position */}
      <motion.span
        className="site-shape site-shape--square absolute bottom-[20%] right-[10%] w-32 h-32 border-[3px] border-black opacity-10"
        animate={
          shouldReduceMotion
            ? {}
            : {
                y: [0, 18, 0, -12, 0],
                rotate: [0, -10, 0, 8, 0],
              }
        }
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'easeInOut',
        }}
      />

      {/* Small Dot – original size, position & rotation */}
      <motion.span
        className="site-shape site-shape--dot absolute top-[30%] right-[15%] w-16 h-16 border-[3px] border-black rotate-12 opacity-15"
        animate={
          shouldReduceMotion
            ? {}
            : {
                y: [0, -10, 0, 8, 0],
                scale: [1, 1.08, 1, 0.96, 1],
                rotate: [12, 32, 12, -3, 12], // starts from baseline rotate-12
              }
        }
        transition={{
          duration: 7,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'easeInOut',
        }}
      />

      {/* ======================================================================== */}
      {/*   Eight additional small decorative shapes (from FloatingShapes)        */}
      {/* ======================================================================== */}
      {smallShapes.map((shape, i) => (
        <motion.div
          key={`small-${i}`}
          className={`absolute border-[3px] border-black opacity-10 ${
            shape.type === 'circle' ? 'rounded-full' : ''
          }`}
          style={{
            width: shape.size,
            height: shape.size,
            left: shape.left,
            top: shape.top,
          }}
          animate={
            shouldReduceMotion
              ? { opacity: 0.1 }
              : {
                  y: [0, -15, 0, 12, 0],
                  rotate: [0, 8, 0, -6, 0],
                  opacity: 0.1,
                }
          }
          transition={{
            duration: 7 + i * 0.7,
            repeat: Infinity,
            delay: shape.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
