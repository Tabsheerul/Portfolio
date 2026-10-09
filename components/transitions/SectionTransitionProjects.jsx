'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function SectionTransitionProjects() {
  const sectionRef = useRef(null);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=100%',
        pin: true,
        scrub: 1,
      },
    });

    tl.fromTo('.transition-projects-line',
      { y: 150, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.3, stagger: 0.1, ease: 'none' }
    );

    tl.to('.transition-projects-line', {
      letterSpacing: '0.2em',
      opacity: 0.1,
      scale: 1.05,
      duration: 0.4,
      ease: 'none',
    }, '+=0.1');

    tl.to('.transition-projects-line', {
      y: -80,
      opacity: 0,
      duration: 0.2,
      ease: 'none',
    });
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="section-transition-projects h-screen bg-[#050505] flex items-center justify-center overflow-hidden relative z-10"
    >
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span
          className="text-[20vw] font-display font-bold uppercase leading-none"
          style={{ color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.03)' }}
          aria-hidden="true"
        >
          SKILLS
        </span>
      </div>

      <div className="relative z-10 text-center" aria-hidden="true">
        <div className="overflow-hidden">
          <span className="transition-projects-line block font-display text-[clamp(60px,12vw,160px)] font-bold uppercase text-white leading-[1.0]">
            TOOLS I
          </span>
        </div>
        <div className="overflow-hidden">
          <span className="transition-projects-line block font-display text-[clamp(60px,12vw,160px)] font-bold uppercase text-white leading-[1.0]">
            BUILD WITH
          </span>
        </div>
      </div>
    </section>
  );
}
