// =============================================
// AI Platform - Supabase Module Exports
// =============================================

// Re-export table names
export { Tables } from './types';

// Re-export types
export type {
  ProfileRow,
  CategoryRow,
  ArticleRow,
  ToolRow,
  CommentRow,
  FavoriteRow,
  SubscriptionRow,
  ApiKeyRow,
  ApiLogRow,
  ApiEndpointRow,
  NotificationRow,
  ActivityLogRow,
  AuthUser,
} from './types';

// Re-export client functions
export {
  createClient,
  createBrowserClient,
  createServerClient,
  createServerClientFromMiddleware,
  getServerClient,
  createAdminClient,
} from './client';

// Re-export middleware helpers
export {
  SUPABASE_AUTH_COOKIE_NAMES,
  COOKIE_OPTIONS,
  createMiddlewareClient,
  getUserFromRequest,
  getAccessToken,
  getRefreshToken,
  isAuthenticated,
  createAuthResponse,
  createSignOutResponse,
  refreshSession,
  requireAuth,
  optionalAuth,
  requireAdmin,
} from './middleware';

export type { AuthenticatedUser } from './middleware';

// Re-export helper functions
export {
  formatUser,
  formatProfile,
  getProfile,
  getProfileByUsername,
  createProfile,
  updateProfile,
  updateUserPlan,
  getCurrentUser,
  getSession,
  signUp,
  signIn,
  signOut,
  resetPassword,
  updatePassword,
  uploadAvatar,
  deleteAvatar,
  isUsernameAvailable,
  getUserSubscription,
} from './helpers';

export type { UserProfile } from './helpers';

// Re-export query functions
export {
  getTools,
  getToolById,
  getToolBySlug,
  getFeaturedTools,
  createTool,
  updateTool,
  deleteTool,
  getArticles,
  getArticleById,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
  getCategories,
  getCategoryById,
  getCategoryBySlug,
  getCategoryTree,
  createCategory,
  updateCategory,
  deleteCategory,
  getComments,
  getCommentReplies,
  createComment,
  approveComment,
  deleteComment,
  getUserFavorites,
  addFavorite,
  removeFavorite,
  isFavorited,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  createNotification,
  logActivity,
  getRecentActivity,
  getDashboardStats,
  globalSearch,
} from './queries';

export type {
  PaginationParams,
  PaginatedResult,
} from './queries';
