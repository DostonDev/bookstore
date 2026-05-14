import api from './api'
import type { Blog, ApiResponse, PaginatedApiResponse } from '@/types'

export const blogsService = {
  getAll: (params?: Record<string, unknown>) =>
    api.get<PaginatedApiResponse<Blog>>('/blogs', { params }),
  getAllAdmin: (params?: Record<string, unknown>) =>
    api.get<PaginatedApiResponse<Blog>>('/blogs/admin', { params }),
  getBySlug: (slug: string) =>
    api.get<ApiResponse<Blog>>(`/blogs/${slug}`),
  create: (data: FormData) =>
    api.post<ApiResponse<Blog>>('/blogs', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id: string, data: FormData) =>
    api.put<ApiResponse<Blog>>(`/blogs/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id: string) => api.delete(`/blogs/${id}`),
}
