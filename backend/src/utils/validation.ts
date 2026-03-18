import type { RequestHandler } from 'express'
import Joi from 'joi'
import { ValidationError } from '@/types'
import env from './env'

// URL validation schema
const urlSchema = Joi.string()
  .uri({ scheme: ['http', 'https'] })
  .max(env.MAX_URL_LENGTH)
  .required()

// QR Code creation validation schema
export const createQRCodeSchema = Joi.object({
  originalUrl: urlSchema.messages({
    'string.uri': 'Must be a valid URL with http or https protocol',
    'string.max': `URL must not exceed ${env.MAX_URL_LENGTH} characters`,
    'any.required': 'URL is required'
  }),
  
  expiryHours: Joi.number()
    .integer()
    .min(1)
    .max(env.MAX_EXPIRY_DAYS * 24)
    .required()
    .messages({
      'number.base': 'Expiry hours must be a number',
      'number.integer': 'Expiry hours must be an integer',
      'number.min': 'Expiry hours must be at least 1',
      'number.max': `Expiry hours must not exceed ${env.MAX_EXPIRY_DAYS * 24} (${env.MAX_EXPIRY_DAYS} days)`,
      'any.required': 'Expiry hours is required'
    }),
  
  title: Joi.string()
    .max(200)
    .optional()
    .messages({
      'string.max': 'Title must not exceed 200 characters'
    }),
  
  description: Joi.string()
    .max(1000)
    .optional()
    .messages({
      'string.max': 'Description must not exceed 1000 characters'
    })
})

// QR Code update validation schema
export const updateQRCodeSchema = Joi.object({
  title: Joi.string()
    .max(200)
    .optional()
    .messages({
      'string.max': 'Title must not exceed 200 characters'
    }),
  
  description: Joi.string()
    .max(1000)
    .optional()
    .messages({
      'string.max': 'Description must not exceed 1000 characters'
    }),
  
  isActive: Joi.boolean()
    .optional()
    .messages({
      'boolean.base': 'isActive must be a boolean'
    })
})

// ID validation schema
export const idSchema = Joi.string()
  .required()
  .messages({
    'any.required': 'ID is required',
    'string.empty': 'ID cannot be empty'
  })

export const idParamsSchema = Joi.object({
  id: idSchema
})

// Query parameters validation
export const queryParamsSchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      'number.base': 'Page must be a number',
      'number.integer': 'Page must be an integer',
      'number.min': 'Page must be at least 1'
    }),
  
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(20)
    .messages({
      'number.base': 'Limit must be a number',
      'number.integer': 'Limit must be an integer',
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit must not exceed 100'
    }),
  
  search: Joi.string()
    .max(200)
    .optional()
    .messages({
      'string.max': 'Search term must not exceed 200 characters'
    }),
  
  status: Joi.string()
    .valid('active', 'expired', 'all')
    .default('all')
    .messages({
      'any.only': 'Status must be one of: active, expired, all'
    }),
  
  sortBy: Joi.string()
    .valid('createdAt', 'expiresAt', 'accessCount', 'title')
    .default('createdAt')
    .messages({
      'any.only': 'SortBy must be one of: createdAt, expiresAt, accessCount, title'
    }),
  
  sortOrder: Joi.string()
    .valid('asc', 'desc')
    .default('desc')
    .messages({
      'any.only': 'SortOrder must be either asc or desc'
    })
})

/**
 * Validate data against a Joi schema
 */
export function validateData<T>(schema: Joi.Schema, data: unknown): {
  isValid: boolean
  data?: T
  errors?: ValidationError[]
} {
  const { error, value } = schema.validate(data, {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true
  })
  
  if (error) {
    const errors: ValidationError[] = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message,
      value: detail.context?.value
    }))
    
    return {
      isValid: false,
      errors
    }
  }
  
  return {
    isValid: true,
    data: value as T
  }
}

/**
 * Express middleware for request validation
 */
export function validateRequest(schema: Joi.Schema, source: 'body' | 'params' | 'query' = 'body'): RequestHandler {
  return (req, res, next) => {
    const dataToValidate = req[source]
    const validation = validateData(schema, dataToValidate)
    
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: validation.errors,
        timestamp: new Date().toISOString()
      })
    }
    
    // Replace the request data with validated and sanitized data
    req[source] = validation.data
    next()
  }
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Sanitize string input
 */
export function sanitizeString(input: string): string {
  return input.trim().replace(/[<>]/g, '')
}
