import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { initDatabase, checkDatabaseConnection } from '@/services/database'
import { requestLogger } from '@/utils/logger'
import { errorHandler, notFoundHandler } from '@/middleware/errorHandler'
import {
  corsOptions,
  helmetOptions,
  basicRateLimit,
  extractClientIP,
  requestSizeLimiter,
  validateUserAgent,
  securityHeaders
} from '@/middleware/security'
import { validateEnv } from '@/utils/env'
import logger from '@/utils/logger'

// Import routes
import qrCodeRoutes from '@/routes/qrcode'
import redirectRoutes from '@/routes/redirect'
import healthRoutes from '@/routes/health'

// Validate environment variables
validateEnv()

// Initialize database
initDatabase()

// Create Express app
const app = express()

// Trust proxy (important for rate limiting and IP detection)
app.set('trust proxy', 1)

// Security middleware
app.use(helmet(helmetOptions))
app.use(extractClientIP)
app.use(securityHeaders)
app.use(validateUserAgent)
app.use(requestSizeLimiter)

// CORS
app.use(cors(corsOptions))

// Rate limiting
app.use(basicRateLimit)

// Body parsing middleware
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))

// Request logging
app.use(requestLogger)

// Health check endpoint (before other routes)
app.get('/health', async (_req, res) => {
  const dbHealthy = await checkDatabaseConnection()
  
  const health = {
    status: dbHealthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0',
    database: dbHealthy ? 'connected' : 'disconnected'
  }
  
  const statusCode = dbHealthy ? 200 : 503
  res.status(statusCode).json(health)
})

// API routes
app.use('/api/qrcodes', qrCodeRoutes)
app.use('/api/health', healthRoutes)
app.use('/redirect', redirectRoutes)

// Root endpoint
app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'QR Link Timer API Server',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    documentation: '/api/docs'
  })
})

// Catch 404 errors
app.use(notFoundHandler)

// Global error handler (must be last)
app.use(errorHandler)

// Graceful shutdown handler
const gracefulShutdown = (signal: string) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`)
  
  // Close server
  process.exit(0)
}

// Handle process termination
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', { error: error.message, stack: error.stack })
  process.exit(1)
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', { reason, promise })
  process.exit(1)
})

export default app
