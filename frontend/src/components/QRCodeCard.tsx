import { useState } from 'react'
import { ExternalLink, Trash2, Download, Copy, Check, Calendar, BarChart3 } from 'lucide-react'
import { Card, CardHeader, CardBody, CardFooter } from './Card'
import Button from './Button'
import Badge from './Badge'
import { QRCode } from '@/types'
import { formatDistanceToNow } from '@/utils/date'

interface QRCodeCardProps {
  qrCode: QRCode
  onDelete: (id: string) => void
}

export default function QRCodeCard({ qrCode, onDelete }: QRCodeCardProps) {
  const [copied, setCopied] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const downloadQRCode = () => {
    const link = document.createElement('a')
    link.href = qrCode.qrCodeData
    link.download = `qr-code-${qrCode.title || qrCode.id}.png`
    link.click()
  }

  const copyToClipboard = async () => {
    try {
      const response = await fetch(qrCode.qrCodeData)
      const blob = await response.blob()
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ])
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }

  const openOriginalUrl = () => {
    window.open(qrCode.originalUrl, '_blank', 'noopener,noreferrer')
  }

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete(qrCode.id)
    } else {
      setShowDeleteConfirm(true)
      setTimeout(() => setShowDeleteConfirm(false), 3000)
    }
  }

  const formatUrl = (url: string) => {
    try {
      const urlObj = new URL(url)
      return urlObj.hostname + (urlObj.pathname !== '/' ? urlObj.pathname : '')
    } catch {
      return url
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {qrCode.title || '未命名二维码'}
            </h3>
            <p className="text-sm text-gray-600 truncate mt-1">
              {formatUrl(qrCode.originalUrl)}
            </p>
          </div>
          <Badge
            variant={qrCode.isActive ? 'success' : 'danger'}
            size="sm"
          >
            {qrCode.isActive ? '活跃' : '已过期'}
          </Badge>
        </div>
      </CardHeader>

      <CardBody className="py-3">
        {/* QR Code Image */}
        <div className="flex justify-center mb-4">
          <img
            src={qrCode.qrCodeData}
            alt="QR Code"
            className="w-32 h-32 border border-gray-200 rounded-lg"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">访问: {qrCode.accessCount}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">
              {formatDistanceToNow(new Date(qrCode.createdAt))}
            </span>
          </div>
        </div>

        {/* Expiry Info */}
        <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
          <p className="text-gray-600">
            {qrCode.isActive ? (
              <>
                <span className="text-orange-600">将于</span>{' '}
                {new Date(qrCode.expiresAt).toLocaleString('zh-CN')}{' '}
                <span className="text-orange-600">过期</span>
              </>
            ) : (
              <>
                <span className="text-red-600">已于</span>{' '}
                {new Date(qrCode.expiresAt).toLocaleString('zh-CN')}{' '}
                <span className="text-red-600">过期</span>
              </>
            )}
          </p>
        </div>
      </CardBody>

      <CardFooter className="pt-3">
        <div className="flex justify-between w-full">
          <div className="flex space-x-1">
            <Button
              onClick={downloadQRCode}
              variant="ghost"
              size="sm"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              onClick={copyToClipboard}
              variant="ghost"
              size="sm"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            <Button
              onClick={openOriginalUrl}
              variant="ghost"
              size="sm"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>

          <Button
            onClick={handleDelete}
            variant={showDeleteConfirm ? 'danger' : 'ghost'}
            size="sm"
          >
            <Trash2 className="h-4 w-4" />
            {showDeleteConfirm && <span className="ml-1 text-xs">确认删除</span>}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}