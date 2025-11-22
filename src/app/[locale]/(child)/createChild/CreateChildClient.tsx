'use client';

import type { FormEvent } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

import { useState } from 'react';
import { CgGenderFemale, CgGenderMale } from 'react-icons/cg';
import { MdOutlineArrowBackIos } from 'react-icons/md';

import { useToast } from '@/components/toast/ToastMessage';

export default function CreateChilClient() {
  const [name, setName] = useState<string>('');
  const [nickName, setNickName] = useState<string>('');
  const [birthDate, setBirthDate] = useState<string>('');
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const router = useRouter();
  const { showToast } = useToast();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    showToast('Tạo bé thành công');
    router.push('/selectSubject');
  };

  return (

    <div className="pt-[70px] sm:pt-10">
      <div className="flex w-full flex-col items-center bg-white px-6 py-10 pt-0 text-center">
        <div className="relative w-full">

          <MdOutlineArrowBackIos onClick={() => router.back()} className="block sm:hidden absolute top-1 left-0 cursor-pointer text-[20px] hover:bg-gray-200 hover:opacity-90" />
          <h2 className="mb-2 text-[20px] font-bold text-[#0090E0] sm:text-[32px]">
            Thông tin về bé
          </h2>
        </div>
        <p className="mb-3 hidden text-[16px] text-[#3d4260] sm:block">
          Giúp chúng tôi hiểu về bé để đưa ra lộ trình học phù hợp
        </p>
        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-[26px] w-full lg:w-[70%] ">
          {/* Họ tên */}
          <div className="mb-[18px]  text-left text-[18px]">
            <label
              htmlFor="name"
              className="mb-2 block font-medium "
            >
              Họ và tên bé
              {' '}
              <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              required
              placeholder="Ví dụ: Nam, Hoa..."
              value={name}
              onChange={e => setName(e.target.value)}
              className="h-[56px] w-full rounded-md border border-[#e5e6fa] bg-[#F4F4F4] px-4 py-3 text-[1.05rem] transition outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500 "
            />
          </div>

          {/* Biệt danh */}
          <div className="mb-[18px] text-left  text-[18px]">
            <label
              htmlFor="nickname"
              className="mb-2 block font-medium "
            >
              Biệt danh
              {' '}
              <span className="text-[12px] italic">(nếu có)</span>
            </label>
            <input
              id="nickname"
              type="text"
              placeholder="Ví dụ: Bin, Bống..."
              value={nickName}
              onChange={e => setNickName(e.target.value)}
              className=" h-[56px] w-full rounded-md border border-[#e5e6fa] bg-[#F4F4F4] px-4 py-3 text-[1.05rem]  transition outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Ngày sinh */}
          <div className="mb-[18px] text-left text-[18px]">
            <label
              htmlFor="birthdate"
              className="mb-2 block font-medium "
            >
              Ngày sinh
              {' '}
              <span className="text-red-500">*</span>
            </label>
            <input
              id="birthdate"
              type="date"
              required
              value={birthDate}
              onChange={e => setBirthDate(e.target.value)}
              className=" custom-date-icon h-[56px] w-full rounded-md border bg-[#F4F4F4]  px-4 py-3 text-[1.05rem] transition outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200 "
            />
          </div>

          {/* Giới tính */}
          <div className="mb-4 text-left text-[18px]">
            <p className="mb-2 block font-medium ">
              Giới tính
              {' '}
              <span className="text-red-500">*</span>
            </p>

            <div className="mt-3 flex flex-wrap justify-center gap-4">
              {/* Bé trai */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => setGender('male')}

                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setGender('male');
                  }
                }}
                className={`flex min-w-[130px] cursor-pointer flex-col items-center justify-center rounded-md border-2 px-6 py-4 transition 

                  ${
    gender === 'male'
      ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-md'
      : 'border-[#ede9fe] bg-[#f2f6ff]'
    }`}
              >

                <span className="mb-2 text-3xl">
                  <CgGenderMale className="text-blue-500" />
                </span>
                <div className="font-medium text-[#4939be]">Bé trai</div>

              </div>

              {/* Bé gái */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => setGender('female')}

                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setGender('male');
                  }
                }}
                className={`flex min-w-[130px] cursor-pointer flex-col items-center justify-center rounded-md border-2 px-6 py-4 transition 

                  ${
    gender === 'female'
      ? 'border-pink-400 bg-gradient-to-br from-pink-50 to-purple-50 shadow-md'
      : 'border-[#ede9fe] bg-[#f2f6ff]'
    }`}
              >

                <span className="mb-2 text-3xl ">

                  <CgGenderFemale className="text-pink-600" />
                </span>
                <div className="font-medium text-[#4939be]">Bé gái</div>

              </div>
            </div>
          </div>

          {/* Nút Tiếp tục */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"

            className="m-auto mt-6 block w-[50%] cursor-pointer rounded-md bg-[#0090E0] py-3 text-[16px] font-medium text-white shadow-lg transition hover:opacity-90 lg:w-[392px]"

          >
            Tạo hồ sơ
          </motion.button>
        </form>
      </div>
    </div>
  );
}
