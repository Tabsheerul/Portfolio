'use client';

import { useState, useRef, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { SKILL_CATEGORIES, ALL_SKILLS } from '@/lib/skillsData';

gsap.registerPlugin(ScrollTrigger);

// Inline SVG Icons for categories & decorative accents
const ICONS = {
  Terminal: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  ),
  Sparkle: (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z" />
    </svg>
  ),
  Layers: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  ),
  Cpu: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <line x1="9" y1="1" x2="9" y2="4" />
      <line x1="15" y1="1" x2="15" y2="4" />
      <line x1="9" y1="20" x2="9" y2="23" />
      <line x1="15" y1="20" x2="15" y2="23" />
      <line x1="20" y1="9" x2="23" y2="9" />
      <line x1="20" y1="14" x2="23" y2="14" />
      <line x1="1" y1="9" x2="4" y2="9" />
      <line x1="1" y1="14" x2="4" y2="14" />
    </svg>
  ),
};

const TICKER_ITEMS = [
  'JAVA 21', 'SPRING BOOT 3', 'APACHE KAFKA', 'REACT 19', 'POSTGRESQL',
  'PGVECTOR', 'DOCKER', 'MICROSERVICES', 'DISTRIBUTED SYSTEMS', 'NEXT.JS',
  'GOOGLE VERTEX AI', 'TAILWIND CSS', 'REDUX', 'SPRING SECURITY',
];

