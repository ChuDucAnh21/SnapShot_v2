import React from 'react';
import NavList from '../molecules/NavList';

export type BottomNavProps = {
  items: { icon?: string; label: string; href?: string; active?: boolean }[];
};

const BottomNav: React.FC<BottomNavProps> = ({ items }) => (
  <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/90 backdrop-blur lg:hidden">
    <div className="grid grid-cols-5 gap-1 p-1">
      <NavList items={items} />
    </div>
  </nav>
);

export default BottomNav;
