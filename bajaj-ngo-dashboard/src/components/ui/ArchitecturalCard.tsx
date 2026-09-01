import React from 'react';
import { cn } from '../../lib/utils';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface CardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  variant?: 'default' | 'inset' | 'accent';
  noPadding?: boolean;
}

export const ArchitecturalCard = ({ 
  children, 
  className, 
  variant = 'default',
  noPadding = false,
  ...props 
}: CardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "relative bg-white/95 backdrop-blur-sm overflow-hidden",
        "border border-slate-200", // Hairline border
        {
          "p-6 md:p-8": !noPadding,
          "bg-slate-50/80": variant === 'inset',
          "border-ice-blue-500 shadow-[0_4px_24px_rgba(2,132,199,0.12)]": variant === 'accent',
        },
        className
      )}
      {...props}
    >
      {/* Decorative corner accent for structural feel */}
      <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-slate-400" />
      <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-slate-400" />
      
      {children}
    </motion.div>
  );
};

export const CardHeader = ({ children, className, noBorder = false }: { children: React.ReactNode, className?: string, noBorder?: boolean }) => (
  <div className={cn("flex flex-col space-y-1.5 mb-6", !noBorder && "pb-6 border-b border-slate-100", className)}>
    {children}
  </div>
);
