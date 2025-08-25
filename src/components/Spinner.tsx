"use client";

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    text?: string;
}

export default function Spinner({ size = 'md', className = '', text = 'در حال بارگذاری...' }: SpinnerProps) {
    const sizeClasses = {
        sm: 'h-6 w-6',
        md: 'h-8 w-8',
        lg: 'h-12 w-12'
    };

    const textSizeClasses = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg'
    };

    return (
        <div className={`min-h-screen flex items-center justify-center ${className}`}>
            <div className="text-center">
                <div
                    className={`animate-spin rounded-full border-b-2 border-blue-600 mx-auto mb-4 ${sizeClasses[size]}`}
                    role="status"
                    aria-label="در حال بارگذاری"
                />
                <p className={`text-gray-600 ${textSizeClasses[size]}`}>
                    {text}
                </p>
            </div>
        </div>
    );
}