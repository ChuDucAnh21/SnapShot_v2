// Rules applied: brace-style:1tbs, ts:consistent-type-definitions:type, antfu/no-top-level-await:off
'use client';

import type { ButtonProps } from '@atoms/Button';
import Button from '@atoms/Button';
import * as React from 'react';

export type TooltipCardAction = {
  readonly id: string;
  readonly label: string;
  readonly onClick?: () => void;
  readonly icon?: React.ReactNode;
  readonly buttonProps?: Partial<Omit<ButtonProps, 'children' | 'onClick'>>;
};

export type TooltipCardProps = {
  readonly title: string;
  readonly description?: string;
  readonly children?: React.ReactNode;
  readonly primaryAction?: TooltipCardAction;
  readonly secondaryAction?: TooltipCardAction;
};

export default function TooltipCard({
  title,
  description,
  children,
  primaryAction,
  secondaryAction,
}: TooltipCardProps) {
  return (
    <article className="max-w-[320px] min-w-[240px] rounded-[--radius-lg] border border-[--border] bg-[--card] p-4 text-left shadow-xl">
      <header className="space-y-1">
        <p className="text-xs tracking-wide text-[--muted] uppercase">Learning tip</p>
        <h2 className="text-base font-semibold text-[--foreground]">{title}</h2>
        {description ? <p className="text-sm text-[--muted-foreground]">{description}</p> : null}
      </header>

      {children ? <div className="mt-3 space-y-2 text-sm text-[--muted-foreground]">{children}</div> : null}

      {primaryAction || secondaryAction
        ? (
          <footer className="mt-4 flex flex-col gap-2">
            {primaryAction
              ? (
                <Button fullWidth variant="primary" onClick={primaryAction.onClick} {...primaryAction.buttonProps}>
                  <span className="flex items-center justify-center gap-2">
                    {primaryAction.icon ? <span aria-hidden>{primaryAction.icon}</span> : null}
                    <span>{primaryAction.label}</span>
                  </span>
                </Button>
              )
              : null}
            {secondaryAction
              ? (
                <Button fullWidth variant="ghost" onClick={secondaryAction.onClick} {...secondaryAction.buttonProps}>
                  <span className="flex items-center justify-center gap-2">
                    {secondaryAction.icon ? <span aria-hidden>{secondaryAction.icon}</span> : null}
                    <span>{secondaryAction.label}</span>
                  </span>
                </Button>
              )
              : null}
          </footer>
        )
        : null}
    </article>
  );
}
