import { z } from "zod";

// Schema for login form
export const loginSchema = z.object({
  username: z
    .string()
    .min(3, "نام کاربری باید حداقل ۳ کاراکتر باشد")
    .max(50, "نام کاربری نمی‌تواند بیش از ۵۰ کاراکتر باشد")
    .regex(/^[a-zA-Z0-9._-]+$/, "نام کاربری فقط می‌تواند شامل حروف، اعداد، نقطه، خط تیره و زیرخط باشد"),
  
  password: z
    .string()
    .min(4, "رمز عبور باید حداقل ۴ کاراکتر باشد")
    .max(100, "رمز عبور نمی‌تواند بیش از ۱۰۰ کاراکتر باشد"),
});

// Schema for user data
export const userSchema = z.object({
  id: z.string().or(z.number()),
  username: z.string().min(3).max(50),
  email: z.string().email("فرمت ایمیل نامعتبر است").optional(),
  role: z.enum(["admin", "user", "moderator"]).default("user"),
  status: z.boolean().default(true),
  nationalId: z
    .string()
    .length(10, "کد ملی باید ۱۰ رقم باشد")
    .regex(/^\d+$/, "کد ملی فقط باید شامل اعداد باشد")
    .optional(),
  phone: z
    .string()
    .regex(/^09\d{9}$/, "شماره تلفن باید با ۰۹ شروع شده و ۱۱ رقم باشد")
    .optional(),
  company: z.string().max(100, "نام شرکت نمی‌تواند بیش از ۱۰۰ کاراکتر باشد").optional(),
});

// Schema for environment variables
export const envSchema = z.object({
  NEXTAUTH_SECRET: z.string().min(32, "NEXTAUTH_SECRET باید حداقل ۳۲ کاراکتر باشد"),
  NEXTAUTH_URL: z.string().url("NEXTAUTH_URL باید یک URL معتبر باشد"),
  AUTH_USERNAME: z.string().min(3),
  AUTH_PASSWORD: z.string().min(4),
  SESSION_MAX_AGE: z.string().regex(/^\d+$/).default("86400"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

// Types extracted from schemas
export type LoginFormData = z.infer<typeof loginSchema>;
export type UserData = z.infer<typeof userSchema>;
export type EnvConfig = z.infer<typeof envSchema>;

// Validation functions
export function validateLoginForm(data: unknown): { success: true; data: LoginFormData } | { success: false; errors: z.ZodError } {
  const result = loginSchema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, errors: result.error };
  }
}

export function validateUser(data: unknown): { success: true; data: UserData } | { success: false; errors: z.ZodError } {
  const result = userSchema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, errors: result.error };
  }
}

// Helper function to get validation error messages in Persian
export function getValidationErrorMessage(error: z.ZodError): string {
  const firstError = error.issues[0];
  return firstError?.message || "داده‌های ورودی نامعتبر است";
}

// Iranian National ID validation
export function validateNationalId(nationalId: string): boolean {
  if (!/^\d{10}$/.test(nationalId)) {
    return false;
  }

  const digits = nationalId.split('').map(Number);
  const checkDigit = digits[9];
  
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += digits[i] * (10 - i);
  }
  
  const remainder = sum % 11;
  
  if (remainder < 2) {
    return checkDigit === remainder;
  } else {
    return checkDigit === 11 - remainder;
  }
}

// Input sanitization
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>\"'&]/g, '') // Remove potential XSS characters
    .slice(0, 1000); // Limit length
}

// Email validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Phone number validation (Iranian format)
export function isValidIranianPhone(phone: string): boolean {
  const phoneRegex = /^(\+98|0)?9\d{9}$/;
  return phoneRegex.test(phone);
}
