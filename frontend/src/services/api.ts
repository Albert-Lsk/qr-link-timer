import axios, { AxiosResponse } from 'axios'
import { QRCode, CreateQRCodeRequest, QRCodeStats, ApiResponse, ApiError } from '@/types'

// 创建axios实例
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 可以在这里添加认证token等
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<any>>) => {
    return response
  },
  (error) => {
    let message = '请求失败'
    
    if (error.code === 'ECONNABORTED') {
      message = '请求超时，请稍后重试'
    } else if (error.code === 'NETWORK_ERROR') {
      message = '网络连接失败，请检查网络设置'
    } else if (error.response) {
      const status = error.response.status
      switch (status) {
        case 400:
          message = '请求参数错误'
          break
        case 401:
          message = '身份验证失败'
          break
        case 403:
          message = '权限不足'
          break
        case 404:
          message = '请求的资源不存在'
          break
        case 429:
          message = '请求过于频繁，请稍后重试'
          break
        case 500:
          message = '服务器错误，请稍后重试'
          break
        case 503:
          message = '服务暂时不可用'
          break
        default:
          message = error.response?.data?.message || `请求失败 (${status})`
      }
    } else if (error.request) {
      message = '网络连接失败，请检查网络设置'
    }

    const apiError: ApiError = {
      success: false,
      message,
      code: error.response?.status?.toString() || error.code,
    }
    return Promise.reject(apiError)
  }
)

// QR Code API服务
export const qrCodeService = {
  /**
   * 创建新的二维码
   */
  async create(data: CreateQRCodeRequest): Promise<QRCode> {
    const response = await api.post<ApiResponse<QRCode>>('/qrcodes', data)
    return response.data.data
  },

  /**
   * 获取所有二维码列表
   */
  async getAll(): Promise<QRCode[]> {
    const response = await api.get<ApiResponse<QRCode[]>>('/qrcodes')
    return response.data.data
  },

  /**
   * 根据ID获取二维码
   */
  async getById(id: string): Promise<QRCode> {
    const response = await api.get<ApiResponse<QRCode>>(`/qrcodes/${id}`)
    return response.data.data
  },

  /**
   * 更新二维码信息
   */
  async update(id: string, data: Partial<QRCode>): Promise<QRCode> {
    const response = await api.put<ApiResponse<QRCode>>(`/qrcodes/${id}`, data)
    return response.data.data
  },

  /**
   * 删除二维码
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/qrcodes/${id}`)
  },

  /**
   * 访问二维码（重定向）
   */
  async access(id: string): Promise<{ redirectUrl: string }> {
    const response = await api.get<ApiResponse<{ redirectUrl: string }>>(`/redirect/${id}`)
    return response.data.data
  },

  /**
   * 获取统计信息
   */
  async getStats(): Promise<QRCodeStats> {
    const response = await api.get<ApiResponse<QRCodeStats>>('/qrcodes/stats')
    return response.data.data
  },

  /**
   * 批量删除二维码
   */
  async batchDelete(ids: string[]): Promise<void> {
    await api.post('/qrcodes/batch-delete', { ids })
  },

  /**
   * 搜索二维码
   */
  async search(query: string): Promise<QRCode[]> {
    const response = await api.get<ApiResponse<QRCode[]>>(`/qrcodes/search?q=${encodeURIComponent(query)}`)
    return response.data.data
  },
}

// 导出axios实例以供其他地方使用
export default api