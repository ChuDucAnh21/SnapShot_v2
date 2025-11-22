'use client';

import Image from 'next/image';
import React from 'react';
import { AvataChildFemale, AvataChildMale } from '@/assets';

// // 🧩 Định nghĩa kiểu dữ liệu cho profile
type Profile = {
  full_name: string;
  nickname: string;
  age_years: number;
  description: string;
  gender: 'male' | 'female';
};

// // 🧩 Props type
// interface ProfileHeaderProps {
//   profile: Profile;
// }

// const ProfileHeader: React.FC<ProfileHeaderProps> = () => {
const ProfileHeader = () => {
  const dataChild: Profile = {
    full_name: 'Chu Duc Anh',
    nickname: 'Bin',
    age_years: 5,
    description: 'đang thích vận động, thể thao',
    gender: 'male',
  };
  return (
    <header className="flex w-full  items-center justify-center rounded-md  p-2  mt-[24px] sm:mt-10 sm:w-[50%] lg:w-[40%] ">
      <div className="flex w-[100%] flex-col items-center justify-center ">

        <div className="flex w-full items-center justify-between pr-2 pl-2">
          <h1 className="flex items-center gap-2 text-[18px] font-medium text-black">
            {/* {profile.full_name} ({profile.nickname}) */}
            {/* <div className="h-[40px] w-[40px] rounded-full bg-white bg-[url('/assets/avata/avataChildFemale.svg')] bg-cover bg-center bg-no-repeat"></div> */}
            <Image
              alt="avata"
              src={dataChild.gender === 'male' ? AvataChildMale : AvataChildFemale}
            />
            <p>
              {dataChild.full_name}
              {' '}
            </p>
          </h1>
          <div className="flex h-[32px] items-center rounded-2xl  bg-[#48ade7b4] px-4 py-2 font-semibold text-white">
            {dataChild.gender === 'male' ? 'Nam' : 'Nữ'}
          </div>
        </div>
        <div className="w-full p-2  pt-1 text-left text-[16px] text-gray-500">
          Bé
          {' '}
          {dataChild.age_years}
          {' '}
          tuổi -
          {dataChild.description}
        </div>
      </div>

    </header>
  );
};

export default ProfileHeader;
