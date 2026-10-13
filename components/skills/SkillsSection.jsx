'use client';

import { useEffect, useRef } from 'react';

// Constellation data with generous spacing so words never collide or overlap
const CONSTELLATION_DATA = [
  {
    id: 'backend',
    title: 'BACKEND ARCHITECTURE',
    x: 0.46,
    y: 0.18,
    size: 19,
    color: '#ffffff',
    children: [
      { name: 'Spring Boot', color: '#c084fc', size: 14, dx: -180, dy: -35 },
      { name: 'Java 21', color: '#e879f9', size: 14, dx: 180, dy: -35 },
      { name: 'Apache Kafka', color: '#c084fc', size: 13, dx: -200, dy: 30 },
      { name: 'Microservices', color: '#e2e8f0', size: 13, dx: 190, dy: 30 },
      { name: 'Distributed Systems', color: '#a855f7', size: 12, dx: 0, dy: 65 },
      { name: 'Hibernate / JPA', color: '#38bdf8', size: 12, dx: -130, dy: 95 },
      { name: 'Spring Security', color: '#c084fc', size: 12, dx: 130, dy: 95 },
    ],
  },
  {
    id: 'web',
    title: 'WEB DEVELOPMENT',
    x: 0.72,
    y: 0.44,
    size: 19,
    color: '#ffffff',
    children: [
      { name: 'React.js', color: '#38bdf8', size: 14, dx: -160, dy: -35 },
      { name: 'Next.js', color: '#f8fafc', size: 13, dx: 155, dy: -32 },
      { name: 'Javascript', color: '#facc15', size: 13, dx: -150, dy: 35 },
      { name: 'Tailwind CSS', color: '#38bdf8', size: 12, dx: 150, dy: 40 },
      { name: 'Redux', color: '#c084fc', size: 12, dx: -30, dy: 75 },
      { name: 'Three.js / GSAP', color: '#a855f7', size: 12, dx: 95, dy: 85 },
    ],
  },
  {
    id: 'data-ai',
    title: 'DATA & AI LAYER',
    x: 0.30,
    y: 0.74,
    size: 18,
    color: '#ffffff',
    children: [
      { name: 'PostgreSQL', color: '#60a5fa', size: 13, dx: -160, dy: -35 },
      { name: 'pgVector', color: '#4ade80', size: 13, dx: 160, dy: -30 },
      { name: 'Vertex AI', color: '#fb923c', size: 13, dx: -140, dy: 40 },
      { name: 'SQL', color: '#38bdf8', size: 12, dx: 135, dy: 40 },
      { name: 'Vector Embeddings', color: '#4ade80', size: 11, dx: 0, dy: 75 },
    ],
  },
  {
    id: 'devops',
    title: 'DEVOPS & SYSTEMS',
    x: 0.74,
    y: 0.82,
    size: 18,
    color: '#ffffff',
    children: [
      { name: 'Docker', color: '#38bdf8', size: 13, dx: -145, dy: -35 },
      { name: 'Git & GitHub', color: '#f43f5e', size: 12, dx: 145, dy: -30 },
      { name: 'C Language', color: '#94a3b8', size: 12, dx: -90, dy: 45 },
      { name: 'REST APIs', color: '#c084fc', size: 11, dx: 90, dy: 45 },
    ],
  },
];

