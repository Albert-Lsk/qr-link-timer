import { Response } from 'express'
import { ApiResponse, ApiError } from '@/types'

/**
 * Send successful API response
 */
export function sendSuccess<T>(
  res: Response,
  data: T,
  message?: string,
  statusCode: number = 200
): Response<ApiResponse<T>> {
  const response: ApiResponse<T> = {
    success: true,
    data,
    timestamp: new Date().toISOString()
  }
  if (message) {
    response.message = message
  }
  
  return res.status(statusCode).json(response)
}

/**
 * Send error API response
 */
export function sendError(
  res: Response,
  message: string,
  statusCode: number = 500,
  code?: string,
  details?: any
): Response<ApiError> {
  const response: ApiError = {
    success: false,
    message,
    timestamp: new Date().toISOString()
  }
  if (code) {
    response.code = code
  }
  if (details !== undefined) {
    response.details = details
  }
  
  return res.status(statusCode).json(response)
}

/**
 * Send validation error response
 */
export function sendValidationError(
  res: Response,
  errors: Array<{ field: string; message: string; value?: any }>
): Response<ApiError> {
  return sendError(
    res,
    'Validation failed',
    400,
    'VALIDATION_ERROR',
    errors
  )
}

/**
 * Send not found error response
 */
export function sendNotFound(
  res: Response,
  resource: string = 'Resource'
): Response<ApiError> {
  return sendError(
    res,
    `${resource} not found`,
    404,
    'NOT_FOUND'
  )
}

/**
 * Send unauthorized error response
 */
export function sendUnauthorized(
  res: Response,
  message: string = 'Unauthorized'
): Response<ApiError> {
  return sendError(
    res,
    message,
    401,
    'UNAUTHORIZED'
  )
}

/**
 * Send forbidden error response
 */
export function sendForbidden(
  res: Response,
  message: string = 'Forbidden'
): Response<ApiError> {
  return sendError(
    res,
    message,
    403,
    'FORBIDDEN'
  )
}

/**
 * Send too many requests error response
 */
export function sendTooManyRequests(
  res: Response,
  message: string = 'Too many requests'
): Response<ApiError> {
  return sendError(
    res,
    message,
    429,
    'TOO_MANY_REQUESTS'
  )
}

/**
 * Send internal server error response
 */
export function sendInternalError(
  res: Response,
  message: string = 'Internal server error'
): Response<ApiError> {
  return sendError(
    res,
    message,
    500,
    'INTERNAL_ERROR'
  )
}
