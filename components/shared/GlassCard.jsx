'use client';

import { cn } from '@/lib/utils';

export default function GlassCard({ children, className, ...props }) {
  return (
    <div
      className={cn(
        "p-6 rounded-[8px]",
        "bg-white/[0.03] backdrop-blur-[10px]",
        "border border-white/[0.06]",
        "transition-all duration-300",
        "hover:border-[#00d4ff]/20 hover:shadow-[0_0_20px_rgba(0,212,255,0.05)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
