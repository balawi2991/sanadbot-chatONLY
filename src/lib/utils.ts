import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * دالة لدمج فئات CSS مع Tailwind CSS
 * تستخدم clsx لدمج الفئات و tailwind-merge لحل التعارضات
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * دالة لتنسيق التاريخ باللغة العربية
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj)
}

/**
 * دالة لتنسيق الأرقام باللغة العربية
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('ar-SA').format(num)
}

/**
 * دالة لاختصار النص
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

/**
 * دالة للتحقق من صحة البريد الإلكتروني
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * دالة لتوليد معرف فريد
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

/**
 * دالة لتأخير التنفيذ (للاستخدام مع async/await)
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}