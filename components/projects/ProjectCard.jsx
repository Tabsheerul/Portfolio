'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import ProjectImage from './ProjectImage';
import MagneticButton from '@/components/shared/MagneticButton';

gsap.registerPlugin(ScrollTrigger);

// Inline GitHub icon
const GithubIconPath =
  'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22';

export default function ProjectCard({ project, isReversed }) {
  const cardRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);
  const borderRef = useRef(null);

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
    tl.fromTo(
      borderRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 0.8, ease: 'power2.inOut', transformOrigin: 'left center' },
      0
    );

    // Image slides in smoothly
    const imageDirection = isReversed ? 50 : -50;
    tl.fromTo(
      imageRef.current,
      { x: imageDirection, opacity: 0, scale: 0.96 },
      { x: 0, opacity: 1, scale: 1, duration: 1, ease: 'power3.out' },
      0.1
    );

    // Content stagger
    const contentItems = contentRef.current?.querySelectorAll('.project-animate-item') ?? [];
    if (contentItems.length > 0) {
      tl.fromTo(
        contentItems,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' },
        '-=0.7'
      );
    }
  }, { scope: cardRef });

  const imageCol = isReversed
    ? 'lg:col-start-7 lg:col-span-6'
    : 'lg:col-start-1 lg:col-span-6';
  const contentCol = isReversed
    ? 'lg:col-start-1 lg:col-span-5 lg:row-start-1'
    : 'lg:col-start-8 lg:col-span-5';

  const projectUrl = project.githubUrl || project.liveUrl || 'https://github.com/Tabsheerul';

  return (
    <article
      ref={cardRef}
      className="relative mb-[140px] md:mb-[180px] pt-12"
      aria-label={`Project: ${project.title}`}
    >
      {/* Top clean border line */}
      <div
        ref={borderRef}
        className="absolute top-0 left-0 right-0 h-[1px] bg-white/[0.08] origin-left"
      />

      {/* Project number watermark tag */}
      <span className="absolute -top-[10px] left-0 bg-[#140d27] pr-5 text-[11px] uppercase tracking-[0.2em] text-purple-400 font-mono">
        PROJECT /{project.number}
      </span>

      {/* Spacious 12-column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        {/* Visual / Image Side */}
        <div ref={imageRef} className={`${imageCol} relative group`}>
          {/* Ambient background glow */}
          <div
            className="absolute inset-0 -inset-x-4 rounded-2xl blur-[70px] opacity-20 pointer-events-none transition-opacity duration-700 group-hover:opacity-35"
            style={{
              background: `radial-gradient(circle, ${project.accentColor} 0%, transparent 70%)`,
            }}
          />
          <ProjectImage project={project} isReversed={isReversed} />
        </div>

        {/* Content Side — Clean, uncluttered & spacious */}
        <div ref={contentRef} className={contentCol}>
          {/* Category & Date Row */}
          <div className="project-animate-item flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: project.accentColor,
                  boxShadow: `0 0 8px ${project.accentColor}`,
                }}
              />
              <span className="text-[12px] uppercase tracking-wider text-purple-300/80 font-mono">
                {project.type}
              </span>
            </div>
            <span className="text-[12px] font-mono text-gray-500">
              {project.date}
            </span>
          </div>

          {/* Project Title */}
          <h3 className="project-animate-item font-display text-[clamp(28px,3.2vw,44px)] font-bold text-white leading-[1.15] mb-4">
            {project.title}
          </h3>

          {/* Crisp, Short Description */}
          <p className="project-animate-item text-[15px] md:text-[16px] text-gray-300/80 leading-relaxed font-light mb-8 max-w-[460px]">
            {project.description}
          </p>

          {/* Core Tech Stack (Only 4 key pillars, sleek & airy) */}
          <div className="project-animate-item flex flex-wrap gap-2 mb-10">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center gap-1.5 text-[12px] font-mono text-gray-300 bg-white/[0.03] border border-white/[0.08] rounded-full px-3.5 py-1.5 transition-all duration-300 hover:border-purple-400/50 hover:bg-purple-500/10 hover:text-white"
              >
                <span
                  className="w-1 h-1 rounded-full opacity-60"
                  style={{ backgroundColor: project.accentColor }}
                />
                {tech}
              </span>
            ))}
          </div>

          {/* Single Clean Magnetic Action Button */}
          <div className="project-animate-item flex items-center gap-4">
            <a
              href={projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex"
            >
              <MagneticButton
                className="!bg-transparent !text-white !border !border-white/20 !text-[12px] !font-mono !uppercase !tracking-wider !px-6 !py-3 rounded-full hover:!border-purple-400 hover:!shadow-lg hover:!shadow-purple-500/20 transition-all flex items-center gap-2.5"
                data-cursor="hover"
              >
                {project.githubUrl ? (
                  <>
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d={GithubIconPath} />
                    </svg>
                    <span>View Repository ↗</span>
                  </>
                ) : (
                  <>
                    <span>View Project ↗</span>
                  </>
                )}
              </MagneticButton>
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
