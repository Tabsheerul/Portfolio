'use client';

import { cn } from '@/lib/utils';

export default function NavLink({ href, isActive, children }) {
  
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
      href={href}
      onClick={handleClick}
      className={cn(
        "group relative text-[14px] font-medium uppercase tracking-[0.05em] transition-colors duration-300",
        isActive ? "text-white" : "text-[#a0a0a0] hover:text-white"
      )}
      data-cursor="hover"
    >
      {children}
      <span 
        className={cn(
          "absolute -bottom-[6px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#c084fc] transition-transform duration-300",
          isActive ? "scale-100" : "scale-0 group-hover:scale-100"
        )}
      />
    </a>
  );
}
