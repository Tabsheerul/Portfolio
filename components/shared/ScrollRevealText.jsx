'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollRevealText({
  text,
  type = 'words',
  as: Tag = 'p',
  className = '',
  delay = 0,
  stagger = 0.03,
  duration = 0.5,
  y = 40,
  triggerStart = 'top 75%',
  once = true,
}) {
  const containerRef = useRef(null);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      // Show immediately
      gsap.set(containerRef.current.querySelectorAll('.sr-el'), { opacity: 1, y: 0 });
      return;
    }

    const elements = containerRef.current.querySelectorAll('.sr-el');
    if (!elements.length) return;

    gsap.fromTo(elements,
      { y, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration,
        stagger,
        delay,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: triggerStart,
          toggleActions: once ? 'play none none none' : 'play reverse play reverse',
        }
      }
    );
  }, { scope: containerRef });

  let content;

  if (type === 'chars') {
    content = text.split('').map((char, i) => {
      if (char === ' ') return <span key={i}>&nbsp;</span>;
      return (
        <span key={i} className="inline-block overflow-hidden">
          <span className="sr-el inline-block opacity-0">{char}</span>
        </span>
      );
    });
  } else if (type === 'words') {
    content = text.split(' ').map((word, i) => (
      <span key={i} className="inline-block overflow-hidden mr-[0.28em]">
        <span className="sr-el inline-block opacity-0">{word}</span>
      </span>
    ));
  } else {
    // lines
    content = text.split('\n').map((line, i) => (
      <span key={i} className="block overflow-hidden">
        <span className="sr-el inline-block opacity-0">{line}</span>
      </span>
    ));
  }

  return (
    <Tag ref={containerRef} className={className}>
      {content}
    </Tag>
  );
}
