'use client';

import { useRef } from 'react';

export default function FooterTagline() {
  const containerRef = useRef(null);

  return (
    <div 
      ref={containerRef}
      className="footer-tagline my-12 md:my-20 text-center select-none"
      aria-hidden="true"
    >
      <h2 
        className="font-display text-[clamp(32px,5vw,72px)] font-bold uppercase leading-[1.1] transition-colors duration-700"
        style={{
          color: 'rgba(168,85,247,0.03)',
          WebkitTextStroke: '1px rgba(168,85,247,0.12)'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(168,85,247,0.08)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(168,85,247,0.03)'; }}
      >
        CODE IS <span className="font-serif italic font-normal">POETRY.</span><br />
        SYSTEMS ARE <span className="font-serif italic font-normal">ART.</span>
      </h2>
    </div>
  );
}
