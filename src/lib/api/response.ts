// =============================================
// AI Platform - API Response Types
// =============================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedApiResponse<T = unknown> extends ApiResponse<T> {
  pagination?: {
    page: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export function successResponse<T>(data: T, message?: string): ApiResponse<T> {
  return { success: true, data, message };
}

export function errorResponse(error: string, _statusCode = 400): ApiResponse {
  return { success: false, error };
}

export function paginatedResponse<T>(
  data: T[],
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
  }
): PaginatedApiResponse<T[]> {
  const totalPages = Math.ceil(pagination.totalCount / pagination.pageSize);
  return {
    success: true,
    data,
    pagination: {
      ...pagination,
      totalPages,
      hasNextPage: pagination.page < totalPages,
      hasPrevPage: pagination.page > 1,
    },
  };
}