'use client';
import * as React from 'react';

export default function RewardsTray() {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        className="rounded-[--radius-sm] border border-[--border] px-2 py-1 text-sm"
        onClick={() => setOpen(true)}
      >
        Rewards
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-64 rounded-[--radius-md] border border-[--border] bg-[--card] p-3 text-[--card-foreground] shadow-lg">
          <h3 className="mb-2 text-sm font-semibold">Rewards</h3>
          <ul className="grid gap-2 text-sm">
            <li>+10 XP</li>
            <li>+1 Energy</li>
          </ul>
        </div>
      )}
    </div>
  );
}
