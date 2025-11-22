import type { Metadata } from 'next';
import CreateChilClient from './CreateChildClient';

export const metadata: Metadata = {
  title: 'Assessment | Iruka',
  description: 'Complete your learning assessment',
};

export default function CreateChildPage() {
  return <CreateChilClient />;
}
