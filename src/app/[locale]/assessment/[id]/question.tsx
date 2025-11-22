'use client';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MdOutlineArrowBackIos } from 'react-icons/md';
import { Progress, useProgress } from '@/components/progress/ProgressLoading';
import { useToast } from '@/components/toast/ToastMessage';

type Option = {
  value: string;
  label: string;
};

type Question = {
  question_id: string;
  required: boolean;
  text: string;
  type: string;
  options: Option[];
  axis_name?: string;
  axis_code?: string;
};

type SurveyAxis = {
  axis_code: string;
  axis_name: string;
  questions: Question[];
};

type SurveyData = {
  message: string;
  status_code: number;
  user_tip: string;
  code: string;
  survey_metadata: {
    id: string;
    title: string;
  };
  data: SurveyAxis[];
};

// mockSurvey.ts (giữ nguyên dữ liệu như bạn gửi)
// const mockSurveyData: SurveyData = {
//   message: 'Lấy danh sách câu hỏi khảo sát thành công.',
//   status_code: 200 as any,
//   code: 'SURVEY_QUESTIONS_LISTED' as any,
//   user_tip: 'Hãy hoàn thành lần lượt các trục để kết thúc khảo sát.',
//   survey_metadata: {
//     id: '1',
//     title: 'Khảo sát năng lực cho bé',
//   },
//   data: [
//     {
//       axis_code: 'math_competency',
//       axis_name: 'NĂNG LỰC TOÁN HỌC NỀN TẢNG',
//       questions: [
//         {
//           question_id: 'q_m_001',
//           required: true,
//           text: 'Khi mẹ lần lượt đưa cho bé một món đồ chơi rồi nhiều món, bé có biết phân biệt được \'một\' và \'nhiều\' không?',
//           type: 'multiple_choice',
//           options: [
//             { value: 'yes', label: 'Có' },
//             { value: 'no', label: 'Không' },
//             { value: 'partial', label: 'Một phần' },
//           ],
//         },
//         {
//           question_id: 'q_m_002',
//           required: true,
//           text: 'Khi mẹ đếm 1–2–3 và chạm từng món, bé có đếm theo hoặc chỉ tay cùng mẹ không?',
//           type: 'single_choice',
//           options: [
//             { value: 'yes', label: 'Có' },
//             { value: 'no', label: 'Không' },
//             { value: 'partial', label: 'Một phần' },
//           ],
//         },
//         {
//           question_id: 'q_m_003',
//           required: true,
//           text: 'Khi có hai món đồ chơi, một to và một nhỏ, bé có chỉ đúng món \'to hơn\' khi mẹ hỏi không?',
//           type: 'single_choice',
//           options: [
//             { value: 'yes', label: 'Có' },
//             { value: 'no', label: 'Không' },
//             { value: 'partial', label: 'Một phần' },
//           ],
//         },
//         {
//           question_id: 'q_m_004',
//           required: true,
//           text: 'Bé có chơi trò \'thả khối đúng lỗ\' không (ví dụ: tròn vào tròn, vuông vào vuông)?',
//           type: 'single_choice',
//           options: [
//             { value: 'yes', label: 'Có' },
//             { value: 'no', label: 'Không' },
//             { value: 'partial', label: 'Một phần' },
//           ],
//         },
//         {
//           question_id: 'q_m_005',
//           required: true,
//           text: 'Khi xếp bàn ăn, bé có biết mỗi người cần một cái bát hoặc khi đi giày biết mỗi chân một chiếc không?',
//           type: 'single_choice',
//           options: [
//             { value: 'yes', label: 'Có' },
//             { value: 'no', label: 'Không' },
//             { value: 'partial', label: 'Một phần' },
//           ],
//         },
//         {
//           question_id: 'q_m_006',
//           required: true,
//           text: 'Nếu mẹ xếp chuỗi đỏ–xanh–đỏ–xanh rồi hỏi tiếp theo màu gì, bé có đoán đúng không?',
//           type: 'single_choice',
//           options: [
//             { value: 'yes', label: 'Có' },
//             { value: 'no', label: 'Không' },
//             { value: 'partial', label: 'Một phần' },
//           ],
//         },
//         {
//           question_id: 'q_m_007',
//           required: true,
//           text: 'Khi mẹ nói \'đặt con gấu lên ghế\', \'đặt xuống dưới bàn\', bé có làm đúng không?',
//           type: 'single_choice',
//           options: [
//             { value: 'yes', label: 'Có' },
//             { value: 'no', label: 'Không' },
//             { value: 'partial', label: 'Một phần' },
//           ],
//         },
//       ],
//     },
//     {
//       axis_code: 'logic_and_approach_style',
//       axis_name: 'PHONG CÁCH TƯ DUY VÀ CÁCH TIẾP CẬN',
//       questions: [
//         {
//           question_id: 'q_p_001',
//           required: true,
//           text: 'Khi có món đồ chơi mới, bé thường làm gì đầu tiên?',
//           type: 'single_choice',
//           options: [
//             { value: 'visual', label: 'Nhìn và xoay ngắm kỹ (Visual)' },
//             { value: 'auditory', label: 'Lắc, nghe hoặc nghe mẹ nói (Auditory)' },
//             { value: 'kinesthetic', label: 'Cầm, sờ, thử bằng tay chân (Kinesthetic)' },
//           ],
//         },
//         {
//           question_id: 'q_p_002',
//           required: true,
//           text: 'Khi chơi trò hơi khó, bé thường phản ứng thế nào?',
//           type: 'single_choice',
//           options: [
//             { value: 'visual', label: 'Nhìn và xoay ngắm kỹ (Visual)' },
//             { value: 'auditory', label: 'Lắc, nghe hoặc nghe mẹ nói (Auditory)' },
//             { value: 'kinesthetic', label: 'Cầm, sờ, thử bằng tay chân (Kinesthetic)' },
//           ],
//         },
//         {
//           question_id: 'q_p_003',
//           required: true,
//           text: 'Bé thích nhất kiểu chơi nào?',
//           type: 'single_choice',
//           options: [
//             { value: 'visual', label: 'Nhìn và xoay ngắm kỹ (Visual)' },
//             { value: 'auditory', label: 'Lắc, nghe hoặc nghe mẹ nói (Auditory)' },
//             { value: 'kinesthetic', label: 'Cầm, sờ, thử bằng tay chân (Kinesthetic)' },
//           ],
//         },
//       ],
//     },
//   ],
// };

