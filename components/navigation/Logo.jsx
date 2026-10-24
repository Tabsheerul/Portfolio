'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';

export default function Logo() {
  const containerRef = useRef(null);
  const markRef = useRef(null);
  const crossbarRef = useRef(null);
  const stemRef = useRef(null);
  const energyNodeRef = useRef(null);
  const nameRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const mark = markRef.current;
    const crossbar = crossbarRef.current;
    const stem = stemRef.current;
    const energyNode = energyNodeRef.current;
    const nameEl = nameRef.current;

    if (!container || !mark) return;

    // Subtle 3D tilt tracking cursor on the standalone T mark
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(mark, {
        rotateY: x * 0.25,
        rotateX: -y * 0.25,
        duration: 0.25,
        ease: 'power1.out',
        transformPerspective: 400,
      });
    };

    const handleMouseEnter = () => {
      // Kinetic expansion: crossbar lifts, stem drops slightly
      if (crossbar) {
        gsap.to(crossbar, {
          y: -2,
          duration: 0.28,
          ease: 'power2.out',
        });
      }
      if (stem) {
        gsap.to(stem, {
          y: 2,
          duration: 0.28,
          ease: 'power2.out',
        });
      }
      if (energyNode) {
        gsap.to(energyNode, {
          scale: 1.4,
          transformOrigin: '35px 3.5px',
          duration: 0.25,
          ease: 'back.out(2)',
        });
      }
      if (mark) {
        gsap.to(mark, {
          filter: 'drop-shadow(0 0 12px rgba(168,85,247,0.75)) drop-shadow(0 0 24px rgba(56,189,248,0.4))',
          duration: 0.3,
          ease: 'power2.out',
        });
      }

      // Typography letter-spacing expansion
      if (nameEl) {
        gsap.to(nameEl, {
          letterSpacing: '0.18em',
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    };

    const handleMouseLeave = () => {
      if (crossbar) {
        gsap.to(crossbar, {
          y: 0,
          duration: 0.45,
          ease: 'elastic.out(1, 0.5)',
        });
      }
      if (stem) {
        gsap.to(stem, {
          y: 0,
          duration: 0.45,
          ease: 'elastic.out(1, 0.5)',
        });
      }
      if (energyNode) {
        gsap.to(energyNode, {
          scale: 1,
          transformOrigin: '35px 3.5px',
          duration: 0.35,
          ease: 'power2.out',
        });
      }
      if (mark) {
        gsap.to(mark, {
          rotateY: 0,
          rotateX: 0,
          filter: 'drop-shadow(0 0 8px rgba(168,85,247,0.3)) drop-shadow(0 0 0px transparent)',
          duration: 0.4,
          ease: 'power2.out',
        });
      }

      if (nameEl) {
        gsap.to(nameEl, {
          letterSpacing: '0.14em',
          duration: 0.4,
          ease: 'power2.inOut',
        });
      }
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="flex items-center gap-3 select-none py-1 group/logo cursor-pointer"
    >
      {/* Freestanding Chiseled 'T' Mark — Completely Standalone, NO BOX! */}
      <div 
        ref={markRef}
        className="relative flex items-center justify-center transition-all duration-300"
        style={{
          filter: 'drop-shadow(0 0 8px rgba(168,85,247,0.3))',
          willChange: 'transform, filter',
        }}
      >
        <svg 
          viewBox="0 0 38 38" 
          className="w-[30px] h-[30px] md:w-[34px] md:h-[34px] overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Top Beam Specular Light Gradient */}
            <linearGradient id="tBeamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="45%" stopColor="#f3e8ff" />
              <stop offset="85%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>

            {/* Left Pillar Facet (Light Purple Reflection) */}
            <linearGradient id="tPillarLeftGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f3e8ff" />
              <stop offset="45%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>

            {/* Right Pillar Facet (Electric Cyan Ambient Glow) */}
            <linearGradient id="tPillarRightGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="55%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>

          {/* Top Beam (Horizontal Crossbar with 45° Chamfers & Center Notch) */}
          <g ref={crossbarRef}>
            <path 
              d="M 4 5 L 34 5 L 30.5 12.5 L 23 12.5 L 19 8.5 L 15 12.5 L 7.5 12.5 Z" 
              fill="url(#tBeamGrad)"
            />
            {/* Beveled Top Specular Accent */}
            <line 
              x1="5" 
              y1="5.5" 
              x2="33" 
              y2="5.5" 
              stroke="#ffffff" 
              strokeWidth="0.8" 
              strokeLinecap="round" 
              opacity="0.85" 
            />
          </g>

          {/* Vertical Stem (Faceted Dual-Tone Pillar Locking into Notch) */}
          <g ref={stemRef}>
            {/* Left Facet */}
            <path 
              d="M 19 11 L 15.5 14.5 L 15.5 31 L 19 34.5 Z" 
              fill="url(#tPillarLeftGrad)" 
            />
            {/* Right Facet */}
            <path 
              d="M 19 11 L 22.5 14.5 L 22.5 31 L 19 34.5 Z" 
              fill="url(#tPillarRightGrad)" 
            />
            {/* Center Razor Spine Reflection */}
            <line 
              x1="19" 
              y1="11" 
              x2="19" 
              y2="34.5" 
              stroke="#ffffff" 
              strokeWidth="0.75" 
              strokeLinecap="round" 
              opacity="0.75" 
            />
          </g>

          {/* Floating Precision Energy Beacon (Top-Right Trademark Accent) */}
          <g ref={energyNodeRef}>
            <circle cx="35" cy="3.5" r="1.6" fill="#38bdf8" />
            <circle 
              cx="35" 
              cy="3.5" 
              r="3.2" 
              fill="none" 
              stroke="#c084fc" 
              strokeWidth="0.7" 
              opacity="0.75" 
            />
          </g>
        </svg>
      </div>

      {/* Clean Single Brand Name (No Complete Name Stack) */}
      <div className="flex items-center">
        <span 
          ref={nameRef}
          className="font-display text-[16px] md:text-[17px] font-bold uppercase text-white tracking-[0.14em] transition-all duration-300 group-hover/logo:text-transparent group-hover/logo:bg-clip-text group-hover/logo:bg-gradient-to-r group-hover/logo:from-white group-hover/logo:via-purple-200 group-hover/logo:to-cyan-300"
        >
          TABSHEERUL
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 ml-1.5 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
      </div>
    </div>
  );
}
