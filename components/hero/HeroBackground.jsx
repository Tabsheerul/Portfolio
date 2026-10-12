'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// ─────────────────────────────────────────────
// Generates a soft circular glowing star sprite texture
// ─────────────────────────────────────────────
function createStarTexture() {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.18, 'rgba(250, 240, 255, 0.9)');
  gradient.addColorStop(0.45, 'rgba(192, 132, 252, 0.4)');
  gradient.addColorStop(0.8, 'rgba(168, 85, 247, 0.1)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

// ─────────────────────────────────────────────
// Interactive Starfield with Spring Physics Mouse Repulsion
// ─────────────────────────────────────────────
function StarField({ count = 1600 }) {
  const pointsRef = useRef();
  const { viewport } = useThree();
  const mouse = useRef(new THREE.Vector2(9999, 9999));

  // Circular star glow texture
  const starTexture = useMemo(() => createStarTexture(), []);

  const { positions, originalPositions, colors, baseColors, velocities, twinkles } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const origPos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const baseCol = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const tw = new Float32Array(count * 2); // [speed, phase]

    // Celestial theme palette (white + purple / lavender / fuchsia stars)
    const starPalette = [
      new THREE.Color('#ffffff'), // Pure white star (brightest)
      new THREE.Color('#ffffff'), // Pure white star (weighted)
      new THREE.Color('#f3e8ff'), // Pale lilac star
      new THREE.Color('#e9d5ff'), // Soft purple star
      new THREE.Color('#c084fc'), // Lavender star
      new THREE.Color('#d8b4fe'), // Light violet
      new THREE.Color('#a855f7'), // Vibrant purple star
      new THREE.Color('#e879f9'), // Fuchsia glowing star
    ];

    for (let i = 0; i < count; i++) {
      // Broad distribution across the full viewport with 3D depth
      const x = (Math.random() - 0.5) * 28;
      const y = (Math.random() - 0.5) * 18;
      const z = (Math.random() - 0.5) * 14 - 1; // z from -8 to +6

      const i3 = i * 3;
      pos[i3] = x;
      pos[i3 + 1] = y;
      pos[i3 + 2] = z;

      origPos[i3] = x;
      origPos[i3 + 1] = y;
      origPos[i3 + 2] = z;

      vel[i3] = 0;
      vel[i3 + 1] = 0;
      vel[i3 + 2] = 0;

      // Pick color from celestial palette
      const color = starPalette[Math.floor(Math.random() * starPalette.length)];
      // Subtle brightness variation
      const brightness = 0.75 + Math.random() * 0.45;
      col[i3] = Math.min(1, color.r * brightness);
      col[i3 + 1] = Math.min(1, color.g * brightness);
      col[i3 + 2] = Math.min(1, color.b * brightness);

      baseCol[i3] = col[i3];
      baseCol[i3 + 1] = col[i3 + 1];
      baseCol[i3 + 2] = col[i3 + 2];

      // Twinkle parameters
      tw[i * 2] = 1.0 + Math.random() * 2.5; // speed
      tw[i * 2 + 1] = Math.random() * Math.PI * 2; // phase offset
    }

    return {
      positions: pos,
      originalPositions: origPos,
      colors: col,
      baseColors: baseCol,
      velocities: vel,
      twinkles: tw,
    };
  }, [count]);

  useFrame(({ clock, pointer }) => {
    if (!pointsRef.current) return;

    const time = clock.getElapsedTime();
    const posArray = pointsRef.current.geometry.attributes.position.array;
    const colArray = pointsRef.current.geometry.attributes.color.array;

    // Convert normalized device pointer (-1 to 1) to world coordinate space
    mouse.current.set(
      pointer.x * (viewport.width * 0.5),
      pointer.y * (viewport.height * 0.5)
    );

    const springK = 0.055;
    const friction = 0.88;
    const repelRadius = 2.8;
    const repelForce = 1.8;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const origX = originalPositions[i3];
      const origY = originalPositions[i3 + 1];
      const origZ = originalPositions[i3 + 2];

      // Cosmic floating motion (gentle sine wave drift)
      const floatX = Math.cos(time * 0.35 + i * 0.07) * 0.08;
      const floatY = Math.sin(time * 0.45 + i * 0.09) * 0.12;

      let targetX = origX + floatX;
      let targetY = origY + floatY;
      let targetZ = origZ;

      // Mouse repulsion in XY plane
      const dx = posArray[i3] - mouse.current.x;
      const dy = posArray[i3 + 1] - mouse.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      let isDisturbed = false;
      if (dist < repelRadius && dist > 0.001) {
        const force = (1.0 - dist / repelRadius) * repelForce;
        targetX += (dx / dist) * force;
        targetY += (dy / dist) * force;
        targetZ += (Math.random() - 0.5) * force * 0.5;
        isDisturbed = true;
      }

      // Spring physics toward target
      const ax = (targetX - posArray[i3]) * springK;
      const ay = (targetY - posArray[i3 + 1]) * springK;
      const az = (targetZ - posArray[i3 + 2]) * springK;

      velocities[i3] = (velocities[i3] + ax) * friction;
      velocities[i3 + 1] = (velocities[i3 + 1] + ay) * friction;
      velocities[i3 + 2] = (velocities[i3 + 2] + az) * friction;

      posArray[i3] += velocities[i3];
      posArray[i3 + 1] += velocities[i3 + 1];
      posArray[i3 + 2] += velocities[i3 + 2];

      // Subtle twinkling intensity
      const twSpeed = twinkles[i * 2];
      const twPhase = twinkles[i * 2 + 1];
      const twinkleFactor = 0.85 + Math.sin(time * twSpeed + twPhase) * 0.25;

      // Excited glow boost when pushed by cursor
      const glowBoost = isDisturbed ? 1.4 : 1.0;

      colArray[i3] = Math.min(1, baseColors[i3] * twinkleFactor * glowBoost);
      colArray[i3 + 1] = Math.min(1, baseColors[i3 + 1] * twinkleFactor * glowBoost);
      colArray[i3 + 2] = Math.min(1, baseColors[i3 + 2] * twinkleFactor * glowBoost);
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.geometry.attributes.color.needsUpdate = true;

    // Very gentle celestial rotation
    pointsRef.current.rotation.y = time * 0.012;
    pointsRef.current.rotation.x = Math.sin(time * 0.008) * 0.02;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.11}
        map={starTexture || undefined}
        vertexColors
        transparent
        opacity={0.92}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ─────────────────────────────────────────────
// Deep Background Ambient Nebula Dust
// ─────────────────────────────────────────────
function DeepCosmicDust({ count = 600 }) {
  const meshRef = useRef();

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const dustColors = [
      new THREE.Color('#c084fc'),
      new THREE.Color('#a855f7'),
      new THREE.Color('#7c3aed'),
      new THREE.Color('#ffffff'),
    ];

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 36;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 24;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 16 - 3;

      const c = dustColors[Math.floor(Math.random() * dustColors.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }

    return { positions: pos, colors: col };
  }, [count]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    meshRef.current.rotation.y = t * 0.006;
    meshRef.current.rotation.x = Math.sin(t * 0.005) * 0.015;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        vertexColors
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ─────────────────────────────────────────────
// Main Exported HeroBackground Component
// ─────────────────────────────────────────────
export default function HeroBackground({ particleCount = 1600 }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 60 }}
      dpr={[1, 1.5]}
      frameloop="always"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
      }}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      onCreated={({ gl }) => {
        gl.setClearColor('#0d0a1a', 1);
      }}
    >
      <DeepCosmicDust count={600} />
      <StarField count={particleCount} />
    </Canvas>
  );
}
