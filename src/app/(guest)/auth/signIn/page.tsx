import type { Metadata } from "next";
import SignInForm from "@/components/SignInForm";

export const metadata: Metadata = {
    title: "ورود به سیستم",
    description: "وارد حساب کاربری خود در سیستم ردیابی خدمات فارسی شوید",
    robots: {
        index: false,
        follow: false,
    },
    openGraph: {
        title: "ورود به سیستم ردیابی خدمات",
        description: "وارد حساب کاربری خود شوید",
        type: "website",
    },
};

export default function SignInPage() {
    return (
        <div className="w-full max-w-md">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    ورود به سیستم
                </h1>
                <p className="text-gray-600">
                    لطفاً اطلاعات حساب کاربری خود را وارد کنید
                </p>
            </div>
            <SignInForm />
        </div>
    );
}
