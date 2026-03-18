import QRCode from 'qrcode'
import { Prisma } from '@prisma/client'
import { getDatabase } from './database'
import { CreateQRCodeRequest, UpdateQRCodeRequest, QRCodeResponse, QRCodeStats } from '@/types'
import { AppError } from '@/middleware/errorHandler'
import logger from '@/utils/logger'
import env from '@/utils/env'

export class QRCodeService {
  private db = getDatabase()

  /**
   * Generate QR code image as base64 string
   */
  async generateQRCodeImage(url: string): Promise<string> {
    try {
      const qrCodeDataURL = await QRCode.toDataURL(url, {
        width: env.QR_CODE_SIZE,
        margin: env.QR_CODE_MARGIN,
        errorCorrectionLevel: env.QR_CODE_ERROR_CORRECTION_LEVEL,
        color: {
          dark: '#1f2937',  // Dark color
          light: '#ffffff'  // Light color
        }
      })
      return qrCodeDataURL
    } catch (error) {
      logger.error('Failed to generate QR code image', { error, url })
      throw new AppError('Failed to generate QR code image', 500, 'QR_GENERATION_FAILED')
    }
  }

  /**
   * Create a new QR code
   */
  async createQRCode(data: CreateQRCodeRequest): Promise<QRCodeResponse> {
    try {
      // Calculate expiry date
      const expiresAt = new Date(Date.now() + data.expiryHours * 60 * 60 * 1000)
      
      // Generate unique redirect URL
      const qrCodeId = `qr_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`
      const redirectUrl = `${env.APP_BASE_URL}/redirect/${qrCodeId}`
      
      // Generate QR code image
      const qrCodeData = await this.generateQRCodeImage(redirectUrl)
      
      // Save to database
      const qrCode = await this.db.qRCode.create({
        data: {
          id: qrCodeId,
          originalUrl: data.originalUrl,
          qrCodeData,
          title: data.title ?? null,
          description: data.description ?? null,
          expiresAt,
          isActive: true,
          accessCount: 0
        }
      })

      logger.info('QR code created successfully', {
        id: qrCode.id,
        originalUrl: data.originalUrl,
        expiresAt: qrCode.expiresAt
      })

      return this.formatQRCodeResponse(qrCode)
    } catch (error) {
      if (error instanceof AppError) {
        throw error
      }
      logger.error('Failed to create QR code', { error, data })
      throw new AppError('Failed to create QR code', 500, 'CREATE_FAILED')
    }
  }

  /**
   * Get QR code by ID
   */
  async getQRCodeById(id: string): Promise<QRCodeResponse | null> {
    try {
      const qrCode = await this.db.qRCode.findUnique({
        where: { id }
      })

      if (!qrCode) {
        return null
      }

      return this.formatQRCodeResponse(qrCode)
    } catch (error) {
      logger.error('Failed to get QR code by ID', { error, id })
      throw new AppError('Failed to retrieve QR code', 500, 'RETRIEVE_FAILED')
    }
  }

