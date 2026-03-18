import { useEffect, useMemo, useState } from 'react'
import { Search, Download } from 'lucide-react'
import { Card, CardBody } from '@/components/Card'
import Button from '@/components/Button'
import Input from '@/components/Input'
import LoadingSpinner from '@/components/LoadingSpinner'
import QRCodeCard from '@/components/QRCodeCard'
import { QRCode } from '@/types'
import { qrCodeService } from '@/services/api'

export default function HistoryPage() {
  const [qrCodes, setQrCodes] = useState<QRCode[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'expired'>('all')
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true)
        setLoadError(null)
        const data = await qrCodeService.getAll()
        setQrCodes(data)
      } catch (error) {
        console.error('Failed to fetch QR code history:', error)
        setLoadError(error instanceof Error ? error.message : '获取历史记录失败')
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

  const filteredQrCodes = useMemo(() => {
    return qrCodes.filter((qr) => {
      const matchesSearch =
        qr.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        qr.originalUrl.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesFilter =
        filterStatus === 'all' ||
        (filterStatus === 'active' && qr.isActive) ||
        (filterStatus === 'expired' && !qr.isActive)

      return Boolean(matchesSearch) && matchesFilter
    })
  }, [filterStatus, qrCodes, searchTerm])

  const handleDelete = async (id: string) => {
    try {
      await qrCodeService.delete(id)
      setQrCodes((prev) => prev.filter((qr) => qr.id !== id))
    } catch (error) {
      console.error('Failed to delete QR code:', error)
      setLoadError(error instanceof Error ? error.message : '删除二维码失败')
    }
  }

  const exportData = () => {
    const dataStr = JSON.stringify(qrCodes, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'qr-codes-history.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">历史记录</h1>
          <p className="text-gray-600 mt-1">管理您创建的所有二维码</p>
        </div>
        <Button onClick={exportData} variant="secondary">
          <Download className="h-4 w-4 mr-2" />
          导出数据
        </Button>
      </div>

      {loadError && (
        <Card>
          <CardBody className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl">
            {loadError}
          </CardBody>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-gray-900">{qrCodes.length}</div>
            <div className="text-sm text-gray-600">总计二维码</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {qrCodes.filter((qr) => qr.isActive).length}
            </div>
            <div className="text-sm text-gray-600">活跃中</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {qrCodes.reduce((sum, qr) => sum + qr.accessCount, 0)}
            </div>
            <div className="text-sm text-gray-600">总访问次数</div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardBody>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <Input
                placeholder="搜索标题或链接..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex space-x-2">
              <Button variant={filterStatus === 'all' ? 'primary' : 'ghost'} size="sm" onClick={() => setFilterStatus('all')}>
                全部
              </Button>
              <Button variant={filterStatus === 'active' ? 'primary' : 'ghost'} size="sm" onClick={() => setFilterStatus('active')}>
                活跃
              </Button>
              <Button variant={filterStatus === 'expired' ? 'primary' : 'ghost'} size="sm" onClick={() => setFilterStatus('expired')}>
                已过期
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {filteredQrCodes.length === 0 ? (
        <Card>
          <CardBody className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || filterStatus !== 'all' ? '没有找到匹配的记录' : '暂无历史记录'}
            </h3>
            <p className="text-gray-600">
              {searchTerm || filterStatus !== 'all'
                ? '尝试调整搜索条件或筛选器'
                : '创建您的第一个二维码吧！'}
            </p>
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQrCodes.map((qrCode) => (
            <QRCodeCard key={qrCode.id} qrCode={qrCode} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
