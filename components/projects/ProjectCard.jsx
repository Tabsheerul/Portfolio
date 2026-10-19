'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import ProjectImage from './ProjectImage';
import MagneticButton from '@/components/shared/MagneticButton';

gsap.registerPlugin(ScrollTrigger);

const GithubIconPath =
  'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22';

export default function ProjectCard({ project, index, total }) {
  const cardRef = useRef(null);
  const contentRef = useRef(null);
  const imageRef = useRef(null);
  const numberRef = useRef(null);

  // Initial state: content starts slightly faded + shifted right, image slightly scaled
  // These are set immediately so there's no flash of wrong state
  useGSAP(() => {
    // First card is visible immediately; others start off to the right
    if (index === 0) return;
    gsap.set([contentRef.current, imageRef.current], { opacity: 0.5 });
    gsap.set(contentRef.current, { x: 30 });
  }, { scope: cardRef });

  const projectUrl = project.githubUrl || project.liveUrl || 'https://github.com/Tabsheerul';

  return (
    <article
      ref={cardRef}
      className="relative flex-shrink-0 flex items-center justify-center px-8 md:px-16 lg:px-24 xl:px-32"
      style={{ width: '100vw', minHeight: '100vh' }}
      aria-label={`Project: ${project.title}`}
    >
      {/* Ambient bg glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 65% 55% at 55% 50%, ${project.accentColor}09 0%, transparent 70%)`,
        }}
      />

      {/* Large watermark number */}
      <div
        ref={numberRef}
        className="pointer-events-none absolute right-6 lg:right-12 top-1/2 -translate-y-1/2 select-none"
        aria-hidden="true"
        style={{
          fontSize: 'clamp(160px, 22vw, 320px)',
          fontWeight: 900,
          color: 'transparent',
          WebkitTextStroke: `1px ${project.accentColor}15`,
          lineHeight: 1,
          letterSpacing: '-0.04em',
        }}
      >
        {project.number}
      </div>

      {/* Thin top border */}
      <div
        className="absolute top-0 left-8 right-8 lg:left-24 lg:right-24 h-[1px]"
        style={{ background: `linear-gradient(90deg, transparent, ${project.accentColor}25, transparent)` }}
      />

      {/* Card content grid */}
      <div className="relative z-10 w-full max-w-[1300px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 xl:gap-20 items-center">

        {/* Left: Content */}
        <div ref={contentRef} className="lg:col-span-5 flex flex-col gap-5 lg:gap-6">
          {/* Meta */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: project.accentColor, boxShadow: `0 0 8px ${project.accentColor}` }}
              />
              <span
                className="font-mono text-[11px] uppercase tracking-[0.22em]"
                style={{ color: project.accentColor }}
              >
                {project.type}
              </span>
            </div>
            <span className="font-mono text-[11px] text-white/25 tracking-wider">{project.date}</span>
          </div>

          {/* Title */}
          <h3
            className="font-display font-bold text-white leading-[1.1]"
            style={{ fontSize: 'clamp(28px, 3.2vw, 50px)' }}
          >
            {project.title}
          </h3>

          {/* Accent rule */}
          <div
            className="w-10 h-[2px] rounded-full"
            style={{ backgroundColor: project.accentColor, opacity: 0.55 }}
          />

          {/* Description */}
          <p className="text-[15px] md:text-[16px] text-white/50 leading-relaxed font-light max-w-[420px]">
            {project.description}
          </p>

          {/* Stack pills */}
          <div className="flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center gap-1.5 font-mono text-[11px] text-white/55 border border-white/[0.07] rounded-full px-3 py-1.5 transition-all duration-300 hover:border-purple-400/40 hover:text-white/90"
                style={{ background: `${project.accentColor}07` }}
              >
                <span
                  className="w-1 h-1 rounded-full"
                  style={{ backgroundColor: project.accentColor, opacity: 0.65 }}
                />
                {tech}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div className="pt-1">
            <a href={projectUrl} target="_blank" rel="noopener noreferrer" className="inline-flex">
              <MagneticButton
                className="!bg-transparent !text-white !border !border-white/15 !text-[11px] !font-mono !uppercase !tracking-[0.18em] !px-7 !py-3 rounded-full hover:!border-purple-400/60 hover:!shadow-lg hover:!shadow-purple-500/15 transition-all flex items-center gap-2.5"
                data-cursor="hover"
              >
                {project.githubUrl ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                      <path d={GithubIconPath} />
                    </svg>
                    <span>View Repository ↗</span>
                  </>
                ) : (
                  <span>View Project ↗</span>
                )}
              </MagneticButton>
            </a>
          </div>
        </div>

        {/* Right: Visual */}
        <div ref={imageRef} className="lg:col-span-7 relative">
          <div
            className="absolute -inset-6 rounded-3xl blur-[50px] opacity-10 pointer-events-none"
            style={{ background: project.accentColor }}
          />
          <ProjectImage project={project} isReversed={false} />
        </div>
      </div>

      {/* Progress dots */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2.5"
        aria-hidden="true"
      >
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className="rounded-full transition-all duration-500"
            style={{
              width: i === index ? '22px' : '6px',
              height: '6px',
              backgroundColor: i === index ? project.accentColor : 'rgba(255,255,255,0.12)',
            }}
          />
        ))}
      </div>
    </article>
  );
}
