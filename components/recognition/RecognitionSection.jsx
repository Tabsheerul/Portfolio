'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import ScrollRevealText from '@/components/shared/ScrollRevealText';
import GlassCard from '@/components/shared/GlassCard';

gsap.registerPlugin(ScrollTrigger);

const ICONS = {
  GraduationCap: 'M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5',
  Award: 'M12 15c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z M8.21 13.89L7 23l5-3 5 3-1.21-9.12',
  Code2: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4'
};

export default function RecognitionSection() {
  const sectionRef = useRef(null);
  
  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !sectionRef.current) return;

    // Caption and Title fades
    gsap.fromTo('.recog-caption',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: '.recog-caption', start: 'top 85%' } }
    );
    gsap.fromTo('.recog-subtitle',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', scrollTrigger: { trigger: '.recog-subtitle', start: 'top 85%' } }
    );

    // Education card slides in from left
    gsap.fromTo('.recog-edu-card',
      { x: -40, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: '.recog-grid', start: 'top 80%' } }
    );

    // Certifications stagger in from right
    gsap.fromTo('.recog-cert-item',
      { x: 40, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out', scrollTrigger: { trigger: '.recog-grid', start: 'top 80%' } }
    );

  }, { scope: sectionRef });

  return (
    <section id="recognition" ref={sectionRef} className="py-24 border-t border-purple-500/10 overflow-hidden" style={{ background: '#140d27' }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        
        {/* Header */}
        <div className="mb-12">
          <span className="badge-pill mb-6 inline-block recog-caption">
            06 / RECOGNITION
          </span>

          <h2 className="font-display text-[clamp(32px,4vw,56px)] font-bold text-white uppercase leading-[1.0] mb-4">
            EDUCATION & <span className="font-serif italic font-normal text-purple-300">CERTIFICATIONS</span>
          </h2>

          <p className="recog-subtitle text-[16px] text-[#a0a0a0] max-w-[600px]">
            Continuous learning and formal credentials that back the craft.
          </p>
        </div>

        {/* Content Grid */}
        <div className="recog-grid grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
          
          {/* Left: Education */}
          <div className="recog-edu-card h-full">
            <GlassCard className="p-8 h-full">
              <div className="flex items-center gap-4 mb-6">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={ICONS.GraduationCap} />
                </svg>
                <h3 className="text-[24px] font-semibold text-white">B.Tech in Computer Science</h3>
              </div>
              
              <div className="mb-6">
                <p className="text-[16px] text-[#a0a0a0]">Jharkhand University of Technology</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-[14px] text-[#a78bfa] font-mono">2022 – 2026</p>
                  <p className="text-[14px] text-[#a0a0a0]">CGPA: <span className="font-semibold text-white">7.33</span></p>
                </div>
              </div>

              <div>
                <p className="text-[12px] uppercase tracking-[0.05em] text-[#666666] mb-3 font-medium">Relevant Coursework</p>
                <div className="flex flex-wrap gap-2">
                  {['Data Structures & Algorithms', 'Java Full Stack Development', 'Software Engineering'].map(course => (
                    <span key={course} className="text-[11px] uppercase tracking-[0.05em] text-[#c084fc] border border-purple-500/20 rounded px-3 py-1 bg-purple-500/5">
                      {course}
                    </span>
                  ))}
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Right: Certifications */}
          <div className="flex flex-col gap-4">
            
            {/* Cert 1 */}
            <div 
              className="recog-cert-item flex items-center p-5 md:p-6 bg-white/[0.02] border border-white/[0.06] rounded-lg transition-all duration-300 group hover:-translate-y-1"
              style={{ borderLeft: '2px solid transparent' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderLeftColor = '#c084fc'; e.currentTarget.style.backgroundColor = 'rgba(168,85,247,0.08)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderLeftColor = 'transparent'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'; }}
            >
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0 mr-4 md:mr-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={ICONS.Award} />
                </svg>
              </div>
              <div>
                <h4 className="text-[18px] font-semibold text-white mb-1">Programming in C</h4>
                <p className="text-[14px] text-[#a0a0a0]">NPTEL / IIT</p>
              </div>
            </div>

            {/* Cert 2 */}
            <div 
              className="recog-cert-item flex items-center p-5 md:p-6 bg-white/[0.02] border border-white/[0.06] rounded-lg transition-all duration-300 group hover:-translate-y-1"
              style={{ borderLeft: '2px solid transparent' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderLeftColor = '#a855f7'; e.currentTarget.style.backgroundColor = 'rgba(168,85,247,0.08)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderLeftColor = 'transparent'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'; }}
            >
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0 mr-4 md:mr-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={ICONS.Code2} />
                </svg>
              </div>
              <div>
                <h4 className="text-[18px] font-semibold text-white mb-1">Java Full Stack Development</h4>
                <p className="text-[14px] text-[#a0a0a0]">Certification Program</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
