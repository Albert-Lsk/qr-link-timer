import { Github, Mail, Heart, Code, Shield, Zap } from 'lucide-react'
import { Card, CardHeader, CardBody } from '@/components/Card'
import Button from '@/components/Button'

export default function AboutPage() {
  const features = [
    {
      icon: Zap,
      title: '快速生成',
      description: '一键生成高质量二维码，支持多种尺寸和格式'
    },
    {
      icon: Shield,
      title: '安全可靠',
      description: '本地处理数据，不上传用户隐私信息到服务器'
    },
    {
      icon: Code,
      title: '开源免费',
      description: '完全开源，基于MIT协议，欢迎贡献代码'
    }
  ]

  const techStack = [
    { name: 'React 18', description: '现代化前端框架' },
    { name: 'TypeScript', description: '类型安全的JavaScript' },
    { name: 'Tailwind CSS', description: '实用程序优先的CSS框架' },
    { name: 'Vite', description: '快速的构建工具' },
    { name: 'Node.js', description: '后端运行环境' },
    { name: 'Prisma', description: '现代化数据库工具' }
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">关于 QR Link Timer</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          一个简单、安全、高效的时效性二维码生成工具
        </p>
      </div>

      {/* Project Description */}
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold text-gray-900">项目简介</h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            QR Link Timer 是一个专为需要临时分享链接的场景而设计的工具。
            它允许用户创建具有时效性的二维码，当达到设定的过期时间后，
            二维码将自动失效，无法访问原始链接。
          </p>
          <p className="text-gray-700 leading-relaxed">
            这个项目特别适用于临时文件分享、活动链接、限时优惠等需要控制访问时间的场景。
            通过设置合理的有效期，可以有效保护隐私和控制信息传播范围。
          </p>
        </CardBody>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold text-gray-900">核心特性</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="text-center space-y-3">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                    <Icon className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </CardBody>
      </Card>

      {/* Tech Stack */}
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold text-gray-900">技术栈</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {techStack.map((tech, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                <div className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">{tech.name}</h4>
                  <p className="text-sm text-gray-600">{tech.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Contact & Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900">开源信息</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <p className="text-gray-700">
              本项目基于 MIT 协议开源，欢迎大家贡献代码、提出建议或报告问题。
            </p>
            <div className="space-y-2">
              <Button
                onClick={() => window.open('https://github.com/Albert-Lsk/qr-link-timer', '_blank')}
                className="w-full justify-center"
              >
                <Github className="h-4 w-4 mr-2" />
                访问 GitHub 仓库
              </Button>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900">联系方式</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <p className="text-gray-700">
              如果您有任何问题、建议或想要合作，欢迎联系我们。
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-3 text-gray-700">
                <Mail className="h-4 w-4" />
                <span>your.email@example.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700">
                <Github className="h-4 w-4" />
                <span>@Albert-Lsk</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Footer */}
      <Card>
        <CardBody className="text-center space-y-3">
          <div className="flex items-center justify-center space-x-2 text-gray-700">
            <Heart className="h-5 w-5 text-red-500" />
            <span>感谢您使用 QR Link Timer</span>
          </div>
          <p className="text-sm text-gray-500">
            如果这个项目对您有帮助，请给我们一个 ⭐ Star！
          </p>
        </CardBody>
      </Card>
    </div>
  )
}