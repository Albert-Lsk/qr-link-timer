import { Router } from 'express'
import {
  createQRCode,
  getQRCodes,
  getQRCodeById,
  updateQRCode,
  deleteQRCode,
  getQRCodeStats,
  batchDeleteQRCodes,
  searchQRCodes
} from '@/controllers/qrcode'
import { validateRequest } from '@/utils/validation'
import {
  createQRCodeSchema,
  updateQRCodeSchema,
  idParamsSchema,
  queryParamsSchema
} from '@/utils/validation'
import { strictRateLimit } from '@/middleware/security'

const router = Router()

/**
 * @route   POST /api/qrcodes
 * @desc    Create a new QR code
 * @access  Public
 */
router.post(
  '/',
  strictRateLimit, // Apply stricter rate limiting for creation
  validateRequest(createQRCodeSchema, 'body'),
  createQRCode
)

/**
 * @route   GET /api/qrcodes
 * @desc    Get all QR codes with pagination and filtering
 * @access  Public
 */
router.get(
  '/',
  validateRequest(queryParamsSchema, 'query'),
  getQRCodes
)

/**
 * @route   GET /api/qrcodes/stats
 * @desc    Get QR code statistics
 * @access  Public
 */
router.get('/stats', getQRCodeStats)

/**
 * @route   GET /api/qrcodes/search
 * @desc    Search QR codes
 * @access  Public
 */
router.get('/search', searchQRCodes)

/**
 * @route   POST /api/qrcodes/batch-delete
 * @desc    Batch delete QR codes
 * @access  Public
 */
router.post('/batch-delete', batchDeleteQRCodes)

/**
 * @route   GET /api/qrcodes/:id
 * @desc    Get QR code by ID
 * @access  Public
 */
router.get(
  '/:id',
  validateRequest(idParamsSchema, 'params'),
  getQRCodeById
)

/**
 * @route   PUT /api/qrcodes/:id
 * @desc    Update QR code
 * @access  Public
 */
router.put(
  '/:id',
  validateRequest(idParamsSchema, 'params'),
  validateRequest(updateQRCodeSchema, 'body'),
  updateQRCode
)

/**
 * @route   DELETE /api/qrcodes/:id
 * @desc    Delete QR code
 * @access  Public
 */
router.delete(
  '/:id',
  validateRequest(idParamsSchema, 'params'),
  deleteQRCode
)

export default router
