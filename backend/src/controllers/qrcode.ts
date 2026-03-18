import { Request, Response } from 'express'
import { QRCodeService } from '@/services/qrcode'
import { CreateQRCodeRequest, UpdateQRCodeRequest } from '@/types'
import { sendSuccess, sendError, sendNotFound } from '@/utils/response'
import { asyncHandler } from '@/middleware/errorHandler'
import logger from '@/utils/logger'

const qrCodeService = new QRCodeService()

/**
 * Create a new QR code
 */
export const createQRCode = asyncHandler(async (req: Request, res: Response) => {
  const data: CreateQRCodeRequest = req.body
  
  logger.info('Creating QR code', { 
    originalUrl: data.originalUrl,
    expiryHours: data.expiryHours,
    title: data.title 
  })
  
  const qrCode = await qrCodeService.createQRCode(data)
  
  sendSuccess(res, qrCode, 'QR code created successfully', 201)
})

/**
 * Get all QR codes with pagination and filtering
 */
export const getQRCodes = asyncHandler(async (req: Request, res: Response) => {
  const options = req.query
  
  logger.info('Fetching QR codes', { options })
  
  const result = await qrCodeService.getQRCodes(options)
  
  sendSuccess(res, result, 'QR codes retrieved successfully')
})

/**
 * Get QR code by ID
 */
export const getQRCodeById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  
  logger.info('Fetching QR code by ID', { id })
  
  const qrCode = await qrCodeService.getQRCodeById(id)
  
  if (!qrCode) {
    return sendNotFound(res, 'QR code')
  }
  
  sendSuccess(res, qrCode, 'QR code retrieved successfully')
})

/**
 * Update QR code
 */
export const updateQRCode = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  const data: UpdateQRCodeRequest = req.body
  
  logger.info('Updating QR code', { id, data })
  
  const qrCode = await qrCodeService.updateQRCode(id, data)
  
  if (!qrCode) {
    return sendNotFound(res, 'QR code')
  }
  
  sendSuccess(res, qrCode, 'QR code updated successfully')
})

/**
 * Delete QR code
 */
export const deleteQRCode = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  
  logger.info('Deleting QR code', { id })
  
  const deleted = await qrCodeService.deleteQRCode(id)
  
  if (!deleted) {
    return sendNotFound(res, 'QR code')
  }
  
  sendSuccess(res, { id }, 'QR code deleted successfully')
})

/**
 * Handle QR code access (redirect)
 */
export const accessQRCode = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  const userAgent = req.headers['user-agent']
  const ipAddress = req.ip
  const referer = req.headers.referer
  
  logger.info('Accessing QR code', { id, userAgent, ipAddress })
  
  const result = await qrCodeService.accessQRCode(id, userAgent, ipAddress, referer)
  
  if (!result.isActive) {
    if (result.isExpired) {
      return res.status(410).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>QR Code Expired</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
            .container { max-width: 400px; margin: 0 auto; padding: 20px; }
            .icon { font-size: 48px; color: #ef4444; margin-bottom: 20px; }
            h1 { color: #374151; margin-bottom: 10px; }
            p { color: #6b7280; margin-bottom: 20px; }
            .expired { background: #fef2f2; border: 1px solid #fecaca; padding: 20px; border-radius: 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="expired">
              <div class="icon">⏰</div>
              <h1>QR Code Expired</h1>
              <p>This QR code has expired and is no longer accessible.</p>
              <p>Please contact the sender for a new link.</p>
            </div>
          </div>
        </body>
        </html>
      `)
    } else {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>QR Code Not Found</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
            .container { max-width: 400px; margin: 0 auto; padding: 20px; }
            .icon { font-size: 48px; color: #ef4444; margin-bottom: 20px; }
            h1 { color: #374151; margin-bottom: 10px; }
            p { color: #6b7280; margin-bottom: 20px; }
            .not-found { background: #f9fafb; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="not-found">
              <div class="icon">❓</div>
              <h1>QR Code Not Found</h1>
              <p>The QR code you're looking for doesn't exist.</p>
              <p>Please check the link and try again.</p>
            </div>
          </div>
        </body>
        </html>
      `)
    }
  }
  
  // Redirect to the original URL
  res.redirect(302, result.redirectUrl!)
})

/**
 * Get QR code statistics
 */
export const getQRCodeStats = asyncHandler(async (req: Request, res: Response) => {
  logger.info('Fetching QR code statistics')
  
  const stats = await qrCodeService.getStats()
  
  sendSuccess(res, stats, 'Statistics retrieved successfully')
})

/**
 * Batch delete QR codes
 */
export const batchDeleteQRCodes = asyncHandler(async (req: Request, res: Response) => {
  const { ids } = req.body
  
  if (!Array.isArray(ids) || ids.length === 0) {
    return sendError(res, 'IDs array is required and cannot be empty', 400, 'INVALID_INPUT')
  }
  
  logger.info('Batch deleting QR codes', { ids, count: ids.length })
  
  const results = []
  let deletedCount = 0
  
  for (const id of ids) {
    try {
      const deleted = await qrCodeService.deleteQRCode(id)
      results.push({ id, deleted })
      if (deleted) deletedCount++
    } catch (error) {
      results.push({ id, deleted: false, error: 'Failed to delete' })
    }
  }
  
  sendSuccess(res, {
    results,
    summary: {
      total: ids.length,
      deleted: deletedCount,
      failed: ids.length - deletedCount
    }
  }, `Batch delete completed: ${deletedCount}/${ids.length} QR codes deleted`)
})

/**
 * Search QR codes
 */
export const searchQRCodes = asyncHandler(async (req: Request, res: Response) => {
  const { q } = req.query
  
  if (!q || typeof q !== 'string') {
    return sendError(res, 'Search query is required', 400, 'MISSING_QUERY')
  }
  
  logger.info('Searching QR codes', { query: q })
  
  const result = await qrCodeService.getQRCodes({
    search: q,
    limit: 50 // Limit search results
  })
  
  sendSuccess(res, result.qrCodes, `Found ${result.qrCodes.length} QR codes`)
})