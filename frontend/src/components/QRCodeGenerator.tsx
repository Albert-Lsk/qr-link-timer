import { useState, useEffect } from 'react'
import { Link, Clock, Download, Copy, Check } from 'lucide-react'
import QRCode from 'qrcode'
import { Card, CardHeader, CardBody, CardFooter } from './Card'
import Button from './Button'
import Input from './Input'
import Badge from './Badge'
import { CreateQRCodeRequest, TimeUnit } from '@/types'

const timeUnits: TimeUnit[] = [
  { value: 1, unit: 'hours', label: '1小时' },
  { value: 6, unit: 'hours', label: '6小时' },
  { value: 24, unit: 'hours', label: '1天' },
  { value: 168, unit: 'hours', label: '1周' },
  { value: 720, unit: 'hours', label: '1个月' }
]

export default function QRCodeGenerator() {
  const [url, setUrl] = useState('')
  const [customHours, setCustomHours] = useState('')
  const [selectedTimeUnit, setSelectedTimeUnit] = useState<TimeUnit>(timeUnits[2])
  const [title, setTitle] = useState('')
  const [qrCodeData, setQrCodeData] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const generateQRCode = async () => {
    const newErrors: Record<string, string> = {}

    if (!url.trim()) {
      newErrors.url = '请输入链接地址'
    } else if (!validateUrl(url)) {
      newErrors.url = '请输入有效的链接地址'
    }

    if (customHours && (!parseInt(customHours) || parseInt(customHours) <= 0)) {
      newErrors.customHours = '请输入有效的小时数'
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      return
    }

    setIsGenerating(true)

    try {
      // 使用自定义小时数或预设时间单位
      const expiryHours = customHours ? parseInt(customHours) : selectedTimeUnit.value
      const expiryDate = new Date(Date.now() + expiryHours * 60 * 60 * 1000)

      // 生成包含过期时间的URL（这里应该是后端API的链接）
      const qrUrl = `${window.location.origin}/redirect/${Date.now()}?expires=${expiryDate.toISOString()}`
      
      // 生成二维码
      const qrDataUrl = await QRCode.toDataURL(qrUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: '#1f2937',
          light: '#ffffff'
        }
      })

      setQrCodeData(qrDataUrl)

      // 这里应该调用API保存二维码信息
      console.log('QR Code generated:', {
        originalUrl: url,
        expiryHours,
        title,
        qrUrl
      })

    } catch (error) {
      console.error('Failed to generate QR code:', error)
      setErrors({ general: '生成二维码失败，请稍后重试' })
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadQRCode = () => {
    if (!qrCodeData) return

    const link = document.createElement('a')
    link.href = qrCodeData
    link.download = `qr-code-${title || 'untitled'}-${Date.now()}.png`
    link.click()
  }

  const copyToClipboard = async () => {
    if (!qrCodeData) return

    try {
      const response = await fetch(qrCodeData)
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

  const resetForm = () => {
    setUrl('')
    setTitle('')
    setCustomHours('')
    setQrCodeData('')
    setErrors({})
    setSelectedTimeUnit(timeUnits[2])
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
          <Link className="h-6 w-6" />
          <span>生成二维码</span>
        </h2>
        <p className="text-gray-600">输入链接和有效期，生成时效性二维码</p>
      </CardHeader>

      <CardBody className="space-y-6">
        {errors.general && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{errors.general}</p>
          </div>
        )}

        {/* URL Input */}
        <div>
          <Input
            label="链接地址"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            error={errors.url}
            helperText="请输入完整的URL地址，包含协议（http://或https://）"
          />
        </div>

        {/* Title Input */}
        <div>
          <Input
            label="标题（可选）"
            placeholder="为您的二维码添加一个描述性标题"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            helperText="方便在历史记录中识别和管理"
          />
        </div>

        {/* Time Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            <Clock className="h-4 w-4 inline mr-1" />
            有效期设置
          </label>
          
          {/* Preset Time Units */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {timeUnits.map((unit) => (
              <Button
                key={unit.label}
                variant={selectedTimeUnit.label === unit.label ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => {
                  setSelectedTimeUnit(unit)
                  setCustomHours('')
                }}
                className="justify-center"
              >
                {unit.label}
              </Button>
            ))}
          </div>

          {/* Custom Hours */}
          <div>
            <Input
              label="自定义小时数"
              type="number"
              placeholder="输入自定义小时数"
              value={customHours}
              onChange={(e) => {
                setCustomHours(e.target.value)
                if (e.target.value) {
                  setSelectedTimeUnit({ value: 0, unit: 'hours', label: '自定义' })
                }
              }}
              error={errors.customHours}
              helperText="留空使用上方预设时间，或输入1-8760（一年）之间的小时数"
            />
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={generateQRCode}
          loading={isGenerating}
          className="w-full"
          size="lg"
        >
          生成二维码
        </Button>

        {/* QR Code Display */}
        {qrCodeData && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">生成的二维码</h3>
              <div className="flex items-center space-x-2">
                <Badge variant="success">
                  有效期 {customHours || selectedTimeUnit.value} 小时
                </Badge>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-4 p-6 bg-gray-50 rounded-lg">
              <img
                src={qrCodeData}
                alt="Generated QR Code"
                className="w-64 h-64 border border-gray-200 rounded-lg bg-white p-2"
              />
              
              <div className="flex space-x-2">
                <Button
                  onClick={downloadQRCode}
                  variant="secondary"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  下载
                </Button>
                <Button
                  onClick={copyToClipboard}
                  variant="secondary"
                  size="sm"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      已复制
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      复制
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="text-center">
              <Button
                onClick={resetForm}
                variant="ghost"
                size="sm"
              >
                生成新的二维码
              </Button>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  )
}