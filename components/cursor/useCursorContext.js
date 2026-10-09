'use client';

import { useAppStore } from '@/lib/store';

export function useCursorContext() {
  const { setCursorVariant, setCursorText, cursorVariant, cursorText } = useAppStore();
  
  return {
    setCursorVariant,
    setCursorText,
    cursorVariant,
    cursorText
  };
}
