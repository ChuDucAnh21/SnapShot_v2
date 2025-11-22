import type { Metadata } from 'next';
import ListChildClient from './ListChildClient';

export const metadata: Metadata = {
  title: 'Assessment | Iruka',
  description: 'Complete your learning assessment',
};

export default function ListChildPage() {
  return <ListChildClient />;
}
