import * as React from 'react';

export type TooltipProps = {
  content: React.ReactNode;
  /**
   * Render-prop that receives props you MUST spread onto the actual
   * interactive trigger element (button, link, etc.).
   */
  children: (triggerProps: {
    'aria-describedby': string;
    'onMouseEnter': React.MouseEventHandler;
    'onMouseLeave': React.MouseEventHandler;
    'onFocus': React.FocusEventHandler;
    'onBlur': React.FocusEventHandler;
  }) => React.ReactElement;
};

export default function Tooltip({ content, children }: TooltipProps) {
  const [open, setOpen] = React.useState(false);
  const tooltipId = React.useId();

  const trigger = children({
    'aria-describedby': tooltipId,
    'onMouseEnter': () => setOpen(true),
    'onMouseLeave': () => setOpen(false),
    'onFocus': () => setOpen(true),
    'onBlur': () => setOpen(false),
  });

  return (
    <span className="relative inline-flex">
      {trigger}
      {open && (
        <span
          id={tooltipId}
          role="tooltip"
          className="pointer-events-none absolute bottom-full left-1/2 z-50 -translate-x-1/2 rounded-[--radius-sm] bg-[--card] px-2 py-1 text-xs whitespace-nowrap text-[--card-foreground] shadow"
        >
          {content}
        </span>
      )}
    </span>
  );
}
