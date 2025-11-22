import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { cn } from '@/utils/cn';

export type LogoProps = {
  href?: string;
  label?: string;
  className?: string;
};
const Logo: React.FC<LogoProps> = ({ href = '/', className }) => (
  <Link href={href} className={cn('inline-flex items-center font-extrabold text-sky-600 text-xl', className)}>
    <Image
      src="/Logo.webp"
      height={90}
      width={90}
      alt="logo"
    />

  </Link>
);
export default Logo;
