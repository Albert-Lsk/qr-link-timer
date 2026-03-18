import { Github, Heart, Code, Shield, Zap } from 'lucide-react'
import { Card, CardHeader, CardBody } from '@/components/Card'
import Button from '@/components/Button'

export default function AboutPage() {
  const features = [
    {
      icon: Zap,
      title: '快速生成',
      description: '一键生成高质量二维码，支持多种有效期设置'
    },
    {
      icon: Shield,
      title: '到期失效',
      description: '二维码链接在过期后自动失效，避免继续扩散'
    },
    {
      icon: Code,
      title: '开源可扩展',
      description: '前后端分离，适合二次开发和部署到自己的环境'
    }
  ]

  const techStack = [
    { name: 'React 18', description: '现代化前端框架' },
    { name: 'TypeScript', description: '类型安全的 JavaScript' },
    { name: 'Tailwind CSS', description: '实用程序优先的 CSS 框架' },
    { name: 'Vite', description: '快速构建工具' },
    { name: 'Node.js', description: '后端运行环境' },
    { name: 'Prisma + SQLite', description: '轻量数据层，后续可切 PostgreSQL' }
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">关于 QR Link Timer</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          一个简单、安全、高效的时效性二维码生成工具
        </p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold text-gray-900">项目简介</h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            QR Link Timer 用来解决“链接发出去后没法控时效”的问题。你可以给任意 URL 生成一个二维码，
            并为它设置过期时间，到期后扫描会得到失效提示页。
          </p>
          <p className="text-gray-700 leading-relaxed">
            它适合临时文件分享、活动页面、限时优惠、会议资料、私密入口等需要控制访问时间的场景。
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold text-gray-900">核心特性</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div key={feature.title} className="text-center space-y-3">
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

      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold text-gray-900">技术栈</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {techStack.map((tech) => (
              <div key={tech.name} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                <div className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">{tech.name}</h4>
                  <p className="text-sm text-gray-600">{tech.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900">开源信息</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <p className="text-gray-700">
              本项目基于 MIT 协议开源，欢迎提出 Issue 或直接提交 Pull Request。
            </p>
            <Button
              onClick={() => window.open('https://github.com/your-github-username/qr-link-timer', '_blank', 'noopener,noreferrer')}
              className="w-full justify-center"
            >
              <Github className="h-4 w-4 mr-2" />
              访问 GitHub 仓库
            </Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900">发布提醒</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <p className="text-gray-700">
              在公开仓库前，请将文档和 `package.json` 中的 GitHub 占位链接替换为你自己的仓库地址，并确认环境变量不包含真实密钥。
            </p>
            <div className="flex items-center space-x-3 text-gray-700">
              <Github className="h-4 w-4" />
              <span>@your-github-username</span>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardBody className="text-center space-y-3">
          <div className="flex items-center justify-center space-x-2 text-gray-700">
            <Heart className="h-5 w-5 text-red-500" />
            <span>感谢使用 QR Link Timer</span>
          </div>
          <p className="text-sm text-gray-500">
            如果这个项目对你有帮助，欢迎在开源仓库里点个 Star。
          </p>
        </CardBody>
      </Card>
    </div>
  )
}
