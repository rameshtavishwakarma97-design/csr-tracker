import React from 'react';
import { cn } from '../../lib/utils';

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  columns?: 12 | 6 | 4 | 3;
}

export const Grid = ({ children, columns = 12, className, ...props }: GridProps) => {
  return (
    <div 
      className={cn(
        "grid gap-4 md:gap-6 lg:gap-8",
        {
          "grid-cols-1 md:grid-cols-12": columns === 12,
          "grid-cols-1 md:grid-cols-6": columns === 6,
          "grid-cols-1 md:grid-cols-4": columns === 4,
          "grid-cols-1 md:grid-cols-3": columns === 3,
        },
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};
