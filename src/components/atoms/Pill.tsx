import React from 'react';
import { cn } from '@/utils/cn';

export type PillProps = React.HTMLAttributes<HTMLSpanElement> & {
  text?: string;
};

const Pill: React.FC<PillProps> = ({ text, className, ...rest }) => (
  <span
    className={cn(
      'inline-flex items-center rounded-full bg-sky-50 text-sky-700 px-3 py-1 text-xs ring-1 ring-sky-200',
      className,
    )}
    {...rest}
  >
    {text}
  </span>
);
export default Pill;
