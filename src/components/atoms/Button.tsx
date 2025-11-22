import * as React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const baseClasses
  = 'inline-flex items-center justify-center gap-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--ring] disabled:opacity-60 disabled:cursor-not-allowed rounded-[--radius-md]';

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-[--color-primary] text-[--color-primary-foreground] hover:brightness-110',
  secondary: 'bg-[--color-secondary] text-[--color-secondary-foreground] hover:brightness-110',
  ghost: 'bg-transparent text-[--foreground] hover:bg-white/5 border border-[--border]',
  danger: 'bg-[--color-danger] text-white hover:brightness-110',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-6 text-base',
};

function classNames(...parts: Array<string | undefined | false>): string {
  return parts.filter(Boolean).join(' ');
}

export default function Button(props: ButtonProps) {
  const {
    variant = 'primary',
    size = 'md',
    fullWidth,
    isLoading,
    leftIcon,
    rightIcon,
    className,
    children,
    disabled,
    ...rest
  } = props;

  const ariaBusy = isLoading ? true : undefined;
  const computedClassName = classNames(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && 'w-full',
    isLoading && 'relative',
    className,
  );

  return (
    <button
      type="button"
      aria-busy={ariaBusy}
      data-variant={variant}
      data-size={size}
      disabled={disabled || isLoading}
      className={computedClassName}
      {...rest}
    >
      {leftIcon
        ? (
          <span className="pointer-events-none" aria-hidden>
            {leftIcon}
          </span>
        )
        : null}
      <span>{children}</span>
      {rightIcon
        ? (
          <span className="pointer-events-none" aria-hidden>
            {rightIcon}
          </span>
        )
        : null}
    </button>
  );
}
