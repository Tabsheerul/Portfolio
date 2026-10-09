'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(MotionPathPlugin);

export default function DataPacket({
  pathSelector,
  color,
  duration = 4,
  delay = 0,
  size = 3,
}) {
  const packetRef = useRef(null);

  useGSAP(() => {
    if (!packetRef.current) return;

    // Query the SVG path element using the selector
    const pathEl = document.querySelector(pathSelector);
    if (!pathEl) return;

    gsap.to(packetRef.current, {
      motionPath: {
        path: pathEl,
        align: pathEl,
        alignOrigin: [0.5, 0.5],
        autoRotate: false,
      },
      duration,
      repeat: -1,
      ease: 'none',
      delay,
    });
  }, { dependencies: [pathSelector, duration, delay] });

  return (
    <circle
      ref={packetRef}
      r={size}
      fill={color}
      opacity={0.9}
      filter="url(#glow-small)"
    />
  );
}
