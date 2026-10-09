'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';

/**
 * Abstract generative SVG visuals unique to each project.
 * Three distinct patterns based on project theme.
 */
function VideoIntelligencePattern({ accentColor }) {
  // Audio waveform / spectrum bars
  const bars = Array.from({ length: 32 }, (_, i) => ({
    x: 20 + i * 27,
    height: 40 + Math.sin(i * 0.8) * 80 + Math.cos(i * 1.4) * 40,
    opacity: 0.3 + (i % 3) * 0.2,
  }));

  return (
    <svg width="100%" height="100%" viewBox="0 0 900 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="waveGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accentColor} stopOpacity="0.8" />
          <stop offset="100%" stopColor={accentColor} stopOpacity="0.1" />
        </linearGradient>
      </defs>
      {/* Background grid */}
      {Array.from({ length: 10 }).map((_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 50} x2="900" y2={i * 50} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
      ))}
      {Array.from({ length: 18 }).map((_, i) => (
        <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="500" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
      ))}
      {/* Spectrum bars */}
      {bars.map((bar, i) => (
        <rect
          key={i}
          x={bar.x}
          y={250 - bar.height / 2}
          width={18}
          height={bar.height}
          fill="url(#waveGrad)"
          opacity={bar.opacity}
          rx={3}
        />
      ))}
      {/* Center line */}
      <line x1="0" y1="250" x2="900" y2="250" stroke={accentColor} strokeWidth="1" strokeOpacity="0.3" />
    </svg>
  );
}

function EcommercePattern({ accentColor }) {
  // Geometric grid of product tiles + overlapping shapes
  return (
    <svg width="100%" height="100%" viewBox="0 0 900 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="shopGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={accentColor} stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      {/* Grid of product card rectangles */}
      {[0, 1, 2].map((row) =>
        [0, 1, 2, 3].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={50 + col * 210}
            y={60 + row * 140}
            width={180}
            height={110}
            rx={8}
            fill="rgba(255,255,255,0.03)"
            stroke={accentColor}
            strokeWidth="0.5"
            strokeOpacity="0.3"
          />
        ))
      )}
      {/* Large overlapping circles */}
      <circle cx="450" cy="250" r="180" fill={accentColor} fillOpacity="0.04" stroke={accentColor} strokeWidth="1" strokeOpacity="0.2" />
      <circle cx="450" cy="250" r="100" fill={accentColor} fillOpacity="0.06" stroke={accentColor} strokeWidth="1" strokeOpacity="0.3" />
      {/* Accent dots */}
      {[50, 150, 750, 850].map((x, i) => (
        <circle key={i} cx={x} cy={250} r={4} fill={accentColor} opacity={0.6} />
      ))}
    </svg>
  );
}

function TravelsPattern({ accentColor }) {
  // Map-inspired route paths with location dots
  const waypoints = [
    { cx: 150, cy: 400 },
    { cx: 280, cy: 280 },
    { cx: 450, cy: 200 },
    { cx: 620, cy: 260 },
    { cx: 750, cy: 150 },
  ];

  const pathD = waypoints
    .map((p, i) => (i === 0 ? `M ${p.cx} ${p.cy}` : `Q ${(waypoints[i - 1].cx + p.cx) / 2} ${(waypoints[i - 1].cy + p.cy) / 2 - 40} ${p.cx} ${p.cy}`))
    .join(' ');

  return (
    <svg width="100%" height="100%" viewBox="0 0 900 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {/* Background grid dots */}
      {Array.from({ length: 9 }).map((_, row) =>
        Array.from({ length: 18 }).map((_, col) => (
          <circle key={`${row}-${col}`} cx={50 + col * 50} cy={50 + row * 50} r={1.5} fill="rgba(255,255,255,0.08)" />
        ))
      )}
      {/* Route path */}
      <path d={pathD} fill="none" stroke={accentColor} strokeWidth="2" strokeOpacity="0.4" strokeDasharray="8 4" />
      {/* Waypoint dots */}
      {waypoints.map((p, i) => (
        <g key={i}>
          <circle cx={p.cx} cy={p.cy} r={18} fill={accentColor} fillOpacity="0.08" stroke={accentColor} strokeWidth="1" strokeOpacity="0.4" />
          <circle cx={p.cx} cy={p.cy} r={6} fill={accentColor} opacity={0.7} />
        </g>
      ))}
      {/* 50km radius circle around main point */}
      <circle cx={450} cy={200} r={120} fill="none" stroke={accentColor} strokeWidth="1" strokeOpacity="0.15" strokeDasharray="4 8" />
    </svg>
  );
}

export default function ProjectImage({ project, isReversed }) {
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || window.matchMedia('(hover: none)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouchDevice || prefersReducedMotion) return;

    const el = containerRef.current;
    if (!el) return;

    const xTo = gsap.quickTo(imageRef.current, 'rotateY', { duration: 0.5, ease: 'power2.out' });
    const yTo = gsap.quickTo(imageRef.current, 'rotateX', { duration: 0.5, ease: 'power2.out' });

    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 8;
      const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * -8;
      xTo(rotateY);
      yTo(rotateX);
    };

    const handleMouseLeave = () => {
      gsap.to(imageRef.current, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.5)',
      });
    };

    const handleMouseEnter = () => {
      gsap.to(imageRef.current, { scale: 1.04, duration: 0.6, ease: 'power2.out' });
      el.style.willChange = 'transform';
    };

    const handleMouseLeaveScale = () => {
      gsap.to(imageRef.current, { scale: 1, duration: 0.6, ease: 'power2.out' });
      el.style.willChange = 'auto';
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);
    el.addEventListener('mouseenter', handleMouseEnter);
    el.addEventListener('mouseleave', handleMouseLeaveScale);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mouseleave', handleMouseLeaveScale);
    };
  }, []);

  const pattern = project.id === 'video-intelligence'
    ? <VideoIntelligencePattern accentColor={project.accentColor} />
    : project.id === 'ecommerce-platform'
      ? <EcommercePattern accentColor={project.accentColor} />
      : <TravelsPattern accentColor={project.accentColor} />;

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-lg bg-[#111111]"
      style={{ perspective: '1000px', aspectRatio: '16/10' }}
      data-cursor="view"
    >
      <div ref={imageRef} className="w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
        {pattern}
        {/* Gradient overlay */}
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{ background: `linear-gradient(135deg, transparent 0%, rgba(0,0,0,0.3) 100%)` }}
        />
        {/* Accent tint on hover — handled via CSS since it's a simple color shift */}
        <div
          className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500"
          style={{ background: `linear-gradient(135deg, ${project.accentColor}18 0%, transparent 100%)` }}
        />
      </div>
    </div>
  );
}
