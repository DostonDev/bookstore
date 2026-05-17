import api from './api'
import type { User, DownloadsResponse } from '@/types'

export const usersService = {
  async getProfile(): Promise<{ user: User }> {
    const res = await api.get('/users/profile')
    return res.data.data
  },

  async getDownloads(params?: { page?: number; limit?: number }): Promise<DownloadsResponse> {
    const res = await api.get('/users/downloads', { params })
    return res.data.data
  },

  async getBookmarks(): Promise<{ bookmarks: import('@/types').Book[] }> {
    const res = await api.get('/bookmarks')
    return res.data.data
  },

  async getLikes(): Promise<{ likes: import('@/types').Book[] }> {
    const res = await api.get('/likes')
    return res.data.data
  },

  async uploadAvatar(file: File): Promise<{ user: User }> {
    const formData = new FormData()
    formData.append('avatar', file)
    const res = await api.patch('/users/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data.data
  },

  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<void> {
    await api.patch('/users/profile/password', data)
  },

  async getAllUsers(params?: { page?: number; limit?: number; search?: string }): Promise<{
    users: User[]
    pagination: { total: number; page: number; limit: number; totalPages: number }
  }> {
    const res = await api.get('/users/all', { params })
    return res.data.data
  },
}
