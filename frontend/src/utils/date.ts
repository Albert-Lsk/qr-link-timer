/**
 * 格式化相对时间
 */
export function formatDistanceToNow(date: Date): string {
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInSeconds = Math.floor(diffInMs / 1000)
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  const diffInHours = Math.floor(diffInMinutes / 60)
  const diffInDays = Math.floor(diffInHours / 24)

  if (diffInSeconds < 60) {
    return '刚刚'
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}分钟前`
  } else if (diffInHours < 24) {
    return `${diffInHours}小时前`
  } else if (diffInDays < 7) {
    return `${diffInDays}天前`
  } else {
    return date.toLocaleDateString('zh-CN')
  }
}

/**
 * 格式化时间段
 */
export function formatDuration(hours: number): string {
  if (hours < 24) {
    return `${hours}小时`
  } else if (hours < 168) { // 7 days
    const days = Math.floor(hours / 24)
    return `${days}天`
  } else if (hours < 720) { // 30 days
    const weeks = Math.floor(hours / 168)
    return `${weeks}周`
  } else {
    const months = Math.floor(hours / 720)
    return `${months}个月`
  }
}

/**
 * 检查日期是否已过期
 */
export function isExpired(date: Date): boolean {
  return new Date() > date
}

/**
 * 计算剩余时间
 */
export function getTimeRemaining(expiryDate: Date): {
  days: number
  hours: number
  minutes: number
  seconds: number
  total: number
} {
  const now = new Date().getTime()
  const expiry = expiryDate.getTime()
  const total = expiry - now

  if (total <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 }
  }

  const seconds = Math.floor((total / 1000) % 60)
  const minutes = Math.floor((total / 1000 / 60) % 60)
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24)
  const days = Math.floor(total / (1000 * 60 * 60 * 24))

  return { days, hours, minutes, seconds, total }
}