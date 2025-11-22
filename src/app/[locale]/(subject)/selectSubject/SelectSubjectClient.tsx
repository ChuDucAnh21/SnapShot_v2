'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { MdOutlineArrowBackIos } from 'react-icons/md';
import { AvataChildFemale, AvataChildMale, MathIcon, VietnameseIcon } from '@/assets';
import { useToast } from '@/components/toast/ToastMessage';

type Subject = {
  subject_id: string;
  subject_name: string;
  description: string;
  estimate?: number;
  info_detail: string[];
};

type Kid = {
  fullname: string;
  nickname: string;
  gender: string;
  age: number;
  child_id: string;
  submiss_subject?: { id_subject: string; submiss_id?: string }[];
};

const kidCurrent: Kid = {
  fullname: 'Hoa',
  nickname: 'Bống',
  gender: 'male',
  age: 6,
  child_id: 'kid_001',
  submiss_subject: [
    { id_subject: 'math_001', submiss_id: 'done_1' },
    { id_subject: 'eng_001' },
  ],
};
const mockSubjects: Subject[] = [
  {
    subject_id: 'math_001',
    subject_name: 'Toán học',
    description: 'Khám phá tư duy logic và giải quyết vấn đề.',
    estimate: 10,
    info_detail: ['10 câu hỏi', 'Độ tuổi 5-8'],
  },
  {
    subject_id: 'eng_001',
    subject_name: 'Tiếng Anh',
    description: 'Học từ vựng cơ bản và phát âm tự nhiên.',
    estimate: 12,
    info_detail: ['8 câu hỏi', 'Có hình minh họa'],
  },
  {
    subject_id: 'read_001',
    subject_name: 'Tiếng Việt',
    description: 'Phát triển khả năng đọc và hiểu nội dung.',
    info_detail: ['Đang phát triển'],
  },
];

export default function SelectSubjectClient() {
  const subjects = mockSubjects;
  const router = useRouter();
  const [actSubjectID, setActSubjectID] = useState<string>('math_001');

  // const [subjects, setSubjects] = useState<Subject[]>(mockSubjects);

  const { showToast } = useToast();

  const handleStart = () => {
    if (actSubjectID === 'math_001') {
      router.push(`/assessment/overview/${actSubjectID}`);
    } else if (!actSubjectID) {
      showToast('⚠️ Bạn cần chọn môn để tiếp tục', 'info');
    } else {
      showToast('Môn này chưa ra mắt nhé!', 'info');
    }
  };

  return (
    <div className=" px-6 py-10 pt-[70px] text-center">
      {/* Header */}
      <header className="hidden items-center justify-center sm:flex">
        <div className="flex items-center">
          <Image
            alt="avate"
            src={kidCurrent.gender === 'male' ? AvataChildMale : AvataChildFemale}
            height={40}
            width={40}
            className="rounded-full"
          />

          <div className="ml-4 flex items-center text-left">
            <p className="font-semibold text-gray-800">
              Bé:
              {' '}
              {kidCurrent.fullname}
              {' '}
              (
              {kidCurrent.nickname}
              )
            </p>
            <span className="text-sm font-semibold text-gray-800">
              -
              {kidCurrent.age}
              {' '}
              tuổi
            </span>

          </div>
        </div>
      </header>
      {/* Title */}
      <div className="relative w-full">

        <MdOutlineArrowBackIos onClick={() => router.back()} className="block sm:hidden absolute top-1 sm:top-3 left-0 cursor-pointer text-[20px] hover:bg-gray-200 hover:opacity-90" />
        <h2 className="sm:mt-4 mb-2 text-[20px] font-bold text-[#0090E0] sm:text-[32px]">
          Chọn môn học cho bé
        </h2>
      </div>

      <p className="mb-8 hidden text-[16px] text-gray-500 sm:block">
        Mỗi môn học sẽ có bộ câu hỏi và lộ trình riêng phù hợp với bé
      </p>

      {/* Subject Cards */}
      <div className="mt-[50px] flex flex-wrap justify-center gap-6 sm:mt-[24px]">
        {subjects.map(subj => (
          <motion.div
            key={subj.subject_id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActSubjectID(subj.subject_id)}
            className={`relative min-h-[108px] w-[100%] cursor-pointer rounded-md border-2 p-3 transition-all sm:min-h-[240px] sm:w-[320px] sm:p-6
              ${
          actSubjectID === subj.subject_id
            ? 'border-indigo-500 shadow-indigo-200 '
            : 'border-gray-300 bg-white'
          }

              ${subj.estimate === undefined ? 'bg-white' : 'bg-white'} hover:shadow-lg`}
          >
            <div className="flex flex-row items-center justify-start sm:flex-col sm:items-center sm:justify-center">
              <Image
                alt="subject"
                src={subj.subject_name === 'Toán học' ? MathIcon : subj.subject_name === 'Tiếng Anh' ? MathIcon : VietnameseIcon}
                width={40}
                height={40}
                className="mr-2 h-[40px] w-[40px] rounded-full bg-white  sm:mr-0"
              />
              <h3 className="mb-[8px] text-lg font-semibold">{subj.subject_name}</h3>
            </div>

            <p className=" min-h-[40px] text-center text-gray-600 sm:mb-[8px]">
              {subj.description}
            </p>

            {!subj.estimate
              ? (
                <span className="absolute top-7 right-5 rounded-md bg-pink-100 px-3 py-1 text-sm font-medium text-pink-600 sm:static">
                  Sắp ra mắt
                </span>
              )
              : (

                <span className="absolute top-7 right-5 rounded-md bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-600 sm:static">

                  ~
                  {subj.estimate}
                  {' '}
                  phút
                </span>
              )}
          </motion.div>
        ))}
      </div>

      {/* Action */}
      <div className="mt-30 sm:mt-20">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStart}
          className={`${
            actSubjectID === 'math_001'

              ? 'cursor-pointer bg-[#0090E0]'
              : 'cursor-not-allowed bg-gray-500 opacity-75'
          } h-[54px] w-[90%] rounded-md bg-gradient-to-r px-6 py-3 font-semibold text-white shadow-md hover:opacity-90 sm:w-[390px]`}

        >
          Xem lộ trình cho bé
          <i className="fa-solid fa-arrow-right ml-2"></i>
        </motion.button>
      </div>

      {/* Modal & Progress — tạm comment lại */}
      {/* {show && (
        <ModalConfirmSurvey
          actSubjectID={actSubjectID}
          show={show}
          setShow={setShow}
        />
      )}
      <Progress percent={percent} visible={visible} /> */}
    </div>
  );
}
