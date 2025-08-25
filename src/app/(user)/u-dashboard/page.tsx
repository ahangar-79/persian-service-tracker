import type { Metadata } from "next";
import Dashboard from "@/components/Dashboard";

export const metadata: Metadata = {
    title: "داشبورد کلی",
    description: "داشبورد مدیریت و آنالیز سیستم ردیابی خدمات با نمایش آمار کاربران، سرویس‌ها و نمودارهای تحلیلی",
    keywords: ["داشبورد", "آمار", "نمودار", "کاربران", "سرویس", "تحلیل"],
    openGraph: {
        title: "داشبورد سیستم ردیابی خدمات",
        description: "مشاهده آمار و تحلیل‌های سیستم ردیابی خدمات",
        type: "website",
        images: [
            {
                url: "/dashboard-preview.jpg",
                width: 1200,
                height: 630,
                alt: "تصویر پیش‌نمایش داشبورد",
            },
        ],
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function DashboardPage() {
    return (
        <div>
            <header className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    داشبورد کلی
                </h1>
                <p className="text-gray-600">
                    مشاهده آمار و وضعیت کلی سیستم ردیابی خدمات
                </p>
            </header>
            <Dashboard />
        </div>
    );
}
