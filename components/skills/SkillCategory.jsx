'use client';

import { useRef } from 'react';
import GlassCard from '@/components/shared/GlassCard';
import SkillBar from './SkillBar';

// Inline SVG icon paths matching Lucide viewBox 24x24
const ICON_PATHS = {
  Code2: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
  Monitor: 'M2 3h20v14H2zM8 21h8M12 17v4',
  Server: 'M2 2h20v8H2zM2 14h20v8H2zM6 6h.01M6 18h.01',
  Database: 'M12 2C6.48 2 2 4.69 2 8s4.48 6 10 6 10-2.69 10-6-4.48-6-10-6zM2 8v8c0 3.31 4.48 6 10 6s10-2.69 10-6V8',
  Brain: 'M9.5 2a3.5 3.5 0 0 0-3.44 4.15A3.5 3.5 0 0 0 5 12.5a3.5 3.5 0 0 0 2.1 6.35A3.5 3.5 0 0 0 12 22a3.5 3.5 0 0 0 4.9-3.15A3.5 3.5 0 0 0 19 12.5a3.5 3.5 0 0 0-1.06-6.35A3.5 3.5 0 0 0 14.5 2 3.5 3.5 0 0 0 12 3.6 3.5 3.5 0 0 0 9.5 2z',
  Wrench: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z',
};

export default function SkillCategory({ category }) {
  const cardRef = useRef(null);
  const iconPath = ICON_PATHS[category.icon] || ICON_PATHS.Code2;

  return (
    <div ref={cardRef} className="skill-category-card">
      <GlassCard
        className="p-8 rounded-xl h-full"
        style={{
          '--hover-border': `${category.accentColor}33`,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${category.accentColor}33`; e.currentTarget.style.boxShadow = `0 0 24px ${category.accentColor}0d`; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.boxShadow = ''; }}
      >
        {/* Card Header */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${category.accentColor}1a` }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke={category.accentColor}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d={iconPath} />
            </svg>
          </div>
          <h3 className="text-[18px] font-semibold text-white">{category.title}</h3>
        </div>

        {/* Skill Bars */}
        <div>
          {category.skills.map((skill, i) => (
            <SkillBar
              key={skill.name}
              name={skill.name}
              level={skill.level}
              description={skill.description}
              accentColor={category.accentColor}
              delay={i * 0.05}
            />
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
