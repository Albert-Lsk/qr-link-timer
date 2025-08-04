# 构建阶段
FROM node:18-alpine as builder

WORKDIR /app

# 复制包文件
COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY tailwind.config.js ./
COPY postcss.config.js ./

# 安装依赖
RUN npm ci --only=production --silent

# 复制源代码
COPY src/ ./src/
COPY public/ ./public/
COPY index.html ./

# 构建应用
RUN npm run build

# 生产阶段
FROM nginx:alpine

# 复制nginx配置
COPY nginx.conf /etc/nginx/nginx.conf

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 暴露端口
EXPOSE 3000

# 启动nginx
CMD ["nginx", "-g", "daemon off;"]