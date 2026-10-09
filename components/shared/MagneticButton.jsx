'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function MagneticButton({ children, className, ...props }) {
  const buttonRef = useRef(null);
  
  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || window.matchMedia('(hover: none)').matches;
    if (isTouchDevice) return;

    const button = buttonRef.current;
    if (!button) return;

    const xTo = gsap.quickTo(button, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
    const yTo = gsap.quickTo(button, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { height, width, left, top } = button.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
      
      // Movement strength 0.3
      xTo(x * 0.3);
      yTo(y * 0.3);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    button.addEventListener("mousemove", handleMouseMove);
    button.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      button.removeEventListener("mousemove", handleMouseMove);
      button.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <button
      ref={buttonRef}
      className={`relative inline-flex items-center justify-center px-8 py-4 rounded-full bg-white text-black font-medium hover:bg-[#00d4ff] hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#00d4ff] focus:ring-offset-2 focus:ring-offset-black ${className}`}
      data-cursor="hover"
      {...props}
    >
      {children}
    </button>
  );
}
