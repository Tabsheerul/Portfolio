'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';

export default function PageTransition({ children }) {
  const pathname = usePathname();
  const transitionRef = useRef(null);
  const containerRef = useRef(null);
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // IN - cover screen
      tl.set('.transition-panel', { yPercent: 100 });
      tl.to('.transition-panel', {
        yPercent: 0,
        duration: 0.6,
        stagger: 0.05,
        ease: 'power4.inOut'
      });
      
      tl.fromTo('.transition-text', 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.3 },
        '-=0.3'
      );

      // OUT - reveal page
      tl.to('.transition-text', { opacity: 0, duration: 0.2, delay: 0.2 });
      tl.to('.transition-panel', {
        yPercent: -100,
        duration: 0.6,
        stagger: -0.05, // reverse stagger
        ease: 'power4.inOut'
      });
      
      // Reset position after animation finishes so it doesn't block interactions
      tl.set('.transition-panel', { yPercent: 100 });

    }, transitionRef);

    return () => ctx.revert();
  }, [pathname]);

  return (
    <>
      <div 
        ref={transitionRef} 
        className="fixed inset-0 z-[9995] pointer-events-none flex"
      >
        <div className="transition-panel w-1/4 h-full bg-[#0a0a0a] translate-y-full" />
        <div className="transition-panel w-1/4 h-full bg-[#0a0a0a] translate-y-full" />
        <div className="transition-panel w-1/4 h-full bg-[#0a0a0a] translate-y-full" />
        <div className="transition-panel w-1/4 h-full bg-[#0a0a0a] translate-y-full" />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="transition-text font-display text-[24px] text-white opacity-0">
            T.HAFEEZ
          </span>
        </div>
      </div>
      
      {/* Container for page content to ensure remount if needed, but App router handles this in template.js */}
      <div ref={containerRef}>
        {children}
      </div>
    </>
  );
}
