'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function ConnectionLine({
  pathD,
  color,
  isActive,
  isDimmed,
  id,
}) {
  const pathRef = useRef(null);

  // Set dash for draw animation
  useEffect(() => {
    if (!pathRef.current) return;
    const length = pathRef.current.getTotalLength();
    pathRef.current.style.strokeDasharray = length;
    pathRef.current.style.strokeDashoffset = length;
  }, [pathD]);

  // Active / Dimmed states
  useGSAP(() => {
    if (!pathRef.current) return;

    if (isActive) {
      gsap.to(pathRef.current, {
        stroke: color,
        strokeOpacity: 0.6,
        strokeWidth: 2,
        duration: 0.4,
        ease: 'power2.out',
      });
    } else if (isDimmed) {
      gsap.to(pathRef.current, {
        stroke: 'rgba(255,255,255,0.08)',
        strokeOpacity: 0.04,
        strokeWidth: 1,
        duration: 0.4,
        ease: 'power2.out',
      });
    } else {
      gsap.to(pathRef.current, {
        stroke: 'rgba(255,255,255,0.08)',
        strokeOpacity: 1,
        strokeWidth: 1,
        duration: 0.4,
        ease: 'power2.out',
      });
    }
  }, { dependencies: [isActive, isDimmed, color] });

  return (
    <path
      ref={pathRef}
      className="architecture-line"
      d={pathD}
      fill="none"
      stroke="rgba(255,255,255,0.08)"
      strokeWidth={1}
      strokeLinecap="round"
      data-line-id={id}
    />
  );
}
