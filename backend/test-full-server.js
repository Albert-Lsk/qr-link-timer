const express = require('express');
const cors = require('cors');
const QRCode = require('qrcode');

const app = express();
const PORT = process.env.PORT || 3002;

// 中间件
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// 模拟数据存储
let qrCodes = [
  {
    id: 'test_qr_1',
    originalUrl: 'https://example.com/demo',
    qrCodeData: 'data:image/png;base64,iVBORw0K...',
    title: '测试二维码',
    description: '这是一个测试二维码',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
    accessCount: 5
  }
];

// 生成二维码
async function generateQRCode(url) {
  try {
    return await QRCode.toDataURL(url, {
      width: 256,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#1f2937',
        light: '#ffffff'
      }
    });
  } catch (error) {
    console.error('QR code generation failed:', error);
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
  }
}

// 根路径
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'QR Link Timer API Server',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: [
      'GET /',
      'GET /health',
      'POST /api/qrcodes',
      'GET /api/qrcodes',
      'GET /api/qrcodes/stats',
      'GET /redirect/:id'
    ]
  });
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    database: 'connected',
    version: '1.0.0'
  });
});

// 创建二维码
app.post('/api/qrcodes', async (req, res) => {
  try {
    const { originalUrl, expiryHours, title, description } = req.body;
    
    // 验证输入
    if (!originalUrl || !expiryHours) {
      return res.status(400).json({
        success: false,
        message: 'originalUrl and expiryHours are required',
        timestamp: new Date().toISOString()
      });
    }

    // 生成ID和过期时间
    const id = `qr_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const expiresAt = new Date(Date.now() + expiryHours * 60 * 60 * 1000);
    
    // 生成重定向URL和二维码
    const redirectUrl = `http://localhost:3000/redirect/${id}`;
    const qrCodeData = await generateQRCode(redirectUrl);
    
    // 创建二维码对象
    const qrCode = {
      id,
      originalUrl,
      qrCodeData,
      title: title || 'Untitled QR Code',
      description: description || '',
      createdAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString(),
      isActive: true,
      accessCount: 0
    };
    
    // 保存到内存存储
    qrCodes.push(qrCode);
    
    console.log(`✅ Created QR code: ${title} -> ${originalUrl}`);
    
    res.status(201).json({
      success: true,
      data: qrCode,
      message: 'QR code created successfully',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error creating QR code:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create QR code',
      timestamp: new Date().toISOString()
    });
  }
});

// 获取所有二维码
app.get('/api/qrcodes', (req, res) => {
  const { status = 'all', page = 1, limit = 20 } = req.query;
  
  let filteredQRCodes = qrCodes;
  
  // 状态筛选
  if (status === 'active') {
    const now = new Date();
    filteredQRCodes = qrCodes.filter(qr => qr.isActive && new Date(qr.expiresAt) > now);
  } else if (status === 'expired') {
    const now = new Date();
    filteredQRCodes = qrCodes.filter(qr => !qr.isActive || new Date(qr.expiresAt) <= now);
  }
  
  // 分页
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedQRCodes = filteredQRCodes.slice(startIndex, endIndex);
  
  res.json({
    success: true,
    data: {
      qrCodes: paginatedQRCodes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: filteredQRCodes.length,
        totalPages: Math.ceil(filteredQRCodes.length / limit)
      }
    },
    message: 'QR codes retrieved successfully',
    timestamp: new Date().toISOString()
  });
});

// 获取统计信息
app.get('/api/qrcodes/stats', (req, res) => {
  const now = new Date();
  const activeCodes = qrCodes.filter(qr => qr.isActive && new Date(qr.expiresAt) > now);
  const expiredCodes = qrCodes.filter(qr => !qr.isActive || new Date(qr.expiresAt) <= now);
  const totalAccess = qrCodes.reduce((sum, qr) => sum + qr.accessCount, 0);
  
  const stats = {
    totalCodes: qrCodes.length,
    activeCodes: activeCodes.length,
    expiredCodes: expiredCodes.length,
    totalAccess,
    recentActivity: {
      todayCreated: qrCodes.filter(qr => {
        const created = new Date(qr.createdAt);
        const today = new Date();
        return created.toDateString() === today.toDateString();
      }).length,
      todayAccessed: 0,
      weeklyGrowth: 0
    }
  };
  
  res.json({
    success: true,
    data: stats,
    message: 'Statistics retrieved successfully',
    timestamp: new Date().toISOString()
  });
});

// 二维码重定向处理
app.get('/redirect/:id', (req, res) => {
  const { id } = req.params;
  const qrCode = qrCodes.find(qr => qr.id === id);
  
  if (!qrCode) {
    return res.status(404).send(`
      <html>
        <head><title>QR Code Not Found</title></head>
        <body style="font-family: Arial; text-align: center; margin-top: 50px;">
          <h1>❓ QR Code Not Found</h1>
          <p>The QR code you're looking for doesn't exist.</p>
        </body>
      </html>
    `);
  }
  
  const now = new Date();
  const isExpired = new Date(qrCode.expiresAt) <= now;
  
  if (isExpired || !qrCode.isActive) {
    return res.status(410).send(`
      <html>
        <head><title>QR Code Expired</title></head>
        <body style="font-family: Arial; text-align: center; margin-top: 50px;">
          <h1>⏰ QR Code Expired</h1>
          <p>This QR code has expired and is no longer accessible.</p>
        </body>
      </html>
    `);
  }
  
  // 增加访问计数
  qrCode.accessCount++;
  
  console.log(`🔗 Redirecting ${id} to ${qrCode.originalUrl}`);
  
  // 重定向到原始URL
  res.redirect(302, qrCode.originalUrl);
});

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  });
});

// 启动服务器
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 QR Link Timer API Server started`);
  console.log(`📖 Local:    http://localhost:${PORT}`);
  console.log(`📊 Health:   http://localhost:${PORT}/health`);
  console.log(`🔧 API:      http://localhost:${PORT}/api/qrcodes`);
  console.log(`📱 Frontend: http://localhost:3000`);
  console.log(`\n✨ Ready to serve QR codes!`);
});
