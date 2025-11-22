'use client';

import Button from '@atoms/Button';
import { LocaleSwitcher } from '@molecules/LocaleSwitcher';
import { Diamond, Flame, Heart, Star } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';

export type RightRailSection = {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly action?: {
    readonly label: string;
    readonly onClick: () => void;
  };
  readonly content: React.ReactNode;
};

export type RightRailProps = {
  readonly sections: RightRailSection[];
};

export default function RightRail({ sections }: RightRailProps) {
  return (
    <div className="flex h-full flex-col gap-5">
      {/* Thông tin bé */}
      <div className="flex items-center justify-between rounded-lg bg-white border border-gray-200 px-4 py-2 shadow-sm">
         <div className="flex items-center">
          <span className="text-4xl">🧒</span>
          <div className="text-left flex items-center">
            <p className="font-semibold text-gray-800">
              Duc Anh 
            </p>
            <span className="text-sm font-semibold text-gray-800">- 5 tuổi</span>
          </div>
        </div>
      </div>
      {/* Tìm kiếm */}
      <div className="flex items-center justify-between rounded-lg bg-white border border-gray-200 px-4 py-2 shadow-sm">
        <div className="relative w-full">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            🔍
          </span>
          <input
            type="text"
            placeholder="Bạn muốn tìm gì"
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>
      {/* Sự kiện */}
      <div className=" rounded-lg bg-white border border-gray-200 px-4 py-2 shadow-sm">
         <div className=''>
          🎉 Sự kiện 
         </div>
         <div className='flex flex-col justify-center items-center'>
            <img className='w-[60px]' src="/assets/navbar-icon/helloween.svg" alt="" />
            <p>
              Halloween
            </p>
         </div>
      </div>
      {/* ngôn ngữ, phần thưởng */}
      <div className="flex items-center justify-between rounded-lg bg-white border border-gray-200 px-4 py-2 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 rounded bg-blue-500 px-2 py-1 text-xs font-medium text-white">
            <Star className="h-3 w-3" />
            US
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Flame className="h-4 w-4" />
            <span>0</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-sm font-medium text-blue-500">
            <Diamond className="h-4 w-4" />
            <span>500</span>
          </div>
          <div className="flex items-center gap-1 text-sm font-medium text-red-500">
            <Heart className="h-4 w-4" />
            <span>5</span>
          </div>
          <LocaleSwitcher />
        </div>
      </div>

      <div className="space-y-4">
        {sections.map(section => (
          <section
            key={section.id}
            className="rounded-[18px] border border-gray-200 bg-white p-5 text-gray-800 shadow-sm"
          >
            <header className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-gray-800">{section.title}</h3>
                {section.description
                  ? (
                    <p className="mt-1 text-xs font-medium text-gray-600">{section.description}</p>
                  )
                  : null}
              </div>
              {section.action
                ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={section.action.onClick}
                    className="rounded-full border border-gray-300 bg-white px-3 text-xs font-semibold tracking-wide text-blue-500 uppercase hover:bg-gray-50"
                  >
                    {section.action.label}
                  </Button>
                )
                : null}
            </header>
            <div className="text-sm text-gray-700">{section.content}</div>
          </section>
        ))}
      </div>

      <div className="mt-auto space-y-3 border-t border-gray-200 pt-4">
        <div className="grid grid-cols-3 gap-2 text-xs font-medium tracking-wide text-gray-600 uppercase">
          <Link href="/about" className="transition-colors hover:text-pink-500">
            Giới thiệu
          </Link>
          <Link href="/store" className="transition-colors hover:text-pink-500">
            Cửa hàng
          </Link>
          <Link href="/efficiency" className="transition-colors hover:text-pink-500">
            Tính hiệu quả
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs font-medium tracking-wide text-gray-600 uppercase">
          <Link href="/careers" className="transition-colors hover:text-pink-500">
            Công việc
          </Link>
          <Link href="/investors" className="transition-colors hover:text-pink-500">
            Nhà đầu tư
          </Link>
          <Link href="/terms" className="transition-colors hover:text-pink-500">
            Điều khoản
          </Link>
        </div>
        <div className="flex justify-center">
          <Link
            href="/privacy"
            className="text-xs font-medium tracking-wide text-gray-600 uppercase transition-colors hover:text-pink-500"
          >
            Quyền riêng tư
          </Link>
        </div>
      </div>
    </div>
  );
}
