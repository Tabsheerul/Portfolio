'use client';

import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function SkillBar({ name, level, description, accentColor, delay = 0 }) {
  const fillRef = useRef(null);
  const percentRef = useRef(null);
  const containerRef = useRef(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useGSAP(() => {
    if (!fillRef.current || !percentRef.current) return;

    if (prefersReducedMotion) {
      // Show fully filled immediately
      gsap.set(fillRef.current, { scaleX: level / 100, transformOrigin: 'left center' });
      percentRef.current.textContent = level + '%';
      return;
    }

    // Animate fill bar
    gsap.fromTo(fillRef.current,
      { scaleX: 0 },
      {
        scaleX: level / 100,
        duration: 1.2,
        ease: 'power3.out',
        delay,
        transformOrigin: 'left center',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );

    // Animate percentage counter
    const obj = { val: 0 };
    gsap.to(obj, {
      val: level,
      duration: 1.2,
      ease: 'power3.out',
      delay,
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      onUpdate: () => {
        if (percentRef.current) {
          percentRef.current.textContent = Math.floor(obj.val) + '%';
        }
      },
    });
  }, { scope: containerRef, dependencies: [level, delay, prefersReducedMotion] });

  return (
    <div ref={containerRef} className="mb-5">
      {/* Name + percentage row */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-[14px] font-medium text-white">{name}</span>
        <span
          ref={percentRef}
          className="text-[12px] font-mono"
          style={{ color: accentColor }}
          aria-hidden="true"
        >
          0%
        </span>
      </div>

      {/* Description */}
      <p className="text-[11px] text-[#666666] mb-2 leading-relaxed">{description}</p>

      {/* Progress bar */}
      <div
        className="w-full h-[3px] bg-white/[0.06] rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={level}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${name} proficiency ${level} percent`}
      >
        <div
          ref={fillRef}
          className="h-full rounded-full origin-left"
          style={{
            backgroundColor: accentColor,
            transform: 'scaleX(0)',
            transformOrigin: 'left center',
          }}
        />
      </div>
    </div>
  );
}
