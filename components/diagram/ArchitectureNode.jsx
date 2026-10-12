'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function ArchitectureNode({
  id,
  label,
  techs = [],
  x,
  y,
  accentColor,
  iconPath,
  isActive,
  isDimmed,
  onHover,
  onLeave,
  onFocus,
  description,
  nodeRadius = 50,
}) {
  const groupRef = useRef(null);
  const glowRef = useRef(null);
  const ringRef = useRef(null);
  const iconGroupRef = useRef(null);

  // Animate node based on active/dimmed state
  useGSAP(() => {
    if (!groupRef.current) return;

    if (isActive) {
      gsap.to(groupRef.current, { opacity: 1, scale: 1.12, duration: 0.4, ease: 'power2.out' });
      gsap.to(glowRef.current, { opacity: 0.12, duration: 0.4 });
      gsap.to(ringRef.current, {
        attr: { 'stroke-opacity': 1, 'stroke-width': 2, r: nodeRadius + 5 },
        duration: 0.4,
        ease: 'power2.out',
      });
      gsap.to(iconGroupRef.current, { scale: 1.1, duration: 0.3, transformOrigin: 'center center' });
    } else if (isDimmed) {
      gsap.to(groupRef.current, { opacity: 0.2, scale: 0.95, duration: 0.4, ease: 'power2.out' });
      gsap.to(glowRef.current, { opacity: 0, duration: 0.4 });
      gsap.to(ringRef.current, {
        attr: { 'stroke-opacity': 0.4, 'stroke-width': 1, r: nodeRadius },
        duration: 0.4,
      });
    } else {
      gsap.to(groupRef.current, { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' });
      gsap.to(glowRef.current, { opacity: 0, duration: 0.4 });
      gsap.to(ringRef.current, {
        attr: { 'stroke-opacity': 0.4, 'stroke-width': 1, r: nodeRadius },
        duration: 0.4,
      });
      gsap.to(iconGroupRef.current, { scale: 1, duration: 0.3 });
    }
  }, { dependencies: [isActive, isDimmed] });

  return (
    <g
      ref={groupRef}
      className="architecture-node"
      transform={`translate(${x}, ${y})`}
      style={{ cursor: 'pointer' }}
      onMouseEnter={() => onHover(id)}
      onMouseLeave={() => onLeave()}
      onFocus={() => onFocus?.(id)}
      tabIndex={0}
      role="button"
      aria-label={`${label}: ${techs.join(', ')}`}
    >
      <title>{`${label} — ${description}`}</title>

      {/* Glow circle (bottom layer) */}
      <circle
        ref={glowRef}
        r={nodeRadius + 8}
        fill={accentColor}
        opacity={0}
        filter="url(#glow)"
      />

      {/* Outer ring */}
      <circle
        ref={ringRef}
        r={nodeRadius}
        fill="#140d27"
        stroke={accentColor}
        strokeWidth={1}
        strokeOpacity={0.4}
      />

      {/* Icon — rendered as SVG path inside foreignObject for Lucide compatibility */}
      <g ref={iconGroupRef}>
        <path
          d={iconPath}
          fill="none"
          stroke="#ffffff"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          transform={`translate(-12, -12) scale(1)`}
        />
      </g>

      {/* Label */}
      <text
        y={nodeRadius + 22}
        textAnchor="middle"
        fill="#ffffff"
        fontSize={13}
        fontWeight={600}
        fontFamily="var(--font-space-grotesk), sans-serif"
        style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}
      >
        {label}
      </text>

      {/* Tech pills */}
      {techs.map((tech, i) => (
        <text
          key={tech}
          className="node-tech-pill"
          y={nodeRadius + 40 + i * 14}
          textAnchor="middle"
          fill="#666666"
          fontSize={9}
          fontFamily="var(--font-inter), sans-serif"
          style={{ letterSpacing: '0.03em' }}
        >
          {tech}
        </text>
      ))}
    </g>
  );
}
