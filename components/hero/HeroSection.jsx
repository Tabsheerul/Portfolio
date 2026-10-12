'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import dynamic from 'next/dynamic';
import { useAppStore } from '@/lib/store';
import MagneticButton from '@/components/shared/MagneticButton';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const HeroBackground = dynamic(() => import('./HeroBackground'), { ssr: false });

export default function HeroSection() {
  const sectionRef = useRef(null);
  const cursorBlinkRef = useRef(null);
  const isLoading = useAppStore((s) => s.isLoading);
  const isScrolled = useAppStore((s) => s.isScrolled);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const subtitleText = 'I build scalable end-to-end applications';

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
        setTimeout(type, 48);
      }
    };
    type();
  }, []);

  // Hero entrance timeline
  useGSAP(() => {
    if (isLoading) return;

    if (prefersReducedMotion) {
      gsap.set('.hero-pretitle, .hero-char, .hero-location, .hero-cta, .scroll-indicator', { opacity: 1, y: 0 });
      gsap.set('.subtitle-char', { display: 'inline-block' });
      return;
    }

    const tl = gsap.timeline({ delay: 0.3 });

    tl.fromTo('.hero-pretitle',
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }
    );

    tl.fromTo('.hero-char',
      { y: '110%', opacity: 0 },
      { y: '0%', opacity: 1, duration: 0.9, stagger: 0.035, ease: 'power3.out' },
      '-=0.4'
    );

    tl.add(() => { startTypewriter(); }, '-=0.3');

    tl.fromTo('.hero-location',
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.5 },
      '-=1.0'
    );

    tl.fromTo('.hero-cta',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      '-=0.6'
    );

    tl.fromTo('.scroll-indicator',
      { opacity: 0 },
      { opacity: 1, duration: 0.5 },
      '-=0.3'
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

  // Mouse physics — letters + other text elements dodge the cursor
  useGSAP(() => {
    if (prefersReducedMotion || isMobile) return;

    const chars = sectionRef.current.querySelectorAll('.hero-char-repel, .hero-repel-element');

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      chars.forEach((char) => {
        const rect = char.getBoundingClientRect();
        const charX = rect.left + rect.width / 2;
        const charY = rect.top + rect.height / 2;
        const dx = clientX - charX;
        const dy = clientY - charY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 120;

        if (dist < maxDist) {
          const force = (maxDist - dist) / maxDist;
          const angle = Math.atan2(dy, dx);
          gsap.to(char, {
            x: -Math.cos(angle) * force * 38,
            y: -Math.sin(angle) * force * 38,
            rotation: -Math.cos(angle) * force * 12,
            scale: 1 + force * 0.12,
            duration: 0.4,
            ease: 'power3.out'
          });
        } else if (gsap.getProperty(char, 'x') !== 0) {
          gsap.to(char, {
            x: 0, y: 0, rotation: 0, scale: 1,
            duration: 0.7, ease: 'elastic.out(1, 0.4)'
          });
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, { scope: sectionRef, dependencies: [prefersReducedMotion, isMobile] });

  // Main heading lines — mixed editorial style like Emotion Agency:
  // italic serif + bold uppercase alternating
  const line1 = 'Where'; // italic serif
  const line2 = 'CODE MEETS';
  const line3 = 'CRAFT';

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden flex items-end justify-start"
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

      {/* Content — bottom-left editorial layout like Emotion Agency */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-12 pb-16 md:pb-24">

        {/* Caption — monospace uppercase small */}
        <div className="hero-pretitle opacity-0 mb-6">
          <span className="caption-mono text-[#6b5f8a]">
            {'FULL STACK DEVELOPER & SYSTEMS ARCHITECT'.split('').map((char, i) => (
              <span key={i} className="hero-repel-element inline-block origin-center" style={{ willChange: 'transform' }}>
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </span>
        </div>

        {/* Hero Headline — editorial mix: italic serif + bold uppercase */}
        <h1 className="font-display leading-[0.95] mb-8" style={{ perspective: '800px' }}>
          {/* Line 1: italic serif "Where" */}
          <div className="block overflow-visible mb-1">
            <span
              className="inline-block"
              style={{
                fontFamily: 'var(--font-playfair), Georgia, serif',
                fontStyle: 'italic',
                fontWeight: 400,
                fontSize: 'clamp(64px, 10vw, 140px)',
                color: '#f0eeff',
                lineHeight: 1,
              }}
            >
              {line1.split('').map((char, i) => (
                <span key={i} className="inline-block overflow-hidden">
                  <span className="inline-block hero-char-repel origin-center" style={{ willChange: 'transform' }}>
                    <span className="inline-block hero-char opacity-0">{char}</span>
                  </span>
                </span>
              ))}
            </span>
          </div>

          {/* Line 2: bold uppercase "CODE MEETS" */}
          <div className="block overflow-visible mb-1">
            <span
              className="inline-block"
              style={{
                fontFamily: 'var(--font-space-grotesk), sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(54px, 9vw, 130px)',
                color: '#f0eeff',
                letterSpacing: '-0.02em',
                lineHeight: 1,
              }}
            >
              {line2.split('').map((char, i) => (
                <span key={i} className="inline-block overflow-hidden">
                  <span className="inline-block hero-char-repel origin-center" style={{ willChange: 'transform' }}>
                    <span className="inline-block hero-char opacity-0">
                      {char === ' ' ? '\u00A0' : char}
                    </span>
                  </span>
                </span>
              ))}
            </span>
          </div>

          {/* Line 3: "CRAFT" — large bold + purple accent arrow */}
          <div className="block overflow-visible flex items-center gap-4">
            <span
              className="inline-block"
              style={{
                fontFamily: 'var(--font-space-grotesk), sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(54px, 9vw, 130px)',
                color: '#a855f7',
                letterSpacing: '-0.02em',
                lineHeight: 1,
              }}
            >
              {line3.split('').map((char, i) => (
                <span key={i} className="inline-block overflow-hidden">
                  <span className="inline-block hero-char-repel origin-center" style={{ willChange: 'transform' }}>
                    <span className="inline-block hero-char opacity-0">{char}</span>
                  </span>
                </span>
              ))}
            </span>
          </div>
        </h1>

        {/* Typewriter subtitle */}
        <div className="flex items-center mb-8 h-[28px]">
          <div className="flex items-center">
            {subtitleText.split('').map((char, i) => (
              <span
                key={i}
                className="hero-repel-element subtitle-char origin-center text-[16px] md:text-[18px]"
                style={{
                  willChange: 'transform',
                  display: 'none',
                  color: '#9b8fc4',
                  fontFamily: 'var(--font-inter), sans-serif',
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
            <span
              ref={cursorBlinkRef}
              className="text-[18px] ml-[2px] font-light"
              style={{ color: '#a855f7' }}
            >
              |
            </span>
          </div>
        </div>

        {/* Location */}
        <div className="hero-location opacity-0 mb-8">
          <span className="caption-mono" style={{ color: '#6b5f8a' }}>
            {'Based in Jamshedpur, India'.split('').map((char, i) => (
              <span key={i} className="hero-repel-element inline-block origin-center" style={{ willChange: 'transform' }}>
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </span>
        </div>

        {/* CTA */}
        <div className="hero-cta opacity-0">
          <MagneticButton
            className="!bg-transparent border text-[13px] uppercase tracking-[0.08em] font-medium"
            style={{
              color: '#f0eeff',
              borderColor: 'rgba(168,85,247,0.4)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(168,85,247,0.2)';
              e.currentTarget.style.borderColor = '#a855f7';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(168,85,247,0.4)';
            }}
            onClick={() => {
              const el = document.querySelector('#projects-header');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Explore My Work
          </MagneticButton>
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
