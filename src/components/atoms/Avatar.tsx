import Image from 'next/image';
import * as React from 'react';

export type AvatarProps = {
  src?: string;
  alt?: string;
  size?: number; // px
  fallback?: string; // initials
} & React.HTMLAttributes<HTMLDivElement>;

export default function Avatar({ src, alt = '', size = 32, fallback, className, ...rest }: AvatarProps) {
  const radius = 'rounded-full';
  return (
    <div
      className={[
        radius,
        'bg-white/10 text-center text-xs font-medium text-[--foreground] inline-flex items-center justify-center overflow-hidden',
      ]
        .concat(className ?? '')
        .join(' ')}
      style={{ width: size, height: size }}
      {...rest}
    >
      {src
        ? (
          <Image src={src} alt={alt} width={size} height={size} className={radius} />
        )
        : (
          <span aria-hidden>{fallback?.slice(0, 2).toUpperCase()}</span>
        )}
    </div>
  );
}
