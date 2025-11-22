import React from 'react';
import { cn } from '@/utils/cn';

export type BasicProgressBarProps = {
  value: number; // 0..100
  className?: string;
};

const BasicProgressBar: React.FC<BasicProgressBarProps> = ({ value, className }) => (
  <div className={cn('w-full h-2 bg-slate-100 rounded-full overflow-hidden', className)}>
    <div className="h-full bg-sky-500" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
  </div>
);
export default BasicProgressBar;
