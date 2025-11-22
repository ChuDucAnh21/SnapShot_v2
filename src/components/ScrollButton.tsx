'use client';

import { ArrowUp } from 'lucide-react';

const ScrollButton = () => {
  return (
    <button
      type="button"
      onClick={() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
      className="inline-flex size-12 cursor-pointer items-center justify-center rounded-[16px] border border-gray-300 bg-white text-2xl text-blue-500 shadow-md transition-transform duration-150 hover:-translate-y-1 hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none"
      aria-label="Back to top"
    >
      <ArrowUp />
    </button>
  );
};

export default ScrollButton;
