'use client';

import { useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// Marquee text repeated 3× to ensure seamless wrap
const ROW1_TEXT = 'JAVA • SPRING BOOT • REACT • KAFKA • DOCKER • POSTGRESQL • TAILWIND • REDUX • GIT • JWT • MICROSERVICES • VECTOR DB • ';
const ROW2_TEXT = 'FULL STACK • SYSTEMS ARCHITECT • BACKEND ENGINEER • FRONTEND DEVELOPER • AI INTEGRATOR • ';

export default function SkillsMarquee() {
  const containerRef = useRef(null);
  const row1Ref = useRef(null);
  const row2Ref = useRef(null);
  const tween1Ref = useRef(null);
  const tween2Ref = useRef(null);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Row 1 scrolls left (-50% = one copy's width, ensuring seamless loop)
    tween1Ref.current = gsap.to(row1Ref.current, {
      xPercent: -50,
      duration: 22,
      ease: 'none',
      repeat: -1,
    });

    // Row 2 scrolls right (starts at -50%, animates to 0)
    gsap.set(row2Ref.current, { xPercent: -50 });
    tween2Ref.current = gsap.to(row2Ref.current, {
      xPercent: 0,
      duration: 28,
      ease: 'none',
      repeat: -1,
    });

    // Pause tweens when section is out of viewport for performance
    const scrollTrigger = {
      trigger: containerRef.current,
      start: 'top bottom',
      end: 'bottom top',
      onEnter: () => { tween1Ref.current?.resume(); tween2Ref.current?.resume(); },
      onLeave: () => { tween1Ref.current?.pause(); tween2Ref.current?.pause(); },
      onEnterBack: () => { tween1Ref.current?.resume(); tween2Ref.current?.resume(); },
      onLeaveBack: () => { tween1Ref.current?.pause(); tween2Ref.current?.pause(); },
    };
    // Use GSAP ScrollTrigger inline  
    const { ScrollTrigger } = require('gsap/ScrollTrigger');
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.create(scrollTrigger);
  }, { scope: containerRef });

  const handleMouseEnter = useCallback(() => {
    tween1Ref.current?.timeScale(0.3);
    tween2Ref.current?.timeScale(0.3);
  }, []);

  const handleMouseLeave = useCallback(() => {
    tween1Ref.current?.timeScale(1);
    tween2Ref.current?.timeScale(1);
  }, []);

  // Row 1 content: 3 copies for seamless loop
  const row1Content = ROW1_TEXT.repeat(3);
  // Row 2 content: 3 copies
  const row2Content = ROW2_TEXT.repeat(3);

  return (
    <div
      ref={containerRef}
      className="py-16 bg-[#0a0a0a] overflow-hidden"
      style={{
        borderTop: '1px solid rgba(255,255,255,0.04)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-hidden="true"
    >
      {/* Row 1 — scrolls left, outline style */}
      <div className="overflow-hidden mb-3">
        <div
          ref={row1Ref}
          className="whitespace-nowrap inline-block"
          style={{ willChange: 'transform' }}
        >
          <span
            className="font-display text-[clamp(48px,8vw,120px)] font-bold uppercase"
            style={{
              color: 'transparent',
              WebkitTextStroke: '1px rgba(255,255,255,0.15)',
              letterSpacing: '0.04em',
            }}
          >
            {row1Content}
          </span>
        </div>
      </div>

      {/* Row 2 — scrolls right, filled faint style */}
      <div className="overflow-hidden">
        <div
          ref={row2Ref}
          className="whitespace-nowrap inline-block"
          style={{ willChange: 'transform' }}
        >
          <span
            className="font-display text-[clamp(48px,8vw,120px)] font-bold uppercase"
            style={{
              color: 'rgba(255,255,255,0.04)',
              letterSpacing: '0.04em',
            }}
          >
            {row2Content}
          </span>
        </div>
      </div>
    </div>
  );
}
