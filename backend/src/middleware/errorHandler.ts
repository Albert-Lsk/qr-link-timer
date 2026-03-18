import { Request, Response, NextFunction } from 'express'
import { Prisma } from '@prisma/client'
import { logError } from '@/utils/logger'
import { sendError, sendInternalError } from '@/utils/response'

// Custom error class
export class AppError extends Error {
  public statusCode: number
  public code?: string
  public details?: any

  constructor(message: string, statusCode: number = 500, code?: string, details?: any) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.details = details
    this.name = 'AppError'

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, AppError)
  }
}

// Handle Prisma errors
function handlePrismaError(error: Prisma.PrismaClientKnownRequestError): {
  message: string
  statusCode: number
  code: string
} {
  switch (error.code) {
    case 'P2002':
      return {
        message: 'A record with this information already exists',
        statusCode: 409,
        code: 'DUPLICATE_RECORD'
      }
    case 'P2025':
      return {
        message: 'Record not found',
        statusCode: 404,
        code: 'NOT_FOUND'
      }
    case 'P2003':
      return {
        message: 'Foreign key constraint violation',
        statusCode: 400,
        code: 'FOREIGN_KEY_VIOLATION'
      }
    case 'P2006':
      return {
        message: 'Invalid value provided',
        statusCode: 400,
        code: 'INVALID_VALUE'
      }
    case 'P2011':
      return {
        message: 'Null constraint violation',
        statusCode: 400,
        code: 'NULL_CONSTRAINT_VIOLATION'
      }
    case 'P2012':
      return {
        message: 'Missing required value',
        statusCode: 400,
        code: 'MISSING_REQUIRED_VALUE'
      }
    case 'P2013':
      return {
        message: 'Missing required argument',
        statusCode: 400,
        code: 'MISSING_REQUIRED_ARGUMENT'
      }
    case 'P2014':
      return {
        message: 'Invalid relation',
        statusCode: 400,
        code: 'INVALID_RELATION'
      }
    default:
      return {
        message: 'Database operation failed',
        statusCode: 500,
        code: 'DATABASE_ERROR'
      }
  }
}

// Error handling middleware
export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Log the error
  logError(error, {
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
    ip: req.ip
  })

  // Handle different error types
  if (error instanceof AppError) {
    // Custom application errors
    sendError(res, error.message, error.statusCode, error.code, error.details)
    return
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Prisma known errors
    const { message, statusCode, code } = handlePrismaError(error)
    sendError(res, message, statusCode, code)
    return
  }

  if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    // Prisma unknown errors
    sendError(res, 'Database operation failed', 500, 'DATABASE_ERROR')
    return
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    // Prisma validation errors
    sendError(res, 'Invalid data provided', 400, 'VALIDATION_ERROR')
    return
  }

  if (error instanceof SyntaxError && 'body' in error) {
    // JSON parsing errors
    sendError(res, 'Invalid JSON format', 400, 'INVALID_JSON')
    return
  }

  // Default error handling
  const isDevelopment = process.env.NODE_ENV === 'development'
  const message = isDevelopment ? error.message : 'Internal server error'
  const details = isDevelopment ? { stack: error.stack } : undefined

  sendInternalError(res, message)
}

// Async error handler wrapper
export function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

// 404 Not Found handler
export function notFoundHandler(req: Request, res: Response, next: NextFunction): void {
  sendError(res, `Route ${req.method} ${req.url} not found`, 404, 'NOT_FOUND')
}