'use client';

import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import GlassCard from '@/components/shared/GlassCard';

gsap.registerPlugin(ScrollTrigger);

export default function StatCard({ number, label, delay = 0 }) {
  const cardRef = useRef(null);
  const numberRef = useRef(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useGSAP(() => {
    if (!numberRef.current || !cardRef.current) return;

    // Parse number: extracts numeric part and suffix like '+' or '%'
    const numericValue = parseInt(number);
    const suffix = number.replace(/[0-9]/g, '');

    if (prefersReducedMotion) {
      numberRef.current.textContent = numericValue + suffix;
      return;
    }

    const obj = { val: 0 };

    gsap.to(obj, {
      val: numericValue,
      duration: 2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: cardRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
      onUpdate: () => {
        const rounded = Math.floor(obj.val);
        numberRef.current.textContent = rounded + suffix;
      },
    });
  }, { scope: cardRef, dependencies: [number, prefersReducedMotion] });

  return (
    <div ref={cardRef} className="stat-card" style={{ '--delay': `${delay}s` }}>
      <GlassCard className="flex flex-col justify-center min-h-[160px] p-8 text-center">
        <span
          ref={numberRef}
          className="font-display text-[48px] md:text-[56px] font-bold text-white mb-2 leading-none"
          aria-label={`${number} ${label}`}
        >
          0
        </span>
        <span className="text-[13px] uppercase tracking-[0.1em] text-[#a0a0a0] font-medium">
          {label}
        </span>
      </GlassCard>
    </div>
  );
}
