'use client';

export default function BackToTop() {
  const handleBackToTop = () => {
    if (window.appLenis) {
      window.appLenis.scrollTo(0, { 
        duration: 1.5, 
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) 
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <button
      onClick={handleBackToTop}
      className="group flex items-center gap-2 text-[12px] uppercase tracking-[0.1em] text-[#666666] hover:text-white transition-colors duration-300 focus:outline-none"
      data-cursor="hover"
      aria-label="Scroll back to top"
    >
      BACK TO TOP
      <svg 
        width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        className="transition-transform duration-300 group-hover:-translate-y-1"
        aria-hidden="true"
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
