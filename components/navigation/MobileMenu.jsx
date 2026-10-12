'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';

export default function MobileMenu() {
  const { isMenuOpen, closeMenu } = useAppStore();
  const menuRef = useRef(null);
  const linksRef = useRef([]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        closeMenu();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isMenuOpen, closeMenu]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';

      gsap.fromTo(
        linksRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out', delay: 0.1 }
      );
    } else {
      document.body.style.overflow = '';
      
      gsap.to(linksRef.current, {
        y: 20, opacity: 0, duration: 0.3, stagger: -0.05, ease: 'power2.in'
      });
    }
  }, [isMenuOpen]);

  const links = [
    { name: 'Work', href: '#projects-header' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills-header' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (e, target) => {
    e.preventDefault();
    closeMenu();
    
    // Wait for menu closing animation before scrolling
    setTimeout(() => {
      if (window.appLenis) {
        window.appLenis.scrollTo(target, { offset: -80 });
      } else {
        const el = document.querySelector(target);
        if (el) {
          const y = el.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }
    }, 400); // 400ms is enough to let the menu fade out mostly
  };

  return (
    <div
      ref={menuRef}
      className={cn(
        "fixed inset-0 z-[9997] flex flex-col items-center justify-center transition-all duration-500",
        isMenuOpen ? "opacity-100 pointer-events-auto visible" : "opacity-0 pointer-events-none invisible"
      )}
      style={{ background: '#0d0a1a' }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at center, rgba(168,85,247,0.07) 0%, transparent 60%)' }} />

      <nav className="flex flex-col items-center space-y-8">
        {links.map((link, i) => (
          <div key={link.name} className="overflow-hidden">
            <a
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              ref={el => linksRef.current[i] = el}
              className="inline-block font-display text-[48px] text-white hover:text-purple-400 transition-colors"
              data-cursor="hover"
            >
              {link.name}
            </a>
          </div>
        ))}
      </nav>
    </div>
  );
}
