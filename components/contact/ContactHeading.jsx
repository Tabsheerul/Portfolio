'use client';

import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import StrokeRevealText from '@/components/shared/StrokeRevealText';

gsap.registerPlugin(ScrollTrigger);

export default function ContactHeading() {
  const containerRef = useRef(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useGSAP(() => {
    if (!containerRef.current || prefersReducedMotion) return;

    gsap.fromTo('.contact-caption',
      { y: 30, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: '.contact-caption', start: 'top 85%' },
      }
    );

    gsap.fromTo('.contact-subtitle',
      { y: 20, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: '.contact-subtitle', start: 'top 90%' },
      }
    );
  }, { scope: containerRef, dependencies: [prefersReducedMotion] });

  return (
    <div ref={containerRef} className="text-left md:text-center z-10 relative">
      <span className="badge-pill mb-6 inline-block contact-caption">05 / GET IN TOUCH</span>

      {/* LET'S TALK — stroke fill-on-scroll, centred on md+ */}
      <div className="flex md:justify-center">
        <StrokeRevealText
          text="LET'S TALK"
          as="h2"
          className="font-display text-[clamp(60px,12vw,180px)] font-bold uppercase leading-[1.0]"
          strokeColor="rgba(255,255,255,0.15)"
          fillColor="#ffffff"
          strokeWidth={1.5}
          start="top 85%"
          end="top 20%"
        />
      </div>

      <p className="contact-subtitle text-[16px] md:text-[18px] max-w-[560px] md:mx-auto mt-6 leading-relaxed" style={{ color: '#9b8fc4' }}>
        Have a project in mind or want to collaborate? I'm open to freelance opportunities and full-time roles.
      </p>
    </div>
  );
}
