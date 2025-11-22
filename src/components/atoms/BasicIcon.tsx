import React from 'react';
import { cn } from '@/utils/cn';

export type BasicIconProps = React.SVGProps<SVGSVGElement> & {
  name?: string;
  size?: number;
  ariaLabel?: string;
};

/** Generic Icon wrapper. In real app, map `name` to lucide-react icons. */
const BasicIcon: React.FC<BasicIconProps> = ({ name, size = 20, ariaLabel, className, ...rest }) => {
  return (
    <svg
      role="img"
      aria-label={ariaLabel || name || 'icon'}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={cn('inline-block', className)}
      {...rest}
    >
      <circle cx="12" cy="12" r="10" className="fill-current opacity-20" />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="10">
        {name?.[0] || 'i'}
      </text>
    </svg>
  );
};
export default BasicIcon;
