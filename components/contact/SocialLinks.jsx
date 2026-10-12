'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const ICONS = {
  Github: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22',
  Linkedin: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 2a2 2 0 1 1-2 2 2 2 0 0 1 2-2z',
  Twitter: 'M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z',
  Mail: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6',
  FileText: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8',
};

const socialLinks = [
  { name: 'GitHub', url: 'https://github.com/Tabsheerul', icon: 'Github' },
  { name: 'LinkedIn', url: '#', icon: 'Linkedin' },
  { name: 'Email', url: 'mailto:tabsheerul07@gmail.com', icon: 'Mail' },
  { name: 'Resume', url: '#', icon: 'FileText' },
];

export default function SocialLinks() {
  const containerRef = useRef(null);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !containerRef.current) return;

    gsap.fromTo('.social-link-item',
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.06,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 90%',
          once: true
        }
      }
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="mt-16 flex flex-row flex-wrap justify-center gap-3 md:gap-4 z-10 relative">
      {socialLinks.map((link) => {
        const isExternal = link.url.startsWith('http');
        return (
          <a
            key={link.name}
            href={link.url}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            className="social-link-item flex items-center gap-2 px-6 py-3 border border-white/10 rounded-full bg-transparent transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400 group"
            data-cursor="hover"
            aria-label={`Visit ${link.name}`}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.4)';
              e.currentTarget.style.backgroundColor = 'rgba(168, 85, 247, 0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '';
              e.currentTarget.style.backgroundColor = '';
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#a0a0a0] group-hover:text-purple-400 transition-colors duration-300"
              aria-hidden="true"
            >
              <path d={ICONS[link.icon]} />
            </svg>
            <span className="text-[13px] font-medium text-white">
              {link.name}
            </span>
          </a>
        );
      })}
    </div>
  );
}
