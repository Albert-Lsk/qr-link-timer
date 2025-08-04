export interface QRCode {
  id: string
  originalUrl: string
  qrCodeData: string
  createdAt: string
  expiresAt: string
  isActive: boolean
  accessCount: number
  title?: string
  description?: string
}

export interface CreateQRCodeRequest {
  originalUrl: string
  expiryHours: number
  title?: string
  description?: string
}

export interface QRCodeStats {
  totalCodes: number
  activeCodes: number
  expiredCodes: number
  totalAccess: number
}

export interface TimeUnit {
  value: number
  unit: 'hours' | 'days' | 'weeks'
  label: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface ApiError {
  success: false
  message: string
  code?: string
}