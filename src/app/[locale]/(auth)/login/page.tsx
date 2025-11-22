import type { Metadata } from 'next';
import { LoginClient } from './LoginClient';

export const metadata: Metadata = {
  title: 'Login | Iruka',
  description: 'Login to your Iruka account',
};

export default function LoginPage() {
  return <LoginClient />;
}
