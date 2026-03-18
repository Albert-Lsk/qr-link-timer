# API Reference

基础地址：`http://localhost:3001`

## `GET /health`

返回基础健康状态。

## `GET /api/health`

返回带数据库状态的健康检查。

## `POST /api/qrcodes`

创建二维码。

请求体：

```json
{
  "originalUrl": "https://example.com",
  "expiryHours": 24,
  "title": "Demo QR",
  "description": "Optional description"
}
```

## `GET /api/qrcodes`

获取二维码列表。

可选查询参数：

- `page`
- `limit`
- `search`
- `status=all|active|expired`
- `sortBy=createdAt|expiresAt|accessCount|title`
- `sortOrder=asc|desc`

## `GET /api/qrcodes/:id`

按 ID 获取二维码详情。

## `PUT /api/qrcodes/:id`

更新二维码元信息。

请求体：

```json
{
  "title": "Updated title",
  "description": "Updated description",
  "isActive": true
}
```

## `DELETE /api/qrcodes/:id`

删除二维码。

## `GET /api/qrcodes/stats`

获取统计数据。

响应字段：

- `totalCodes`
- `activeCodes`
- `expiredCodes`
- `totalAccess`
- `recentActivity`

## `POST /api/qrcodes/batch-delete`

批量删除二维码。

请求体：

```json
{
  "ids": ["qr_xxx", "qr_yyy"]
}
```

## `GET /api/qrcodes/search?q=keyword`

按标题、描述、原始链接搜索二维码。

## `GET /redirect/:id`

访问二维码对应的重定向地址。

- 未过期：返回 `302` 并跳转到原始链接
- 已过期：返回 `410`
- 不存在：返回 `404`
