'use client';

import { useRef, useId } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

/**
 * StrokeRevealText
 *
 * Renders text as an outlined stroke and, as you scroll,
 * a solid-filled clone reveals itself left-to-right via clipPath,
 * staggered letter by letter. This perfectly handles wrapping text.
 *
 * Props:
 *   text          — the string to display
 *   as            — HTML tag ('h1' | 'h2' | 'h3' | 'span' | 'p')
 *   className     — classes applied to both layers (size, font, etc.)
 *   strokeColor   — outline color (default: rgba(255,255,255,0.2))
 *   fillColor     — fill color for the revealed text (default: #ffffff)
 *   strokeWidth   — SVG-style stroke width in px (default: 1)
 *   start         — ScrollTrigger start position (default: 'top 80%')
 *   end           — ScrollTrigger end position (default: 'top 30%')
 *   scrub         — whether to scrub to scroll (default: true)
 *   id            — optional HTML id on the wrapper
 */
export default function StrokeRevealText({
  text,
  as: Tag = 'h2',
  className = '',
  strokeColor = 'rgba(255, 255, 255, 0.18)',
  fillColor = '#ffffff',
  strokeWidth = 1,
  start = 'top 80%',
  end = 'top 30%',
  scrub = true,
  id,
}) {
  const wrapperRef = useRef(null);
  const uid = useId().replace(/:/g, '');

  useGSAP(() => {
    if (!wrapperRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const chars = wrapperRef.current.querySelectorAll('.fill-char');
    
    if (prefersReducedMotion) {
      // Just show filled text immediately
      gsap.set(chars, { clipPath: 'inset(0% 0% 0% 0%)' });
      return;
    }

    if (!chars.length) return;

    gsap.fromTo(
      chars,
      { clipPath: 'inset(0% 100% 0% 0%)' },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        ease: 'none',
        stagger: {
          each: 0.1, // slightly overlap the letter reveals
        },
        scrollTrigger: {
          trigger: wrapperRef.current,
          start,
          end,
          scrub: scrub ? 1.5 : false,
          toggleActions: scrub ? undefined : 'play none none none',
        },
      }
    );
  }, { scope: wrapperRef });

  const sharedStyle = {
    WebkitTextStroke: `${strokeWidth}px ${strokeColor}`,
    color: 'transparent',
  };

  const filledStyle = {
    WebkitTextStroke: '0px transparent',
    color: fillColor,
  };

  const words = text.split(' ');

  return (
    <Tag ref={wrapperRef} id={id} className={className} aria-label={text}>
      {words.map((word, wIndex) => (
        <span key={wIndex} className="inline-block whitespace-nowrap">
          {word.split('').map((char, cIndex) => (
            <span key={`${wIndex}-${cIndex}`} className="relative inline-block">
              {/* Bottom layer: stroke only */}
              <span style={sharedStyle} aria-hidden="true">
                {char}
              </span>
              {/* Top layer: filled, clipped to reveal left→right */}
              <span
                className="fill-char absolute inset-0"
                style={{ ...filledStyle, clipPath: 'inset(0% 100% 0% 0%)' }}
                aria-hidden="true"
              >
                {char}
              </span>
            </span>
          ))}
          {wIndex < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </Tag>
  );
}
