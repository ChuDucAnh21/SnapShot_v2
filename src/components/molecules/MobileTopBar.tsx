// Rules applied: brace-style:1tbs, ts:consistent-type-definitions:type, antfu/no-top-level-await:off
'use client';

import { Menu } from 'lucide-react';
import * as React from 'react';
import { Button } from '@/components/ui/button';

type MobileTopBarProps = {
  readonly title: string;
  readonly onOpenMenu: () => void;
};

export default function MobileTopBar({ title, onOpenMenu }: MobileTopBarProps) {
  return (
    <div className="fixed w-full h-[64px] bg-white shadow-md px-6 py-3 flex justify-between items-center border-b-2 border-blue-400 top-0 left-0 z-30">
      <Button
        type="button"
        aria-label="Open menu"
        onClick={onOpenMenu}
        variant="outline"
        size="icon"
        className="h-11 w-11 bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:scale-105 transition-all duration-200"
      >
        <Menu className="h-5 w-5" />
      </Button>
      <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
        <span className="animate-bounce">🎯</span>
        {title}
      </h1>
      <div className="h-11 w-11" aria-hidden />
    </div>
  );
}
