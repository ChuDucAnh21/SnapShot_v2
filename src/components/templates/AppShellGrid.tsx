// components/layouts/AppShellGrid.tsx
import type { LeftNavProps } from '@organisms/LeftNav';
import LeftNav from '@organisms/LeftNav';
import React from 'react';

export type AppShellGridProps = {
  navItems: LeftNavProps['items'];
  children: React.ReactNode;
};

const AppShellGrid: React.FC<AppShellGridProps> = ({ navItems, children }) => (
  <div className="relative flex h-full min-h-screen w-full bg-white">
    <div className="sticky top-0 left-0 h-full shrink-0">
      <LeftNav items={navItems} />
    </div>
    <main className="min-h-screen flex-1 bg-white">{children}</main>
  </div>
);

export default AppShellGrid;
