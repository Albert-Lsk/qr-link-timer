# 环境变量配置指南

本文档介绍了 QR Link Timer 项目中所有可配置的环境变量。

## 快速开始

1. 复制环境变量模板：
```bash
# 根目录环境变量
cp .env.example .env

# 前端环境变量
cp frontend/.env.example frontend/.env
```

2. 根据您的环境修改相应的配置值。

## 环境变量说明

### 应用基础配置

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `NODE_ENV` | `development` | 运行环境：development/production/test |
| `APP_NAME` | `QR Link Timer` | 应用名称 |
| `APP_VERSION` | `1.0.0` | 应用版本 |

### 服务器配置

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `FRONTEND_PORT` | `3000` | 前端服务端口 |
| `BACKEND_PORT` | `3001` | 后端API端口 |
| `FRONTEND_URL` | `http://localhost:3000` | 前端访问地址 |
| `BACKEND_URL` | `http://localhost:3001` | 后端API地址 |

### 数据库配置

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `DATABASE_URL` | `file:./dev.db` | 数据库连接字符串 |

**数据库连接示例：**
- SQLite: `file:./dev.db`
- PostgreSQL: `postgresql://username:password@localhost:5432/qr_link_timer?schema=public`
- MySQL: `mysql://username:password@localhost:3306/qr_link_timer`

### JWT 认证配置

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `JWT_SECRET` | `your-super-secret-jwt-key-here` | JWT签名密钥（生产环境必须修改） |
| `JWT_EXPIRE_TIME` | `7d` | JWT过期时间 |

### 二维码配置

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `QR_CODE_SIZE` | `200` | 二维码尺寸（像素） |
| `QR_CODE_ERROR_CORRECTION_LEVEL` | `M` | 错误纠正级别：L/M/Q/H |
| `MAX_URL_LENGTH` | `2048` | 最大URL长度限制 |

### 时间配置

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `DEFAULT_EXPIRY_HOURS` | `24` | 默认过期时间（小时） |
| `MAX_EXPIRY_DAYS` | `365` | 最大过期时间（天） |
| `CLEANUP_INTERVAL_HOURS` | `1` | 清理过期数据间隔（小时） |

### 文件存储配置

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `UPLOAD_DIR` | `./uploads` | 文件上传目录 |
| `MAX_FILE_SIZE` | `5MB` | 最大文件大小 |

### Redis缓存配置

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `REDIS_URL` | `redis://localhost:6379` | Redis连接地址 |
| `REDIS_PASSWORD` | - | Redis密码（可选） |

### 安全配置

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `CORS_ORIGIN` | `http://localhost:3000` | CORS允许的源 |
| `RATE_LIMIT_WINDOW_MS` | `900000` | 速率限制时间窗口（毫秒） |
| `RATE_LIMIT_MAX_REQUESTS` | `100` | 速率限制最大请求数 |

### 日志配置

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `LOG_LEVEL` | `info` | 日志级别：error/warn/info/debug |
| `LOG_FILE` | `./logs/app.log` | 日志文件路径 |

### 前端专用配置

以下变量在 `frontend/.env` 中配置：

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `VITE_API_URL` | `http://localhost:3001` | 后端API地址 |
| `VITE_API_TIMEOUT` | `10000` | API请求超时时间（毫秒） |
| `VITE_APP_TITLE` | `QR Link Timer` | 应用标题 |
| `VITE_QR_CODE_SIZE` | `256` | 前端二维码尺寸 |

## 部署环境配置

### 开发环境
```bash
NODE_ENV=development
DATABASE_URL=file:./dev.db
LOG_LEVEL=debug
```

### 生产环境
```bash
NODE_ENV=production
DATABASE_URL=postgresql://username:password@db.example.com:5432/qr_link_timer
JWT_SECRET=your-production-secret-key-here
LOG_LEVEL=info
CORS_ORIGIN=https://your-domain.com
```

### Docker环境
```bash
DATABASE_URL=postgresql://qr_user:qr_password@postgres:5432/qr_link_timer
REDIS_URL=redis://redis:6379
```

## 安全注意事项

1. **绝不要在代码中硬编码敏感信息**
2. **生产环境必须使用强密码和密钥**
3. **定期更换JWT密钥和数据库密码**
4. **限制CORS_ORIGIN到具体域名**
5. **根据需要调整速率限制参数**

## 故障排除

### 常见问题

1. **数据库连接失败**
   - 检查 `DATABASE_URL` 格式是否正确
   - 确认数据库服务是否运行
   - 验证用户名密码是否正确

2. **JWT认证失败**
   - 确认前后端使用相同的 `JWT_SECRET`
   - 检查令牌是否过期

3. **CORS错误**
   - 确认 `CORS_ORIGIN` 包含前端域名
   - 检查端口号是否正确

4. **文件上传失败**
   - 确认 `UPLOAD_DIR` 目录存在且有写权限
   - 检查 `MAX_FILE_SIZE` 设置

### 环境变量验证

可以在应用启动时添加环境变量验证：

```typescript
// 验证必需的环境变量
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];
requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});
```