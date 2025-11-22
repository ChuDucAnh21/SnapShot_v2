import React from 'react';
import { cn } from '@/utils/cn';

export type CardSurfaceProps = React.HTMLAttributes<HTMLDivElement>;

const CardSurface: React.FC<CardSurfaceProps> = ({ className, ...rest }) => (
  <div className={cn('rounded-2xl bg-white shadow-sm ring-1 ring-slate-200', className)} {...rest} />
);
export default CardSurface;