export default function SurveyClient() {
  const { showToast } = useToast();
  const router = useRouter();
  const { percent, visible, start, finish } = useProgress();
  const [current, setCurrent] = useState(0);
  const [screens, setScreens] = useState<Question[][]>([]);
  const [flatQuestions, setFlatQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [surveyInfo, setSurveyInfo] = useState<SurveyData | null>(null);
  const dataChild = {
    child_current_id: 'child-1',
    list_kids: [] as unknown[],
  };
  const { id } = useParams();

  useEffect(() => {
    start();
    // const timer = setTimeout(() => {
    const getMockData = async () => {
      try {
        const dataMock = await fetch(`https://iruka-mvp-596825522277.asia-southeast1.run.app/api/surveys/questions?subject_id=${id}`);
        const surveyData = await dataMock.json();
        setSurveyInfo(surveyData);
        const flat = surveyData?.data?.flatMap((axis: any) =>
          axis.questions.map((q: any) => ({
            ...q,
            axis_name: axis.axis_name,
            axis_code: axis.axis_code,
          })),
        );

        const screensByAxis: Question[][] = surveyData.data
          .map((axis: any) => {
            const qs = axis.questions.map((q: any) => ({
              ...q,
              axis_name: axis.axis_name,
              axis_code: axis.axis_code,
            }));
            const axisScreens: Question[][] = [];
            for (let i = 0; i < qs.length; i += 2) {
              axisScreens.push(qs.slice(i, i + 2));
            }
            return axisScreens;
          })
          .flat();

        setFlatQuestions(flat);
        setScreens(screensByAxis);

        const initialAnswers: Record<string, string[]> = {};
        flat.forEach((q: any) => {
          initialAnswers[q.question_id] = [];
        });
        setAnswers(initialAnswers);
        finish();
        // console.warn('loaded survey', surveyData);
      } catch (error) {
        console.warn('loi', error);
        finish();
      }
    };

    // const surveyData: SurveyData = mockSurveyData;
    // setSurveyInfo(surveyData);
    getMockData();
  }, [id]);

  const currentScreen = screens[current] || [];

  const handleSelect = (qid: string, optionValue: string, type: string) => {
    setAnswers((prev) => {
      // ensure prev[qid] is an array
      const prevAnswers = Array.isArray(prev[qid]) ? prev[qid] : [];
      if (type === 'multiple_choice') {
        if (prevAnswers.includes(optionValue)) {
          return { ...prev, [qid]: prevAnswers.filter(v => v !== optionValue) };
        } else {
          return { ...prev, [qid]: [...prevAnswers, optionValue] };
        }
      } else {
        // single choice -> replace
        return { ...prev, [qid]: [optionValue] };
      }
    });
  };

  const next = () => {
    // only allow next when all questions in current screen have answers
    const hasAnswered
      = currentScreen.length > 0
        && currentScreen.every(q => (answers[q.question_id]?.length ?? 0) > 0);

    if (!hasAnswered) {
      return;
    }
    if (current < screens.length - 1) {
      setCurrent(prev => prev + 1);
    }
  };

  const prev = () => {
    if (current > 0) {
      setCurrent(prev => prev - 1);
    }
  };

  const progress = screens.length > 0 ? Math.round(((current + 1) / screens.length) * 100) : 0;

  const hasAnswered
    = currentScreen.length > 0
      && currentScreen.every(q => (answers[q.question_id]?.length ?? 0) > 0);

  const handleFinish = () => {
    // Build axesMap similar to original behavior (group by axis_code)
    const axesMap: Record<
      string,
      {
        axis_code?: string;
        axis_name?: string;
        questions: {
          question_id: string;
          text: string;
          type: string;
          required: boolean;
          options: Option[];
          answers: string[];
        }[];
      }
    > = {};

    // iterate over flatQuestions so we don't miss any
    flatQuestions.forEach((q) => {
      const selectedAnswers = answers[q.question_id] || [];
      if (!selectedAnswers.length) {
        return;
      }

      const axisKey = q.axis_code ?? 'default_axis';
      if (!axesMap[axisKey]) {
        axesMap[axisKey] = {
          axis_code: q.axis_code,
          axis_name: q.axis_name,
          questions: [],
        };
      }

      axesMap[axisKey].questions.push({
        question_id: q.question_id,
        text: q.text,
        type: q.type,
        required: q.required,
        options: q.options,
        answers: selectedAnswers,
      });
    });

    const survey_result = Object.values(axesMap);
    const dataRequest = {
      child_id: dataChild.child_current_id,
      subject_id: surveyInfo?.survey_metadata.id ?? 'unknown_subject',
      survey_id: surveyInfo?.survey_metadata.id ?? 'survey-1',
      locale: 'vi-VN',
      segment: 'urban',
      survey_result,
    };

    console.warn('handleFinish payload', dataRequest);
    showToast('Nộp bài khảo sát thành công!');
    router.push('/snapshot/math_001');
  };
  // Render
  return (

    <div className="relative flex min-h-screen justify-center 0 p-[24px] pt-0">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-[100%] rounded-md bg-white pt-[70px] sm:pt-2 sm:w-[80%] sm:p-8  lg:w-[60%]"
      >
        <div className="hidden  justify-center sm:flex">
          {/* <img src="/Logo_text.webp" alt="Logo" className="w-[100px]" /> */}
          <Image
            src="/Logo_text.webp"
            alt="Iruka logo"
            width={190}
            height={70}
          />
        </div>

        {surveyInfo && (
          <div className="relative mb-4 text-center ">
            <MdOutlineArrowBackIos onClick={() => router.back()} className="block sm:hidden absolute top-1 left-0 cursor-pointer text-[20px] hover:bg-gray-200 hover:opacity-90" />

            <h2 className="hidden text-[32px] font-bold text-[#0090E0] sm:block">Khảo sát năng lực cho bé</h2>
            <h2 className=" text-[20px] font-bold text-[#0090E0] sm:hidden">Khảo sát</h2>
          </div>
        )}

        <div className="mb-4 flex justify-between font-bold text-sm text-gray-500">
          <span>

            {' '}
            {current + 1}
            {' '}
            /
            {' '}
            {screens.length}
          </span>
          <span className="font-bold">
            {progress}
            %
          </span>
        </div>

        <div className="mb-6 h-2 rounded-full bg-gray-100">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-blue-400 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
          >
            {/* axis_name lấy từ câu đầu của màn (màn luôn thuộc 1 axis) */}
            {currentScreen[0] && (
              <h2 className="mb-2  rounded-md bg-blue-100 p-2 text-center text-[18px] font-semibold text-blue-700">
                {currentScreen[0].axis_name}
              </h2>
            )}

            <div className="space-y-6">
              {currentScreen.map(q => (
                <div key={q.question_id}>
                  <p className="mb-3 text-[18px] font-medium text-[#0090E0]">
                    {q.text}
                    {q.type === 'multiple_choice' && (
                      <span className="text-[12px] text-red-500">{' ( Có thể chọn nhiều đáp án )'}</span>
                    )}
                  </p>

                  <div className="space-y-3">
                    {Array.isArray(q.options)
                      && q.options.map((option) => {
                        const selected = (answers[q.question_id] || []).includes(option?.value);
                        return (
                          <button
                            type="button"
                            key={option?.value}
                            onClick={() => handleSelect(q.question_id, option?.value ?? '', q.type)}

                            className={`mb-[12px] h-[56px] w-full cursor-pointer font-medium rounded-md border p-2 text-left transition-all duration-200 ${
                              selected ? 'bg-blue-400 text-white  shadow-sm' : 'border-blue-200 hover:bg-blue-50'
                            }`}
                          >
                            {option?.label ?? ''}
                          </button>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex justify-between gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={prev}
            disabled={current === 0}
            className="font-medium h-[56px] w-[286px] cursor-pointer rounded-md border border-blue-500 px-8 py-3 text-blue-700 hover:bg-gray-200 disabled:opacity-50"
          >
            Quay lai
          </motion.button>

          {current === screens.length - 1 && hasAnswered
            ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleFinish}
                className="h-[56px] w-[286px] font-medium  rounded-md bg-gradient-to-r from-blue-500 to-blue-500 px-6 py-3 text-white transition-transform hover:scale-105"
              >
                Hoàn thành
              </motion.button>
            )
            : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={next}
                disabled={!hasAnswered}
                className="h-[56px] w-[286px]  cursor-pointer rounded-md bg-[#0090E0] px-6 py-3 font-medium text-white  disabled:opacity-50"
              >
                Tiếp theo
              </motion.button>
            )}
        </div>
      </motion.div>

      <Progress percent={percent} visible={visible} />
    </div>
  );
}
