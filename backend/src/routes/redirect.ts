import { Router } from 'express'
import { accessQRCode } from '@/controllers/qrcode'
import { validateRequest, idParamsSchema } from '@/utils/validation'

const router = Router()

/**
 * @route   GET /redirect/:id
 * @desc    Handle QR code access and redirect
 * @access  Public
 */
router.get(
  '/:id',
  validateRequest(idParamsSchema, 'params'),
  accessQRCode
)

export default router
