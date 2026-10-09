'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// ─────────────────────────────────────────────
// Particle Field: 300 particles with subtle floating motion and mouse repel
// ─────────────────────────────────────────────
function ParticleField({ count = 300 }) {
  const pointsRef = useRef();
  const { viewport } = useThree();

  // Generate random positions and colors once
  const { positions, originalPositions, colors, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const origPos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sz = new Float32Array(count);

    const cyan = new THREE.Color('#00d4ff');
    const white = new THREE.Color('#ffffff');

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 15;
      const y = (Math.random() - 0.5) * 15;
      const z = (Math.random() - 0.5) * 15;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      origPos[i * 3] = x;
      origPos[i * 3 + 1] = y;
      origPos[i * 3 + 2] = z;

      // 20% chance of cyan, 80% white
      const isCyan = Math.random() < 0.2;
      const color = isCyan ? cyan : white;
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;

      sz[i] = isCyan ? 0.035 : 0.02;
    }

    return { positions: pos, originalPositions: origPos, colors: col, sizes: sz };
  }, [count]);

  // Mouse position in normalized device coords
  const mouse = useRef(new THREE.Vector2(0, 0));

  useFrame(({ clock, pointer }) => {
    if (!pointsRef.current) return;

    const time = clock.getElapsedTime();
    const posArray = pointsRef.current.geometry.attributes.position.array;

    // Map pointer (-1 to 1) to world space approximately
    mouse.current.set(pointer.x * viewport.width * 0.5, pointer.y * viewport.height * 0.5);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const origX = originalPositions[i3];
      const origY = originalPositions[i3 + 1];
      const origZ = originalPositions[i3 + 2];

      // Subtle floating sine wave
      const floatY = Math.sin(time * 0.5 + i * 0.1) * 0.08;

      // Mouse repulsion on XY plane
      const dx = posArray[i3] - mouse.current.x;
      const dy = posArray[i3 + 1] - mouse.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      let targetX = origX;
      let targetY = origY + floatY;
      let targetZ = origZ;

      if (dist < 2) {
        const force = (1 - dist / 2) * 0.3;
        targetX = origX + (dx / (dist || 1)) * force;
        targetY = origY + floatY + (dy / (dist || 1)) * force;
      }

      // Lerp towards target for smooth return
      posArray[i3] += (targetX - posArray[i3]) * 0.05;
      posArray[i3 + 1] += (targetY - posArray[i3 + 1]) * 0.05;
      posArray[i3 + 2] = targetZ;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // Slow global rotation
    pointsRef.current.rotation.y += 0.0003;
  });

  // Use PointsMaterial for simple size; custom sizes would need ShaderMaterial
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
        size={0.025}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ─────────────────────────────────────────────
// Gradient Mesh: slowly morphing wireframe icosahedron
// ─────────────────────────────────────────────
function GradientMesh() {
  const meshRef = useRef();

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.3) * 0.2;
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} scale={[1.5, 1.5, 1.5]}>
      <icosahedronGeometry args={[1, 1]} />
      <MeshDistortMaterial
        color="#00d4ff"
        transparent
        opacity={0.08}
        distort={0.3}
        speed={2}
        wireframe
      />
    </mesh>
  );
}

// ─────────────────────────────────────────────
// Main exported component
// ─────────────────────────────────────────────
export default function HeroBackground({ particleCount = 300 }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      dpr={[1, 2]}
      frameloop="always"
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
      gl={{ antialias: true, alpha: false }}
      onCreated={({ gl }) => { gl.setClearColor('#050505'); }}
    >
      <ParticleField count={particleCount} />
      <GradientMesh />
    </Canvas>
  );
}
