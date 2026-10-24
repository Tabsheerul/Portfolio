'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import dynamic from 'next/dynamic';
import { useAppStore } from '@/lib/store';
import MagneticButton from '@/components/shared/MagneticButton';
import VenomButton from '@/components/ui/VenomButton';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const HeroBackground = dynamic(() => import('./HeroBackground'), { ssr: false });

export default function HeroSection() {
  const sectionRef = useRef(null);
  const cursorBlinkRef = useRef(null);
  const isLoading = useAppStore((s) => s.isLoading);
  const isScrolled = useAppStore((s) => s.isScrolled);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const roleWords = ['Engineering', 'distributed', 'backends', '&', 'high-performance', 'web', 'apps'];
  const subtitleWords = [
    'Crafting', 'scalable', 'distributed', 'systems', 'and', 'bespoke', 'web', 'applications', 'from', 'scratch'
  ];

  useEffect(() => {
    setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  // Typewriter — reveals hidden letter spans one by one
  const startTypewriter = useCallback(() => {
    const chars = sectionRef.current?.querySelectorAll('.subtitle-char');
    if (!chars || chars.length === 0) return;
    let i = 0;
    const type = () => {
      if (i < chars.length) {
        chars[i].style.display = 'inline-block';
        i++;
        setTimeout(type, 45);
      }
    };
    type();
  }, []);

  // Hero entrance timeline
  useGSAP(() => {
    if (isLoading) return;

    if (prefersReducedMotion) {
      gsap.set('.hero-pretitle, .hero-char, .hero-role-title, .hero-cta, .scroll-indicator', { opacity: 1, y: 0 });
      gsap.set('.subtitle-char', { display: 'inline-block' });
      return;
    }

    const tl = gsap.timeline({ delay: 0.3 });

    tl.fromTo('.hero-pretitle',
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }
    );

    tl.fromTo('.hero-char',
      { y: 45, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.85, stagger: 0.03, ease: 'power3.out' },
      '-=0.4'
    );

    tl.fromTo('.hero-role-title',
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      '-=0.3'
    );

    tl.add(() => { startTypewriter(); }, '-=0.2');

    tl.fromTo('.hero-cta',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      '-=0.2'
    );

    tl.fromTo('.scroll-indicator',
      { opacity: 0 },
      { opacity: 1, duration: 0.5 },
      '-=0.2'
    );
  }, { dependencies: [isLoading, prefersReducedMotion], scope: sectionRef });

  // Blinking cursor
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
      y: 16, duration: 1, repeat: -1, yoyo: true, ease: 'power1.inOut',
    });
  }, { scope: sectionRef });

  // Mouse physics — letters + dot have dynamic repulsion; bio words have subtle magnetic dodge
  useGSAP(() => {
    if (prefersReducedMotion || isMobile) return;

    const majorChars = sectionRef.current.querySelectorAll('.hero-char-repel');
    const subtleWords = sectionRef.current.querySelectorAll('.hero-subtle-repel');

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;

      // 1. Monumental name letters + punctuation dot (full dynamic repulsion)
      majorChars.forEach((char) => {
        const rect = char.getBoundingClientRect();
        const charX = rect.left + rect.width / 2;
        const charY = rect.top + rect.height / 2;
        const dx = clientX - charX;
        const dy = clientY - charY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 125;

        if (dist < maxDist) {
          const force = (maxDist - dist) / maxDist;
          const angle = Math.atan2(dy, dx);
          gsap.to(char, {
            x: -Math.cos(angle) * force * 38,
            y: -Math.sin(angle) * force * 38,
            rotation: -Math.cos(angle) * force * 10,
            scale: 1 + force * 0.12,
            zIndex: 20,
            duration: 0.4,
            ease: 'power3.out'
          });
        } else if (gsap.getProperty(char, 'x') !== 0) {
          gsap.to(char, {
            x: 0, y: 0, rotation: 0, scale: 1,
            zIndex: 1,
            duration: 0.7, ease: 'elastic.out(1, 0.4)'
          });
        }
      });

      // 2. Subtle bio text words (gentle magnetic dodge, never scrambles or flies away)
      subtleWords.forEach((word) => {
        const rect = word.getBoundingClientRect();
        const wordX = rect.left + rect.width / 2;
        const wordY = rect.top + rect.height / 2;
        const dx = clientX - wordX;
        const dy = clientY - wordY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 80;

        if (dist < maxDist) {
          const force = (maxDist - dist) / maxDist;
          const angle = Math.atan2(dy, dx);
          gsap.to(word, {
            x: -Math.cos(angle) * force * 12,
            y: -Math.sin(angle) * force * 8,
            rotation: -Math.cos(angle) * force * 2.5,
            scale: 1 + force * 0.04,
            zIndex: 10,
            duration: 0.35,
            ease: 'power2.out'
          });
        } else if (gsap.getProperty(word, 'x') !== 0) {
          gsap.to(word, {
            x: 0, y: 0, rotation: 0, scale: 1,
            zIndex: 1,
            duration: 0.6, ease: 'elastic.out(1, 0.5)'
          });
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, { scope: sectionRef, dependencies: [prefersReducedMotion, isMobile] });

  // Main heading — The developer's name as the monumental headline
  const line1 = 'TABSHEERUL';
  const line2 = 'HAFEEZ';

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden flex flex-col justify-center"
    >
      {/* Purple particle orb background */}
      <div className="absolute inset-0 z-0">
        {!prefersReducedMotion ? (
          <HeroBackground />
        ) : (
          <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #1c1235 0%, #0d0a1a 60%)' }} />
        )}
      </div>

      {/* Ambient cosmic nebula glow */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: 'radial-gradient(ellipse 85% 65% at 50% 35%, rgba(168, 85, 247, 0.12) 0%, rgba(124, 58, 237, 0.04) 55%, transparent 75%)',
        }}
        aria-hidden="true"
      />

      {/* Content — editorial layout with centered vertical rhythm */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-12 pt-20 md:pt-24 pb-6 md:pb-8">

        {/* Eyebrow Status Badge */}
        <div className="hero-pretitle opacity-0 mb-4 flex items-center flex-wrap gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md shadow-[0_4px_25px_rgba(168,85,247,0.12)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="font-mono text-[11px] md:text-[12px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
              Available for Projects
            </span>
          </div>

          <span className="w-8 h-[1px] bg-purple-500/30 hidden sm:inline-block" />

          <span className="text-[11px] font-mono tracking-[0.16em] text-[#9b8fc4] uppercase hidden sm:inline-block">
            Full Stack Developer &amp; Systems Architect
          </span>
        </div>

        {/* Hero Headline — The Developer's Name as the Monumental Centerpiece */}
        <h1 className="font-display leading-[0.90] mb-5 md:mb-6" style={{ perspective: '800px' }}>
          {/* Line 1: "TABSHEERUL" */}
          <div className="block overflow-visible mb-1">
            <span
              className="inline-block"
              style={{
                fontFamily: 'var(--font-space-grotesk), sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(52px, 8.5vw, 128px)',
                color: '#f0eeff',
                letterSpacing: '-0.02em',
                lineHeight: 1,
              }}
            >
              {line1.split('').map((char, i) => (
                <span key={i} className="inline-block overflow-visible relative">
                  <span className="inline-block hero-char-repel origin-center relative" style={{ willChange: 'transform' }}>
                    <span className="inline-block hero-char opacity-0">{char}</span>
                  </span>
                </span>
              ))}
            </span>
          </div>

          {/* Line 2: "HAFEEZ" */}
          <div className="block overflow-visible flex items-center gap-3 md:gap-4">
            <span
              className="inline-block overflow-visible"
              style={{
                fontFamily: 'var(--font-space-grotesk), sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(52px, 8.5vw, 128px)',
                color: '#a855f7',
                letterSpacing: '-0.02em',
                lineHeight: 1,
                textShadow: '0 0 45px rgba(168, 85, 247, 0.3)',
              }}
            >
              {line2.split('').map((char, i) => (
                <span key={i} className="inline-block overflow-visible relative">
                  <span className="inline-block hero-char-repel origin-center relative" style={{ willChange: 'transform' }}>
                    <span className="inline-block hero-char opacity-0">{char}</span>
                  </span>
                </span>
              ))}
            </span>
            <span className="inline-block overflow-visible relative">
              <span
                id="hero-dot-repel"
                className="inline-block hero-char-repel origin-center relative cursor-default p-2 -m-2"
                style={{ willChange: 'transform' }}
              >
                <span className="inline-block hero-char opacity-0">
                  <span className="w-3.5 h-3.5 md:w-4 md:h-4 rounded-full bg-purple-400 block shadow-[0_0_18px_#a855f7]" />
                </span>
              </span>
            </span>
          </div>
        </h1>

        {/* Solo Coder Bio & Tagline */}
        <div className="max-w-[720px] mt-2 mb-6">
          {/* Role Header */}
          <div className="hero-role-title opacity-0 text-[18px] sm:text-[20px] md:text-[22px] font-display font-semibold text-white tracking-tight leading-snug mb-2.5 flex items-center flex-wrap gap-y-1">
            {roleWords.map((word, i) => (
              <span
                key={i}
                className="inline-block hero-subtle-repel relative origin-center"
                style={{ willChange: 'transform', marginRight: '0.38em' }}
              >
                {word}
              </span>
            ))}
          </div>

          {/* Typewriter Subtitle */}
          <div className="flex items-center min-h-[26px]">
            <div className="flex items-center flex-wrap">
              {subtitleWords.map((word, wIdx) => (
                <span
                  key={wIdx}
                  className="inline-block hero-subtle-repel relative origin-center"
                  style={{ willChange: 'transform', marginRight: '0.38em' }}
                >
                  {word.split('').map((char, cIdx) => (
                    <span
                      key={cIdx}
                      className="subtitle-char origin-center text-[15px] md:text-[17px]"
                      style={{
                        display: 'none',
                        color: '#9b8fc4',
                        fontFamily: 'var(--font-inter), sans-serif',
                      }}
                    >
                      {char}
                    </span>
                  ))}
                </span>
              ))}
              <span
                ref={cursorBlinkRef}
                className="text-[17px] ml-[2px] font-light inline-block"
                style={{ color: '#a855f7' }}
              >
                |
              </span>
            </div>
          </div>

          {/* Solo Coder Meta */}
          <div className="flex items-center gap-3 mt-3 text-[12px] font-mono text-[#6b5f8a]">
            <span className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              Jamshedpur, India
            </span>
            <span>•</span>
            <span className="text-[#9b8fc4]">Solo Developer</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="hero-cta opacity-0 flex flex-wrap items-center gap-3.5 mt-8">
          <VenomButton
            label="Explore My Work"
            theme="transparent"
            color="purple"
            cursor="native"
            inline={true}
            bleed={50}
            bleedY={36}
            strands={6}
            sense={180}
            reach={90}
            release={150}
            onClick={() => {
              const el = document.querySelector('#projects-header');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          <button
            className="px-6 py-3.5 rounded-full border border-white/15 bg-white/[0.02] hover:bg-white/[0.06] hover:border-purple-400/50 text-[12.5px] uppercase tracking-[0.08em] font-medium text-[#f0eeff] transition-all duration-300 backdrop-blur-sm"
            data-cursor="hover"
            onClick={() => {
              const el = document.querySelector('#contact');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Let&apos;s Connect
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        className="scroll-indicator opacity-0 absolute bottom-10 right-12 flex flex-col items-center transition-opacity duration-500"
        style={{ opacity: isScrolled ? 0 : undefined }}
      >
        <span className="caption-mono mb-3" style={{ color: '#6b5f8a' }}>SCROLL</span>
        <div className="w-[1px] h-[40px] relative overflow-hidden rounded-full" style={{ background: 'rgba(168,85,247,0.2)' }}>
          <div className="scroll-indicator-dot absolute top-0 left-1/2 -translate-x-1/2 w-[4px] h-[4px] rounded-full" style={{ background: '#a855f7' }} />
        </div>
      </div>
    </section>
  );
}
