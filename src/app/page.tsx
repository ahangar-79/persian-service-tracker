import type { Metadata } from "next";
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: "صفحه اصلی",
  description: "سیستم ردیابی خدمات فارسی - پلتفرم مدیریت و نظارت بر خدمات آنلاین",
  robots: {
    index: true,
    follow: true,
  },
};

export default function Home() {
  redirect('/u-dashboard');
  return null;
}
