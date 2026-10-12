'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Link from 'next/link';
import MagneticButton from '@/components/shared/MagneticButton';

export default function NotFound() {
  const containerRef = useRef(null);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !containerRef.current) return;

    gsap.fromTo('.not-found-404',
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1, ease: 'power3.out' }
    );
    
    gsap.fromTo('.not-found-content',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, delay: 0.3, ease: 'power2.out' }
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative z-10 overflow-hidden" style={{ background: '#0d0a1a' }}>
      
      {/* 404 Text */}
      <h1 
        className="not-found-404 font-display text-[clamp(100px,20vw,280px)] font-bold leading-none mb-6 select-none"
        style={{
          color: 'transparent',
          WebkitTextStroke: '2px rgba(168,85,247,0.2)'
        }}
      >
        404
      </h1>

      {/* Content */}
      <div className="not-found-content flex flex-col items-center">
        <h2 className="text-[24px] font-semibold text-white mb-2">
          PAGE NOT FOUND
        </h2>
        <p className="text-[16px] text-[#a0a0a0] max-w-[400px] mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Link href="/" tabIndex={-1}>
          <MagneticButton
            className="!bg-transparent !border !border-white/20 hover:!bg-[#a855f7] hover:!border-[#a855f7] hover:!text-white !text-[13px] !uppercase !tracking-[0.05em] !font-medium !px-8 !py-4 transition-all duration-300"
            data-cursor="hover"
          >
            BACK TO HOME
          </MagneticButton>
        </Link>
      </div>

    </div>
  );
}
