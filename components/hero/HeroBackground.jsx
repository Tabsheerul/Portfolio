'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
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
// Autonomous Smooth Starfield (No Mouse Interaction)
// ─────────────────────────────────────────────
function StarField({ count = 1600 }) {
  const pointsRef = useRef();

  // Circular star glow texture
  const starTexture = useMemo(() => createStarTexture(), []);

  const { positions, originalPositions, colors, baseColors, twinkles } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const origPos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const baseCol = new Float32Array(count * 3);
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
      twinkles: tw,
    };
  }, [count]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;

    const time = clock.getElapsedTime();
    const posArray = pointsRef.current.geometry.attributes.position.array;
    const colArray = pointsRef.current.geometry.attributes.color.array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const origX = originalPositions[i3];
      const origY = originalPositions[i3 + 1];
      const origZ = originalPositions[i3 + 2];

      // Autonomous gentle celestial drift (harmonic floating sine waves)
      posArray[i3] = origX + Math.cos(time * 0.35 + i * 0.07) * 0.12;
      posArray[i3 + 1] = origY + Math.sin(time * 0.45 + i * 0.09) * 0.15;
      posArray[i3 + 2] = origZ + Math.sin(time * 0.25 + i * 0.05) * 0.08;

      // Smooth organic twinkling
      const twSpeed = twinkles[i * 2];
      const twPhase = twinkles[i * 2 + 1];
      const twinkleFactor = 0.82 + Math.sin(time * twSpeed + twPhase) * 0.22;

      colArray[i3] = Math.min(1, baseColors[i3] * twinkleFactor);
      colArray[i3 + 1] = Math.min(1, baseColors[i3 + 1] * twinkleFactor);
      colArray[i3 + 2] = Math.min(1, baseColors[i3 + 2] * twinkleFactor);
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.geometry.attributes.color.needsUpdate = true;

    // Smooth eternal celestial rotation
    pointsRef.current.rotation.y = time * 0.012;
    pointsRef.current.rotation.x = Math.sin(time * 0.008) * 0.018;
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