export default function SkillsSection() {
  const containerRef = useRef(null);
  const tickerRef = useRef(null);
  const [activeTab, setActiveTab] = useState('all');
  const [hoveredSkill, setHoveredSkill] = useState(ALL_SKILLS[0]); // default to Spring Boot 3

  // Filter skills according to active tab
  const displayedSkills = useMemo(() => {
    if (activeTab === 'all') return ALL_SKILLS;
    return ALL_SKILLS.filter((s) => s.category === activeTab);
  }, [activeTab]);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Header reveal
    gsap.fromTo(
      '.skills-anim-reveal',
      { y: 35, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        },
      }
    );

    // Continuous smooth micro-ticker loop
    if (tickerRef.current) {
      gsap.to(tickerRef.current, {
        xPercent: -50,
        duration: 25,
        ease: 'none',
        repeat: -1,
      });
    }
  }, { scope: containerRef });

  return (
    <section
      id="skills-header"
      ref={containerRef}
      className="relative pt-20 pb-24 overflow-hidden"
      style={{ background: '#0d0a1a' }}
    >
      {/* Background radial cosmic glow */}
      <div
        className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] rounded-full blur-[140px] opacity-25"
        style={{
          background: 'radial-gradient(circle, rgba(168,85,247,0.35) 0%, rgba(120,40,200,0.1) 70%, transparent 100%)',
        }}
      />

      <div className="max-w-[1360px] mx-auto px-6 lg:px-12 relative z-10">
        {/* Compact Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-purple-500/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono tracking-wider uppercase bg-purple-500/10 text-purple-300 border border-purple-500/20 mb-3 skills-anim-reveal">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              04 / TECHNICAL ARSENAL
            </div>
            <h2 className="font-display text-[clamp(32px,4.5vw,56px)] font-bold text-white leading-tight uppercase tracking-tight skills-anim-reveal">
              ENGINEERED WITH <span className="italic font-normal text-purple-300">PRECISION</span>
            </h2>
          </div>
          <p className="text-[14px] md:text-[15px] text-gray-400 max-w-[440px] mt-4 md:mt-0 leading-relaxed font-light skills-anim-reveal">
            A production-proven stack focused on distributed resilience, enterprise microservices, and high-fidelity interaction.
          </p>
        </div>

        {/* Compact Kinetic Ticker Ribbon */}
        <div className="relative overflow-hidden py-2.5 mb-8 rounded-lg bg-purple-950/20 border border-purple-500/15 backdrop-blur-sm">
          <div
            ref={tickerRef}
            className="flex items-center gap-6 whitespace-nowrap will-change-transform"
          >
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-[12px] font-mono font-medium tracking-wider text-purple-200/90">
                  {item}
                </span>
                <span className="w-1 h-1 rounded-full bg-purple-400/50" />
              </div>
            ))}
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-6 skills-anim-reveal">
          {SKILL_CATEGORIES.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-2 rounded-full text-[12px] font-mono transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 border border-purple-400/50 scale-[1.02]'
                    : 'bg-white/[0.03] text-gray-400 border border-white/[0.06] hover:border-purple-500/30 hover:text-white'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-purple-800 text-purple-200' : 'bg-white/[0.06] text-gray-500'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Bento Matrix: Badges Cloud (Left) + Tech Inspector HUD (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start skills-anim-reveal">
          {/* Left Column: Interactive Badges Playground (7 Cols) */}
          <div className="lg:col-span-7 bg-[#140d27]/70 border border-purple-500/20 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden min-h-[380px] flex flex-col justify-between">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-purple-300 text-[12px] font-mono uppercase tracking-wider">
                {ICONS.Layers}
                <span>Interactive Stack Cloud</span>
              </div>
              <span className="text-[11px] text-gray-400 font-mono">
                Showing {displayedSkills.length} tools • Tap / Hover to inspect
              </span>
            </div>

            {/* Badges Container */}
            <div className="flex flex-wrap gap-2.5 py-2">
              {displayedSkills.map((skill) => {
                const isSelected = hoveredSkill?.id === skill.id;
                return (
                  <button
                    key={skill.id}
                    onMouseEnter={() => setHoveredSkill(skill)}
                    onClick={() => setHoveredSkill(skill)}
                    className={`group relative text-left px-3.5 py-2.5 rounded-xl border transition-all duration-300 flex items-center gap-2.5 cursor-pointer select-none ${
                      isSelected
                        ? 'bg-purple-500/25 border-purple-400 shadow-lg shadow-purple-500/20 translate-y-[-2px]'
                        : 'bg-white/[0.03] border-white/[0.08] hover:border-purple-500/50 hover:bg-purple-500/10 hover:translate-y-[-1px]'
                    }`}
                  >
                    {/* Glowing status pip */}
                    <span
                      className="w-2 h-2 rounded-full transition-transform duration-300 group-hover:scale-125"
                      style={{
                        backgroundColor: skill.accentColor || '#c084fc',
                        boxShadow: isSelected ? `0 0 8px ${skill.accentColor || '#c084fc'}` : 'none',
                      }}
                    />

                    {/* Skill Name */}
                    <span className="text-[13px] font-medium text-white tracking-wide">
                      {skill.name}
                    </span>

                    {/* Role Tag Chip */}
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-md transition-colors ${
                        isSelected
                          ? 'bg-purple-900/80 text-purple-200 border border-purple-400/40'
                          : 'bg-white/[0.05] text-gray-400 group-hover:text-purple-300 group-hover:bg-purple-950/40'
                      }`}
                    >
                      {skill.roleTag}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Insight Footer */}
            <div className="pt-4 mt-6 border-t border-purple-500/10 flex items-center justify-between text-[11px] text-gray-400 font-mono">
              <span className="flex items-center gap-1.5 text-purple-400">
                {ICONS.Sparkle}
                Enterprise Ready
              </span>
              <span>No Arbitrary Metrics • Pure Architectural Context</span>
            </div>
          </div>

          {/* Right Column: Live Inspector Terminal HUD (5 Cols) */}
          <div className="lg:col-span-5 bg-[#0a0614] border border-purple-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">
            {/* Terminal Window Header */}
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-purple-500/15">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-purple-300/80">
                {ICONS.Terminal}
                <span>tech_inspector.sh</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                ACTIVE
              </span>
            </div>

            {/* Terminal Content readout */}
            {hoveredSkill ? (
              <div className="space-y-4 font-mono">
                {/* Tech Name & Status */}
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-purple-400 mb-1">
                    TARGET MODULE
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-[20px] font-bold text-white font-sans tracking-wide">
                      {hoveredSkill.name}
                    </h3>
                    <span
                      className="text-[10px] px-2.5 py-1 rounded-full font-mono font-medium border"
                      style={{
                        color: hoveredSkill.accentColor || '#c084fc',
                        borderColor: `${hoveredSkill.accentColor || '#c084fc'}40`,
                        backgroundColor: `${hoveredSkill.accentColor || '#c084fc'}15`,
                      }}
                    >
                      {hoveredSkill.spec.status}
                    </span>
                  </div>
                  <div className="text-[12px] text-gray-400 mt-0.5">
                    {hoveredSkill.categoryLabel}
                  </div>
                </div>

                {/* Scope & Role */}
                <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/15">
                  <div className="text-[10px] text-purple-300 uppercase tracking-wider mb-1">
                    ARCHITECTURAL SCOPE
                  </div>
                  <div className="text-[12px] text-gray-200 leading-snug">
                    {hoveredSkill.spec.scope}
                  </div>
                </div>

                {/* Practical Use Case */}
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                    PRODUCTION USE CASE
                  </div>
                  <p className="text-[12px] text-gray-300 leading-relaxed font-sans">
                    {hoveredSkill.spec.useCase}
                  </p>
                </div>

                {/* Ecosystem Alignment */}
                <div className="pt-2">
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1.5">
                    STACK INTEROPERABILITY
                  </div>
                  <div className="text-[11px] text-purple-300 bg-purple-950/40 border border-purple-500/20 px-3 py-2 rounded-lg">
                    {hoveredSkill.spec.stackFit}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-gray-500 font-mono text-[13px]">
                Hover or click any skill badge to inspect its architectural spec.
              </div>
            )}
          </div>
        </div>

        {/* Architectural Pillars Footnote (Ultra-compact 3 columns) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-6 border-t border-purple-500/10 skills-anim-reveal">
          <div className="p-4 rounded-xl bg-[#140d27]/40 border border-purple-500/15 flex items-start gap-3">
            <span className="p-2 rounded-lg bg-purple-500/10 text-purple-400 shrink-0">
              {ICONS.Cpu}
            </span>
            <div>
              <h4 className="text-[13px] font-semibold text-white">Event-Driven Architecture</h4>
              <p className="text-[11px] text-gray-400 leading-relaxed mt-0.5">
                Microservices choreographed via Apache Kafka for fault-tolerant asynchronous pipelines.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#140d27]/40 border border-purple-500/15 flex items-start gap-3">
            <span className="p-2 rounded-lg bg-purple-500/10 text-purple-400 shrink-0">
              {ICONS.Sparkle}
            </span>
            <div>
              <h4 className="text-[13px] font-semibold text-white">Semantic AI & Vector DB</h4>
              <p className="text-[11px] text-gray-400 leading-relaxed mt-0.5">
                pgVector HNSW indexing combined with Google Cloud Vertex AI foundation models.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#140d27]/40 border border-purple-500/15 flex items-start gap-3">
            <span className="p-2 rounded-lg bg-purple-500/10 text-purple-400 shrink-0">
              {ICONS.Layers}
            </span>
            <div>
              <h4 className="text-[13px] font-semibold text-white">Kinetic Precision & UX</h4>
              <p className="text-[11px] text-gray-400 leading-relaxed mt-0.5">
                High-performance 60fps animations via GSAP and React Three Fiber without layout shifts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
