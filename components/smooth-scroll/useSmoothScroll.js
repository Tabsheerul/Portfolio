'use client';

import { useEffect, useState } from 'react';

// Simplified hook as Lenis instance is managed globally, but can provide access if needed later.
// Currently returns whether scroll is initialized or basic scroll Y if needed.
export function useSmoothScroll() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { scrollY };
}
