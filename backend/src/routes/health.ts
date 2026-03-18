import { Router } from 'express'
import { Request, Response } from 'express'
import { checkDatabaseConnection, getDatabaseHealth } from '@/services/database'
import { sendSuccess } from '@/utils/response'
import { asyncHandler } from '@/middleware/errorHandler'
import env from '@/utils/env'

const router = Router()

/**
 * @route   GET /api/health
 * @desc    Basic health check
 * @access  Public
 */
router.get('/', asyncHandler(async (_req: Request, res: Response) => {
  const dbHealthy = await checkDatabaseConnection()
  
  const health = {
    status: dbHealthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    environment: env.NODE_ENV,
    version: '1.0.0',
    services: {
      database: dbHealthy ? 'connected' : 'disconnected'
    }
  }
  
  const statusCode = dbHealthy ? 200 : 503
  res.status(statusCode).json(health)
}))

/**
 * @route   GET /api/health/detailed
 * @desc    Detailed health check with metrics
 * @access  Public
 */
router.get('/detailed', asyncHandler(async (_req: Request, res: Response) => {
  const [dbHealth] = await Promise.all([
    getDatabaseHealth()
  ])
  
  const memoryUsage = process.memoryUsage()
  const cpuUsage = process.cpuUsage()
  
  const health = {
    status: dbHealth.status === 'healthy' ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    environment: env.NODE_ENV,
    version: '1.0.0',
    
    services: {
      database: dbHealth
    },
    
    system: {
      memory: {
        rss: Math.round(memoryUsage.rss / 1024 / 1024) + ' MB',
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + ' MB',
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + ' MB',
        external: Math.round(memoryUsage.external / 1024 / 1024) + ' MB'
      },
      cpu: {
        user: Math.round(cpuUsage.user / 1000) + ' ms',
        system: Math.round(cpuUsage.system / 1000) + ' ms'
      },
      platform: process.platform,
      nodeVersion: process.version,
      pid: process.pid
    }
  }
  
  const statusCode = health.status === 'healthy' ? 200 : 503
  sendSuccess(res, health, 'Detailed health check completed', statusCode)
}))

/**
 * @route   GET /api/health/readiness
 * @desc    Readiness probe for container orchestration
 * @access  Public
 */
router.get('/readiness', asyncHandler(async (req: Request, res: Response) => {
  const dbHealthy = await checkDatabaseConnection()
  
  if (dbHealthy) {
    sendSuccess(res, { ready: true }, 'Service is ready')
  } else {
    res.status(503).json({
      success: false,
      message: 'Service is not ready',
      ready: false,
      timestamp: new Date().toISOString()
    })
  }
}))

/**
 * @route   GET /api/health/liveness
 * @desc    Liveness probe for container orchestration
 * @access  Public
 */
router.get('/liveness', (_req: Request, res: Response) => {
  // Simple liveness check - if we can respond, we're alive
  sendSuccess(res, { alive: true }, 'Service is alive')
})

export default router
