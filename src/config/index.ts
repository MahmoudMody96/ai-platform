/**
 * AI Platform Configuration
 * Central configuration for site settings, API endpoints, and feature flags
 */

// Site Configuration
export const siteConfig = {
  name: "AI Platform",
  description: "منصة الذكاء الاصطناعي",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  locale: "ar",
  direction: "rtl" as const,
  theme: {
    primaryColor: "#6366f1",
    secondaryColor: "#8b5cf6",
  },
  author: {
    name: "AI Platform Team",
    email: "support@aiplatform.example.com",
  },
} as const;

// API Endpoints
export const apiConfig = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  },
  endpoints: {
    articles: "/api/articles",
    categories: "/api/categories",
    tools: "/api/tools",
    comments: "/api/comments",
    users: "/api/users",
    analytics: "/api/analytics",
  },
} as const;

// Feature Flags
export const featureFlags = {
  analytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true",
  debugMode: process.env.NEXT_PUBLIC_ENABLE_DEBUG_MODE === "true",
  // Add more flags as needed
  enableRegistration: true,
  enableComments: true,
  enableApiKeys: true,
} as const;

// Environment Info
export const environment = {
  isDevelopment: process.env.NODE_ENV === "development",
  isTest: process.env.NODE_ENV === "test",
  isProduction: process.env.NODE_ENV === "production",
} as const;

// Validation constants
export const validationConfig = {
  maxArticleLength: 50000,
  maxCommentLength: 2000,
  maxTitleLength: 200,
  allowedImageTypes: ["image/jpeg", "image/png", "image/webp"],
  maxFileSize: 5 * 1024 * 1024, // 5MB
} as const;

export default {
  siteConfig,
  apiConfig,
  featureFlags,
  environment,
  validationConfig,
};