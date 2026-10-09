'use client';

import { useRef, useState, useMemo, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { useGSAP } from '@gsap/react';
import ArchitectureNode from './ArchitectureNode';
import ConnectionLine from './ConnectionLine';
import DataPacket from './DataPacket';
import ScrollRevealText from '@/components/shared/ScrollRevealText';
import { useMediaQuery } from '@/hooks/useMediaQuery';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

// ─── Lucide icon SVG paths (24x24 viewBox) ───
const ICON_PATHS = {
  Monitor: 'M2 3h20v14H2zM8 21h8M12 17v4',
  Shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  Server: 'M2 2h20v8H2zM2 14h20v8H2zM6 6h.01M6 18h.01',
  Zap: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  Database: 'M12 2C6.48 2 2 4.69 2 8s4.48 6 10 6 10-2.69 10-6-4.48-6-10-6zM2 8v8c0 3.31 4.48 6 10 6s10-2.69 10-6V8',
  Brain: 'M9.5 2a3.5 3.5 0 0 0-3.44 4.15A3.5 3.5 0 0 0 5 12.5a3.5 3.5 0 0 0 2.1 6.35A3.5 3.5 0 0 0 12 22a3.5 3.5 0 0 0 4.9-3.15A3.5 3.5 0 0 0 19 12.5a3.5 3.5 0 0 0-1.06-6.35A3.5 3.5 0 0 0 14.5 2 3.5 3.5 0 0 0 12 3.6 3.5 3.5 0 0 0 9.5 2zM12 3.6V22',
  GitBranch: 'M6 3v12M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 9a9 9 0 0 1-9 9',
};

// ─── Node definitions ───
const nodesData = [
  {
    id: 'frontend', label: 'FRONTEND',
    techs: ['React.js', 'Redux', 'Tailwind', 'Framer Motion'],
    x: 150, y: 150, mobileX: 150, mobileY: 250,
    accentColor: '#00d4ff', icon: 'Monitor',
    description: 'Crafting responsive, interactive user interfaces with React and modern CSS.',
  },
  {
    id: 'gateway', label: 'GATEWAY / API',
    techs: ['REST APIs', 'JWT Auth', 'Spring Security'],
    x: 500, y: 80, mobileX: 300, mobileY: 80,
    accentColor: '#0088ff', icon: 'Shield',
    description: 'Secure API endpoints, JWT authentication, and request routing layers.',
  },
  {
    id: 'backend', label: 'BACKEND CORE',
    techs: ['Spring Boot', 'Microservices', 'Hibernate'],
    x: 500, y: 300, mobileX: 300, mobileY: 450,
    accentColor: '#ffffff', icon: 'Server',
    description: 'Scalable Spring Boot microservices and core business logic engines.',
  },
  {
    id: 'messaging', label: 'MESSAGING',
    techs: ['Apache Kafka', 'Event-Driven'],
    x: 850, y: 150, mobileX: 450, mobileY: 250,
    accentColor: '#ff8800', icon: 'Zap',
    description: 'Event-driven architecture with Apache Kafka for async communication.',
  },
  {
    id: 'database', label: 'DATA LAYER',
    techs: ['MySQL', 'PostgreSQL', 'pgVector'],
    x: 850, y: 450, mobileX: 450, mobileY: 650,
    accentColor: '#00ff88', icon: 'Database',
    description: 'Relational and vector databases — MySQL, PostgreSQL, pgVector.',
  },
  {
    id: 'ai-cloud', label: 'AI & CLOUD',
    techs: ['Vertex AI', 'Speech-to-Text', 'Embeddings'],
    x: 150, y: 450, mobileX: 150, mobileY: 650,
    accentColor: '#aa00ff', icon: 'Brain',
    description: 'AI integrations with Google Cloud Vertex AI, speech-to-text, and embeddings.',
  },
  {
    id: 'devops', label: 'DEVOPS',
    techs: ['Docker', 'Git', 'Vercel'],
    x: 500, y: 520, mobileX: 300, mobileY: 850,
    accentColor: '#ff0088', icon: 'GitBranch',
    description: 'Docker containerization, Git workflows, and cloud deployment.',
  },
];

// ─── Connection definitions ───
const connectionsData = [
  { id: 'fe-gw', from: 'frontend', to: 'gateway', color: '#00d4ff' },
  { id: 'gw-be', from: 'gateway', to: 'backend', color: '#0088ff' },
  { id: 'be-msg', from: 'backend', to: 'messaging', color: '#ff8800' },
  { id: 'be-db', from: 'backend', to: 'database', color: '#00ff88' },
  { id: 'be-ai', from: 'backend', to: 'ai-cloud', color: '#aa00ff' },
  { id: 'be-do', from: 'backend', to: 'devops', color: '#ff0088' },
  { id: 'msg-be', from: 'messaging', to: 'backend', color: '#ff8800' },
  { id: 'ai-be', from: 'ai-cloud', to: 'backend', color: '#aa00ff' },
];

// ─── Which nodes are connected to which (bidirectional map) ───
const nodeConnections = {
  frontend: ['gateway'],
  gateway: ['frontend', 'backend'],
  backend: ['gateway', 'messaging', 'database', 'ai-cloud', 'devops'],
  messaging: ['backend'],
  database: ['backend'],
  'ai-cloud': ['backend'],
  devops: ['backend'],
};

/**
 * Generate smooth cubic bezier SVG path between two points.
 * Return paths use an outward arc so they don't overlap.
 */
function generatePath(fromX, fromY, toX, toY, isReturn = false) {
  const midX = (fromX + toX) / 2;
  const midY = (fromY + toY) / 2;
  const dx = toX - fromX;
  const dy = toY - fromY;

  // Offset for curvature perpendicular to the line
  const dist = Math.sqrt(dx * dx + dy * dy);
  const offset = dist * (isReturn ? -0.35 : 0.25);

  // Normal perpendicular direction
  const nx = -dy / dist;
  const ny = dx / dist;

  const cpX = midX + nx * offset;
  const cpY = midY + ny * offset;

  return `M ${fromX} ${fromY} Q ${cpX} ${cpY} ${toX} ${toY}`;
}

export default function SystemArchitecture() {
  const sectionRef = useRef(null);
  const svgRef = useRef(null);
  const [activeNode, setActiveNode] = useState(null);
  const [packetsVisible, setPacketsVisible] = useState(false);
  const [tooltipData, setTooltipData] = useState(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  const viewBox = isMobile ? '0 0 600 1000' : '0 0 1000 600';
  const nodeRadius = isMobile ? 40 : 50;

  // Get position for a node based on breakpoint
  const getPos = (node) => ({
    x: isMobile ? node.mobileX : node.x,
    y: isMobile ? node.mobileY : node.y,
  });

  // Memoize paths
  const paths = useMemo(() => {
    return connectionsData.map((conn) => {
      const from = nodesData.find((n) => n.id === conn.from);
      const to = nodesData.find((n) => n.id === conn.to);
      const fPos = isMobile
        ? { x: from.mobileX, y: from.mobileY }
        : { x: from.x, y: from.y };
      const tPos = isMobile
        ? { x: to.mobileX, y: to.mobileY }
        : { x: to.x, y: to.y };

      // Return loops (msg-be, ai-be) curve outward
      const isReturn = conn.id === 'msg-be' || conn.id === 'ai-be';

      return {
        ...conn,
        pathD: generatePath(fPos.x, fPos.y, tPos.x, tPos.y, isReturn),
      };
    });
  }, [isMobile]);

  // Handle hover tooltip
  const handleNodeHover = (nodeId) => {
    setActiveNode(nodeId);
    const node = nodesData.find((n) => n.id === nodeId);
    if (node) setTooltipData(node);
  };

  const handleNodeLeave = () => {
    setActiveNode(null);
    setTooltipData(null);
  };

  // Scroll-triggered reveal timeline
  useGSAP(() => {
    if (prefersReducedMotion) {
      // Show immediately
      gsap.set('.architecture-node', { scale: 1, opacity: 1 });
      gsap.set('.architecture-line', { strokeDashoffset: 0 });
      gsap.set('.node-tech-pill', { opacity: 1 });
      setPacketsVisible(true);
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 60%',
        end: 'center center',
        toggleActions: 'play none none none',
      }
    });

    // Nodes pop in with elastic ease
    tl.fromTo('.architecture-node',
      { scale: 0, opacity: 0, transformOrigin: 'center center' },
      { scale: 1, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'back.out(1.7)' },
      0
    );

    // Lines draw themselves
    tl.fromTo('.architecture-line',
      { strokeDashoffset: (i, el) => el.getTotalLength() },
      { strokeDashoffset: 0, duration: 1.2, stagger: 0.06, ease: 'power2.inOut' },
      0.2
    );

    // Tech pills fade in
    tl.fromTo('.node-tech-pill',
      { opacity: 0 },
      { opacity: 1, duration: 0.3, stagger: 0.02 },
      0.8
    );

    // Start data packets after lines are drawn
    tl.add(() => {
      setPacketsVisible(true);
    }, 1.2);

  }, { scope: sectionRef, dependencies: [prefersReducedMotion, isMobile] });

  // Section header scroll animation
  useGSAP(() => {
    if (prefersReducedMotion) return;

    gsap.fromTo('.arch-caption',
      { y: 30, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: '.arch-caption', start: 'top 85%' }
      }
    );
    gsap.fromTo('.arch-title',
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.7, ease: 'power2.out',
        scrollTrigger: { trigger: '.arch-title', start: 'top 85%' }
      }
    );
    gsap.fromTo('.arch-subtitle',
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.7, ease: 'power2.out',
        scrollTrigger: { trigger: '.arch-subtitle', start: 'top 85%' }
      }
    );
  }, { scope: sectionRef, dependencies: [prefersReducedMotion] });

  const maxPacketsPerLine = isMobile ? 1 : 2;

  return (
    <section
      id="system-architecture"
      ref={sectionRef}
      className="relative min-h-screen py-32 overflow-hidden"
      style={{ background: 'linear-gradient(to bottom, rgba(0,212,255,0.02), transparent 200px), #050505' }}
    >
      {/* Container */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">

        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="arch-caption text-[12px] uppercase tracking-[0.1em] text-[#00d4ff] font-medium mb-4">
            01 / MY ECOSYSTEM
          </p>
          <h2 className="arch-title font-display text-[clamp(36px,5vw,64px)] font-bold text-white mb-3">
            CONNECTED SYSTEMS
          </h2>
          <p className="arch-subtitle text-[16px] md:text-[18px] text-[#a0a0a0] max-w-[600px] mx-auto leading-relaxed">
            Every layer engineered to work in harmony — from frontend pixels to AI-powered backends.
          </p>
        </div>

        {/* SVG Diagram Container */}
        <div className="relative w-full">
          <svg
            ref={svgRef}
            width="100%"
            height="100%"
            viewBox={viewBox}
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label="System architecture diagram showing connected technologies including Frontend, Gateway, Backend, Messaging, Database, AI Cloud, and DevOps."
          >
            {/* SVG Filters */}
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="8" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="glow-small">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Connection Lines (rendered first, behind nodes) */}
            {paths.map((conn) => {
              const lineIsActive = activeNode && (conn.from === activeNode || conn.to === activeNode);
              const lineIsDimmed = activeNode !== null && !lineIsActive;

              return (
                <ConnectionLine
                  key={conn.id}
                  id={conn.id}
                  pathD={conn.pathD}
                  color={conn.color}
                  isActive={lineIsActive}
                  isDimmed={lineIsDimmed}
                />
              );
            })}

            {/* Data Packets — only render after scroll reveal finishes */}
            {packetsVisible && !prefersReducedMotion && paths.map((conn) =>
              Array.from({ length: maxPacketsPerLine }).map((_, pi) => (
                <DataPacket
                  key={`${conn.id}-p${pi}`}
                  pathSelector={`[data-line-id="${conn.id}"]`}
                  color={conn.color}
                  duration={3 + Math.random() * 2}
                  delay={pi * 1.5 + Math.random() * 0.5}
                  size={isMobile ? 2 : 3}
                />
              ))
            )}

            {/* Architecture Nodes */}
            {nodesData.map((node) => {
              const pos = getPos(node);
              const nodeIsActive = activeNode === node.id;
              const nodeIsDimmed = activeNode !== null && activeNode !== node.id && !nodeConnections[activeNode]?.includes(node.id);

              return (
                <ArchitectureNode
                  key={node.id}
                  id={node.id}
                  label={node.label}
                  techs={node.techs}
                  x={pos.x}
                  y={pos.y}
                  accentColor={node.accentColor}
                  iconPath={ICON_PATHS[node.icon]}
                  isActive={nodeIsActive}
                  isDimmed={nodeIsDimmed}
                  onHover={handleNodeHover}
                  onLeave={handleNodeLeave}
                  onFocus={handleNodeHover}
                  description={node.description}
                  nodeRadius={nodeRadius}
                />
              );
            })}
          </svg>

          {/* HTML Tooltip overlay */}
          {tooltipData && (
            <div
              className="absolute pointer-events-none z-20 transition-opacity duration-200"
              style={{
                left: `${((isMobile ? tooltipData.mobileX : tooltipData.x) / (isMobile ? 600 : 1000)) * 100}%`,
                top: `${((isMobile ? tooltipData.mobileY : tooltipData.y) / (isMobile ? 1000 : 600)) * 100 - 12}%`,
                transform: 'translate(-50%, -110%)',
              }}
            >
              <div
                className="bg-white/[0.05] backdrop-blur-[12px] border border-white/[0.08] rounded-lg p-4 max-w-[240px]"
                style={{ borderLeft: `2px solid ${tooltipData.accentColor}` }}
              >
                <h4 className="font-display text-[14px] font-semibold text-white mb-1">
                  {tooltipData.label}
                </h4>
                <p className="text-[12px] text-[#a0a0a0] leading-relaxed">
                  {tooltipData.description}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
