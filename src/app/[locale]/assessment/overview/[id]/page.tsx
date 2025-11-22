'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MdOutlineArrowBackIos } from 'react-icons/md';
import { MathIcon } from '@/assets';

type EvaluationItem = {
  title: string;
  description: string;
};
type OverviewData = {
  subject_id: string;
  subject_name: string;
  evaluation_framework: EvaluationItem[];
};
const mockUser = {
  userInfor: {
    gender: 'female', // hoặc "male"
  },
};
// const mockOverviewData: OverviewData = {
//   subject_name: 'Toán học nền tảng',
//   evaluation_framework: [
//     {
//       title: 'Tư duy logic',
//       description: 'Khả năng nhận diện quy luật, mô hình và giải quyết vấn đề.',
//     },
//     {
//       title: 'Khả năng tính toán',
//       description: 'Đánh giá kỹ năng cộng, trừ, nhân, chia và phản xạ với con số.',
//     },
//     {
//       title: 'Ghi nhớ và tập trung',
//       description: 'Đo lường mức độ ghi nhớ và khả năng duy trì sự chú ý của bé.',
//     },
//     {
//       title: 'Ghi nhớ và tập trung',
//       description: 'Đo lường mức độ ghi nhớ và khả năng duy trì sự chú ý của bé.',
//     },
//   ],
// };

export default function SurveyIntroPage() {
  const { id } = useParams();
  const [dataOverview, setDataOverview] = useState<OverviewData>({
    subject_id: ' ',
    subject_name: ' ',
    evaluation_framework: [],
  });
  useEffect(() => {
    const getDataSubject = async () => {
      try {
        const dt = await fetch(`https://iruka-mvp-596825522277.asia-southeast1.run.app/api/surveys/overview?subject_id=${id}`);
        const res = await dt.json();
        setDataOverview(res);
      } catch (error) {
        console.warn('loi', error);
      }
    };
    getDataSubject();
  }, [id]);

  // const dataOverview = mockOverviewData;
  // const [dataOverview, setDataOverview] = useState<OverviewData>(mockOverviewData);

  const router = useRouter();

  //   const getDataOverview = async () => {
  //     try {
  //       const dataRes = await SubjectService.getOverviewApi(id);
  //       setDataOverview(dataRes);
  //       console.log("dataRes Overview", dataRes);
  //     } catch (error: any) {
  //       showToast(error.detail?.[0]?.msg || error?.detail, "error");
  //     }
  //   };
  //   getDataOverview();
  // }, []);

  // const router = useRouter();
  const handleStartSurvey = () => {
    router.push(`/assessment/math_001`);
  };

  return (
    <div className=" flex items-center justify-center ">
      <div className="w-full  p-[24px] pt-[70px] sm:pt-10  text-center">
        {/* Logo */}
        <div className="relative">
          <MdOutlineArrowBackIos onClick={() => router.back()} className="block sm:hidden absolute top-1 left-0 cursor-pointer text-[20px] hover:bg-gray-200 hover:opacity-90" />

          <div className="flex justify-center ">
            <Image
              src="/Logo_text.webp"
              alt="Iruka Logo"
              height={74}
              width={190}
              className="mb-[75px] hidden h-[74px] w-[190px] object-contain sm:block"
            />
            <h2 className="mb-[21px] block text-[20px] font-bold text-blue-500 sm:hidden">Đánh giá</h2>
          </div>
        </div>

        {/* Title */}
        <h1 className="mb-[28px]  text-[18px] font-medium sm:font-bold sm:text-[#0090E0]">
          {mockUser.userInfor.gender === 'male' ? 'Ba' : 'Mẹ'}
          {' '}
          dành ít phút cùng
          IruKa khám phá chân dung
          {' '}
          {' '}
          {dataOverview.subject_name}
          {' '}
          của
          bé nhé
        </h1>
        <div className="hidden sm:block text-[16px] text-gray-600">
          <p>Trả lời các câu hỏi để nhận được đánh giá chi tiết và lộ trình học phù hợp cho bé</p>
        </div>

        {/* Options */}
        <div className="mt-8  flex flex-wrap items-center justify-center gap-[16px] text-left sm:gap-[32px]">
          {dataOverview?.evaluation_framework?.map((item, idx) => (
            <div
              key={idx}

              className="flex min-h-[98px] w-full flex-col items-start gap-1 rounded-md shadow-[0_0_15px_3px_rgba(0,0,0,0.1)] p-5 sm:h-[168px]  sm:basis-[286px] sm:gap-[16px]"

            >
              <div className="flex w-full items-center justify-start gap-2 sm:justify-center">
                <Image
                  alt="subject"
                  src={MathIcon}
                  width={40}
                  height={40}
                  className="mr-2 h-[40px] w-[40px] rounded-full bg-white  sm:mr-0"
                />
                <h3 className="text-[16px] font-medium lowercase text-blue-800">{item.title}</h3>
              </div>

              <div>

                <p className="block text-center text-[14px] text-gray-600">

                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStartSurvey}

          className="mt-[70px] h-[56px] w-full cursor-pointer rounded-md bg-[#0090E0] py-3 text-[16px] font-semibold text-white transition hover:opacity-90 sm:w-[392px]"

        >
          Bắt đầu đánh giá
        </motion.button>
      </div>

      {/* <Progress percent={percent} visible={visible} /> */}
    </div>
  );
}
