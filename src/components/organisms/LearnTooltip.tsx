// Rules applied: brace-style:1tbs, ts:consistent-type-definitions:type, antfu/no-top-level-await:off
'use client';

import type { TooltipCardProps } from '@molecules/TooltipCard';
import TooltipCard from '@molecules/TooltipCard';
import * as React from 'react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

type TriggerRenderProps = React.HTMLAttributes<HTMLElement> & {
  className?: string;
  id: string; // <-- anchorId lives here
  role?: string;
  tabIndex?: number;
};

export type LearnTooltipProps = {
  id: string; // stable base id from caller (e.g., 'word-help')
  /**
   * Render-prop trigger. You MUST spread the provided props onto your trigger element.
   * Example:
   *   <LearnTooltip id="hello" tooltipContent={...}>
   *     {(props) => <button {...props}>Open</button>}
   *   </LearnTooltip>
   */
  children: (props: TriggerRenderProps) => React.ReactElement;
  tooltipContent: TooltipCardProps;
  /** hover: open on hover and close on leave; toggle: click to toggle */
  hoverMode?: 'auto-close' | 'toggle';
  className?: string;
  place?: 'bottom' | 'top' | 'left' | 'right';
};

export default function LearnTooltip({
  id,
  children,
  tooltipContent,
  hoverMode = 'auto-close',
  className,
  place = 'bottom',
}: LearnTooltipProps) {
  // one anchor id per instance; stable across re-renders
  const uid = React.useId();
  const anchorId = `${id}-${uid}-anchor`;

  const rootRef = React.useRef<HTMLSpanElement | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);

  const open = React.useCallback(() => setIsOpen(true), []);
  const close = React.useCallback(() => setIsOpen(false), []);
  const toggle = React.useCallback(() => setIsOpen(v => !v), []);

  // close on ESC / outside click
  React.useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
      }
    };
    const onPointer = (e: PointerEvent) => {
      const root = rootRef.current;
      if (root && !root.contains(e.target as Node)) {
        close();
      }
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onPointer);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onPointer);
    };
  }, [isOpen, close]);

  const trigger = children({
    id: anchorId, // <-- IMPORTANT: give trigger this id
    role: 'button',
    tabIndex: 0,
    onClick: hoverMode === 'toggle' ? () => toggle() : undefined,
    onMouseEnter: hoverMode === 'auto-close' ? () => open() : undefined,
    onMouseLeave: hoverMode === 'auto-close' ? () => close() : undefined,
    onFocus: () => open(),
    onBlur: () => close(),
  });

  return (
    <span ref={rootRef} className={['inline-flex items-center', className].filter(Boolean).join(' ')} data-tooltip-root>
      {trigger}

      <Tooltip
        anchorId={anchorId} // <-- bind to trigger by id (not data-attributes)
        place={place}
        isOpen={isOpen} // controlled visibility
        clickable
        closeOnEsc
        className="!rounded-[--radius-lg] !bg-transparent !text-inherit !shadow-none"
        opacity={1}
        afterHide={close}
      >
        <TooltipCard
          {...tooltipContent}
          primaryAction={
            tooltipContent.primaryAction
              ? {
                ...tooltipContent.primaryAction,
                onClick: () => {
                  tooltipContent.primaryAction?.onClick?.();
                  close();
                },
              }
              : undefined
          }
          secondaryAction={
            tooltipContent.secondaryAction
              ? {
                ...tooltipContent.secondaryAction,
                onClick: () => {
                  tooltipContent.secondaryAction?.onClick?.();
                  close();
                },
              }
              : undefined
          }
        />
      </Tooltip>
    </span>
  );
}