  /**
   * Get all QR codes with pagination and filtering
   */
  async getQRCodes(options: {
    page?: number
    limit?: number
    search?: string
    status?: 'active' | 'expired' | 'all'
    sortBy?: 'createdAt' | 'expiresAt' | 'accessCount' | 'title'
    sortOrder?: 'asc' | 'desc'
  } = {}): Promise<{
    qrCodes: QRCodeResponse[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }> {
    try {
      const {
        page = 1,
        limit = 20,
        search,
        status = 'all',
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = options

      const skip = (page - 1) * limit
      const now = new Date()

      // Build where clause
      const where: Prisma.QRCodeWhereInput = {}

      // Search filter
      if (search) {
        where.OR = [
          { title: { contains: search } },
          { description: { contains: search } },
          { originalUrl: { contains: search } }
        ]
      }

      // Status filter
      if (status === 'active') {
        where.isActive = true
        where.expiresAt = { gt: now }
      } else if (status === 'expired') {
        where.OR = [
          { isActive: false },
          { expiresAt: { lte: now } }
        ]
      }

      // Get total count
      const total = await this.db.qRCode.count({ where })

      // Get QR codes
      const qrCodes = await this.db.qRCode.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder as Prisma.SortOrder }
      })

      const totalPages = Math.ceil(total / limit)

      return {
        qrCodes: qrCodes.map(qr => this.formatQRCodeResponse(qr)),
        pagination: {
          page,
          limit,
          total,
          totalPages
        }
      }
    } catch (error) {
      logger.error('Failed to get QR codes', { error, options })
      throw new AppError('Failed to retrieve QR codes', 500, 'RETRIEVE_FAILED')
    }
  }

  /**
   * Update QR code
   */
  async updateQRCode(id: string, data: UpdateQRCodeRequest): Promise<QRCodeResponse | null> {
    try {
      const existingQRCode = await this.db.qRCode.findUnique({
        where: { id }
      })

      if (!existingQRCode) {
        return null
      }

      const updatedQRCode = await this.db.qRCode.update({
        where: { id },
        data: {
          title: data.title !== undefined ? data.title : existingQRCode.title,
          description: data.description !== undefined ? data.description : existingQRCode.description,
          isActive: data.isActive !== undefined ? data.isActive : existingQRCode.isActive
        }
      })

      logger.info('QR code updated successfully', { id, data })

      return this.formatQRCodeResponse(updatedQRCode)
    } catch (error) {
      logger.error('Failed to update QR code', { error, id, data })
      throw new AppError('Failed to update QR code', 500, 'UPDATE_FAILED')
    }
  }

  /**
   * Delete QR code
   */
  async deleteQRCode(id: string): Promise<boolean> {
    try {
      const existingQRCode = await this.db.qRCode.findUnique({
        where: { id }
      })

      if (!existingQRCode) {
        return false
      }

      await this.db.qRCode.delete({
        where: { id }
      })

      logger.info('QR code deleted successfully', { id })
      return true
    } catch (error) {
      logger.error('Failed to delete QR code', { error, id })
      throw new AppError('Failed to delete QR code', 500, 'DELETE_FAILED')
    }
  }

  /**
   * Handle QR code access (redirect)
   */
  async accessQRCode(id: string, userAgent?: string, ipAddress?: string, referer?: string): Promise<{
    redirectUrl?: string
    isExpired: boolean
    isActive: boolean
  }> {
    try {
      const qrCode = await this.db.qRCode.findUnique({
        where: { id }
      })

      if (!qrCode) {
        return { isExpired: false, isActive: false }
      }

      const now = new Date()
      const isExpired = qrCode.expiresAt <= now
      const isActive = qrCode.isActive && !isExpired

      if (isActive) {
        // Increment access count and log access
        await this.db.$transaction([
          this.db.qRCode.update({
            where: { id },
            data: { accessCount: { increment: 1 } }
          }),
          this.db.accessLog.create({
            data: {
              qrCodeId: id,
              userAgent: userAgent ?? null,
              ipAddress: ipAddress ?? null,
              referer: referer ?? null
            }
          })
        ])

        logger.info('QR code accessed successfully', {
          id,
          originalUrl: qrCode.originalUrl,
          userAgent,
          ipAddress
        })

        return {
          redirectUrl: qrCode.originalUrl,
          isExpired: false,
          isActive: true
        }
      }

      // Update expired QR codes
      if (isExpired && qrCode.isActive) {
        await this.db.qRCode.update({
          where: { id },
          data: { isActive: false }
        })
      }

      return {
        isExpired,
        isActive: false
      }
    } catch (error) {
      logger.error('Failed to access QR code', { error, id })
      throw new AppError('Failed to access QR code', 500, 'ACCESS_FAILED')
    }
  }

  /**
   * Get QR code statistics
   */
  async getStats(): Promise<QRCodeStats> {
    try {
      const now = new Date()
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const weekAgoStart = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000)

      const [
        totalCodes,
        activeCodes,
        expiredCodes,
        totalAccessResult,
        todayCreated,
        todayAccessed,
        weekAgoCreated
      ] = await Promise.all([
        this.db.qRCode.count(),
        this.db.qRCode.count({
          where: {
            isActive: true,
            expiresAt: { gt: now }
          }
        }),
        this.db.qRCode.count({
          where: {
            OR: [
              { isActive: false },
              { expiresAt: { lte: now } }
            ]
          }
        }),
        this.db.qRCode.aggregate({
          _sum: { accessCount: true }
        }),
        this.db.qRCode.count({
          where: {
            createdAt: { gte: todayStart }
          }
        }),
        this.db.accessLog.count({
          where: {
            accessedAt: { gte: todayStart }
          }
        }),
        this.db.qRCode.count({
          where: {
            createdAt: { gte: weekAgoStart, lt: todayStart }
          }
        })
      ])

      const totalAccess = totalAccessResult._sum.accessCount || 0
      const weeklyGrowth = weekAgoCreated > 0 
        ? Math.round(((todayCreated / 7 - weekAgoCreated / 7) / (weekAgoCreated / 7)) * 100)
        : 0

      return {
        totalCodes,
        activeCodes,
        expiredCodes,
        totalAccess,
        recentActivity: {
          todayCreated,
          todayAccessed,
          weeklyGrowth
        }
      }
    } catch (error) {
      logger.error('Failed to get QR code statistics', { error })
      throw new AppError('Failed to retrieve statistics', 500, 'STATS_FAILED')
    }
  }

  /**
   * Clean up expired QR codes
   */
  async cleanupExpiredQRCodes(): Promise<number> {
    try {
      const now = new Date()
      
      const result = await this.db.qRCode.updateMany({
        where: {
          isActive: true,
          expiresAt: { lte: now }
        },
        data: {
          isActive: false
        }
      })

      if (result.count > 0) {
        logger.info(`Marked ${result.count} QR codes as expired`)
      }

      return result.count
    } catch (error) {
      logger.error('Failed to cleanup expired QR codes', { error })
      throw new AppError('Failed to cleanup expired QR codes', 500, 'CLEANUP_FAILED')
    }
  }

  /**
   * Format database QR code to response format
   */
  private formatQRCodeResponse(qrCode: {
    id: string
    originalUrl: string
    qrCodeData: string
    title: string | null
    description: string | null
    createdAt: Date
    expiresAt: Date
    isActive: boolean
    accessCount: number
  }): QRCodeResponse {
    return {
      id: qrCode.id,
      originalUrl: qrCode.originalUrl,
      qrCodeData: qrCode.qrCodeData,
      title: qrCode.title ?? undefined,
      description: qrCode.description ?? undefined,
      createdAt: qrCode.createdAt.toISOString(),
      expiresAt: qrCode.expiresAt.toISOString(),
      isActive: qrCode.isActive,
      accessCount: qrCode.accessCount
    }
  }
}
