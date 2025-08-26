import bcrypt from "bcryptjs";
import { z } from "zod";

// Security configuration
const SECURITY_CONFIG = {
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS || "12"),
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  PASSWORD_MIN_LENGTH: 8,
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
};

// Rate limiting store (در پروداکشن از Redis استفاده کنید)
const loginAttempts = new Map<string, { count: number; lastAttempt: number; lockedUntil?: number }>();

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(SECURITY_CONFIG.BCRYPT_ROUNDS);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    console.error('Error hashing password:', error);
    throw new Error('خطا در رمزنگاری رمز عبور');
  }
}

// Password verification
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
}

// Check if IP is rate limited for login attempts
export function isLoginRateLimited(ip: string): boolean {
  const attempts = loginAttempts.get(ip);
  
  if (!attempts) {
    return false;
  }

  // Check if locked out
  if (attempts.lockedUntil && Date.now() < attempts.lockedUntil) {
    return true;
  }

  // Reset if lockout period has expired
  if (attempts.lockedUntil && Date.now() >= attempts.lockedUntil) {
    loginAttempts.delete(ip);
    return false;
  }

  return attempts.count >= SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS;
}

// Record failed login attempt
export function recordFailedLogin(ip: string): void {
  const now = Date.now();
  const attempts = loginAttempts.get(ip) || { count: 0, lastAttempt: now };

  attempts.count++;
  attempts.lastAttempt = now;

  // Lock out after max attempts
  if (attempts.count >= SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS) {
    attempts.lockedUntil = now + SECURITY_CONFIG.LOCKOUT_DURATION;
  }

  loginAttempts.set(ip, attempts);
}

// Record successful login (reset attempts)
export function recordSuccessfulLogin(ip: string): void {
  loginAttempts.delete(ip);
}

// Get remaining lockout time
export function getRemainingLockoutTime(ip: string): number {
  const attempts = loginAttempts.get(ip);
  
  if (!attempts?.lockedUntil) {
    return 0;
  }

  const remaining = attempts.lockedUntil - Date.now();
  return Math.max(0, remaining);
}

// Generate secure random string
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}

// Input sanitization for preventing XSS
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
    .slice(0, 1000); // Limit length
}

// Validate password strength
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  score: number;
  message: string;
} {
  let score = 0;
  const messages: string[] = [];

  // Length check
  if (password.length >= 8) {
    score++;
  } else {
    messages.push('حداقل ۸ کاراکتر');
  }

  // Uppercase letter
  if (/[A-Z]/.test(password)) {
    score++;
  } else {
    messages.push('حداقل یک حرف بزرگ');
  }

  // Lowercase letter
  if (/[a-z]/.test(password)) {
    score++;
  } else {
    messages.push('حداقل یک حرف کوچک');
  }

  // Number
  if (/\d/.test(password)) {
    score++;
  } else {
    messages.push('حداقل یک عدد');
  }

  // Special character
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    score++;
  } else {
    messages.push('حداقل یک کاراکتر خاص');
  }

  const isValid = score >= 3; // At least 3 out of 5 criteria
  const message = isValid 
    ? 'رمز عبور مناسب است' 
    : `رمز عبور باید شامل: ${messages.join('، ')}`;

  return { isValid, score, message };
}

// Check for common passwords
const COMMON_PASSWORDS = [
  'password', '123456', '123456789', 'qwerty', 'abc123', 
  'password123', 'admin', 'test', '1234', '12345',
  'test123', 'user', 'root', 'guest'
];

export function isCommonPassword(password: string): boolean {
  return COMMON_PASSWORDS.includes(password.toLowerCase());
}

// Environment variable validation
export function validateEnvironmentVariables(): void {
  const requiredVars = [
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL'
  ];

  const missing = requiredVars.filter(varName => !process.env[varName]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  // Validate NEXTAUTH_SECRET length
  if (process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET.length < 32) {
    throw new Error('NEXTAUTH_SECRET must be at least 32 characters long');
  }
}

// IP address extraction and validation
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

// Security headers
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
} as const;
