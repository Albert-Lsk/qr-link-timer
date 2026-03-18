import { PrismaClient } from '@prisma/client'
import logger from '@/utils/logger'

// Prisma client instance
let prisma: PrismaClient | undefined

// Initialize database connection
export function initDatabase(): PrismaClient {
  if (!prisma) {
    prisma = new PrismaClient()
    logger.info('Database client initialized')
  }

  return prisma
}

// Get database instance
export function getDatabase(): PrismaClient {
  if (!prisma) {
    return initDatabase()
  }
  return prisma
}

// Close database connection
export async function closeDatabase(): Promise<void> {
  if (prisma) {
    await prisma.$disconnect()
    logger.info('Database connection closed')
  }
}

// Check database connection
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    const db = getDatabase()
    await db.$queryRaw`SELECT 1`
    logger.info('Database connection successful')
    return true
  } catch (error) {
    logger.error('Database connection failed', { error })
    return false
  }
}

// Database health check
export async function getDatabaseHealth() {
  try {
    const db = getDatabase()
    const start = Date.now()
    await db.$queryRaw`SELECT 1`
    const responseTime = Date.now() - start

    // Get basic statistics
    const qrCodeCount = await db.qRCode.count()
    const activeQRCodeCount = await db.qRCode.count({
      where: { isActive: true }
    })

    return {
      status: 'healthy',
      responseTime: `${responseTime}ms`,
      statistics: {
        totalQRCodes: qrCodeCount,
        activeQRCodes: activeQRCodeCount
      }
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export default getDatabase
