'use client';

import { useEffect, useRef } from 'react';

// ─── Constellation data ────────────────────────────────────────────────────────
const CONSTELLATION_DATA = [
  {
    id: 'backend',
    title: 'BACKEND ARCHITECTURE',
    x: 0.46,
    y: 0.20,
    size: 18,
    color: '#ffffff',
    glowColor: '#a855f7',
    children: [
      { name: 'Spring Boot',       color: '#c084fc', size: 13, dx: -190, dy: -50 },
      { name: 'Java 21',           color: '#e879f9', size: 13, dx:  185, dy: -50 },
      { name: 'Apache Kafka',      color: '#c084fc', size: 12, dx: -210, dy:  25 },
      { name: 'Microservices',     color: '#e2e8f0', size: 12, dx:  195, dy:  25 },
      { name: 'Distributed Systems', color: '#a855f7', size: 12, dx: 0, dy:  72 },
      { name: 'Hibernate / JPA',   color: '#38bdf8', size: 11, dx: -140, dy: 105 },
      { name: 'Spring Security',   color: '#c084fc', size: 11, dx:  140, dy: 105 },
    ],
  },
  {
    id: 'web',
    title: 'WEB DEVELOPMENT',
    x: 0.73,
    y: 0.46,
    size: 18,
    color: '#ffffff',
    glowColor: '#38bdf8',
    children: [
      { name: 'React.js',       color: '#38bdf8', size: 13, dx: -165, dy: -42 },
      { name: 'Next.js',        color: '#f8fafc', size: 13, dx:  158, dy: -38 },
      { name: 'JavaScript',     color: '#facc15', size: 13, dx: -155, dy:  38 },
      { name: 'Tailwind CSS',   color: '#38bdf8', size: 12, dx:  155, dy:  45 },
      { name: 'Redux',          color: '#c084fc', size: 11, dx:  -28, dy:  80 },
      { name: 'Three.js / GSAP',color: '#a855f7', size: 11, dx:  100, dy:  90 },
    ],
  },
  {
    id: 'data-ai',
    title: 'DATA & AI LAYER',
    x: 0.28,
    y: 0.74,
    size: 17,
    color: '#ffffff',
    glowColor: '#4ade80',
    children: [
      { name: 'PostgreSQL',       color: '#60a5fa', size: 13, dx: -168, dy: -40 },
      { name: 'pgVector',         color: '#4ade80', size: 13, dx:  165, dy: -35 },
      { name: 'Vertex AI',        color: '#fb923c', size: 13, dx: -148, dy:  42 },
      { name: 'SQL',              color: '#38bdf8', size: 12, dx:  140, dy:  42 },
      { name: 'Vector Embeddings',color: '#4ade80', size: 11, dx:    0, dy:  80 },
    ],
  },
  {
    id: 'devops',
    title: 'DEVOPS & SYSTEMS',
    x: 0.76,
    y: 0.82,
    size: 17,
    color: '#ffffff',
    glowColor: '#f43f5e',
    children: [
      { name: 'Docker',     color: '#38bdf8', size: 13, dx: -148, dy: -38 },
      { name: 'Git & GitHub', color: '#f43f5e', size: 12, dx:  148, dy: -35 },
      { name: 'C Language', color: '#94a3b8', size: 12, dx:  -92, dy:  48 },
      { name: 'REST APIs',  color: '#c084fc', size: 11, dx:   92, dy:  48 },
    ],
  },
];

