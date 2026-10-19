'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import CustomCursor from './CustomCursor';

export default function CursorProvider({ children }) {
  const { setCursorVariant, setCursorText } = useAppStore();

  useEffect(() => {
    // Add event delegation to the body to handle hover states dynamically based on data attributes
    const handleMouseOver = (e) => {
      // First check if hovering over form inputs / editable text
      if (e.target.closest('input, textarea, [contenteditable="true"]')) {
        setCursorVariant('hidden');
        setCursorText('');
        return;
      }

      const target = e.target.closest('[data-cursor]');
      if (target) {
        const variant = target.getAttribute('data-cursor');
        const text = target.getAttribute('data-cursor-text') || '';
        
        setCursorVariant(variant);
        if (text) setCursorText(text);
      } else if (e.target.closest('a, button, [role="button"], select')) {
        // Fallback for native interactive elements
        setCursorVariant('hover');
      }
    };

    const handleMouseOut = (e) => {
      if (e.target.closest('input, textarea, [contenteditable="true"]')) {
        // Re-evaluate what we are now hovering over
        setCursorVariant('default');
        return;
      }

      const target = e.target.closest('[data-cursor]');
      if (target) {
        setCursorVariant('default');
        setCursorText('');
      } else if (e.target.closest('a, button, [role="button"], select')) {
        setCursorVariant('default');
      }
    };

    const handleMouseDown = (e) => {
      if (e.target.closest('input, textarea, [contenteditable="true"]')) {
        setCursorVariant('hidden');
        return;
      }
      setCursorVariant('click');
    };

    const handleMouseUp = (e) => {
      if (e.target.closest('input, textarea, [contenteditable="true"]')) {
        setCursorVariant('hidden');
        return;
      }
      // Re-evaluate what we are hovering over
      const target = e.target.closest('[data-cursor]');
      if (target) {
        setCursorVariant(target.getAttribute('data-cursor'));
      } else if (e.target.closest('a, button, [role="button"], select')) {
        setCursorVariant('hover');
      } else {
        setCursorVariant('default');
      }
    };

    const handleWindowLeave = () => {
      setCursorVariant('hidden');
    };

    const handleWindowEnter = () => {
      setCursorVariant('default');
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.documentElement.addEventListener('mouseleave', handleWindowLeave);
    document.documentElement.addEventListener('mouseenter', handleWindowEnter);

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.documentElement.removeEventListener('mouseleave', handleWindowLeave);
      document.documentElement.removeEventListener('mouseenter', handleWindowEnter);
    };
  }, [setCursorVariant, setCursorText]);

  return (
    <>
      <CustomCursor />
      {children}
    </>
  );
}
