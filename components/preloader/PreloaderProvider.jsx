'use client';

import { useAppStore } from '@/lib/store';
import Preloader from './Preloader';

export default function PreloaderProvider({ children }) {
  const { isLoading } = useAppStore();

  return (
    <>
      {isLoading && <Preloader />}
      {children}
    </>
  );
}
