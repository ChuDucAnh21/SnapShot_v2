import type { Metadata } from 'next';
import SurveyClient from './question';

export const metadata: Metadata = {
  title: 'Assessment | Iruka',
  description: 'Complete your learning assessment',
};

export default function AssessmentPage() {
  return <SurveyClient />;
}