// ─── Component ─────────────────────────────────────────────────────────────────
export default function SkillsSection() {
  const canvasRef   = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let W = 0, H = 0;
    const dpr = () => Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      if (!canvas.parentElement) return;
      const d = dpr();
      W = canvas.parentElement.clientWidth;
      H = canvas.parentElement.clientHeight || 640;
      canvas.width  = W * d;
      canvas.height = H * d;
      canvas.style.width  = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(d, 0, 0, d, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    // ─── Mouse with smooth lag ─────────────────────────────────────────────────
    const mouse = { x: W * 0.5, y: H * 0.5, tx: W * 0.5, ty: H * 0.5 };
    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.tx = e.clientX - r.left;
      mouse.ty = e.clientY - r.top;
    };
    canvas.parentElement.addEventListener('mousemove', onMove);

    // ─── Build node / link lists ───────────────────────────────────────────────
    const nodes = [];
    const links = [];

    CONSTELLATION_DATA.forEach((cluster, ci) => {
      const parent = {
        ...cluster,
        name: cluster.title,
        isMajor: true, seed: ci * 13,
        x: cluster.x * W, y: cluster.y * H,
        baseX: cluster.x, baseY: cluster.y,
        pulseT: Math.random() * Math.PI * 2,
      };
      nodes.push(parent);

      cluster.children.forEach((ch, i) => {
        const child = {
          ...ch, isMajor: false, parentRef: parent, seed: ci * 13 + i + 1,
          x: parent.x + ch.dx, y: parent.y + ch.dy,
          hovered: false,
        };
        nodes.push(child);
        links.push({ source: parent, target: child, isCross: false,
                     particles: Array.from({ length: 2 }, () => ({ t: Math.random() })) });
      });
    });

    // Cross-cluster links
    const majorNodes = nodes.filter(n => n.isMajor);
    for (let i = 0; i < majorNodes.length - 1; i++) {
      links.push({
        source: majorNodes[i],
        target: majorNodes[i + 1],
        isCross: true,
        particles: [{ t: Math.random() }],
      });
    }
    links.push({ source: majorNodes[0], target: majorNodes[2], isCross: true,
                 particles: [{ t: Math.random() }] });

    // ─── Helper: safe shadow ────────────────────────────────────────────────────
    const setShadow = (color, blur) => {
      ctx.shadowColor = color;
      ctx.shadowBlur  = blur;
    };
    const clearShadow = () => { ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; };

    // ─── Helper: round-rect for cross-browser label chips ──────────────────────
    const roundRect = (x, y, w, h, r) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    };

    let time = 0;

    const render = () => {
      time += 0.011;

      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;

      ctx.clearRect(0, 0, W, H);

      // Parallax
      const ox = (mouse.x - W * 0.5) * 0.032;
      const oy = (mouse.y - H * 0.5) * 0.032;

      // ── Update positions ────────────────────────────────────────────────────
      nodes.forEach(n => {
        if (n.isMajor) {
          n.x = n.baseX * W + Math.sin(time + n.seed) * 5 + ox * 1.2;
          n.y = n.baseY * H + Math.cos(time * 0.75 + n.seed) * 5 + oy * 1.2;
        } else {
          n.x = n.parentRef.x + n.dx + Math.sin(time * 1.1 + n.seed) * 3;
          n.y = n.parentRef.y + n.dy + Math.cos(time * 0.9 + n.seed) * 3;
        }
        n.hovered = Math.hypot(mouse.x - n.x, mouse.y - n.y) < 50;
      });

      // ── Draw links ──────────────────────────────────────────────────────────
      links.forEach(link => {
        if (!link.source || !link.target) return;
        const { source: s, target: t } = link;

        if (link.isCross) {
          // Dashed gradient cross-cluster link
          ctx.save();
          const grad = ctx.createLinearGradient(s.x, s.y, t.x, t.y);
          grad.addColorStop(0, `${s.glowColor || '#a855f7'}22`);
          grad.addColorStop(1, `${t.glowColor || '#a855f7'}22`);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1;
          ctx.setLineDash([6, 8]);
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(t.x, t.y);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.restore();
        } else {
          // Solid link with glow
          ctx.save();
          const grad = ctx.createLinearGradient(s.x, s.y, t.x, t.y);
          grad.addColorStop(0, `${s.glowColor || '#38bdf8'}20`);
          grad.addColorStop(1, `${t.color || '#38bdf8'}28`);
          setShadow(t.color, 4);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(t.x, t.y);
          ctx.stroke();
          clearShadow();
          ctx.restore();
        }

        // ── Animated particles flowing along links ──────────────────────────
        link.particles.forEach(p => {
          p.t = (p.t + (link.isCross ? 0.003 : 0.006)) % 1;
          const px = s.x + (t.x - s.x) * p.t;
          const py = s.y + (t.y - s.y) * p.t;
          const pColor = link.isCross ? '#a855f7' : (t.color || '#38bdf8');
          setShadow(pColor, 8);
          ctx.beginPath();
          ctx.arc(px, py, link.isCross ? 1.5 : 2, 0, Math.PI * 2);
          ctx.fillStyle = pColor;
          ctx.globalAlpha = 0.7;
          ctx.fill();
          ctx.globalAlpha = 1;
          clearShadow();
        });
      });

      // ── Draw nodes ──────────────────────────────────────────────────────────
      nodes.forEach(n => {
        const hov = n.hovered;

        if (n.isMajor) {
          // ── Outer ambient halo ─────────────────────────────────────────────
          const halo = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, hov ? 54 : 40);
          halo.addColorStop(0, `${n.glowColor}2a`);
          halo.addColorStop(1, `${n.glowColor}00`);
          ctx.beginPath();
          ctx.arc(n.x, n.y, hov ? 54 : 40, 0, Math.PI * 2);
          ctx.fillStyle = halo;
          ctx.fill();

          // ── Pulse ring ─────────────────────────────────────────────────────
          n.pulseT += 0.025;
          const pr = 14 + Math.abs(Math.sin(n.pulseT)) * 12;
          ctx.beginPath();
          ctx.arc(n.x, n.y, pr, 0, Math.PI * 2);
          ctx.strokeStyle = `${n.glowColor}${hov ? '50' : '28'}`;
          ctx.lineWidth = hov ? 1.5 : 1;
          setShadow(n.glowColor, hov ? 14 : 6);
          ctx.stroke();
          clearShadow();

          // ── Core dot ───────────────────────────────────────────────────────
          setShadow(n.glowColor, hov ? 22 : 12);
          ctx.beginPath();
          ctx.arc(n.x, n.y, hov ? 5 : 3.5, 0, Math.PI * 2);
          ctx.fillStyle = hov ? '#ffffff' : n.glowColor;
          ctx.fill();
          clearShadow();

          // ── Label ─────────────────────────────────────────────────────────
          ctx.save();
          ctx.font = `700 ${n.size}px "Space Grotesk","Outfit","Inter",sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          setShadow(n.glowColor, hov ? 20 : 12);
          ctx.fillStyle = hov ? '#ffffff' : 'rgba(255,255,255,0.96)';
          ctx.fillText(n.name, n.x, n.y - 22);
          clearShadow();
          ctx.restore();

        } else {
          // ── Skill chip (pill label) ────────────────────────────────────────
          ctx.save();
          ctx.font = `${hov ? 600 : 400} ${hov ? n.size + 1 : n.size}px "Space Grotesk","Outfit","Inter",sans-serif`;
          ctx.textBaseline = 'middle';
          ctx.textAlign = 'left';
          const metrics = ctx.measureText(n.name);
          const padX = 10, padY = 5;
          const chipW = metrics.width + padX * 2;
          const chipH = n.size + padY * 2;
          const cx = n.x - chipW / 2;
          const cy = n.y - chipH / 2;

          // Pill background
          ctx.globalAlpha = hov ? 0.25 : 0.14;
          roundRect(cx, cy, chipW, chipH, chipH / 2);
          ctx.fillStyle = n.color;
          ctx.fill();
          ctx.globalAlpha = 1;

          // Pill border
          setShadow(n.color, hov ? 14 : 0);
          roundRect(cx, cy, chipW, chipH, chipH / 2);
          ctx.strokeStyle = hov ? n.color : `${n.color}55`;
          ctx.lineWidth = hov ? 1.2 : 0.8;
          ctx.stroke();
          clearShadow();

          // Tiny anchor dot
          ctx.beginPath();
          ctx.arc(n.x, n.y, hov ? 2.8 : 1.8, 0, Math.PI * 2);
          setShadow(n.color, hov ? 10 : 4);
          ctx.fillStyle = n.color;
          ctx.fill();
          clearShadow();

          // Label text
          ctx.textAlign = 'center';
          setShadow(hov ? n.color : 'transparent', hov ? 8 : 0);
          ctx.fillStyle = hov ? '#ffffff' : n.color;
          ctx.fillText(n.name, n.x, n.y);
          clearShadow();
          ctx.restore();
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      canvas.parentElement?.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <section
      id="skills-header"
      ref={containerRef}
      className="relative py-16 md:py-20 overflow-hidden"
      style={{ background: '#0d0a1a' }}
    >
      {/* ── Multi-layer ambient background glows ─────────────────────────── */}
      <div
        className="pointer-events-none absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full blur-[160px] opacity-[0.12]"
        style={{ background: 'radial-gradient(circle, #a855f7 0%, transparent 70%)' }}
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 w-[700px] h-[500px] rounded-full blur-[140px] opacity-[0.10]"
        style={{ background: 'radial-gradient(circle, #38bdf8 0%, #a855f7 50%, transparent 80%)' }}
      />
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[120px] opacity-[0.08]"
        style={{ background: '#c084fc' }}
      />

      {/* ── Subtle noise-grain overlay ───────────────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
          mixBlendMode: 'overlay',
        }}
      />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[600px]">

          {/* ── Left: Code-tag styled bio ─────────────────────────────────── */}
          <div className="lg:col-span-5 space-y-3.5 select-none">
            {/* <body> */}
            <div className="flex items-center gap-3">
              <span className="font-mono text-[13px] text-amber-400 font-medium tracking-wider">&lt;body&gt;</span>
              <div className="h-1 w-20 rounded-full bg-gray-600/40" />
              <div className="h-1 w-24 rounded-full" style={{ background: 'linear-gradient(to right,#f97316,#ec4899)' }} />
            </div>

            {/* <h1> */}
            <div className="flex items-center gap-3 pl-4">
              <span className="font-mono text-[13px] text-purple-400 font-medium tracking-wider">&lt;h1&gt;</span>
              <div className="h-1 w-32 rounded-full" style={{ background: 'linear-gradient(to right,#a855f7,#6366f1,#3b82f6)' }} />
              <div className="h-1 w-12 rounded-full bg-cyan-400" />
            </div>

            {/* Skills headline */}
            <div className="pl-7 py-1">
              <h2
                className="text-[clamp(48px,5.5vw,80px)] font-extrabold tracking-tight leading-none"
                style={{
                  background: 'linear-gradient(135deg, #ffffff 30%, #c084fc 70%, #38bdf8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Skills
              </h2>
            </div>

            {/* </h1> */}
            <div className="flex items-center gap-3 pl-4">
              <span className="font-mono text-[13px] text-purple-400 font-medium tracking-wider">&lt;/h1&gt;</span>
              <div className="h-1 w-28 rounded-full" style={{ background: 'linear-gradient(to right,#a855f7,#3b82f6)' }} />
              <div className="h-1 w-24 rounded-full" style={{ background: 'linear-gradient(to right,#22d3ee,#14b8a6)' }} />
            </div>

            {/* <p> */}
            <div className="flex items-center gap-3 pl-4">
              <span className="font-mono text-[13px] text-emerald-400 font-medium tracking-wider">&lt;p&gt;</span>
              <div className="h-1 w-40 rounded-full" style={{ background: 'linear-gradient(to right,#4ade80,#a3e635,#facc15)' }} />
            </div>

            {/* Description */}
            <div className="pl-7 py-2 max-w-[480px]">
              <p className="text-[15px] md:text-[16px] leading-relaxed font-light" style={{ color: 'rgba(203,213,225,0.85)' }}>
                My skills span enterprise backend architectures, distributed systems, responsive web interfaces, and modern vector AI. I absorb information rapidly and stay in constant pursuit of skills that make me a well-rounded software engineer.
              </p>
            </div>

            {/* </p> */}
            <div className="flex items-center gap-3 pl-4">
              <span className="font-mono text-[13px] text-emerald-400 font-medium tracking-wider">&lt;/p&gt;</span>
              <div className="h-1 w-60 rounded-full" style={{ background: 'linear-gradient(to right,#fb923c,#f43f5e,#d946ef)' }} />
            </div>

            {/* </body> */}
            <div className="flex items-center gap-3">
              <span className="font-mono text-[13px] text-amber-400 font-medium tracking-wider">&lt;/body&gt;</span>
              <div className="h-1 w-24 rounded-full" style={{ background: 'linear-gradient(to right,#22d3ee,#3b82f6)' }} />
              <div className="h-1 w-14 rounded-full bg-gray-600/40" />
            </div>

            {/* Stat pills */}
            <div className="flex flex-wrap gap-3 pt-4 pl-2">
              {[
                { label: '4+', sub: 'clusters' },
                { label: '25+', sub: 'technologies' },
                { label: '3+', sub: 'years exp.' },
              ].map(({ label, sub }) => (
                <div key={sub} className="flex flex-col items-center px-5 py-2.5 rounded-xl border"
                  style={{
                    background: 'rgba(168,85,247,0.06)',
                    borderColor: 'rgba(168,85,247,0.2)',
                  }}>
                  <span className="font-bold text-[22px] leading-none" style={{ color: '#c084fc' }}>{label}</span>
                  <span className="font-mono text-[10px] tracking-widest uppercase mt-0.5" style={{ color: 'rgba(148,163,184,0.7)' }}>{sub}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Constellation galaxy canvas ────────────────────────── */}
          <div className="lg:col-span-7 relative h-[540px] md:h-[640px] w-full flex items-center justify-center">
            {/* Glow underlay behind canvas */}
            <div
              className="absolute inset-0 pointer-events-none rounded-2xl"
              style={{
                background: 'radial-gradient(ellipse 80% 70% at 55% 45%, rgba(168,85,247,0.07) 0%, rgba(56,189,248,0.04) 60%, transparent 100%)',
              }}
            />
            <canvas
              ref={canvasRef}
              className="w-full h-full cursor-crosshair"
              style={{ display: 'block' }}
            />
          </div>

        </div>
      </div>
    </section>
  );
}
