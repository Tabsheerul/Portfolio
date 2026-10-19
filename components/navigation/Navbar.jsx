'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import NavLink from './NavLink';

export default function Navbar() {
  const navRef = useRef(null);
  const logoRef = useRef(null);
  const { scrollDirection, isScrolled, toggleMenu, isMenuOpen } = useAppStore();
  const [activeSection, setActiveSection] = useState('');
  
  useScrollDirection();

  useEffect(() => {
    // Hide / Show on Scroll
    if (navRef.current) {
      if (scrollDirection === 'down' && isScrolled && !isMenuOpen) {
        gsap.to(navRef.current, { yPercent: -100, duration: 0.4, ease: 'power2.out' });
      } else {
        gsap.to(navRef.current, { yPercent: 0, duration: 0.4, ease: 'power2.out' });
      }
    }
  }, [scrollDirection, isScrolled, isMenuOpen]);

  useEffect(() => {
    if (!logoRef.current) return;
    
    // Split text manually for logo animation
    const text = "TABSHEERUL HAFEEZ";
    logoRef.current.innerHTML = '';
    
    text.split('').forEach((char) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.style.display = 'inline-block';
      if (char === ' ') {
        span.style.width = '0.3em';
      }
      logoRef.current.appendChild(span);
    });

    const chars = logoRef.current.children;
    
    const handleMouseEnter = () => {
      gsap.to(chars, {
        y: -2,
        stagger: 0.02,
        duration: 0.2,
        ease: 'power1.out',
        yoyo: true,
        repeat: 1
      });
    };

    const logoEl = logoRef.current;
    logoEl.addEventListener('mouseenter', handleMouseEnter);
    
    return () => {
      logoEl.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  // Intersection Observer for Active Section
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(`#${entry.target.id}`);
        }
      });
    }, { rootMargin: '-20% 0px -80% 0px' }); // Trigger when section is near top

    const sections = document.querySelectorAll('section[id]');
    sections.forEach(sec => observer.observe(sec));

    return () => observer.disconnect();
  }, []);

  const handleLogoClick = (e) => {
    e.preventDefault();
    if (window.appLenis) {
      window.appLenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header 
      ref={navRef}
      className={cn(
        "fixed top-0 left-0 right-0 w-full z-[9996] transition-all duration-300",
        "h-[64px] lg:h-[80px]",
        isScrolled 
          ? "bg-[rgba(13,10,26,0.85)] backdrop-blur-[12px] border-b border-[rgba(168,85,247,0.12)]" 
          : "bg-transparent border-transparent"
      )}
    >
      <div className="max-w-[1400px] h-full mx-auto px-6 lg:px-12 flex items-center justify-between">
        
        {/* Logo */}
        <a 
          href="/" 
          onClick={handleLogoClick}
          className="relative z-[9999]"
          data-cursor="hover"
        >
          <span 
            ref={logoRef} 
            className="font-display text-[15px] md:text-[17px] font-bold uppercase tracking-wider text-white"
          >
            TABSHEERUL HAFEEZ
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-3">
          <NavLink href="#projects-header" isActive={activeSection === '#projects-header'}>Work</NavLink>
          <NavLink href="#about" isActive={activeSection === '#about'}>About</NavLink>
          <NavLink href="#skills-header" isActive={activeSection === '#skills-header'}>Skills</NavLink>
          <NavLink href="#contact" isButton={true} isActive={activeSection === '#contact'}>Let's Talk</NavLink>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden relative z-[9999] w-8 h-8 flex flex-col items-center justify-center space-y-[6px]"
          onClick={toggleMenu}
          data-cursor="hover"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          <span 
            className={cn(
              "w-[24px] h-[2px] bg-white transition-transform duration-300 origin-center",
              isMenuOpen ? "rotate-45 translate-y-[4px]" : ""
            )}
          />
          <span 
            className={cn(
              "w-[24px] h-[2px] bg-white transition-transform duration-300 origin-center",
              isMenuOpen ? "-rotate-45 -translate-y-[4px]" : ""
            )}
          />
        </button>

      </div>
    </header>
  );
}
