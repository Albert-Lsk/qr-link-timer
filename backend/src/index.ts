import app from './app'
import env from '@/utils/env'
import logger from '@/utils/logger'
import { closeDatabase } from '@/services/database'

// Start the server
const server = app.listen(env.PORT, env.HOST, () => {
  logger.info(`🚀 QR Link Timer API Server started`, {
    port: env.PORT,
    host: env.HOST,
    environment: env.NODE_ENV,
    pid: process.pid
  })
  
  logger.info(`📖 Server URLs:`, {
    local: `http://localhost:${env.PORT}`,
    network: `http://${env.HOST}:${env.PORT}`,
    health: `http://localhost:${env.PORT}/health`
  })
})

// Handle server errors
server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof env.PORT === 'string' ? 'Pipe ' + env.PORT : 'Port ' + env.PORT

  // Handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.error(`${bind} requires elevated privileges`)
      process.exit(1)
      break
    case 'EADDRINUSE':
      logger.error(`${bind} is already in use`)
      process.exit(1)
      break
    default:
      throw error
  }
})

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`)
  
  // Close HTTP server
  server.close(async (err) => {
    if (err) {
      logger.error('Error during server shutdown', { error: err })
      process.exit(1)
    }
    
    logger.info('HTTP server closed')
    
    // Close database connection
    try {
      await closeDatabase()
      logger.info('Database connection closed')
    } catch (error) {
      logger.error('Error closing database connection', { error })
    }
    
    logger.info('Graceful shutdown completed')
    process.exit(0)
  })
  
  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout')
    process.exit(1)
  }, 10000)
}

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))

export default server