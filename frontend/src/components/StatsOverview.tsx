import { useEffect, useState } from 'react'
import { BarChart3, QrCode, Clock, TrendingUp } from 'lucide-react'
import { Card, CardHeader, CardBody } from './Card'
import LoadingSpinner from './LoadingSpinner'
import { QRCodeStats } from '@/types'

export default function StatsOverview() {
  const [stats, setStats] = useState<QRCodeStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock API call to fetch stats
    const fetchStats = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock data
        const mockStats: QRCodeStats = {
          totalCodes: 15,
          activeCodes: 8,
          expiredCodes: 7,
          totalAccess: 342
        }
        
        setStats(mockStats)
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>统计概览</span>
          </h3>
        </CardHeader>
        <CardBody className="flex items-center justify-center py-8">
          <LoadingSpinner />
        </CardBody>
      </Card>
    )
  }

  if (!stats) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>统计概览</span>
          </h3>
        </CardHeader>
        <CardBody className="text-center py-8">
          <p className="text-gray-600">暂无统计数据</p>
        </CardBody>
      </Card>
    )
  }

  const statItems = [
    {
      icon: QrCode,
      label: '总计二维码',
      value: stats.totalCodes,
      color: 'text-blue-600'
    },
    {
      icon: Clock,
      label: '活跃中',
      value: stats.activeCodes,
      color: 'text-green-600'
    },
    {
      icon: Clock,
      label: '已过期',
      value: stats.expiredCodes,
      color: 'text-red-600'
    },
    {
      icon: TrendingUp,
      label: '总访问数',
      value: stats.totalAccess,
      color: 'text-purple-600'
    }
  ]

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <BarChart3 className="h-5 w-5" />
          <span>统计概览</span>
        </h3>
      </CardHeader>
      <CardBody className="space-y-4">
        {statItems.map((item, index) => {
          const Icon = item.icon
          return (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg bg-white ${item.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
              </div>
              <span className={`text-lg font-bold ${item.color}`}>
                {item.value.toLocaleString()}
              </span>
            </div>
          )
        })}

        {/* Success Rate */}
        {stats.totalCodes > 0 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">活跃率</span>
              <span className="text-sm font-bold text-blue-600">
                {Math.round((stats.activeCodes / stats.totalCodes) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(stats.activeCodes / stats.totalCodes) * 100}%`
                }}
              />
            </div>
          </div>
        )}

        {/* Average Access */}
        {stats.totalCodes > 0 && (
          <div className="text-center text-sm text-gray-600 mt-4">
            平均每个二维码访问 {Math.round(stats.totalAccess / stats.totalCodes)} 次
          </div>
        )}
      </CardBody>
    </Card>
  )
}