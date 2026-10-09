'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function AnimatedText({ 
  text, 
  type = 'chars', 
  animation = 'fadeUp', 
  className = '' 
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const elements = gsap.utils.toArray('.anim-element');
      
      let vars = {};
      if (animation === 'fadeUp') {
        vars = {
          y: 40,
          opacity: 0,
          duration: 0.6,
          stagger: 0.02,
          ease: 'power2.out',
        };
      } else if (animation === 'fadeIn') {
        vars = {
          opacity: 0,
          duration: 0.6,
          stagger: 0.02,
          ease: 'power2.out',
        };
      } else if (animation === 'slideUp') {
        vars = {
          y: 40,
          duration: 0.6,
          stagger: 0.02,
          ease: 'power2.out',
        };
      }

      gsap.from(elements, {
        ...vars,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [animation]);

  // Split logic
  const content = [];
  if (type === 'chars') {
    text.split('').forEach((char, i) => {
      if (char === ' ') {
        content.push(<span key={i}>&nbsp;</span>);
      } else {
        content.push(
          <span key={i} className="inline-block overflow-hidden">
            <span className="anim-element inline-block">{char}</span>
          </span>
        );
      }
    });
  } else if (type === 'words') {
    text.split(' ').forEach((word, i) => {
      content.push(
        <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
          <span className="anim-element inline-block">{word}</span>
        </span>
      );
    });
  } else {
    // lines not fully implemented for dynamic wrapping in this simple version, fallback to block
    content.push(
      <span key={0} className="inline-block overflow-hidden">
        <span className="anim-element inline-block">{text}</span>
      </span>
    );
  }

  return (
    <div ref={containerRef} className={className}>
      {content}
    </div>
  );
}
