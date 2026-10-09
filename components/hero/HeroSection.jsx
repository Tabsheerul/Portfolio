'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import dynamic from 'next/dynamic';
import { useAppStore } from '@/lib/store';
import MagneticButton from '@/components/shared/MagneticButton';
import { useMediaQuery } from '@/hooks/useMediaQuery';

// Lazy-load heavy 3D canvas for performance
const HeroBackground = dynamic(() => import('./HeroBackground'), { ssr: false });

export default function HeroSection() {
  const sectionRef = useRef(null);
  const subtitleRef = useRef(null);
  const cursorBlinkRef = useRef(null);
  const isLoading = useAppStore((s) => s.isLoading);
  const isScrolled = useAppStore((s) => s.isScrolled);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const nameChars = 'TABSHEERUL HAFEEZ'.split('');
  const subtitleText = 'I build scalable end-to-end applications';

  useEffect(() => {
    setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  // Typewriter effect function
  const startTypewriter = useCallback(() => {
    if (!subtitleRef.current) return;
    const el = subtitleRef.current;
    el.textContent = '';
    let i = 0;

    const type = () => {
      if (i < subtitleText.length) {
        el.textContent = subtitleText.slice(0, i + 1);
        i++;
        setTimeout(type, 50);
      }
    };
    type();
  }, [subtitleText]);

  // Hero entrance timeline — fires only after preloader finishes
  useGSAP(() => {
    if (isLoading) return;

    if (prefersReducedMotion) {
      // Simple fade in for reduced motion
      gsap.set('.hero-pretitle, .hero-char, .hero-location, .hero-cta, .scroll-indicator', { opacity: 1, y: 0 });
      if (subtitleRef.current) subtitleRef.current.textContent = subtitleText;
      return;
    }

    const tl = gsap.timeline({ delay: 0.3 });

    // Step 1: Pre-title fades up
    tl.fromTo('.hero-pretitle',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    );

    // Step 1.5: Watermark fades in behind everything
    tl.fromTo('.hero-watermark',
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 2, ease: 'power2.out' },
      '-=0.2'
    );

    // Step 2: Name characters stagger in from below
    tl.fromTo('.hero-char',
      { y: '100%', opacity: 0 },
      { y: '0%', opacity: 1, duration: 0.8, stagger: 0.04, ease: 'power3.out' },
      '-=0.3'
    );

    // Step 3: Subtitle typewriter effect starts
    tl.add(() => {
      startTypewriter();
    }, '-=0.4');

    // Step 4: Location fades in
    tl.fromTo('.hero-location',
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.5 },
      '-=1.2'
    );

    // Step 5: CTA button fades up
    tl.fromTo('.hero-cta',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      '-=0.8'
    );

    // Step 6: Scroll indicator appears
    tl.fromTo('.scroll-indicator',
      { opacity: 0 },
      { opacity: 1, duration: 0.5 },
      '-=0.4'
    );

  }, { dependencies: [isLoading, prefersReducedMotion], scope: sectionRef });

  // Blinking cursor for typewriter
  useGSAP(() => {
    if (!cursorBlinkRef.current || prefersReducedMotion) return;
    gsap.fromTo(cursorBlinkRef.current,
      { opacity: 1 },
      { opacity: 0, duration: 0.8, repeat: -1, yoyo: true, ease: 'power1.inOut' }
    );
  }, { scope: sectionRef });

  // Scroll indicator bounce
  useGSAP(() => {
    if (prefersReducedMotion) return;
    gsap.to('.scroll-indicator-dot', {
      y: 16,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
    });
  }, { scope: sectionRef });

  const particleCount = isMobile ? 150 : 300;

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden flex items-center justify-center"
    >
      {/* 3D Background */}
      {!prefersReducedMotion ? (
        <HeroBackground particleCount={particleCount} />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#050505] to-[#0a0a0a]" />
      )}
      
      {/* Background Quote Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
        <h2 
          className="font-display text-[clamp(40px,8vw,140px)] font-bold uppercase leading-[1.1] text-center whitespace-nowrap opacity-0 hero-watermark transition-colors duration-700"
          style={{
            color: 'rgba(255,255,255,0.015)',
            WebkitTextStroke: '1px rgba(255,255,255,0.03)'
          }}
        >
          CODE IS POETRY.<br />
          SYSTEMS ARE ART.
        </h2>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 min-h-screen">

        {/* Pre-title Caption */}
        <p className="hero-pretitle opacity-0 text-[12px] uppercase tracking-[0.2em] font-medium text-[#666666] mb-6">
          SYSTEMS ARCHITECT &amp; FULL STACK DEVELOPER
        </p>

        {/* Main Name */}
        <h1 className="font-display text-[clamp(48px,8vw,96px)] font-bold leading-[1.0] text-white mb-6">
          {nameChars.map((char, i) => (
            <span key={i} className="inline-block overflow-hidden">
              <span className="inline-block hero-char opacity-0">
                {char === ' ' ? '\u00A0' : char}
              </span>
            </span>
          ))}
        </h1>

        {/* Subtitle with Typewriter */}
        <div className="flex items-center justify-center mb-4 h-[28px]">
          <span
            ref={subtitleRef}
            className="text-[16px] md:text-[18px] text-[#a0a0a0]"
          />
          <span
            ref={cursorBlinkRef}
            className="text-[18px] text-[#00d4ff] ml-[2px] font-light"
          >
            |
          </span>
        </div>

        {/* Location */}
        <p className="hero-location opacity-0 text-[12px] uppercase tracking-[0.1em] text-[#666666] mt-2">
          Based in Jamshedpur, India
        </p>

        {/* CTA Button */}
        <div className="hero-cta opacity-0 mt-12">
          <MagneticButton
            className="!bg-transparent !text-white border border-white/20 text-[14px] uppercase tracking-[0.05em] font-medium hover:!bg-[#00d4ff] hover:!text-black hover:!border-[#00d4ff]"
            onClick={() => {
              const el = document.querySelector('#system-architecture');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Explore My Work
          </MagneticButton>
        </div>

        {/* Scroll Indicator */}
        <div
          className="scroll-indicator opacity-0 absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center transition-opacity duration-500"
          style={{ opacity: isScrolled ? 0 : undefined }}
        >
          <span className="text-[10px] uppercase tracking-[0.15em] text-white/30 mb-3">SCROLL</span>
          <div className="w-[1px] h-[40px] bg-white/20 relative overflow-hidden rounded-full">
            <div className="scroll-indicator-dot absolute top-0 left-1/2 -translate-x-1/2 w-[4px] h-[4px] rounded-full bg-white/80" />
          </div>
        </div>
      </div>
    </section>
  );
}
