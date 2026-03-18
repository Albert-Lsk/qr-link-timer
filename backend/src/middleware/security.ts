import { Request, Response, NextFunction } from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import cors from 'cors'
import env from '@/utils/env'
import { sendTooManyRequests } from '@/utils/response'

// CORS configuration
export const corsOptions: cors.CorsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true)
    }

    const allowedOrigins = env.CORS_ORIGIN.split(',').map(o => o.trim())
    
    if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400 // 24 hours
}

// Rate limiting configuration
export const createRateLimit = (windowMs?: number, maxRequests?: number) => {
  return rateLimit({
    windowMs: windowMs || env.RATE_LIMIT_WINDOW_MS,
    max: maxRequests || env.RATE_LIMIT_MAX_REQUESTS,
    message: {
      success: false,
      message: 'Too many requests from this IP, please try again later',
      code: 'TOO_MANY_REQUESTS',
      timestamp: new Date().toISOString()
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req: Request, res: Response) => {
      sendTooManyRequests(res, 'Too many requests from this IP, please try again later')
    }
  })
}

// Stricter rate limiting for API creation endpoints
export const strictRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  10 // max 10 requests per 15 minutes
)

// Basic rate limiting for general API
export const basicRateLimit = createRateLimit()

// Helmet security configuration
export const helmetOptions: Parameters<typeof helmet>[0] = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false, // Disable for API usage
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}

// IP extraction middleware (useful for rate limiting behind proxies)
export function extractClientIP(req: Request, res: Response, next: NextFunction): void {
  const forwarded = req.headers['x-forwarded-for']
  const realIP = req.headers['x-real-ip']
  const cfConnectingIP = req.headers['cf-connecting-ip']

  res.locals.clientIp =
    typeof forwarded === 'string'
      ? forwarded.split(',')[0].trim()
      : typeof realIP === 'string'
        ? realIP
        : typeof cfConnectingIP === 'string'
          ? cfConnectingIP
          : req.ip
  next()
}

// Request size limiter
export function requestSizeLimiter(req: Request, res: Response, next: NextFunction): void {
  const contentLength = req.headers['content-length']
  const maxSize = 1024 * 1024 // 1MB
  
  if (contentLength && parseInt(contentLength) > maxSize) {
    res.status(413).json({
      success: false,
      message: 'Request body too large',
      code: 'PAYLOAD_TOO_LARGE',
      timestamp: new Date().toISOString()
    })
    return
  }
  
  next()
}

// User-Agent validation (block suspicious requests)
export function validateUserAgent(req: Request, res: Response, next: NextFunction): void {
  const userAgent = req.headers['user-agent']
  
  // Block requests without User-Agent (except for development)
  if (!userAgent && env.NODE_ENV === 'production') {
    res.status(400).json({
      success: false,
      message: 'User-Agent header is required',
      code: 'MISSING_USER_AGENT',
      timestamp: new Date().toISOString()
    })
    return
  }
  
  // Block known malicious user agents
  const maliciousPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i
  ]
  
  // Only block in production and if it's clearly malicious
  if (env.NODE_ENV === 'production' && userAgent) {
    const isSuspicious = maliciousPatterns.some(pattern => pattern.test(userAgent))
    
    // You might want to log suspicious requests instead of blocking
    if (isSuspicious) {
      // Log but don't block - many legitimate tools use these patterns
      console.log(`Suspicious User-Agent: ${userAgent} from ${req.ip}`)
    }
  }
  
  next()
}

// Security headers middleware
export function securityHeaders(req: Request, res: Response, next: NextFunction): void {
  // Remove server information
  res.removeHeader('X-Powered-By')
  
  // Add custom security headers
  res.setHeader('X-API-Version', '1.0.0')
  res.setHeader('X-Request-ID', Math.random().toString(36).substr(2, 9))
  
  next()
}
