"use client";

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { validateLoginForm } from '@/lib/validations';
import { sanitizeInput } from '@/lib/security';
import styles from './SignInForm.module.css';

interface ValidationErrors {
    username?: string;
    password?: string;
    general?: string;
}

export default function SignInForm() {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const [attemptCount, setAttemptCount] = useState(0);
    const [isLocked, setIsLocked] = useState(false);
    const [lockoutTime, setLockoutTime] = useState(0);
    const router = useRouter();

    // Handle lockout countdown
    useEffect(() => {
        if (lockoutTime > 0) {
            const timer = setInterval(() => {
                setLockoutTime(prev => {
                    if (prev <= 1) {
                        setIsLocked(false);
                        setAttemptCount(0);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [lockoutTime]);

    const handleInputChange = (field: 'username' | 'password') => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = sanitizeInput(e.target.value);
        setFormData(prev => ({ ...prev, [field]: value }));

        // Clear field-specific error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isLocked) {
            return;
        }

        setIsLoading(true);
        setErrors({});

        try {
            // Client-side validation
            const validation = validateLoginForm(formData);

            if (!validation.success) {
                const fieldErrors: ValidationErrors = {};
                validation.errors.issues.forEach(issue => {
                    const field = issue.path[0] as keyof ValidationErrors;
                    if (field && (field === 'username' || field === 'password')) {
                        fieldErrors[field] = issue.message;
                    }
                });
                setErrors(fieldErrors);
                setIsLoading(false);
                return;
            }

            // Attempt sign in
            const result = await signIn('credentials', {
                redirect: false,
                username: formData.username,
                password: formData.password,
            });

            if (result?.error) {
                const newAttemptCount = attemptCount + 1;
                setAttemptCount(newAttemptCount);

                // Lock account after 5 failed attempts
                if (newAttemptCount >= 5) {
                    setIsLocked(true);
                    setLockoutTime(15 * 60); // 15 minutes
                    setErrors({
                        general: 'تعداد تلاش‌های نامعتبر زیاد است. لطفاً ۱۵ دقیقه صبر کنید.'
                    });
                } else {
                    let errorMessage = 'نام کاربری یا رمز عبور اشتباه است';

                    if (result.error === 'CredentialsSignin') {
                        errorMessage = 'اطلاعات ورود نامعتبر است';
                    } else if (result.error === 'AccessDenied') {
                        errorMessage = 'دسترسی شما محدود شده است';
                    }

                    setErrors({
                        general: `${errorMessage} (${5 - newAttemptCount} تلاش باقی‌مانده)`
                    });
                }
            } else if (result?.ok) {
                // Success - reset attempts and redirect
                setAttemptCount(0);
                router.push('/u-dashboard');
            }
        } catch (error) {
            console.error('Login error:', error);
            setErrors({
                general: 'خطای داخلی سیستم. لطفاً دوباره تلاش کنید.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className={styles.formContainer}>
            <h1>ورود به سیستم</h1>
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label>
                        نام کاربری:
                        <input
                            type="text"
                            value={formData.username}
                            onChange={handleInputChange('username')}
                            disabled={isLoading || isLocked}
                            required
                            className={`${styles.input} ${errors.username ? styles.inputError : ''}`}
                            placeholder="نام کاربری خود را وارد کنید"
                            autoComplete="username"
                            maxLength={50}
                        />
                    </label>
                    {errors.username && (
                        <p className={styles.errorMessage}>{errors.username}</p>
                    )}
                </div>

                <div className={styles.formGroup}>
                    <label>
                        رمز عبور:
                        <input
                            type="password"
                            value={formData.password}
                            onChange={handleInputChange('password')}
                            disabled={isLoading || isLocked}
                            required
                            className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                            placeholder="رمز عبور خود را وارد کنید"
                            autoComplete="current-password"
                            maxLength={100}
                        />
                    </label>
                    {errors.password && (
                        <p className={styles.errorMessage}>{errors.password}</p>
                    )}
                </div>

                {errors.general && (
                    <div className={styles.errorContainer}>
                        <p className={styles.errorMessage}>{errors.general}</p>
                        {isLocked && lockoutTime > 0 && (
                            <p className={styles.lockoutMessage}>
                                زمان باقی‌مانده: {formatTime(lockoutTime)}
                            </p>
                        )}
                    </div>
                )}

                <button
                    type="submit"
                    className={`${styles.submitButton} ${(isLoading || isLocked) ? styles.submitButtonDisabled : ''}`}
                    disabled={isLoading || isLocked || !formData.username || !formData.password}
                >
                    {isLoading ? (
                        <span>
                            <span className={styles.loadingSpinner}>⟳</span>
                            در حال ورود...
                        </span>
                    ) : isLocked ? (
                        'حساب موقتاً قفل شده'
                    ) : (
                        'ورود به سیستم'
                    )}
                </button>

                <div className={styles.securityNotice}>
                    <p>ورود شما به سیستم محفوظ و رمزنگاری شده است</p>
                </div>
            </form>
        </div>
    );
}
