# Project Summary

最后更新：2026-03-19

## 项目定位

QR Link Timer 是一个用于生成“带失效时间”的二维码的全栈 Web 应用。它面向临时分享、活动链接、限时资料、一次性入口等场景。

## 当前完成度

### 已完成

- 前端页面框架和 UI 组件
- 创建二维码流程
- 历史记录列表
- 统计概览
- 后端二维码 CRUD 基础接口
- 重定向与过期处理
- Prisma + SQLite 数据落库
- 本地构建通过
- 本地接口冒烟测试通过

### 本次修复的关键问题

- 修复根目录 workspace / shared 构建链路
- 修复前端 API 基地址和 Vite 代理问题
- 修复后端 `/:id` 参数校验错误
- 修复后端重定向地址错误，改为使用 `APP_BASE_URL`
- 移除仓库中的本地 Claude 配置和构建产物
- 清理文档、页脚、示例数据中的个人仓库地址

## 已验证内容

本地验证已覆盖：

- `npm run build`
- `POST /api/qrcodes`
- `GET /api/qrcodes`
- `GET /api/qrcodes/stats`
- `GET /redirect/:id` 返回 `302`
- 健康检查 `/health`

## 剩余优化项

- 增加用户认证和权限控制
- 增加批量删除/编辑的前端入口
- 增加端到端测试
- 为 Docker 部署补充更完整的生产配置
- 支持自定义短链域名

## 开源建议

在正式 push 到 GitHub 前，请处理以下占位信息：

- `package.json` 中的仓库 URL
- 前端关于页和页脚中的 GitHub 链接
- README 中的仓库地址说明

这些位置目前都改成了 `your-github-username` 占位写法，避免把个人信息误发出去。
