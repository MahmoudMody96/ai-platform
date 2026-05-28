// =============================================
// AI Platform - Utility Functions
// =============================================

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, locale: 'ar' | 'en' = 'ar'): string {
  const d = new Date(date);
  return d.toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatRelativeTime(date: string | Date, locale: 'ar' | 'en' = 'ar'): string {
  const d = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) return locale === 'ar' ? 'الآن' : 'just now';
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return locale === 'ar' ? `منذ ${diffInMinutes} دقيقة` : `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return locale === 'ar' ? `منذ ${diffInHours} ساعة` : `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return locale === 'ar' ? `منذ ${diffInDays} يوم` : `${diffInDays}d ago`;
  
  return formatDate(date, locale);
}

export function calculateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / 200);
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

export function formatNumber(num: number, locale: 'ar' | 'en' = 'ar'): string {
  if (locale === 'ar') {
    return new Intl.NumberFormat('ar-EG').format(num);
  }
  return new Intl.NumberFormat('en-US').format(num);
}

export function formatPrice(price: number | null): string {
  if (price === null) return 'Contact';
  if (price === 0) return 'Free';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(price);
}

export function getInitials(name: string): string {
  return name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);
}

export function getPricingColor(pricing: string): string {
  switch (pricing) {
    case 'free': return 'bg-green-100 text-green-700';
    case 'freemium': return 'bg-blue-100 text-blue-700';
    case 'paid': return 'bg-purple-100 text-purple-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}

export function getPricingLabel(pricing: string, locale: 'ar' | 'en' = 'ar'): string {
  const labels: Record<string, Record<string, string>> = {
    free: { ar: 'مجاني', en: 'Free' },
    freemium: { ar: 'مجاني مع باقة مدفوعة', en: 'Freemium' },
    paid: { ar: 'مدفوع', en: 'Paid' },
    contact: { ar: 'تواصل للسعر', en: 'Contact' },
  };
  return labels[pricing]?.[locale] || pricing;
}

export function generateApiKey(): string {
  const prefix = 'aiplat';
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  const key = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  return prefix + '_' + key.slice(0, 32);
}

export function maskApiKey(key: string): string {
  if (key.length < 12) return key;
  return key.slice(0, 8) + '...' + key.slice(-4);
}

export function copyToClipboard(text: string): Promise<boolean> {
  return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
}

export function debounce<T extends (...args: unknown[]) => unknown>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export const categoryColors: Record<string, string> = {
  writing: '#6366F1',
  design: '#EC4899',
  development: '#10B981',
  automation: '#F59E0B',
  marketing: '#3B82F6',
  video: '#8B5CF6',
  education: '#14B8A6',
  research: '#F97316',
  productivity: '#06B6D4',
  audio: '#F59E0B',
  chatbots: '#4F46E5',
};

export function getCategoryColor(slug: string): string {
  return categoryColors[slug] || '#6B7280';
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return url;
  }
}