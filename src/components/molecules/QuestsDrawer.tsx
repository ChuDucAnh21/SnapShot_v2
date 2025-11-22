'use client';
import * as React from 'react';

export default function QuestsDrawer() {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        className="rounded-[--radius-sm] border border-[--border] px-2 py-1 text-sm"
        onClick={() => setOpen(true)}
      >
        Quests
      </button>
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40"
          role="button"
          tabIndex={0}
          onClick={() => setOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setOpen(false);
            }
          }}
        >
          <div className="absolute top-0 right-0 h-full w-80 bg-[--card] p-4 text-[--card-foreground]">
            <h3 className="mb-2 text-sm font-semibold">Quests</h3>
            <ul className="grid gap-2 text-sm">
              <li>Complete 1 lesson</li>
              <li>Maintain streak</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
