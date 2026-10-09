'use client';

import { useEffect, useRef } from 'react';

// Ref-based mouse position to avoid React state re-renders (as requested)
export function useMousePosition() {
  const mousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', updateMousePosition);
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  return mousePosition;
}
