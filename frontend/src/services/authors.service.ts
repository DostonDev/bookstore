import api from './api'
import type { Author, ApiResponse, PaginatedApiResponse } from '@/types'

export const authorsService = {
  getAll: (params?: Record<string, unknown>) =>
    api.get<PaginatedApiResponse<Author>>('/authors', { params }),
  getBySlug: (slug: string) =>
    api.get<ApiResponse<Author>>(`/authors/${slug}`),
  create: (data: FormData) =>
    api.post<ApiResponse<Author>>('/authors', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id: string, data: FormData) =>
    api.put<ApiResponse<Author>>(`/authors/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id: string) => api.delete(`/authors/${id}`),
}
