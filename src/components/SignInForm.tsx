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

    // Handle field blur for validation
    const handleFieldBlur = (field: 'username' | 'password') => () => {
        const value = formData[field];

        if (!value || value.trim() === '') {
            setErrors(prev => ({
                ...prev,
                [field]: field === 'username' ? 'لطفاً نام کاربری خود را وارد کنید' : 'لطفاً رمز عبور خود را وارد کنید'
            }));
        } else {
            // Validate specific field
            try {
                if (field === 'username') {
                    if (value.length < 3) {
                        setErrors(prev => ({ ...prev, username: 'نام کاربری باید حداقل ۳ کاراکتر باشد' }));
                    } else if (!/^[a-zA-Z0-9._-]+$/.test(value)) {
                        setErrors(prev => ({ ...prev, username: 'نام کاربری فقط می‌تواند شامل حروف، اعداد، نقطه، خط تیره و زیرخط باشد' }));
                    } else {
                        setErrors(prev => ({ ...prev, username: undefined }));
                    }
                } else if (field === 'password') {
                    if (value.length < 4) {
                        setErrors(prev => ({ ...prev, password: 'رمز عبور باید حداقل ۴ کاراکتر باشد' }));
                    } else {
                        setErrors(prev => ({ ...prev, password: undefined }));
                    }
                }
            } catch (error) {
                console.error('Validation error:', error);
            }
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
            // Manual validation for empty fields
            const fieldErrors: ValidationErrors = {};

            if (!formData.username || formData.username.trim() === '') {
                fieldErrors.username = 'لطفاً نام کاربری خود را وارد کنید';
            }

            if (!formData.password || formData.password.trim() === '') {
                fieldErrors.password = 'لطفاً رمز عبور خود را وارد کنید';
            }

            // If we have empty field errors, show them
            if (Object.keys(fieldErrors).length > 0) {
                setErrors(fieldErrors);
                setIsLoading(false);
                return;
            }

            // Advanced validation with Zod
            const validation = validateLoginForm(formData);

            if (!validation.success) {
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
                        general: 'تعداد تلاش‌های نامعتبر زیاد است. حساب شما برای ۱۵ دقیقه قفل شده است.'
                    });
                } else {
                    let errorMessage = '';
                    let fieldErrors: ValidationErrors = {};

                    // Handle specific errors from backend
                    if (result.error === 'INVALID_USERNAME') {
                        fieldErrors.username = 'نام کاربری اشتباه است';
                    } else if (result.error === 'INVALID_PASSWORD') {
                        fieldErrors.password = 'رمز عبور اشتباه است';
                    } else if (result.error === 'INVALID_USERNAME_LENGTH') {
                        fieldErrors.username = 'نام کاربری باید حداقل ۳ کاراکتر باشد';
                    } else if (result.error === 'INVALID_PASSWORD_LENGTH') {
                        fieldErrors.password = 'رمز عبور باید حداقل ۴ کاراکتر باشد';
                    } else if (result.error === 'MISSING_CREDENTIALS') {
                        errorMessage = 'لطفاً تمام فیلدها را پر کنید';
                    } else if (result.error === 'SYSTEM_ERROR') {
                        errorMessage = 'خطای سیستم. لطفاً دوباره تلاش کنید';
                    } else if (result.error === 'CredentialsSignin') {
                        errorMessage = 'اطلاعات ورود نامعتبر است. لطفاً دوباره تلاش کنید';
                    } else if (result.error === 'AccessDenied') {
                        errorMessage = 'دسترسی شما به این حساب محدود شده است';
                    } else if (result.error === 'Configuration') {
                        errorMessage = 'خطا در تنظیمات سیستم. لطفاً با پشتیبانی تماس بگیرید';
                    } else {
                        errorMessage = 'خطا در ورود به سیستم. لطفاً دوباره تلاش کنید';
                    }

                    const remainingAttempts = 5 - newAttemptCount;

                    // If we have field-specific errors, show them
                    if (Object.keys(fieldErrors).length > 0) {
                        // Add remaining attempts to field errors
                        if (fieldErrors.username) {
                            fieldErrors.username += remainingAttempts > 0 ? ` (${remainingAttempts} تلاش باقی‌مانده)` : '';
                        }
                        if (fieldErrors.password) {
                            fieldErrors.password += remainingAttempts > 0 ? ` (${remainingAttempts} تلاش باقی‌مانده)` : '';
                        }
                        setErrors(fieldErrors);
                    } else {
                        // Show general error
                        const finalMessage = remainingAttempts > 0
                            ? `${errorMessage} (${remainingAttempts} تلاش باقی‌مانده)`
                            : errorMessage;
                        setErrors({ general: finalMessage });
                    }
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
                            onBlur={handleFieldBlur('username')}
                            disabled={isLoading || isLocked}
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
                            onBlur={handleFieldBlur('password')}
                            disabled={isLoading || isLocked}
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
                    disabled={isLoading || isLocked}
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
