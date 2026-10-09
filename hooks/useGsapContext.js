'use client';

import { useMemo } from 'react';
import gsap from 'gsap';

export function useGsapContext(scopeRef) {
  const ctx = useMemo(() => gsap.context(() => {}, scopeRef), [scopeRef]);
  return ctx;
}
