import React from 'react';
import { cn } from '@/utils/cn';

const Divider: React.FC<React.HTMLAttributes<HTMLHRElement>> = ({ className, ...rest }) => (
  <hr className={cn('my-4 border-slate-200', className)} {...rest} />
);
export default Divider;
