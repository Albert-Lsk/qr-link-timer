# 🔗 QR Link Timer - 时效性二维码生成器

## 📋 项目简介

QR Link Timer 是一个时效性二维码生成器，允许用户输入链接并设置二维码的有效期。当达到设定的时间限制后，二维码将自动失效。

## ✨ 核心功能

- 🔗 **链接输入** - 用户可以粘贴任意有效的URL链接
- ⏰ **时间设置** - 支持设置二维码有效期（小时/天/周）
- 📱 **二维码生成** - 实时生成高质量二维码
- 🔒 **自动过期** - 超过设定时间后二维码自动失效
- 📊 **访问统计** - 查看二维码访问次数和历史记录
- 💾 **历史管理** - 管理已生成的二维码

## 🏗️ 技术架构

### 前端技术栈
- **React 18** + **TypeScript** - 现代化前端框架
- **Vite** - 快速构建工具
- **Tailwind CSS** - 实用程序优先的CSS框架
- **Axios** - HTTP客户端

### 后端技术栈
- **Node.js** + **Express.js** - 轻量级API服务
- **TypeScript** - 类型安全
- **Prisma ORM** - 数据库操作
- **SQLite** (开发) / **PostgreSQL** (生产) - 数据存储

### 其他工具
- **qrcode** - 二维码生成
- **Docker** - 容器化部署
- **Git** - 版本控制

## 📁 项目结构

```
qr-link-timer/
├── frontend/              # React前端应用
│   ├── src/
│   │   ├── components/    # UI组件
│   │   ├── pages/         # 页面组件
│   │   ├── hooks/         # 自定义Hooks
│   │   ├── types/         # TypeScript类型
│   │   └── utils/         # 工具函数
│   └── public/            # 静态资源
├── backend/               # Node.js后端服务
│   ├── src/
│   │   ├── controllers/   # 控制器
│   │   ├── models/        # 数据模型
│   │   ├── routes/        # 路由
│   │   ├── middleware/    # 中间件
│   │   └── utils/         # 工具函数
│   └── prisma/           # 数据库配置
├── shared/               # 共享类型定义
├── docs/                 # 项目文档
└── docker-compose.yml    # 容器配置
```

## 🚀 快速开始

### 环境要求
- Node.js >= 18.0.0
- npm >= 8.0.0
- Git

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/Albert-Lsk/qr-link-timer.git
cd qr-link-timer
```

2. **安装依赖**
```bash
# 安装前端依赖
cd frontend
npm install

# 安装后端依赖
cd ../backend
npm install

# 安装共享依赖
cd ../shared
npm install
```

3. **配置环境变量**
```bash
cp .env.example .env
# 编辑 .env 文件，配置数据库连接等信息
```

4. **启动开发服务器**

```bash
# 启动后端服务 (端口 3001)
cd backend
npm run dev

# 启动前端服务 (端口 3000)
cd frontend
npm run dev
```

5. **访问应用**
- 前端: http://localhost:3000
- 后端API: http://localhost:3001

## 📖 API文档

详细的API文档请查看 [API.md](./docs/API.md)

## 🐳 Docker 部署

```bash
# 使用 Docker Compose 启动所有服务
docker-compose up -d

# 查看运行状态
docker-compose ps

# 停止服务
docker-compose down
```

## 📝 数据库模型

### QRCodes 表
```sql
- id: 主键ID
- original_url: 原始链接
- qr_code_data: 二维码数据
- created_at: 创建时间
- expires_at: 过期时间
- is_active: 是否有效
- access_count: 访问次数
```

## 🔧 开发指南

### 可用脚本

**根目录:**
- `npm run dev` - 同时启动前后端开发服务器
- `npm run build` - 构建生产版本
- `npm run test` - 运行所有测试

**前端:**
- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run preview` - 预览生产构建

**后端:**
- `npm run dev` - 启动开发服务器
- `npm run build` - 编译TypeScript
- `npm run start` - 启动生产服务器

### 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 👥 团队

- **开发者** - 项目开发和维护

## 📞 联系方式

- 项目链接: [GitHub Repository](https://github.com/Albert-Lsk/qr-link-timer)
- 问题反馈: [Issues](https://github.com/Albert-Lsk/qr-link-timer/issues)

## 🔄 更新日志

查看 [CHANGELOG.md](CHANGELOG.md) 了解项目更新历史

---

⭐ 如果这个项目对您有帮助，请给我们一个星标！