'use client';

import { cn } from '@/lib/utils';

export default function GlassCard({ children, className, ...props }) {
  return (
    <div
      className={cn(
        "p-6 rounded-[8px]",
        "backdrop-blur-[10px]",
        "border transition-all duration-300",
        "hover:shadow-[0_0_24px_rgba(168,85,247,0.1)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
