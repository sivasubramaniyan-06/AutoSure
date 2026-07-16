/**
 * AUTOSURE — Response Helpers
 * Standardized JSON response shapes for all API endpoints.
 */

import type { Response } from 'express';

interface SuccessResponseOptions<T> {
  res: Response;
  message: string;
  data?: T;
  statusCode?: number;
}

interface PaginatedResponseOptions<T> {
  res: Response;
  message: string;
  data: T[];
  page: number;
  limit: number;
  total: number;
}

export function sendSuccess<T>({
  res,
  message,
  data,
  statusCode = 200,
}: SuccessResponseOptions<T>): void {
  res.status(statusCode).json({
    success: true,
    message,
    data: data ?? null,
    timestamp: new Date().toISOString(),
  });
}

export function sendCreated<T>(
  res: Response,
  message: string,
  data: T
): void {
  sendSuccess({ res, message, data, statusCode: 201 });
}

export function sendNoContent(res: Response): void {
  res.status(204).send();
}

export function sendPaginated<T>({
  res,
  message,
  data,
  page,
  limit,
  total,
}: PaginatedResponseOptions<T>): void {
  const totalPages = Math.ceil(total / limit);
  res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
    timestamp: new Date().toISOString(),
  });
}
