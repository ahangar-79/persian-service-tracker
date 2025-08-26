import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "خطا در ورود",
    description: "صفحه خطا در سیستم احراز هویت",
    robots: {
        index: false,
        follow: false,
    },
};

interface ErrorPageProps {
    searchParams: {
        error?: string;
    };
}

const errorMessages: Record<string, string> = {
    Configuration: "خطا در تنظیمات سیستم احراز هویت",
    AccessDenied: "دسترسی شما به این بخش محدود شده است",
    Verification: "خطا در تأیید اطلاعات",
    Default: "خطای غیرمنتظره در سیستم احراز هویت رخ داده است",
    CredentialsSignin: "نام کاربری یا رمز عبور اشتباه است",
    SessionRequired: "برای دسترسی به این بخش باید وارد شوید",
};

export default function AuthErrorPage({ searchParams }: ErrorPageProps) {
    const errorType = searchParams.error || "Default";
    const errorMessage = errorMessages[errorType] || errorMessages.Default;

    return (
        <div className="w-full max-w-md text-center">
            <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="mb-6">
                    <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <svg
                            className="w-8 h-8 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        خطا در ورود
                    </h1>
                    <p className="text-gray-600">
                        {errorMessage}
                    </p>
                </div>

                <div className="space-y-4">
                    <Link
                        href="/auth/signIn"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors inline-block"
                    >
                        تلاش مجدد
                    </Link>

                    <Link
                        href="/"
                        className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors inline-block"
                    >
                        بازگشت به صفحه اصلی
                    </Link>
                </div>

                {process.env.NODE_ENV === "development" && (
                    <div className="mt-6 p-4 bg-gray-100 rounded-md text-left">
                        <p className="text-sm text-gray-600 font-mono">
                            Error Type: {errorType}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
