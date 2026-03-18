import winston from 'winston'
import path from 'path'
import fs from 'fs'
import env from './env'

// Ensure logs directory exists
const logDir = path.dirname(env.LOG_FILE)
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true })
}

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json()
)

// Console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({
    format: 'HH:mm:ss'
  }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let metaStr = ''
    if (Object.keys(meta).length > 0) {
      metaStr = ' ' + JSON.stringify(meta)
    }
    return `${timestamp} [${level}]: ${message}${metaStr}`
  })
)

// Create logger instance
const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  format: logFormat,
  defaultMeta: { service: 'qr-link-timer-backend' },
  transports: [
    // File transport for all logs
    new winston.transports.File({
      filename: env.LOG_FILE,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    
    // Separate file for errors
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 3,
    })
  ],
})

// Add console transport in development
if (env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: consoleFormat
  }))
}

// Express middleware for request logging
export const requestLogger = (req: any, res: any, next: any) => {
  const start = Date.now()
  
  // Log request
  logger.info('HTTP Request', {
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
    ip: req.ip
  })
  
  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - start
    logger.info('HTTP Response', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`
    })
  })
  
  next()
}

// Error logging helper
export const logError = (error: Error, context?: any) => {
  logger.error('Application Error', {
    message: error.message,
    stack: error.stack,
    context
  })
}

// Success logging helper
export const logSuccess = (message: string, data?: any) => {
  logger.info(message, data)
}

// Warning logging helper
export const logWarning = (message: string, data?: any) => {
  logger.warn(message, data)
}

export default logger