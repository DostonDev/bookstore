import api from './api'
import type { Category, ApiResponse } from '@/types'

export const categoriesService = {
  getAll: () => api.get<ApiResponse<Category[]>>('/categories'),
  getById: (id: string) => api.get<ApiResponse<Category>>(`/categories/${id}`),
  create: (data: FormData) => api.post<ApiResponse<Category>>('/categories', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id: string, data: FormData) => api.put<ApiResponse<Category>>(`/categories/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id: string) => api.delete(`/categories/${id}`),
}
