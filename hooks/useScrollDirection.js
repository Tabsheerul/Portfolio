'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';

// This hook uses Lenis scroll data directly (assumes it is integrated via the smooth scroll provider)
export function useScrollDirection() {
  const { setScrollDirection, setIsScrolled } = useAppStore();

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      if (currentScrollY > lastScrollY) {
        setScrollDirection('down');
      } else if (currentScrollY < lastScrollY) {
        setScrollDirection('up');
      }

      lastScrollY = currentScrollY;
    };

    // Lenis might fire its own events, but native scroll event acts as a fallback/sync.
    // Lenis usually syncs window scroll.
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [setScrollDirection, setIsScrolled]);
}
