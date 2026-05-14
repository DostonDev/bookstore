import api from './api'
import type { Tag, ApiResponse } from '@/types'

export const tagsService = {
  getAll: () => api.get<ApiResponse<Tag[]>>('/tags'),
  getPopular: (limit = 20) => api.get<ApiResponse<Tag[]>>('/tags/popular', { params: { limit } }),
  create: (name: string) => api.post<ApiResponse<Tag>>('/tags', { name }),
  delete: (id: string) => api.delete(`/tags/${id}`),
}
