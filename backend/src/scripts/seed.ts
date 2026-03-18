import { PrismaClient } from '@prisma/client'
import QRCode from 'qrcode'
import env from '@/utils/env'

const prisma = new PrismaClient()

async function generateSampleQRCode(url: string): Promise<string> {
  try {
    return await QRCode.toDataURL(url, {
      width: env.QR_CODE_SIZE,
      margin: env.QR_CODE_MARGIN,
      errorCorrectionLevel: env.QR_CODE_ERROR_CORRECTION_LEVEL,
      color: {
        dark: '#1f2937',
        light: '#ffffff'
      }
    })
  } catch (error) {
    console.error('Failed to generate QR code:', error)
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
  }
}

async function main() {
  console.log('🌱 开始添加种子数据...')

  // 清理现有数据
  await prisma.accessLog.deleteMany()
  await prisma.qRCode.deleteMany()

  console.log('🗑️  清理现有数据完成')

  // 创建示例二维码
  const sampleQRCodes = [
    {
      id: 'qr_sample_github',
      originalUrl: 'https://example.com/demo',
      title: 'GitHub 项目',
      description: 'QR Link Timer 项目源代码',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7天后过期
      accessCount: 5
    },
    {
      id: 'qr_sample_demo',
      originalUrl: 'https://example.com/demo',
      title: '演示链接',
      description: '这是一个演示用的临时链接',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24小时后过期
      accessCount: 12
    },
    {
      id: 'qr_sample_expired',
      originalUrl: 'https://example.com/expired',
      title: '已过期链接',
      description: '这是一个已经过期的二维码示例',
      expiresAt: new Date(Date.now() - 60 * 60 * 1000), // 1小时前过期
      isActive: false,
      accessCount: 3
    },
    {
      id: 'qr_sample_docs',
      originalUrl: 'https://docs.example.com',
      title: '文档中心',
      description: '产品使用文档和API说明',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30天后过期
      accessCount: 28
    }
  ]

  console.log('📝 创建示例二维码...')

  for (const qrData of sampleQRCodes) {
    const redirectUrl = `http://localhost:3000/redirect/${qrData.id}`
    const qrCodeData = await generateSampleQRCode(redirectUrl)

    await prisma.qRCode.create({
      data: {
        id: qrData.id,
        originalUrl: qrData.originalUrl,
        qrCodeData,
        title: qrData.title,
        description: qrData.description,
        expiresAt: qrData.expiresAt,
        isActive: qrData.isActive !== false,
        accessCount: qrData.accessCount
      }
    })

    // 为每个二维码创建一些访问日志
    const accessLogCount = Math.min(qrData.accessCount, 5) // 最多5条日志
    for (let i = 0; i < accessLogCount; i++) {
      await prisma.accessLog.create({
        data: {
          qrCodeId: qrData.id,
          accessedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // 过去7天内的随机时间
          userAgent: [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
          ][Math.floor(Math.random() * 3)],
          ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
          referer: Math.random() > 0.5 ? 'https://example.com' : undefined
        }
      })
    }

    console.log(`✅ 创建二维码: ${qrData.title}`)
  }

  console.log('📊 种子数据统计:')
  const totalQRCodes = await prisma.qRCode.count()
  const activeQRCodes = await prisma.qRCode.count({ where: { isActive: true } })
  const totalAccessLogs = await prisma.accessLog.count()

  console.log(`   - 总二维码数: ${totalQRCodes}`)
  console.log(`   - 活跃二维码: ${activeQRCodes}`)
  console.log(`   - 访问日志: ${totalAccessLogs}`)

  console.log('🎉 种子数据添加完成!')
}

main()
  .catch((e) => {
    console.error('❌ 种子数据添加失败:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
