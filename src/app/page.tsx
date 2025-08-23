import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/u-dashboard');
  return null;
}
