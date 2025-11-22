'use client';

import React from 'react';
import { FaHeart } from 'react-icons/fa';
import { PiSealCheckFill } from 'react-icons/pi';

type Advice = {
  summary: string;
  details: string[];
};

type AdviceCardProps = {
  advice: Advice;
  parentGender: 'bố' | 'mẹ';
};

// 🧠 Mock data để test ngay

const AdviceCard: React.FC<AdviceCardProps> = ({ advice, parentGender }) => {
  return (
    <section className="mb-10 w-full rounded-md border-1 border-blue-300 p-6  shadow-md sm:w-[60%]">
      <h2 className="text-black-600 mb-4 flex items-center justify-center gap-2 text-[18px] font-medium">
        <span className="rounded-full bg-pink-100 p-2 text-[16px] text-pink-500">
          <FaHeart />
        </span>
        Gợi ý giúp
        {' '}
        {parentGender}
        {' '}
        đồng hành cùng bé phát triển tốt hơn
      </h2>

      <div className="mb-5 min-h-[70px] rounded-md bg-[#A8E6FF] p-4 text-center">
        <span className="text-[16px]  text-[#374151] ">
          {advice?.summary}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {advice?.details.map((tip, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 rounded-md bg-[#F4F4F4] p-3 shadow-sm"

          >
            {/* <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-400 text-xs"> */}
            <PiSealCheckFill className="text-[30px] text-green-500" />
            {/* </div> */}
            <p className="text-sm font-medium text-[#4CA9F4]">{tip}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AdviceCard;
