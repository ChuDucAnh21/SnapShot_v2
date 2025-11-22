'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AvataChildFemale, AvataChildMale, IrukaQuesstion } from '@/assets';

type Kid = {
  child_id: string;
  fullname: string;
  gender: 'male' | 'female';
  age: number;
};

const mockKids: Kid[] = [
  { child_id: '1', fullname: 'Bé An', gender: 'male', age: 6 },
  { child_id: '2', fullname: 'Bé Linh', gender: 'female', age: 8 },
  { child_id: '3', fullname: 'Bé Minh', gender: 'male', age: 5 },
];

export default function ListChildClient() {
  const router = useRouter();

  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [dataKids] = useState<Kid[]>(mockKids);

  const handleSelect = (kid: Kid) => {
    setSelectedChild(kid.child_id);

    router.push(`/selectSubject`);
  };

  const handleAddkid = () => {
    router.push('/createChild');
  };

  return (

    <div className="flex min-h-svh items-start justify-center bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="min-h-svh w-full  rounded-2xl  bg-white px-6 py-10 text-center shadow-md ">

        {/* Logo */}
        <div className=" flex justify-center">
          {/* <div className="flex h-24 w-24 items-center justify-center rounded-full shadow-[0_8px_36px_rgba(185,131,255,0.2)]"> */}
          <Image
            src={IrukaQuesstion}
            alt="Logo Iruka"
            width={220}
            height={220}
            className="object-contain"
          />
          {/* </div> */}
        </div>

        {/* Title */}
        <h2 className="mt-2 text-[32px] font-bold text-blue-500">
          Chọn bé để tiếp tục
        </h2>
        <p className=" text-base lg:mt-[10px] text-[16px] text-gray-500">
          Chọn một trong các bé đã đánh giá hoặc thêm bé mới
        </p>

        {/* Add kid */}

        {/* Danh sách bé */}
        <div className="flex flex-col  flex-wrap items-center justify-center gap-6 rounded-2xl py-8 pt-2 shadow-[0_2px_16px_rgba(241,234,251,0.1)]">

          {dataKids && dataKids.length > 0
            ? (
              dataKids.map(kid => (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  key={kid.child_id}
                  onClick={() => handleSelect(kid)}
                  className={`flex w-[90%] cursor-pointer items-center gap-4 rounded-md border-2 border-blue-400 bg-blue-400 px-5 py-4 transition sm:w-[50%]

                  ${
                selectedChild === kid.child_id
                  ? 'border-indigo-400  shadow-[0_6px_22px_rgba(169,131,255,0.4)]'
                  : 'border-violet-100 hover:border-indigo-300 hover:opacity-90 hover:shadow-md'
                }`}
                >
                  <div className="text-3xl">
                    <Image
                      src={kid.gender === 'male' ? AvataChildMale : AvataChildFemale}
                      alt="Avatar Bé"
                      width={50}
                      height={50}
                    />
                  </div>

                  <div className="flex items-center gap-3 text-left">
                    <p className="text-base font-bold text-white">

                      {kid.fullname}
                    </p>
                    {/* <p className="text-pink-500 font-medium text-sm">{kid.age} tuổi</p> */}
                    <p className="text-sm font-bold text-white">
                      { kid.gender === 'male'
                        ? '(Bé trai)'
                        : '(Bé gái)'}
                    </p>
                  </div>
                </motion.div>
              ))
            )
            : (
              <div className="w-full text-center text-gray-500">
                Chưa có bé nào
              </div>
            )}
        </div>
        <div

          className="flex justify-center "
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddkid}
            className="flex h-[64px] w-[90%] cursor-pointer items-center justify-center gap-4  rounded-md   border border-blue-500 p-2 text-left leading-tight text-green-600 hover:bg-blue-100 sm:w-[50%]"
          >
            <p className="flex items-center justify-center rounded-2xl bg-blue-400 pr-2 pl-2  text-2xl font-bold text-white shadow-[0_8px_20px_rgba(160,250,235,0.3)]">
              +
            </p>
            <span className="block text-[1.1rem] font-medium text-blue-400">Thêm bé mới</span>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
