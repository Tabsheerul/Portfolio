'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

/**
 * ScrubRevealText — Marcus Lorenzet style
 *
 * Long body text starts dim and lights up word-by-word as you scroll.
 * The animation is SCRUBBED to scroll position — scroll back up, words dim back.
 *
 * Props:
 *   text        — the full string
 *   as          — HTML tag (default 'p')
 *   className   — applied to the wrapper tag
 *   dimColor    — starting muted color  (default: rgba(255,255,255,0.12))
 *   brightColor — final bright color    (default: rgba(255,255,255,0.9))
 *   start       — ScrollTrigger start   (default: 'top 85%')
 *   end         — ScrollTrigger end     (default: 'bottom 20%')
 *   scrub       — scrub smoothing value (default: 2)
 */
export default function ScrubRevealText({
  text,
  as: Tag = 'p',
  className = '',
  dimColor = 'rgba(255,255,255,0.12)',
  brightColor = 'rgba(255,255,255,0.92)',
  start = 'top 85%',
  end = 'bottom 20%',
  scrub = 2,
}) {
  const containerRef = useRef(null);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      // Show everything fully visible immediately
      containerRef.current.querySelectorAll('.scrub-word').forEach(el => {
        el.style.color = brightColor;
      });
      return;
    }

    const words = containerRef.current.querySelectorAll('.scrub-word');
    if (!words.length) return;

    gsap.fromTo(
      words,
      { color: dimColor },
      {
        color: brightColor,
        ease: 'none',
        stagger: {
          each: 0.04,
          from: 'start',
        },
        scrollTrigger: {
          trigger: containerRef.current,
          start,
          end,
          scrub,
        },
      }
    );
  }, { scope: containerRef });

  const words = text.split(' ');

  return (
    <Tag ref={containerRef} className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          className="scrub-word inline"
          style={{ color: dimColor }}
        >
          {word}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  );
}
