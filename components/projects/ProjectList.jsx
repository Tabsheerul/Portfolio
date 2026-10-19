'use client';

import { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { projects } from '@/lib/projectsData';
import ProjectCard from './ProjectCard';

gsap.registerPlugin(ScrollTrigger);

export default function ProjectList() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const scrollTriggerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    // Amount to slide: total track width minus one viewport width
    const getScrollAmount = () => -(track.scrollWidth - window.innerWidth);

    const tween = gsap.to(track, {
      x: getScrollAmount,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${Math.abs(getScrollAmount())}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const rawIndex = self.progress * (projects.length - 1);
          const idx = Math.min(
            projects.length - 1,
            Math.max(0, Math.round(rawIndex))
          );
          setActiveIndex(idx);
        },
      },
    });

    scrollTriggerRef.current = tween.scrollTrigger;
  }, { scope: sectionRef });

  // Smooth click navigation to jump to a specific slide
  const scrollToProject = (targetIndex) => {
    const st = scrollTriggerRef.current;
    if (!st) return;
    const clamped = Math.max(0, Math.min(projects.length - 1, targetIndex));
    const progress = clamped / (projects.length - 1);
    const targetScroll = st.start + progress * (st.end - st.start);
    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth',
    });
  };

  const activeProject = projects[activeIndex] || projects[0];

  return (
    <section
      ref={sectionRef}
      id="projects-list"
      className="relative"
      style={{ background: '#140d27' }}
    >
      {/* Horizontal scrolling track — overflows intentionally (clipped by GSAP pin wrapper) */}
      <div
        ref={trackRef}
        className="flex items-stretch"
        style={{
          width: `${projects.length * 100}vw`,
          minHeight: '100vh',
          willChange: 'transform',
        }}
      >
        {projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            total={projects.length}
          />
        ))}
      </div>

      {/* Advanced Floating Slider Indicator Dock (Pinned at bottom of viewport) */}
      <div
        className="absolute bottom-8 md:bottom-10 left-1/2 -translate-x-1/2 z-30 pointer-events-auto select-none"
        aria-label="Projects slider navigation"
      >
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-[#0d0a1a]/85 backdrop-blur-xl border border-white/10 shadow-[0_12px_36px_rgba(0,0,0,0.6)] transition-all duration-300 hover:border-white/20">
          {/* Previous Arrow Button */}
          <button
            type="button"
            onClick={() => scrollToProject(activeIndex - 1)}
            disabled={activeIndex === 0}
            aria-label="Previous project"
            data-cursor="hover"
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
              activeIndex === 0
                ? 'text-white/20 cursor-not-allowed'
                : 'text-white/80 hover:text-white hover:bg-white/10 active:scale-95'
            }`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Interactive Slide Segment Pills */}
          <div className="flex items-center gap-2.5 px-1">
            {projects.map((proj, i) => {
              const isActive = i === activeIndex;
              return (
                <button
                  key={proj.id}
                  type="button"
                  onClick={() => scrollToProject(i)}
                  aria-label={`Go to slide ${i + 1}: ${proj.title}`}
                  data-cursor="hover"
                  className="relative group py-1.5 focus:outline-none"
                >
                  <span
                    className="block rounded-full transition-all duration-400 ease-out"
                    style={{
                      width: isActive ? '28px' : '7px',
                      height: '7px',
                      backgroundColor: isActive ? proj.accentColor : 'rgba(255,255,255,0.2)',
                      boxShadow: isActive ? `0 0 14px ${proj.accentColor}` : 'none',
                    }}
                  />

                  {/* Tooltip on Hover showing Project Title */}
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 rounded-md bg-[#0d0a1a] border border-white/15 text-[10px] font-mono text-white whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-xl">
                    {proj.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Next Arrow Button */}
          <button
            type="button"
            onClick={() => scrollToProject(activeIndex + 1)}
            disabled={activeIndex === projects.length - 1}
            aria-label="Next project"
            data-cursor="hover"
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
              activeIndex === projects.length - 1
                ? 'text-white/20 cursor-not-allowed'
                : 'text-white/80 hover:text-white hover:bg-white/10 active:scale-95'
            }`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
