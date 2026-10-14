'use client';

import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import AboutText from './AboutText';
import StatCard from './StatCard';
import GlassCard from '@/components/shared/GlassCard';

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const sectionRef = useRef(null);
  const badgeRef = useRef(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  // Caption + info cards + badge entrance
  useGSAP(() => {
    if (prefersReducedMotion) return;

    gsap.fromTo('.about-caption',
      { y: 30, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: '.about-caption', start: 'top 85%' },
      }
    );

    // Info cards stagger
    gsap.fromTo('.about-info-card',
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: 'power2.out',
        scrollTrigger: { trigger: '.about-info-grid', start: 'top 80%' },
      }
    );

    // Stat cards stagger
    gsap.fromTo('.stat-card',
      { y: 50, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: '.stat-grid', start: 'top 75%' },
      }
    );
  }, { scope: sectionRef, dependencies: [prefersReducedMotion] });

  // Availability badge pulse
  useGSAP(() => {
    if (!badgeRef.current || prefersReducedMotion) return;

    gsap.to(badgeRef.current, {
      scale: 1.02,
      duration: 2,
      yoyo: true,
      repeat: -1,
      ease: 'power1.inOut',
    });
  }, { scope: sectionRef, dependencies: [prefersReducedMotion] });

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
      style={{ background: '#0d0a1a' }}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-16 items-start">

          {/* ─── Left Column: About Text ─── */}
          <div>
            <span className="badge-pill mb-6 inline-block">02 / ABOUT ME</span>

            <AboutText />

            {/* Info cards grid */}
            <div className="about-info-grid grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12">

              {/* Education */}
              <div className="about-info-card">
                <GlassCard className="flex items-start gap-4 p-5">
                  {/* Graduation Cap icon inline SVG */}
                  <div className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(168,85,247,0.12)' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                      <path d="M6 12v5c3 3 9 3 12 0v-5" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-[15px] font-semibold text-white mb-1">B.Tech Computer Science</h4>
                    <p className="text-[13px] text-[#a0a0a0]">Jharkhand University of Technology, 2022 – 2026</p>
                  </div>
                </GlassCard>
              </div>

              {/* Location */}
              <div className="about-info-card">
                <GlassCard className="flex items-start gap-4 p-5">
                  <div className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(168,85,247,0.12)' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-[15px] font-semibold text-white mb-1">Jamshedpur, Jharkhand</h4>
                    <p className="text-[13px] text-[#a0a0a0]">India</p>
                  </div>
                </GlassCard>
              </div>
            </div>

            {/* Availability Badge */}
            <div className="mt-8">
              <span
                ref={badgeRef}
                className="inline-block text-[12px] uppercase tracking-[0.1em] font-medium rounded-full px-4 py-2"
                style={{ color: '#c084fc', background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.3)' }}
              >
                ● OPEN FOR OPPORTUNITIES
              </span>
            </div>
          </div>

          {/* ─── Right Column: Stat Cards ─── */}
          <div className="stat-grid grid grid-cols-2 gap-4">
            <StatCard number="10+" label="Projects Delivered" delay={0} />
            <StatCard number="7+" label="Core Technologies" delay={0.1} />
            <StatCard number="3+" label="Years of Code" delay={0.2} />
            <StatCard number="100%" label="Commitment" delay={0.3} />
          </div>
        </div>
      </div>
    </section>
  );
}
