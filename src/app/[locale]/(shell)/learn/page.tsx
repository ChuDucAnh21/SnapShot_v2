import type { RightRailSection } from '@/components/organisms/RightRail';
import { setRequestLocale } from 'next-intl/server';
import ProgressSummary from '@/components/organisms/ProgressSummary';
import WithRightRailTemplate from '@/components/templates/WithRightRailTemplate';
import { RightRailProvider } from '@/context';
import { LearnPageClient } from './LearnPageClient';

export const metadata = {
  title: 'Iruka - The world\'s best way to learn math',
  description: 'Your learning home with progress, quests, and profile actions.',
};

const rightCards: Exclude<RightRailSection, 'action'>[] = [
  {
    id: 'progress',
    title: 'Tiến trình học tập',
    description: 'Theo dõi điểm số và tiến độ',
    content: <ProgressSummary />,
  },
  {
    id: 'promo',
    title: 'Siêu khuyến mãi',
    description: 'Mở khóa các tính năng cao cấp với mức giảm giá 50%!',
    content: <div>Nội dung khuyến mãi</div>,
  },
  {
    id: 'quest',
    title: 'Nhiệm vụ hàng ngày',
    description: 'Hoàn thành nhiệm vụ để nhận điểm thưởng',
    content: <div>Tiến trình nhiệm vụ: 40%</div>,
  },
];

export default async function LearnHomePage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <RightRailProvider initialSections={rightCards}>
      <WithRightRailTemplate stickyTop={0} railWidth={352}>
        <div className="h-full min-h-0 w-full">
          <LearnPageClient />
        </div>
      </WithRightRailTemplate>
    </RightRailProvider>
  );
}
