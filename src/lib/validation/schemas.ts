// =============================================
// AI Platform - Validation Schemas (Zod v4)
// =============================================

import { z } from 'zod';

// Common pagination schema
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

// Tool schemas
export const toolFilterSchema = paginationSchema.extend({
  category: z.string().optional(),
  pricing: z.enum(['free', 'freemium', 'paid', 'contact']).optional(),
  search: z.string().optional(),
  featured: z.coerce.boolean().optional(),
});

export const createToolSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
  description: z.string().max(1000).optional(),
  long_description: z.string().max(5000).optional(),
  logo_url: z.string().url().optional().nullable(),
  website_url: z.string().url().optional().nullable(),
  documentation_url: z.string().url().optional().nullable(),
  pricing_model: z.enum(['free', 'freemium', 'paid', 'contact']),
  monthly_price: z.number().min(0).optional().nullable(),
  category_id: z.string().uuid().optional().nullable(),
  tags: z.array(z.string()).max(20).optional(),
  features: z.array(z.string()).max(50).optional(),
  alternatives: z.array(z.string()).max(10).optional(),
  is_featured: z.boolean().default(false),
});

export const updateToolSchema = createToolSchema.partial();

// Article schemas
export const articleFilterSchema = paginationSchema.extend({
  category: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  search: z.string().optional(),
  featured: z.coerce.boolean().optional(),
  author: z.string().optional(),
});

export const createArticleSchema = z.object({
  title: z.string().min(1).max(300),
  slug: z.string().min(1).max(300).regex(/^[a-z0-9-]+$/),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(1).max(50000).optional(),
  cover_image_url: z.string().url().optional().nullable(),
  author_id: z.string().uuid(),
  category_id: z.string().uuid().optional().nullable(),
  tags: z.array(z.string()).max(20).optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  featured: z.boolean().default(false),
  published_at: z.string().datetime().optional(),
});

export const updateArticleSchema = createArticleSchema.omit({ author_id: true }).partial();

// Category schemas
export const createCategorySchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  description: z.string().max(500).optional().nullable(),
  icon: z.string().max(50).optional().nullable(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().nullable(),
  parent_id: z.string().uuid().optional().nullable(),
  sort_order: z.number().int().min(0).default(0),
});

export const updateCategorySchema = createCategorySchema.partial();

// User schemas
export const updateUserRoleSchema = z.object({
  role: z.enum(['admin', 'editor', 'user']),
});

// Search schemas
export const searchSchema = z.object({
  query: z.string().min(1).max(200),
  type: z.enum(['all', 'tools', 'articles']).default('all'),
  category: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

// Types export
export type ToolFilter = z.infer<typeof toolFilterSchema>;
export type CreateTool = z.infer<typeof createToolSchema>;
export type UpdateTool = z.infer<typeof updateToolSchema>;

export type ArticleFilter = z.infer<typeof articleFilterSchema>;
export type CreateArticle = z.infer<typeof createArticleSchema>;
export type UpdateArticle = z.infer<typeof updateArticleSchema>;

export type CreateCategory = z.infer<typeof createCategorySchema>;
export type UpdateCategory = z.infer<typeof updateCategorySchema>;

export type UpdateUserRole = z.infer<typeof updateUserRoleSchema>;
export type SearchQuery = z.infer<typeof searchSchema>;