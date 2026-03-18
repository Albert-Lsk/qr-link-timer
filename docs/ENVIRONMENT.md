# Environment Guide

## 根目录 `.env`

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `FRONTEND_PORT` | `3000` | 前端端口 |
| `BACKEND_PORT` | `3001` | 后端端口 |
| `FRONTEND_URL` | `http://localhost:3000` | 前端访问地址 |
| `BACKEND_URL` | `http://localhost:3001` | 后端访问地址 |
| `APP_BASE_URL` | `http://localhost:3001` | 二维码中写入的重定向基础地址 |
| `DATABASE_URL` | `file:./dev.db` | 默认数据库连接 |
| `CORS_ORIGIN` | `http://localhost:3000` | 允许跨域来源 |

## 后端 `backend/.env`

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `NODE_ENV` | `development` | 运行环境 |
| `PORT` | `3001` | 后端监听端口 |
| `HOST` | `0.0.0.0` | 监听地址 |
| `APP_BASE_URL` | `http://localhost:3001` | 对外可访问的后端地址 |
| `DATABASE_URL` | `file:./dev.db` | Prisma 数据库地址 |
| `CORS_ORIGIN` | `http://localhost:3000` | 前端来源 |
| `LOG_LEVEL` | `info` | 日志等级 |
| `LOG_FILE` | `./logs/app.log` | 日志文件 |

## 前端 `frontend/.env`

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `VITE_API_URL` | `http://localhost:3001` | 前端请求的后端地址 |
| `VITE_API_TIMEOUT` | `10000` | 请求超时毫秒数 |
| `VITE_APP_TITLE` | `QR Link Timer` | 应用名称 |
| `VITE_APP_DESCRIPTION` | `时效性二维码生成器` | 应用描述 |

## 开源注意事项

- 不要提交任何真实 `.env`
- 不要提交本地数据库文件
- 不要提交日志文件和构建产物
- 如果使用真实域名部署，请同步更新 `APP_BASE_URL` 和 `VITE_API_URL`
