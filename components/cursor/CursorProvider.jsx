'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import CustomCursor from './CustomCursor';

export default function CursorProvider({ children }) {
  const { setCursorVariant, setCursorText } = useAppStore();

  useEffect(() => {
    // Add event delegation to the body to handle hover states dynamically based on data attributes
    const handleMouseOver = (e) => {
      const target = e.target.closest('[data-cursor]');
      if (target) {
        const variant = target.getAttribute('data-cursor');
        const text = target.getAttribute('data-cursor-text') || '';
        
        setCursorVariant(variant);
        if (text) setCursorText(text);
      } else if (e.target.closest('a, button, [role="button"], input, textarea, select')) {
        // Fallback for native interactive elements
        setCursorVariant('hover');
      }
    };

    const handleMouseOut = (e) => {
      const target = e.target.closest('[data-cursor]');
      if (target) {
        setCursorVariant('default');
        setCursorText('');
      } else if (e.target.closest('a, button, [role="button"], input, textarea, select')) {
        setCursorVariant('default');
      }
    };

    const handleMouseDown = () => {
      setCursorVariant('click');
    };

    const handleMouseUp = (e) => {
      // Re-evaluate what we are hovering over
      const target = e.target.closest('[data-cursor]');
      if (target) {
        setCursorVariant(target.getAttribute('data-cursor'));
      } else if (e.target.closest('a, button, [role="button"]')) {
        setCursorVariant('hover');
      } else {
        setCursorVariant('default');
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [setCursorVariant, setCursorText]);

  return (
    <>
      <CustomCursor />
      {children}
    </>
  );
}
