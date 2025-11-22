'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { MdOutlineArrowBackIos } from 'react-icons/md';
import { Progress, useProgress } from '@/components/progress/ProgressLoading';
import AdviceCard from '@/components/snapshot/AdviceCard';
import DashboardCard from '@/components/snapshot/DashboardCard';
import FooterAction from '@/components/snapshot/FooterAction';
import ProfileHeader from '@/components/snapshot/ProfileHeader';

type ChildInfo = {
  full_name: string;
  nickname?: string;
  age?: number;
};
type OverviewItem = {
  axis_name: string;
  score: number;
};
type AdviceItem = {
  title: string;
  content: string;
};
type SnapshotData = {
  subject_name: string;
  child_info: ChildInfo;
  overview: OverviewItem[];
  advice: AdviceItem[];
};
type Advice = {
  summary: string;
  details: string[];
};
const mockSnapshotData: SnapshotData = {
  subject_name: 'Toán học',
  child_info: {
    full_name: 'Nguyễn Minh Anh',
    nickname: 'Na',
    age: 7,
  },
  overview: [
    { axis_name: 'Tư duy logic', score: 85 },
    { axis_name: 'Khả năng ghi nhớ', score: 78 },
    { axis_name: 'Giải quyết vấn đề', score: 90 },
  ],
  advice: [
    {
      title: 'Khuyến khích học qua trò chơi',
      content: 'Hãy cho bé làm quen với các trò chơi đố vui, ghép hình để tăng hứng thú học toán.',
    },
    {
      title: 'Tạo thói quen học đều đặn',
      content: 'Mỗi ngày dành 15 phút để ôn lại các bài toán cơ bản.',
    },
  ],
};
const mockAdvice: Advice = {
  summary:
    'Hãy dành thời gian trò chuyện, chơi cùng bé mỗi ngày để phát triển kỹ năng ngôn ngữ và tư duy cảm xúc. Hãy kiên nhẫn lắng nghe và khuyến khích bé diễn đạt suy nghĩ của mình.',
  details: [
    'Khuyến khích bé kể lại câu chuyện hoặc điều bé quan sát trong ngày.',
    'Dành ít nhất 15 phút mỗi tối để đọc sách cùng bé.',
    'Khen ngợi khi bé cố gắng thay vì chỉ khi bé làm đúng.',
  ],
};
type OverviewDasboard = {
  name?: string;
  scores?: number;
  description?: string;
  tags?: string[];
};
const mockDataDasboard: OverviewDasboard[] = [
  {
    name: 'Trình độ toán học nền tảng',
    scores: 9,
    description: 'Bé có nền tảng toán học tốt, đặc biệt trong các kỹ năng cơ bản.',
    tags: ['Tư duy phân tích', 'Thích khám phá'],
  },
  {
    name: 'Kỹ năng hộ trợ tổng quát',
    scores: 5,
    description: 'Bé đang phát triển kỹ năng ghi nhớ và tập trung.',
    tags: ['Thích kể chuyện', 'Thích học qua hình ảnh'],
  },
];
export default function SnapshotClient() {
  const dataResult = mockSnapshotData;
  const router = useRouter();
  // const [dataResult, setDataResult] = useState<SnapshotData | null>(mockSnapshotData);
  const { percent, visible, start, finish } = useProgress();
  // const [subText, setSubText] = useState("");
  // const callRef = useRef(false);
  // const { id } = useParams();
  // const {showToast}  = useToast()

  useEffect(() => {
    start();
    const time = setTimeout(() => {
      finish();
    }, 1000);
    return () => clearTimeout(time);
  }, []);

  return (
    <main className="relative flex min-h-screen flex-col items-center px-[24px]  pt-[70px] sm:pt-5">

      {/* Title */}
      <div className="relative block   w-full sm:hidden">

        <MdOutlineArrowBackIos onClick={() => router.back()} className="absolute top-1 left-1 block cursor-pointer text-[20px]   hover:bg-gray-200 hover:opacity-90 sm:hidden" />
        <h2 className="text-center text-[#0090E0]   text-[20px] font-bold">Nhận xét</h2>

      </div>

      {/* Header */}
      {dataResult && <ProfileHeader />}

      <div className="mt-4 hidden text-center sm:block">
        <h1 className="text-[24px] font-bold text-[#0090E0]">
          Chân dung
          {' '}
          {dataResult?.subject_name}
          {' '}
          của bé và lời khuyên cho mẹ
        </h1>
        <p className="hidden text-[12px] text-slate-500 md:block">
          {/* Dựa trên {subText.toLowerCase()} */}
        </p>
      </div>

      {/* Dashboard */}
      {dataResult && (
        <DashboardCard overview={mockDataDasboard} parentGender="mẹ" />
      )}

      {/* Advice */}
      {dataResult && <AdviceCard advice={mockAdvice} parentGender="mẹ" />}

      {/* Footer */}
      {dataResult && <FooterAction />}

      {/* Progress Loading */}
      <Progress percent={percent} visible={visible} />
    </main>
  );
}
