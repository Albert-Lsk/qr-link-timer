import dotenv from 'dotenv'
import { EnvConfig } from '@/types'

// Load environment variables
dotenv.config()

// Helper function to get environment variable with type conversion
function getEnvVar<T>(key: string, defaultValue: T, converter?: (value: string) => T): T {
  const value = process.env[key]
  
  if (value === undefined) {
    return defaultValue
  }
  
  if (converter) {
    try {
      return converter(value)
    } catch {
      return defaultValue
    }
  }
  
  return value as unknown as T
}

// Convert string to number
const toNumber = (value: string): number => {
  const num = parseInt(value, 10)
  if (isNaN(num)) {
    throw new Error(`Invalid number: ${value}`)
  }
  return num
}

// Validate error correction level
const toErrorCorrectionLevel = (value: string): 'L' | 'M' | 'Q' | 'H' => {
  const validLevels = ['L', 'M', 'Q', 'H'] as const
  const upperValue = value.toUpperCase() as 'L' | 'M' | 'Q' | 'H'
  
  if (!validLevels.includes(upperValue)) {
    return 'M' // Default fallback
  }
  
  return upperValue
}

// Export environment configuration
export const env: EnvConfig = {
  NODE_ENV: getEnvVar('NODE_ENV', 'development'),
  PORT: getEnvVar('PORT', 3001, toNumber),
  HOST: getEnvVar('HOST', '0.0.0.0'),
  APP_BASE_URL: getEnvVar('APP_BASE_URL', 'http://localhost:3001'),
  DATABASE_URL: getEnvVar('DATABASE_URL', 'file:./dev.db'),
  CORS_ORIGIN: getEnvVar('CORS_ORIGIN', 'http://localhost:3000'),
  JWT_SECRET: getEnvVar('JWT_SECRET', undefined),
  JWT_EXPIRES_IN: getEnvVar('JWT_EXPIRES_IN', '7d'),
  QR_CODE_SIZE: getEnvVar('QR_CODE_SIZE', 256, toNumber),
  QR_CODE_ERROR_CORRECTION_LEVEL: getEnvVar('QR_CODE_ERROR_CORRECTION_LEVEL', 'M', toErrorCorrectionLevel),
  QR_CODE_MARGIN: getEnvVar('QR_CODE_MARGIN', 2, toNumber),
  DEFAULT_EXPIRY_HOURS: getEnvVar('DEFAULT_EXPIRY_HOURS', 24, toNumber),
  MAX_EXPIRY_DAYS: getEnvVar('MAX_EXPIRY_DAYS', 365, toNumber),
  MAX_URL_LENGTH: getEnvVar('MAX_URL_LENGTH', 2048, toNumber),
  RATE_LIMIT_WINDOW_MS: getEnvVar('RATE_LIMIT_WINDOW_MS', 900000, toNumber),
  RATE_LIMIT_MAX_REQUESTS: getEnvVar('RATE_LIMIT_MAX_REQUESTS', 100, toNumber),
  LOG_LEVEL: getEnvVar('LOG_LEVEL', 'info'),
  LOG_FILE: getEnvVar('LOG_FILE', './logs/app.log'),
  CLEANUP_INTERVAL_HOURS: getEnvVar('CLEANUP_INTERVAL_HOURS', 1, toNumber)
}

// Validate required environment variables
export function validateEnv(): void {
  const requiredVars = ['DATABASE_URL']
  const missing = requiredVars.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
  
  // Additional validations
  if (env.PORT < 1 || env.PORT > 65535) {
    throw new Error('PORT must be between 1 and 65535')
  }
  
  if (env.MAX_EXPIRY_DAYS < 1 || env.MAX_EXPIRY_DAYS > 3650) {
    throw new Error('MAX_EXPIRY_DAYS must be between 1 and 3650 (10 years)')
  }
  
  if (env.QR_CODE_SIZE < 64 || env.QR_CODE_SIZE > 2048) {
    throw new Error('QR_CODE_SIZE must be between 64 and 2048')
  }
}

export default env
