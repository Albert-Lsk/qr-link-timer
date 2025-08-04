import { useState } from 'react'
import { Link2, Clock, BarChart3, Shield } from 'lucide-react'
import { Card, CardHeader, CardBody } from '@/components/Card'
import QRCodeGenerator from '@/components/QRCodeGenerator'
import StatsOverview from '@/components/StatsOverview'

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
          QR Link Timer
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          创建时效性二维码，让您的链接在指定时间后自动失效
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardBody className="text-center space-y-3">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto">
              <Link2 className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">简单易用</h3>
            <p className="text-gray-600">
              粘贴链接，设置时间，即可生成专属二维码
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center space-y-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">时效控制</h3>
            <p className="text-gray-600">
              灵活设置有效期，支持小时、天、周等时间单位
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center space-y-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">访问统计</h3>
            <p className="text-gray-600">
              实时查看二维码扫描次数和访问记录
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* QR Code Generator */}
        <div className="lg:col-span-2">
          <QRCodeGenerator />
        </div>

        {/* Stats Sidebar */}
        <div>
          <StatsOverview />
        </div>
      </div>

      {/* Security Notice */}
      <Card>
        <CardBody>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">安全提示</h3>
              <ul className="text-gray-600 space-y-1 text-sm">
                <li>• 所有生成的二维码均在本地处理，确保隐私安全</li>
                <li>• 过期的二维码将自动失效，无法访问原始链接</li>
                <li>• 建议为重要链接设置合适的有效期</li>
              </ul>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}