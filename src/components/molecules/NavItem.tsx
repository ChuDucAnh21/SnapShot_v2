import Text from '@atoms/Text';

import { BookOpen, ChartLine, Gamepad2, Home, Sparkles, User } from 'lucide-react';

import Link from 'next/link';
import React from 'react';
import { cn } from '@/utils/cn';

export type NavItemProps = {
  icon?: React.ReactElement | string;
  label: string;
  href?: string;
  active?: boolean;
  onClick?: () => void;
};

const NavItem: React.FC<NavItemProps> = ({ icon, label, href = '#', active, onClick }) => (
  <Link
    href={href}
    onClick={onClick}
    className={cn(
      'flex items-center gap-4 px-4 py-2 rounded-lg transition',
      active ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-50',
    )}
  >

     {typeof icon === 'string'
      ? (
        icon === 'learn'
          ? (
            <BookOpen size={20} aria-label={label} className={active ? 'text-blue-500' : 'text-gray-500'} />
          )
          : icon === 'profile'
            ? (
              <User size={20} aria-label={label} className={active ? 'text-blue-500' : 'text-gray-500'} />
            )
            : icon === 'home'
              ? (
                <Home size={20} aria-label={label} className={active ? 'text-blue-500' : 'text-gray-500'} />
              )
              : icon === 'chart'
                ? (
                  <ChartLine size={20} aria-label={label} className={active ? 'text-blue-500' : 'text-gray-500'} />
                )
                : icon === 'game'
                  ? (
                    <Gamepad2 size={20} aria-label={label} className={active ? 'text-blue-500' : 'text-gray-500'} />
                  )
                  : (
                    <Sparkles size={20} aria-label={label} className={active ? 'text-blue-500' : 'text-gray-500'} />
                  )
      )
      : (
        icon
      )}
    <Text
      variant="body"
      weight={active ? 'semibold' : 'normal'}
      className={`truncate ${active ? 'text-blue-700' : 'text-gray-700'}`}
    >
      {label}
    </Text>
  </Link>
);

export default NavItem;
