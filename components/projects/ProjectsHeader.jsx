'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import StrokeRevealText from '@/components/shared/StrokeRevealText';
import ScrubRevealText from '@/components/shared/ScrubRevealText';

gsap.registerPlugin(ScrollTrigger);

export default function ProjectsHeader() {
  const sectionRef = useRef(null);
  const arrowsRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    });

    tl.fromTo('.projects-caption',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
    );

    tl.fromTo('.projects-subtitle',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
      '-=0.2'
    );

    // Continuous arrow animation
    if (arrowsRef.current) {
      gsap.to(arrowsRef.current, {
        x: 10,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });
    }
  }, { scope: sectionRef });

  return (
    <section
      id="projects-header"
      ref={sectionRef}
      className="py-24 bg-[#050505]"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <p className="projects-caption text-[12px] uppercase tracking-[0.1em] text-[#00d4ff] font-medium mb-6">
          03 / SELECTED WORKS
        </p>

        {/* Title row — stroke-to-fill scroll reveal */}
        <div className="flex flex-wrap items-center gap-x-4 mb-6">
          <StrokeRevealText
            text="SOME OF MY"
            as="span"
            className="font-display text-[clamp(40px,6vw,80px)] font-bold uppercase leading-[1.0] whitespace-nowrap"
            strokeColor="rgba(255,255,255,0.22)"
            fillColor="#ffffff"
            strokeWidth={1}
            start="top 85%"
            end="top 45%"
          />
          <span
            ref={arrowsRef}
            className="inline-block font-display text-[clamp(40px,6vw,80px)] font-bold text-[#00d4ff] leading-[1.0] select-none"
          >
            ⟶⟶
          </span>
          <StrokeRevealText
            text="PROJECTS"
            as="span"
            className="font-display text-[clamp(40px,6vw,80px)] font-bold uppercase leading-[1.0] whitespace-nowrap"
            strokeColor="rgba(255,255,255,0.22)"
            fillColor="#ffffff"
            strokeWidth={1}
            start="top 80%"
            end="top 40%"
          />
        </div>

        <ScrubRevealText
          text="A selection of projects where design, backend architecture, and AI-driven intelligence come together."
          as="p"
          className="text-[16px] md:text-[18px] max-w-[560px] leading-relaxed projects-subtitle"
          dimColor="rgba(255,255,255,0.12)"
          brightColor="rgba(255,255,255,0.75)"
          start="top 85%"
          end="bottom 50%"
          scrub={1.5}
        />
      </div>
    </section>
  );
}
