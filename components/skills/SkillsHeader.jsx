'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import StrokeRevealText from '@/components/shared/StrokeRevealText';
import ScrubRevealText from '@/components/shared/ScrubRevealText';

gsap.registerPlugin(ScrollTrigger);

export default function SkillsHeader() {
  const sectionRef = useRef(null);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    gsap.fromTo('.skills-caption',
      { y: 30, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: '.skills-caption', start: 'top 85%' },
      }
    );

    gsap.fromTo('.skills-subtitle',
      { y: 20, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.5, ease: 'power2.out',
        scrollTrigger: { trigger: '.skills-subtitle', start: 'top 85%' },
      }
    );
  }, { scope: sectionRef });

  return (
    <section
      id="skills-header"
      ref={sectionRef}
      className="py-24"
      style={{ background: '#0d0a1a' }}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <span className="badge-pill mb-6 inline-block skills-caption">04 / TECH STACK</span>

        <div className="mb-6">
          <StrokeRevealText
            text="WHAT I BUILD WITH"
            as="h2"
            className="font-display text-[clamp(40px,6vw,80px)] font-bold uppercase leading-[1.0]"
            strokeColor="rgba(255,255,255,0.2)"
            fillColor="#ffffff"
            strokeWidth={1}
            start="top 85%"
            end="top 45%"
          />
        </div>

        <ScrubRevealText
          text="Technologies I use to turn ideas into scalable, production-ready systems."
          as="p"
          className="text-[16px] md:text-[18px] max-w-[520px] leading-relaxed skills-subtitle"
          dimColor="rgba(255,255,255,0.12)"
          brightColor="rgba(255,255,255,0.75)"
          start="top 85%"
          end="bottom 40%"
          scrub={1.5}
        />
      </div>
    </section>
  );
}
