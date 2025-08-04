import { useState, useEffect, useCallback } from 'react'
import { QRCode, QRCodeStats, CreateQRCodeRequest } from '@/types'
import { qrCodeService } from '@/services/api'

export function useQRCodes() {
  const [qrCodes, setQrCodes] = useState<QRCode[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchQRCodes = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await qrCodeService.getAll()
      setQrCodes(data)
    } catch (err: any) {
      setError(err.message || '获取二维码列表失败')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchQRCodes()
  }, [fetchQRCodes])

  const createQRCode = useCallback(async (data: CreateQRCodeRequest): Promise<QRCode | null> => {
    try {
      setError(null)
      const newQRCode = await qrCodeService.create(data)
      setQrCodes(prev => [newQRCode, ...prev])
      return newQRCode
    } catch (err: any) {
      setError(err.message || '创建二维码失败')
      return null
    }
  }, [])

  const deleteQRCode = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null)
      await qrCodeService.delete(id)
      setQrCodes(prev => prev.filter(qr => qr.id !== id))
      return true
    } catch (err: any) {
      setError(err.message || '删除二维码失败')
      return false
    }
  }, [])

  const updateQRCode = useCallback(async (id: string, data: Partial<QRCode>): Promise<boolean> => {
    try {
      setError(null)
      const updatedQRCode = await qrCodeService.update(id, data)
      setQrCodes(prev => prev.map(qr => qr.id === id ? updatedQRCode : qr))
      return true
    } catch (err: any) {
      setError(err.message || '更新二维码失败')
      return false
    }
  }, [])

  const refreshQRCodes = useCallback(() => {
    fetchQRCodes()
  }, [fetchQRCodes])

  return {
    qrCodes,
    loading,
    error,
    createQRCode,
    deleteQRCode,
    updateQRCode,
    refreshQRCodes,
  }
}

export function useQRCodeStats() {
  const [stats, setStats] = useState<QRCodeStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await qrCodeService.getStats()
      setStats(data)
    } catch (err: any) {
      setError(err.message || '获取统计信息失败')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const refreshStats = useCallback(() => {
    fetchStats()
  }, [fetchStats])

  return {
    stats,
    loading,
    error,
    refreshStats,
  }
}