/**
 * AUTOSURE — API Types
 * Standardized response shapes matching the server's response helpers.
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface PaginatedResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  timestamp: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: ValidationError[];
  statusCode: number;
  timestamp: string;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: unknown;
}

export type RequestStatus = 'idle' | 'loading' | 'success' | 'error';
