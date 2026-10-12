'use client';

import { useRef, useState, useId } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import ProjectImage from './ProjectImage';
import MagneticButton from '@/components/shared/MagneticButton';

gsap.registerPlugin(ScrollTrigger);

// Inline GitHub icon SVG path (Lucide Github)
const GithubIconPath = 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22';

export default function ProjectCard({ project, isReversed }) {
  const cardRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);
  const borderRef = useRef(null);
  const highlightsRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const highlightsId = useId();

  // Scroll entrance animation
  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      gsap.set([imageRef.current, contentRef.current], { opacity: 1, x: 0, scale: 1, y: 0 });
      gsap.set(borderRef.current, { scaleX: 1 });
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: cardRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });

    // Border line draws from left
    tl.fromTo(borderRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 0.8, ease: 'power2.inOut', transformOrigin: 'left center' },
      0
    );

    // Image slides in from outer side
    const imageDirection = isReversed ? 60 : -60;
    tl.fromTo(imageRef.current,
      { x: imageDirection, opacity: 0, scale: 0.95 },
      { x: 0, opacity: 1, scale: 1, duration: 1, ease: 'power3.out' },
      0.1
    );

    // Content elements stagger in
    const contentItems = contentRef.current?.querySelectorAll('.project-animate-item') ?? [];
    if (contentItems.length > 0) {
      tl.fromTo(contentItems,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power2.out' },
        '-=0.7'
      );
    }
  }, { scope: cardRef });

  // Toggle highlights expand/collapse
  const toggleHighlights = () => {
    const el = highlightsRef.current;
    if (!el) return;

    if (!expanded) {
      // Measure natural height before expansion
      el.style.display = 'block';
      const fullHeight = el.scrollHeight;
      gsap.fromTo(el,
        { height: 0, opacity: 0 },
        { height: fullHeight, opacity: 1, duration: 0.4, ease: 'power2.out', onComplete: () => { el.style.height = 'auto'; } }
      );
      setExpanded(true);
    } else {
      const fullHeight = el.scrollHeight;
      gsap.fromTo(el,
        { height: fullHeight, opacity: 1 },
        { height: 0, opacity: 0, duration: 0.35, ease: 'power2.in', onComplete: () => { el.style.display = 'none'; } }
      );
      setExpanded(false);
    }
  };

  const imageCol = isReversed
    ? 'lg:col-start-7 lg:col-span-6'
    : 'lg:col-start-1 lg:col-span-7';
  const contentCol = isReversed
    ? 'lg:col-start-1 lg:col-span-6 lg:row-start-1'
    : 'lg:col-start-8 lg:col-span-5';

  return (
    <article
      ref={cardRef}
      className="relative mb-[120px] pt-10"
      aria-label={`Project: ${project.title}`}
    >
      {/* Top border line */}
      <div
        ref={borderRef}
        className="absolute top-0 left-0 right-0 h-[1px] bg-white/[0.06] origin-left"
      />

      {/* Project number label that breaks the border */}
      <span className="absolute -top-[11px] left-0 bg-[#140d27] pr-4 text-[11px] uppercase tracking-[0.15em] text-[#a78bfa] font-mono">
        PRJCT /{project.number}
      </span>

      {/* Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">

        {/* Image side */}
        <div ref={imageRef} className={imageCol}>
          <ProjectImage project={project} isReversed={isReversed} />
        </div>

        {/* Content side */}
        <div ref={contentRef} className={contentCol}>

          {/* Type & date row */}
          <div className="project-animate-item flex items-center gap-4 mb-4">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: project.accentColor }}
            />
            <span className="text-[11px] uppercase tracking-[0.05em] text-[#666666] font-mono">
              {project.type}
            </span>
            <span className="text-[11px] uppercase tracking-[0.05em] text-[#666666] font-mono ml-auto">
              {project.date}
            </span>
          </div>

          {/* Title */}
          <h3
            className="project-animate-item font-display text-[clamp(24px,3vw,44px)] font-bold text-white leading-tight mb-4 transition-colors duration-300"
            style={{ '--accent': project.accentColor }}
          >
            {project.title}
          </h3>

          {/* Description */}
          <p className="project-animate-item text-[15px] md:text-[16px] text-[#a0a0a0] leading-relaxed mb-6 max-w-[480px]">
            {project.description}
          </p>

          {/* Scope tags */}
          <div className="project-animate-item flex flex-wrap gap-2 mb-4">
            {project.scope.map((tag) => (
              <span
                key={tag}
                className="text-[11px] uppercase tracking-[0.05em] text-[#a0a0a0] border border-white/10 rounded px-3 py-1"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Tech stack pills */}
          <div className="project-animate-item flex flex-wrap gap-2 mb-6">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="text-[11px] font-medium text-white bg-white/5 border border-white/[0.08] rounded-full px-[10px] py-[4px] transition-all duration-200"
                style={{
                  '--tw-border-opacity': 1,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${project.accentColor}26`;
                  e.currentTarget.style.borderColor = `${project.accentColor}4d`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '';
                  e.currentTarget.style.borderColor = '';
                }}
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Expandable highlights */}
          <div className="project-animate-item mb-6">
            <button
              onClick={toggleHighlights}
              aria-expanded={expanded}
              aria-controls={highlightsId}
              className="flex items-center gap-2 text-[13px] font-medium text-[#a0a0a0] hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-[#140d27] rounded"
            >
              <span
                className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center text-[14px] transition-transform duration-300"
                style={{ transform: expanded ? 'rotate(45deg)' : 'rotate(0deg)' }}
              >
                +
              </span>
              {expanded ? 'Hide Highlights' : 'View Highlights'}
            </button>

            <div
              id={highlightsId}
              ref={highlightsRef}
              style={{ height: 0, overflow: 'hidden', display: 'none', opacity: 0 }}
            >
              <ul className="mt-4 space-y-3">
                {project.highlights.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-[14px] text-[#a0a0a0] leading-relaxed">
                    <span style={{ color: project.accentColor }} className="mt-1 shrink-0 text-[10px]">▶</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action buttons */}
          <div className="project-animate-item flex flex-wrap gap-3">
            <MagneticButton
              className="!bg-transparent !text-white !border !border-white/20 !text-[13px] !uppercase !tracking-[0.05em] !font-medium !px-6 !py-3 hover:!text-black"
              style={{ '--hover-bg': project.accentColor }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = project.accentColor; e.currentTarget.style.borderColor = project.accentColor; e.currentTarget.style.color = '#000'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.borderColor = ''; e.currentTarget.style.color = ''; }}
              data-cursor="hover"
            >
              View Case Study
            </MagneticButton>

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.05em] font-medium text-[#a0a0a0] border border-white/10 rounded-full px-5 py-3 hover:text-white hover:border-purple-400/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-[#140d27]"
                data-cursor="hover"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d={GithubIconPath} />
                </svg>
                GitHub
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
