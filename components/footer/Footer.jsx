'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import BackToTop from './BackToTop';
import FooterTagline from './FooterTagline';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef(null);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    if (window.appLenis) {
      window.appLenis.scrollTo(targetId, { offset: -80 });
    } else {
      const el = document.querySelector(targetId);
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !footerRef.current) return;

    gsap.fromTo('.footer-brand',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: footerRef.current, start: 'top 90%' } }
    );
    gsap.fromTo('.footer-link-column',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out', scrollTrigger: { trigger: footerRef.current, start: 'top 85%' } }
    );
    gsap.fromTo('.footer-tagline',
      { opacity: 0, scale: 0.98 },
      { opacity: 1, scale: 1, duration: 1, ease: 'power2.out', scrollTrigger: { trigger: '.footer-tagline', start: 'top 90%' } }
    );
  }, { scope: footerRef });

  return (
    <footer id="footer" ref={footerRef} className="py-16 border-t border-purple-500/10 relative z-20" style={{ background: '#0d0a1a' }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        
        {/* Top Row: Brand & Links */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-8">
          
          {/* Brand & Location */}
          <div className="footer-brand max-w-[300px]">
            <h2 className="font-display text-[18px] font-bold text-white mb-2 tracking-[0.05em]">T.HAFEEZ</h2>
            <p className="text-[13px] text-[#666666] leading-relaxed">Full Stack Developer & Systems Architect</p>
            <p className="text-[13px] text-[#666666] leading-relaxed mt-1">Jamshedpur, Jharkhand, India</p>
          </div>

          {/* Navigation Columns */}
          <nav className="w-full lg:w-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16" aria-label="Footer navigation">
            {/* SITE */}
            <div className="footer-link-column">
              <h3 className="text-[11px] uppercase tracking-[0.1em] text-white font-semibold mb-4">Site</h3>
              <ul className="space-y-3">
                <li><a href="#" onClick={(e) => handleNavClick(e, '#home')} className="text-[13px] text-[#666666] hover:text-purple-300 transition-colors duration-200 focus:outline-none focus:text-white" data-cursor="hover">Home</a></li>
                <li><a href="#projects-header" onClick={(e) => handleNavClick(e, '#projects-header')} className="text-[13px] text-[#666666] hover:text-purple-300 transition-colors duration-200 focus:outline-none focus:text-white" data-cursor="hover">Work</a></li>
                <li><a href="#about" onClick={(e) => handleNavClick(e, '#about')} className="text-[13px] text-[#666666] hover:text-purple-300 transition-colors duration-200 focus:outline-none focus:text-white" data-cursor="hover">About</a></li>
                <li><a href="#skills-header" onClick={(e) => handleNavClick(e, '#skills-header')} className="text-[13px] text-[#666666] hover:text-purple-300 transition-colors duration-200 focus:outline-none focus:text-white" data-cursor="hover">Skills</a></li>
                <li><a href="#contact" onClick={(e) => handleNavClick(e, '#contact')} className="text-[13px] text-[#666666] hover:text-purple-300 transition-colors duration-200 focus:outline-none focus:text-white" data-cursor="hover">Contact</a></li>
              </ul>
            </div>

            {/* SOCIAL */}
            <div className="footer-link-column">
              <h3 className="text-[11px] uppercase tracking-[0.1em] text-white font-semibold mb-4">Social</h3>
              <ul className="space-y-3">
                <li><a href="https://github.com/Tabsheerul" target="_blank" rel="noopener noreferrer" className="text-[13px] text-[#666666] hover:text-white transition-colors duration-200 focus:outline-none focus:text-white" data-cursor="hover">GitHub</a></li>
                <li><a href="#" target="_blank" rel="noopener noreferrer" className="text-[13px] text-[#666666] hover:text-white transition-colors duration-200 focus:outline-none focus:text-white" data-cursor="hover">LinkedIn</a></li>
              </ul>
            </div>

            {/* CONNECT */}
            <div className="footer-link-column">
              <h3 className="text-[11px] uppercase tracking-[0.1em] text-white font-semibold mb-4">Connect</h3>
              <ul className="space-y-3">
                <li><a href="mailto:tabsheerul07@gmail.com" className="text-[13px] text-[#666666] hover:text-white transition-colors duration-200 focus:outline-none focus:text-white" data-cursor="hover">Email</a></li>
                <li><a href="tel:+918102623810" className="text-[13px] text-[#666666] hover:text-white transition-colors duration-200 focus:outline-none focus:text-white" data-cursor="hover">Phone</a></li>
              </ul>
            </div>

            {/* RESOURCES */}
            <div className="footer-link-column">
              <h3 className="text-[11px] uppercase tracking-[0.1em] text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-[13px] text-[#666666] hover:text-white transition-colors duration-200 focus:outline-none focus:text-white" data-cursor="hover">Resume</a></li>
              </ul>
            </div>
          </nav>
        </div>

        {/* Middle Tagline */}
        <FooterTagline />

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mt-8 pt-8 border-t border-white/[0.04]">
          <p className="text-[12px] text-[#666666]">
            &copy; {new Date().getFullYear()} Tabsheerul Hafeez. All rights reserved.
          </p>
          
          <div className="hidden md:block w-1 h-1 rounded-full bg-[#c084fc] opacity-60" aria-hidden="true" />
          
          <BackToTop />
        </div>

      </div>
    </footer>
  );
}
