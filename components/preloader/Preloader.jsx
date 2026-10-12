'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useAppStore } from '@/lib/store';

export default function Preloader() {
  const containerRef = useRef(null);
  const { setIsLoading, setLoadingProgress } = useAppStore();
  const name = "TABSHEERUL HAFEEZ";

  useEffect(() => {
    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setIsLoading(false);
      return;
    }

    // Lock scroll
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          document.documentElement.style.overflow = '';
          document.body.style.overflow = '';
          setIsLoading(false);
        }
      });

      // Phase 1: Name characters stagger in (starts at 0s)
      tl.fromTo('.preloader-char', 
        { y: '100%', opacity: 0 },
        { y: '0%', opacity: 1, duration: 0.8, stagger: 0.03, ease: 'power3.out' }
      );

      // Phase 2: Progress counter and bar appear (starts at 0.5s)
      tl.fromTo('.preloader-progress-container',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5 },
        0.5
      );

      // Bar fill animation (starts at 0.5s, lasts 2.5s)
      tl.fromTo('.preloader-bar-fill',
        { scaleX: 0 },
        { scaleX: 1, duration: 2.5, ease: 'power1.inOut' },
        0.5
      );

      // Counter number animation using a proxy object
      const counterObj = { val: 0 };
      tl.to(counterObj, {
        val: 100,
        duration: 2.5,
        ease: 'power1.inOut',
        onUpdate: () => {
          const val = Math.floor(counterObj.val);
          setLoadingProgress(val);
          const progressEl = document.querySelector('.preloader-counter');
          if (progressEl) {
            progressEl.textContent = val.toString().padStart(3, '0') + '%';
          }
        }
      }, 0.5);

      // Phase 3: Subtitle fade in (starts at 2s)
      tl.fromTo('.preloader-subtitle',
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
        2
      );

      // Phase 4: Exit animation (starts at 3s)
      // Content fades and moves up
      tl.to('.preloader-content', {
        y: -50,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.in'
      }, 3.0); // start slightly after phase 3 completes

      // Background slides up and away
      tl.to('.preloader-bg', {
        yPercent: -100,
        duration: 0.8,
        ease: 'power4.inOut'
      }, 3.1);

    }, containerRef);

    return () => {
      ctx.revert();
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [setIsLoading, setLoadingProgress]);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[9999] pointer-events-none preloader-bg flex items-center justify-center" style={{ background: '#0d0a1a' }}>
      <div className="preloader-content flex flex-col items-center">
        {/* Name Reveal */}
        <div className="flex space-x-[2px] overflow-hidden mb-8">
          {name.split('').map((char, i) => (
            <span key={i} className="inline-block overflow-hidden">
              <span className="preloader-char inline-block font-display text-[48px] font-semibold text-white">
                {char === ' ' ? '\u00A0' : char}
              </span>
            </span>
          ))}
        </div>

        {/* Progress Container */}
        <div className="preloader-progress-container flex flex-col items-center opacity-0">
          <div className="preloader-counter font-mono text-[14px] text-[#666666] mb-2">
            000%
          </div>
          
          <div className="w-[200px] h-[1px] overflow-hidden mb-4" style={{ background: 'rgba(168,85,247,0.15)' }}>
            <div className="preloader-bar-fill w-full h-full origin-left scale-x-0" style={{ background: 'linear-gradient(90deg, #7c3aed, #a855f7, #e879f9)' }} />
          </div>

          <div className="preloader-subtitle text-[12px] uppercase tracking-[0.1em] text-[#a0a0a0] opacity-0">
            FULL STACK DEVELOPER / SYSTEMS ARCHITECT
          </div>
        </div>
      </div>
    </div>
  );
}
