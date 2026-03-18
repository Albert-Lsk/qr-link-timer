import { Request } from 'express'

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  timestamp: string
}

export interface ApiError {
  success: false
  message: string
  code?: string
  details?: any
  timestamp: string
}

// QR Code types
export interface CreateQRCodeRequest {
  originalUrl: string
  expiryHours: number
  title?: string
  description?: string
}

export interface UpdateQRCodeRequest {
  title?: string
  description?: string
  isActive?: boolean
}

export interface QRCodeResponse {
  id: string
  originalUrl: string
  qrCodeData: string
  title?: string
  description?: string
  createdAt: string
  expiresAt: string
  isActive: boolean
  accessCount: number
}

export interface QRCodeStats {
  totalCodes: number
  activeCodes: number
  expiredCodes: number
  totalAccess: number
  recentActivity: {
    todayCreated: number
    todayAccessed: number
    weeklyGrowth: number
  }
}

// Access Log types
export interface AccessLogEntry {
  id: string
  qrCodeId: string
  accessedAt: string
  userAgent?: string
  ipAddress?: string
  referer?: string
}

// Validation types
export interface ValidationError {
  field: string
  message: string
  value?: any
}

// Environment types
export interface EnvConfig {
  NODE_ENV: string
  PORT: number
  HOST: string
  APP_BASE_URL: string
  DATABASE_URL: string
  CORS_ORIGIN: string
  JWT_SECRET?: string
  JWT_EXPIRES_IN?: string
  QR_CODE_SIZE: number
  QR_CODE_ERROR_CORRECTION_LEVEL: 'L' | 'M' | 'Q' | 'H'
  QR_CODE_MARGIN: number
  DEFAULT_EXPIRY_HOURS: number
  MAX_EXPIRY_DAYS: number
  MAX_URL_LENGTH: number
  RATE_LIMIT_WINDOW_MS: number
  RATE_LIMIT_MAX_REQUESTS: number
  LOG_LEVEL: string
  LOG_FILE: string
  CLEANUP_INTERVAL_HOURS: number
}

// Express Request extensions
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string
    email: string
  }
}

export interface QRCodeRequest extends Request {
  qrCode?: QRCodeResponse
}
