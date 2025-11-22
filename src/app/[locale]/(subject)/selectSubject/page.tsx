import type { Metadata } from 'next';
import SelectSubjectClient from './SelectSubjectClient';

export const metadata: Metadata = {
  title: 'Assessment | Iruka',
  description: 'Complete your learning assessment',
};

export default function IntroducePage() {
  return <SelectSubjectClient/>
}

