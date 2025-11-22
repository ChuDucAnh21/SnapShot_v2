import type { Metadata } from 'next';
import SnapshotClient from './SnapshotClient';

export const metadata: Metadata = {
  title: 'Assessment | Iruka',
  description: 'Complete your learning assessment',
};

export default function IntroducePage() {
  return <SnapshotClient/>
}