export default function SkillsSection() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = 0;
    let height = 0;

    const handleResize = () => {
      if (!canvas.parentElement) return;
      const dpr = window.devicePixelRatio || 1;
      width = canvas.parentElement.clientWidth;
      height = canvas.parentElement.clientHeight || 620;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Mouse coordinates with smooth interpolation
    const mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
    };
    const parent = canvas.parentElement;
    parent.addEventListener('mousemove', handleMouseMove);

    // Prepare node list
    const nodes = [];
    const links = [];

    CONSTELLATION_DATA.forEach((cluster, cIdx) => {
      const parentNode = {
        id: cluster.id,
        name: cluster.title,
        baseX: cluster.x,
        baseY: cluster.y,
        size: cluster.size,
        isMajor: true,
        color: cluster.color,
        seed: cIdx * 12,
        x: cluster.x * width,
        y: cluster.y * height,
      };
      nodes.push(parentNode);

      cluster.children.forEach((child, chIdx) => {
        const childNode = {
          id: `${cluster.id}-${chIdx}`,
          name: child.name,
          color: child.color,
          size: child.size,
          isMajor: false,
          parentRef: parentNode,
          dx: child.dx,
          dy: child.dy,
          seed: cIdx * 12 + chIdx + 1,
          x: parentNode.x + child.dx,
          y: parentNode.y + child.dy,
        };
        nodes.push(childNode);
        links.push({ source: parentNode, target: childNode });
      });
    });

    // Cross-links between clusters for interconnected network feel
    for (let i = 0; i < CONSTELLATION_DATA.length - 1; i++) {
      links.push({
        source: nodes.find((n) => n.id === CONSTELLATION_DATA[i].id),
        target: nodes.find((n) => n.id === CONSTELLATION_DATA[i + 1].id),
        isCross: true,
      });
    }

    let time = 0;

    const render = () => {
      time += 0.012;

      // Smooth mouse follow
      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;

      ctx.clearRect(0, 0, width, height);

      // Subtle parallax offset
      const offsetX = (mouse.x - width / 2) * 0.035;
      const offsetY = (mouse.y - height / 2) * 0.035;

      // Update node positions with gentle floating harmonic motion
      nodes.forEach((n) => {
        if (n.isMajor) {
          const floatX = Math.sin(time + n.seed) * 6;
          const floatY = Math.cos(time * 0.8 + n.seed) * 6;
          n.x = n.baseX * width + floatX + offsetX * 1.2;
          n.y = n.baseY * height + floatY + offsetY * 1.2;
        } else {
          const floatX = Math.sin(time * 1.1 + n.seed) * 4;
          const floatY = Math.cos(time * 0.9 + n.seed) * 4;
          n.x = n.parentRef.x + n.dx + floatX;
          n.y = n.parentRef.y + n.dy + floatY;
        }
      });

      // Draw constellation spiderweb links
      links.forEach((link) => {
        if (!link.source || !link.target) return;
        ctx.beginPath();
        ctx.moveTo(link.source.x, link.source.y);
        ctx.lineTo(link.target.x, link.target.y);

        if (link.isCross) {
          ctx.strokeStyle = 'rgba(168, 85, 247, 0.1)';
          ctx.lineWidth = 1;
        } else {
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.14)';
          ctx.lineWidth = 1;
        }
        ctx.stroke();
      });

      // Draw nodes & text labels
      nodes.forEach((n) => {
        // Check distance to mouse for hover highlight
        const distToMouse = Math.hypot(mouse.x - n.x, mouse.y - n.y);
        const isHovered = distToMouse < 45;

        // Draw node anchor point
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.isMajor ? 3 : 1.5, 0, Math.PI * 2);
        ctx.fillStyle = isHovered ? '#ffffff' : n.color;
        ctx.fill();

        // Major node subtle glow ring
        if (n.isMajor) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, 6, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
          ctx.fill();
        }

        // Draw text
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if (n.isMajor) {
          ctx.font = `bold ${n.size}px "Outfit", "Inter", sans-serif`;
          ctx.fillStyle = isHovered ? '#ffffff' : 'rgba(255, 255, 255, 0.95)';
          ctx.shadowColor = 'rgba(168, 85, 247, 0.5)';
          ctx.shadowBlur = isHovered ? 14 : 8;
          ctx.fillText(n.name, n.x, n.y);
        } else {
          ctx.font = `normal ${isHovered ? n.size + 1 : n.size}px "Outfit", "Inter", sans-serif`;
          ctx.fillStyle = isHovered ? '#ffffff' : n.color;
          ctx.shadowColor = isHovered ? n.color : 'transparent';
          ctx.shadowBlur = isHovered ? 10 : 0;
          ctx.fillText(n.name, n.x, n.y);
        }
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      parent.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section
      id="skills-header"
      ref={containerRef}
      className="relative py-20 overflow-hidden"
      style={{ background: '#0d0a1a' }}
    >
      {/* Background ambient cosmic glow */}
      <div
        className="pointer-events-none absolute right-10 top-1/2 -translate-y-1/2 w-[600px] h-[500px] rounded-full blur-[140px] opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(168,85,247,0.35) 0%, rgba(56,189,248,0.12) 70%, transparent 100%)',
        }}
      />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[580px]">
          
          {/* Left Column: Code-styled Skills bio (Exact match to reference screenshot) */}
          <div className="lg:col-span-5 space-y-3.5 select-none">
            {/* <body> tag row */}
            <div className="flex items-center gap-3">
              <span className="font-mono text-[13px] text-amber-400 font-medium">&lt;body&gt;</span>
              <div className="h-[4px] w-24 rounded-full bg-gray-500/30" />
              <div className="h-[4px] w-28 rounded-full bg-gradient-to-r from-orange-500 to-pink-500" />
            </div>

            {/* <h1> tag row */}
            <div className="flex items-center gap-3 pl-3">
              <span className="font-mono text-[13px] text-purple-400 font-medium">&lt;h1&gt;</span>
              <div className="h-[4px] w-36 rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500" />
              <div className="h-[4px] w-14 rounded-full bg-cyan-400" />
            </div>

            {/* Skills Title */}
            <div className="pl-6 py-1">
              <h2 className="text-[clamp(48px,6vw,76px)] font-bold text-white tracking-tight leading-none font-sans">
                Skills
              </h2>
            </div>

            {/* </h1> tag row */}
            <div className="flex items-center gap-3 pl-3">
              <span className="font-mono text-[13px] text-purple-400 font-medium">&lt;/h1&gt;</span>
              <div className="h-[4px] w-32 rounded-full bg-gradient-to-r from-purple-500 to-blue-500" />
              <div className="h-[4px] w-28 rounded-full bg-gradient-to-r from-cyan-400 to-teal-400" />
            </div>

            {/* <p> tag row */}
            <div className="flex items-center gap-3 pl-3">
              <span className="font-mono text-[13px] text-emerald-400 font-medium">&lt;p&gt;</span>
              <div className="h-[4px] w-44 rounded-full bg-gradient-to-r from-emerald-400 via-lime-400 to-yellow-300" />
            </div>

            {/* Skills Description Paragraph */}
            <div className="pl-6 py-2 max-w-[480px]">
              <p className="text-[16px] md:text-[17px] text-gray-300 leading-relaxed font-sans font-light">
                My skills are wide-ranging, spanning across enterprise backend architectures, distributed systems, responsive web interfaces, and modern vector AI. I absorb information like a sponge and I'm in constant pursuit of skills that help develop me into a well-rounded software engineer.
              </p>
            </div>

            {/* </p> tag row */}
            <div className="flex items-center gap-3 pl-3">
              <span className="font-mono text-[13px] text-emerald-400 font-medium">&lt;/p&gt;</span>
              <div className="h-[4px] w-64 rounded-full bg-gradient-to-r from-orange-400 via-rose-500 to-fuchsia-500" />
            </div>

            {/* </body> tag row */}
            <div className="flex items-center gap-3">
              <span className="font-mono text-[13px] text-amber-400 font-medium">&lt;/body&gt;</span>
              <div className="h-[4px] w-28 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
              <div className="h-[4px] w-16 rounded-full bg-gray-500/30" />
            </div>
          </div>

          {/* Right Column: Constellation Galaxy Cloud (Exact match to reference screenshot) */}
          <div className="lg:col-span-7 relative h-[540px] md:h-[620px] w-full flex items-center justify-center">
            <canvas
              ref={canvasRef}
              className="w-full h-full cursor-crosshair"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
