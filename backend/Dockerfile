# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app

# 复制package文件
COPY package*.json ./
COPY tsconfig.json ./

# 安装依赖
RUN npm ci --silent

# 复制源代码
COPY src/ ./src/
COPY prisma/ ./prisma/

# 生成Prisma客户端
RUN npx prisma generate

# 构建TypeScript
RUN npm run build

# 生产阶段
FROM node:18-alpine AS production

WORKDIR /app

# 安装必要的系统依赖
RUN apk add --no-cache sqlite

# 复制package文件和安装生产依赖
COPY package*.json ./
RUN npm ci --omit=dev --silent

# 复制构建产物
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# 复制Prisma配置
COPY prisma/ ./prisma/

# 创建必要的目录
RUN mkdir -p logs

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3001

# 暴露端口
EXPOSE 3001

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# 启动应用
CMD ["npm", "start"]
