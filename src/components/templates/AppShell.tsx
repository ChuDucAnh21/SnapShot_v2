import * as React from 'react';

export default function AppShell(props: {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-[--background] text-[--foreground]">
      {props.header
        ? (
          <header className="border-b border-[--border]">
            <div className="container flex h-14 items-center justify-between">{props.header}</div>
          </header>
        )
        : null}
      <main className="container py-6">{props.children}</main>
      {props.footer
        ? (
          <footer className="border-t border-[--border]">
            <div className="container flex h-14 items-center justify-center text-sm">{props.footer}</div>
          </footer>
        )
        : null}
    </div>
  );
}
