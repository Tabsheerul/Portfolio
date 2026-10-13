'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { cn } from '@/lib/utils';

export default function NavLink({ href, isActive, children, isButton = false, className = '' }) {
  const linkRef = useRef(null);

  // Magnetic hover tracking (matches MagneticButton physics)
  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || window.matchMedia('(hover: none)').matches;
    if (isTouchDevice) return;

    const el = linkRef.current;
    if (!el) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.8, ease: "elastic.out(1, 0.3)" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.8, ease: "elastic.out(1, 0.3)" });

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { height, width, left, top } = el.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
      xTo(x * 0.32);
      yTo(y * 0.32);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    if (window.appLenis) {
      window.appLenis.scrollTo(href, { offset: -80 });
    } else {
      const el = document.querySelector(href);
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  return (
    <a 
      ref={linkRef}
      href={href}
      onClick={handleClick}
      className={cn(
        "relative inline-flex items-center justify-center text-[13px] font-medium uppercase tracking-[0.06em] rounded-full transition-all duration-300 select-none",
        isButton
          ? "px-5 py-2 bg-transparent border border-white/20 text-white hover:bg-[#a855f7] hover:border-[#a855f7] hover:text-white hover:shadow-[0_0_22px_rgba(168,85,247,0.4)]"
          : "px-3.5 py-1.5 border border-transparent text-[#9b8fc4] hover:border-purple-500/40 hover:bg-[#a855f7] hover:text-white hover:shadow-[0_0_18px_rgba(168,85,247,0.35)]",
        isActive && !isButton && "border-[rgba(168,85,247,0.25)] bg-[rgba(168,85,247,0.12)] text-white",
        className
      )}
      data-cursor="hover"
    >
      {children}
    </a>
  );
}
