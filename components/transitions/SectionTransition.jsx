'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function SectionTransition() {
  const sectionRef = useRef(null);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=120%',
        pin: true,
        scrub: 1,
      }
    });

    // Phase 1: Text rises into view from bottom
    tl.fromTo('.transition-line',
      { y: 120, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.3, stagger: 0.08, ease: 'power2.out' }
    );

    // Phase 2: Text spreads apart dramatically
    tl.to('.transition-line', {
      letterSpacing: '0.18em',
      opacity: 0.15,
      scale: 1.08,
      duration: 0.4,
      ease: 'none'
    }, '+=0.1');

    // Phase 3: Text exits upward
    tl.to('.transition-line', {
      y: -100,
      opacity: 0,
      duration: 0.2,
      ease: 'power2.in'
    });

    // Parallax watermark moves slower
    tl.fromTo('.transition-watermark',
      { y: 0 },
      { y: -60, duration: 1 },
      0
    );

  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="transition-hero-architecture"
      className="section-transition relative h-screen flex items-center justify-center overflow-hidden z-10"
      style={{ background: '#0d0a1a' }}
    >
      {/* Watermark background text */}
      <div className="transition-watermark absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span
          className="text-[25vw] font-display font-bold uppercase leading-none"
          style={{
            color: 'transparent',
            WebkitTextStroke: '1px rgba(255,255,255,0.04)',
          }}
        >
          T.HAFEEZ
        </span>
      </div>

      {/* Foreground text */}
      <div className="relative z-10 text-center">
        <div className="overflow-hidden">
          <span className="transition-line block font-display text-[clamp(44px,9vw,130px)] font-bold uppercase text-white leading-[1.05] opacity-0 whitespace-nowrap">
            CODE IS <span className="font-serif italic font-normal text-purple-300">POETRY.</span>
          </span>
        </div>
        <div className="overflow-hidden mt-2">
          <span className="transition-line block font-display text-[clamp(44px,9vw,130px)] font-bold uppercase text-purple-400 leading-[1.05] opacity-0 whitespace-nowrap">
            SYSTEMS ARE <span className="font-serif italic font-normal text-[#f0eeff]">ART.</span>
          </span>
        </div>
      </div>
    </section>
  );
}
