import React from 'react';
import { cn } from '../../lib/utils';

export const Headline = ({ children, className, as: Component = "h1" }: any) => {
  return (
    <Component className={cn("font-cabinet font-bold tracking-tight text-slate-900 leading-tight", className)}>
      {children}
    </Component>
  );
};

export const OversizedNumber = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("font-cabinet font-black text-6xl md:text-8xl tracking-tighter text-slate-900", className)}>
    {children}
  </div>
);

export const DataLabel = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] text-slate-500", className)}>
    {children}
  </div>
);

export const BodyText = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <p className={cn("text-slate-600 leading-relaxed text-sm md:text-base", className)}>
    {children}
  </p>
);
