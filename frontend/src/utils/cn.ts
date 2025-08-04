import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * 合并和去重CSS类名的工具函数
 * 结合了clsx和tailwind-merge的功能
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}