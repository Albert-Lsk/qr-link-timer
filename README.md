# QR Link Timer

一个可开源交付的时效性二维码生成器。输入任意 URL，设置有效期，系统会生成一个可追踪的二维码；过期后访问会自动跳转到失效提示页。

## 当前状态

- 已完成前后端联调
- 已通过本地构建验证
- 已通过核心接口冒烟测试
- 已清理个人仓库地址和本地敏感配置

## 功能

- 创建带有效期的二维码
- 保存二维码标题和描述
- 查看历史记录
- 查看总量、活跃数、过期数、访问次数
- 访问二维码时自动记录扫描次数
- 过期二维码返回失效页面

## 技术栈

- 前端：React 18、TypeScript、Vite、Tailwind CSS、Axios
- 后端：Node.js、Express、TypeScript、Prisma
- 数据库：SQLite（默认），后续可切 PostgreSQL

## 项目结构

```text
qr-link-timer/
├─ frontend/      # React 前端
├─ backend/       # Express + Prisma 后端
├─ shared/        # 共享构建配置
├─ docs/          # API / 环境 / 项目说明
├─ .env.example
└─ docker-compose.yml
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

PowerShell 也可以这样复制：

```powershell
Copy-Item ".env.example" ".env"
Copy-Item "backend/.env.example" "backend/.env"
Copy-Item "frontend/.env.example" "frontend/.env"
```

默认本地配置已经足够启动开发环境；如果你要公开部署，请至少修改：

- `APP_BASE_URL`
- `CORS_ORIGIN`
- `DATABASE_URL`
- `JWT_SECRET`（如果后续启用认证）

### 3. 启动开发环境

```bash
npm run dev
```

访问地址：

- 前端：http://localhost:3000
- 后端：http://localhost:3001
- 健康检查：http://localhost:3001/health

### 4. 构建生产版本

```bash
npm run build
```

## 可用脚本

根目录：

- `npm run dev`：同时启动前后端
- `npm run build`：构建 shared、backend、frontend
- `npm run db:generate`：生成 Prisma Client
- `npm run db:migrate`：执行数据库迁移

前端：

- `npm --workspace frontend run dev`
- `npm --workspace frontend run build`

后端：

- `npm --workspace backend run dev`
- `npm --workspace backend run build`
- `npm --workspace backend run start`

## Docker

```bash
docker-compose up --build
```

这会启动：

- 前端：http://localhost:3000
- 后端：http://localhost:3001

## API 文档

详见：

- [API.md](./docs/API.md)
- [ENVIRONMENT.md](./docs/ENVIRONMENT.md)
- [PROJECT_SUMMARY.md](./docs/PROJECT_SUMMARY.md)

## 开源发布前检查

- 仓库中的 `.env`、数据库文件、日志、构建产物已经被 `.gitignore` 屏蔽
- README 和前端页面中的 GitHub 链接已改成占位符，请替换为你自己的仓库地址
- 建议再次执行 `git status`，确认没有把本地环境文件带上去

## 已知限制

- 当前没有用户系统，任何人都可以创建和删除二维码
- Docker 方案默认使用 SQLite，适合演示和轻量部署
- 浏览器端统计页目前以基础指标为主，没有做高级图表

## 许可证

MIT
