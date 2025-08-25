import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "ورود به سیستم",
    description: "صفحه ورود و خروج کاربران به سیستم ردیابی خدمات فارسی",
    robots: {
        index: false,
        follow: true,
    },
};

export default function GuestLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            {children}
        </div>
    );
}
