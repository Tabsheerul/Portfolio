'use client';

import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import ScrollRevealText from '@/components/shared/ScrollRevealText';

gsap.registerPlugin(ScrollTrigger);

// Stats data for the freelance project
const stats = [
  { raw: 50, display: '50km', suffix: '', label: 'Service Radius', isNumeric: false },
  { raw: null, display: 'Real-Time', suffix: '', label: 'Booking Dispatch', isNumeric: false },
  { raw: null, display: 'SEO', suffix: '', label: 'Optimized', isNumeric: false },
];

function FreelanceStat({ stat }) {
  const statRef = useRef(null);

  return (
    <div ref={statRef} className="text-center">
      <div
        className="font-display text-[28px] md:text-[32px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-purple-300 to-fuchsia-400 mb-1"
        aria-label={`${stat.display} ${stat.label}`}
      >
        {stat.display}
      </div>
      <div className="text-[11px] uppercase tracking-[0.1em] text-[#666666]">
        {stat.label}
      </div>
    </div>
  );
}

export default function FreelanceImpact() {
  const sectionRef = useRef(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useGSAP(() => {
    if (prefersReducedMotion) return;

    // Attribution fade in
    gsap.fromTo('.freelance-attribution',
      { y: 20, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: '.freelance-attribution', start: 'top 85%' },
      }
    );

    // Stats row fade in
    gsap.fromTo('.freelance-stat',
      { y: 30, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: '.freelance-stats-row', start: 'top 85%' },
      }
    );

    // Divider lines
    gsap.fromTo('.freelance-divider',
      { scaleX: 0 },
      {
        scaleX: 1, duration: 0.8, ease: 'power2.inOut',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      }
    );
  }, { scope: sectionRef, dependencies: [prefersReducedMotion] });

  return (
    <section
      id="freelance-impact"
      ref={sectionRef}
      className="py-32 relative"
      style={{ background: '#0d0a1a' }}
    >
      {/* Top accent line */}
      <div
        className="freelance-divider absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent origin-left"
      />

      <div className="max-w-[1000px] mx-auto px-6 lg:px-12 text-center">

        {/* Caption */}
        <span className="badge-pill mb-8 inline-block">
          COMMERCIAL FREELANCE WORK
        </span>

        {/* Large quote — word-by-word reveal */}
        <ScrollRevealText
          text="Delivered a production-ready travel platform that optimized Core Web Vitals, integrated real-time maps, and drove measurable business growth for a commercial client."
          type="words"
          as="blockquote"
          className="font-display text-[clamp(22px,3.5vw,40px)] font-medium text-white leading-[1.4] mb-10"
          stagger={0.03}
          y={30}
          triggerStart="top 75%"
        />

        {/* Attribution */}
        <div className="freelance-attribution mb-12">
          <p className="text-[14px] font-semibold text-white">Hindustan Tour &amp; Travels</p>
          <p className="text-[13px] text-[#666666] uppercase tracking-[0.05em] mt-1">
            Commercial Freelance Project — Jamshedpur, India
          </p>
        </div>

        {/* Thin divider */}
        <div className="w-full h-[1px] bg-white/[0.06] mb-12" />

        {/* Stats row */}
        <div className="freelance-stats-row flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16">
          {stats.map((stat) => (
            <div key={stat.label} className="freelance-stat">
              <FreelanceStat stat={stat} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
