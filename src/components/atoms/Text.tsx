import React from 'react';
import { cn } from '@/utils/cn';

export type TextVariant = 'label' | 'body' | 'title' | 'pill';

export type TextProps = {
  variant?: TextVariant;
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  as?: React.ElementType;
} & React.HTMLAttributes<HTMLElement>;

const VARIANT_CLASS: Record<TextVariant, string> = {
  title: 'text-xl md:text-2xl',
  body: 'text-sm md:text-base',
  label: 'text-xs uppercase tracking-wide',
  pill: 'text-xs',
};

const Text: React.FC<TextProps> = ({ variant = 'body', weight = 'normal', as: Tag = 'span', className, ...rest }) => (
  <Tag
    className={cn(
      VARIANT_CLASS[variant],
      {
        'font-normal': weight === 'normal',
        'font-medium': weight === 'medium',
        'font-semibold': weight === 'semibold',
        'font-bold': weight === 'bold',
      },
      className,
    )}
    {...rest}
  />
);

export default Text;
