// Error404Page.jsx
// Place the provided mascot image (the dolphin image) in the same folder and name it `mascot.png`.
// This component uses Tailwind CSS. Make sure Tailwind is set up in your project.

import Image from 'next/image';
import React from 'react';
import { ErrorIcon } from '@/assets';

export default function Error404Page() {
  return (
    <div className="mt-30 flex min-h-screen items-start justify-center bg-white px-6 md:mt-0 md:items-center">
      <div className="flex  w-full max-w-6xl flex-col-reverse  items-center  gap-8 md:flex-row md:gap-12">
        {/* LEFT TEXT BLOCK */}
        <div className="flex w-full flex-1   flex-col items-center  ">
          <div className="flex flex-col items-center">
            <span className="
                rotate-[-30deg] text-[40px] leading-none font-semibold tracking-tight
                text-white italic [text-shadow:0_0_4px_#0450E8,0_0_4px_#0450E8]
                md:text-[56px]
            "
            >
              OOPS
            </span>

            <h1 className="mt-2 text-[100px] leading-none font-bold text-blue-500 md:text-[140px]">404</h1>

            <p className="mt-3 text-[24px] font-medium text-sky-600 md:text-[28px]">Ôi ! Lỗi rồi ...</p>
          </div>

          <div className="mt-10 w-[50%] md:mt-16 ">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="inline-block w-full cursor-pointer rounded-md bg-blue-500 px-10 py-3 text-sm font-medium text-white shadow transition hover:bg-blue-600"
              aria-label="Go back"
            >
              Go Back
            </button>

          </div>
        </div>

        {/* RIGHT IMAGE BLOCK */}
        <div className="flex w-full flex-1 items-center justify-center md:justify-end">
          {/* <div className="w-full max-w-[420px] md:max-w-[520px]"> */}
          {/* <img src={"/assets/error/errorPage.svg"} alt="mascot" className="pointer-events-none w-[200px]  select-none md:h-[566px] md:w-[498px]" /> */}
          <Image
            src={ErrorIcon}
            alt="Iruka logo"
            width={200}
            height={566}
            className="pointer-events-none w-[200px]  select-none md:h-[566px] md:w-[498px]"
          />
          {/* </div> */}
        </div>
      </div>
    </div>
  );
}
