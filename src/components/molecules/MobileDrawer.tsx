// Rules applied: brace-style:1tbs, ts:consistent-type-definitions:type, antfu/no-top-level-await:off
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';

type MobileDrawerProps = {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly title?: string;
  readonly children?: React.ReactNode;
};

export default function MobileDrawer({ open, onOpenChange, title = '🎯 Menu', children }: MobileDrawerProps) {
  return (
    <div className="lg:hidden">
      <Drawer open={open} onOpenChange={onOpenChange} direction="right">
        <DrawerContent className="w-[82%] max-w-[300px] sm:max-w-[340px] md:max-w-[400px] bg-white text-gray-800 border-gray-200">
          <DrawerHeader className="border-b border-gray-200 bg-white">
            <DrawerTitle className="text-lg font-bold flex items-center gap-2 text-gray-800">
              <span className="animate-bounce">🎯</span>
              {title}
            </DrawerTitle>
          </DrawerHeader>
          <div className="flex-1 overflow-auto p-3 bg-white">{children}</div>
          <DrawerFooter className="border-t border-gray-200 bg-white p-3">
            <DrawerClose asChild>
              <Button
                variant="outline"
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 border-transparent text-white hover:from-pink-600 hover:to-purple-700 hover:scale-105 transition-all duration-200 font-medium"
                aria-label="Close menu"
              >
                ✨ Đóng Menu
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
