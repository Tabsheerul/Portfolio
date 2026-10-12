'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useAppStore } from '@/lib/store';

export default function CustomCursor() {
  const { cursorVariant, cursorText } = useAppStore();
  const innerDotRef = useRef(null);
  const outerRingRef = useRef(null);
  const textRef = useRef(null);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Detect touch device or reduced motion
    const isTouchDevice = 'ontouchstart' in window || window.matchMedia('(hover: none)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (isTouchDevice || prefersReducedMotion) {
      setIsTouch(true);
      return;
    }

    const xToInner = gsap.quickTo(innerDotRef.current, 'x', { duration: 0, ease: 'none' });
    const yToInner = gsap.quickTo(innerDotRef.current, 'y', { duration: 0, ease: 'none' });
    
    const xToOuter = gsap.quickTo(outerRingRef.current, 'x', { duration: 0.15, ease: 'power2.out' });
    const yToOuter = gsap.quickTo(outerRingRef.current, 'y', { duration: 0.15, ease: 'power2.out' });

    let isVisible = false;

    const onMouseMove = (e) => {
      const { clientX, clientY } = e;
      
      // Initially show cursor once mouse moves
      if (!isVisible) {
        gsap.set([innerDotRef.current, outerRingRef.current], { opacity: 1 });
        isVisible = true;
      }

      xToInner(clientX);
      yToInner(clientY);
      xToOuter(clientX);
      yToOuter(clientY);
    };

    window.addEventListener('mousemove', onMouseMove);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  // Handle visual state changes based on variant
  useEffect(() => {
    if (isTouch) return;

    let innerProps = { scale: 1, opacity: 1 };
    let outerProps = { 
      width: 40, 
      height: 40, 
      borderColor: 'rgba(255, 255, 255, 0.5)', 
      boxShadow: 'none',
      backgroundColor: 'transparent'
    };
    let textProps = { opacity: 0, scale: 0.8 };

    switch (cursorVariant) {
      case 'hover':
        outerProps = {
          width: 64,
          height: 64,
          borderColor: '#a855f7',
          boxShadow: '0 0 20px rgba(168, 85, 247, 0.35)',
          backgroundColor: 'transparent'
        };
        innerProps = { scale: 0.5, opacity: 1 };
        break;
      case 'click':
        outerProps.width = 36;
        outerProps.height = 36;
        innerProps.scale = 0.9;
        break;
      case 'view':
        outerProps = {
          width: 80,
          height: 80,
          borderColor: 'rgba(255,255,255,0.2)',
          boxShadow: 'none',
          backgroundColor: 'rgba(255,255,255,0.05)'
        };
        innerProps = { scale: 0, opacity: 0 };
        textProps = { opacity: 1, scale: 1 };
        break;
      case 'drag':
        outerProps = {
          width: 56,
          height: 56,
          borderColor: 'rgba(255,255,255,0.2)',
          boxShadow: 'none',
          backgroundColor: 'transparent'
        };
        innerProps = { scale: 0, opacity: 0 };
        textProps = { opacity: 1, scale: 1 };
        break;
      default:
        // 'default' state handled by initialization above
        break;
    }

    gsap.to(outerRingRef.current, {
      ...outerProps,
      duration: 0.3,
      ease: 'power2.out',
      // center offset handling when width/height changes
      xPercent: -50,
      yPercent: -50
    });

    gsap.to(innerDotRef.current, {
      ...innerProps,
      duration: 0.3,
      ease: 'power2.out',
      xPercent: -50,
      yPercent: -50
    });

    if (textRef.current) {
      gsap.to(textRef.current, {
        ...textProps,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  }, [cursorVariant, isTouch]);

  if (isTouch) return null;

  return (
    <>
      {/* Outer Ring */}
      <div 
        ref={outerRingRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full border border-white/50 flex items-center justify-center"
        style={{ width: '40px', height: '40px', opacity: 0, transform: 'translate(-50%, -50%)' }}
      >
        <span 
          ref={textRef} 
          className="text-[12px] font-semibold text-white uppercase opacity-0 pointer-events-none"
        >
          {cursorVariant === 'view' ? 'VIEW' : cursorVariant === 'drag' ? 'DRAG' : cursorText}
        </span>
      </div>

      {/* Inner Dot */}
      <div 
        ref={innerDotRef}
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[9998]"
        style={{ opacity: 0, mixBlendMode: 'difference', transform: 'translate(-50%, -50%)' }}
      />
    </>
  );
}
