import type { Metadata } from 'next';
import OnBoardingClient from './OnboardingClient';


export const metadata: Metadata = {
  title: 'Dashboard | Iruka',
  description: 'View your learning progress and statistics',
};

export default function DashboardPage() {
  return <OnBoardingClient />;
}
