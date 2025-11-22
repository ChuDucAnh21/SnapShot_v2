'use client';

import Image from 'next/image';
import React from 'react';

// 🧩 Kiểu dữ liệu
type OverviewItem = {
  name?: string;
  scores?: number;
  description?: string;
  tags?: string[];
};

type DashboardCardProps = {
  overview: OverviewItem[];
  parentGender: 'bố' | 'mẹ';
};

// ⚙️ Component chính
const DashboardCard: React.FC<DashboardCardProps> = ({ overview, parentGender }) => {
  const view_score = overview?.filter(item => item.scores);
  const view_tags = overview?.filter(item => item.tags);
  const listTags = view_tags?.map(item => item.tags).flat(1) ?? [];

  return (
    <section className="my-2 grid w-full gap-1 rounded-md border-1 border-blue-300 bg-white p-6 pt-1 shadow-md sm:gap-6 md:grid-cols-2">
      {/* Biểu đồ năng lực */}
      <div className="col-[1/3] flex flex-wrap justify-around sm:gap-[70px]">
        {view_score.map((item, idx) => {
          const treeImg
            = item.scores && item.scores >= 8
              ? '/tree3.png'
              : item.scores && item.scores < 4
                ? '/tree1.png'
                : '/tree2.png';
          const colorLevel
            = item.scores && item.scores >= 8
              ? 'green'
              : item.scores && item.scores < 4
                ? 'orange'
                : 'blue';

          return (
            <div
              key={idx}
              className="min-w-[200px] flex-1 rounded-2xl p-2 pb-5 text-center"
            >
              <div className="h-[70px]">
                <Image
                  src={treeImg}
                  alt="tree"
                  height={70}
                  width={70}
                  className="mx-auto my-4 w-[70px]"
                />
              </div>

              <h2 className={`text-${colorLevel}-500 text-lg font-bold`}>
                {item.name}
              </h2>
              <p className={`text-${colorLevel}-500 text-[16px]`}>
                {item.scores && item.scores >= 8
                  ? 'Đã hình thành'
                  : item.scores && item.scores < 4
                    ? 'Cần gieo hạt'
                    : 'Đang nảy mầm'}
              </p>

              <div className="mx-auto mt-1 w-2/3">
                <div className={`text-[16px] mb-2 flex justify-center font-semibold text-${colorLevel}-600`}>
                  {item.scores}
                  /10
                  {' '}

                  {/* <span
                    className={`bg- ml-2 rounded-full px-2 py-0.5  text-sm ${colorLevel}-100 text-${colorLevel}-700`}
                  >
                    {item.scores && item.scores >= 8
                      ? "Xuất sắc"
                      : item.scores && item.scores < 4
                      ? "Khá"
                      : "Tốt"}
                  </span> */}
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-[#ccc]">
                  <div
                    className={`bg-${colorLevel}-500 h-full rounded-full`}
                    style={{ width: `${(item.scores ?? 0) * 10}%` }}
                  >
                  </div>
                </div>
                <p className="mt-[8px] text-sm text-gray-500">{item.description}</p>

              </div>
            </div>
          );
        })}
      </div>

      {/* Thẻ Tags */}
      <div className="col-[1/3] text-center">
        <h4 className="col-span-full mt-4 text-center text-[18px] font-medium  text-black">
          🐬Thiên hướng tư duy, tiếp cận, sở thích của bé và tâm lý của
          {' '}
          {parentGender}
        </h4>
      </div>

      <div className="col-[1/3] flex flex-wrap justify-center gap-2">
        {listTags.map((tag, i) => (
          <span
            key={i}

            className="rounded-md border-2 border-violet-50 bg-[#FFF6DA] px-3 py-1 text-sm font-medium text-purple-800"
          >
            {tag}
          </span>
        ))}
      </div>
    </section>
  );
};

export default DashboardCard;
