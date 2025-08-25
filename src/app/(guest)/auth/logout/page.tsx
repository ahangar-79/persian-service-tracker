import type { Metadata } from "next";
import SignOut from "@/components/SignOut";

export const metadata: Metadata = {
    title: "خروج از سیستم",
    description: "صفحه خروج از سیستم ردیابی خدمات فارسی",
    robots: {
        index: false,
        follow: false,
    },
};

export default function SignOutPage() {
    return (
        <div className="w-full max-w-md text-center">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    خروج از سیستم
                </h1>
                <p className="text-gray-600">
                    آیا مطمئن هستید که می‌خواهید از سیستم خارج شوید؟
                </p>
            </div>
            <SignOut />
        </div>
    );
}
