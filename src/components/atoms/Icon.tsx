import * as React from 'react';

type IconName = 'flame' | 'bolt' | 'heart' | 'star' | 'check' | 'x';

export type IconProps = {
  name?: IconName;
  size?: number;
  title?: string;
  className?: string;
  children?: React.ReactNode; // custom svg paths
} & React.SVGProps<SVGSVGElement>;

const paths: Record<IconName, React.ReactNode> = {
  flame: (
    <path
      fill="currentColor"
      d="M13.5 2.6c.3.6.5 1.3.5 2 0 2.2-1.8 4-4 4-.6 0-1.2-.1-1.7-.4.1 3 2.6 5.4 5.7 5.4 3.1 0 5.5-2.5 5.5-5.5 0-3.7-3-6.7-6.7-6.7-.6 0-1.2.1-1.8.2.9.6 1.7 1.4 2.5 2.5z"
    />
  ),
  bolt: <path fill="currentColor" d="M13 2 3 14h6l-1 8 10-12h-6l1-8z" />,
  heart: (
    <path
      fill="currentColor"
      d="M12 21s-8-4.6-8-10.4C4 7.1 5.7 5 8 5c1.4 0 2.7.8 3.4 2 .7-1.2 2-2 3.4-2 2.3 0 4 2.1 4 5.6C19.8 16.4 12 21 12 21z"
    />
  ),
  star: <path fill="currentColor" d="M12 2l2.9 6.2L22 9.3l-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 7.1-1.1L12 2z" />,
  check: <path fill="currentColor" d="M20 6 9 17l-5-5 2-2 3 3 9-9z" />,
  x: <path fill="currentColor" d="M18 6 6 18m0-12 12 12" stroke="currentColor" strokeWidth="2" />,
};

export default function Icon(props: IconProps) {
  const { name, size = 20, className, children, title, ...rest } = props;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" role="img" aria-label={title} className={className} {...rest}>
      {title ? <title>{title}</title> : null}
      {children ?? (name ? paths[name] : null)}
    </svg>
  );
}
