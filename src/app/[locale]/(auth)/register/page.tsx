import type { Metadata } from 'next';
import RegisterClient from './Register';

export const metadata: Metadata = {
  title: 'Login | Iruka',
  description: 'Login to your Iruka account',
};

export default function LoginPage() {
  return <RegisterClient />;
}
