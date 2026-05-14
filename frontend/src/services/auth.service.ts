import api from './api'
import type { AuthResponse, User } from '@/types'

export const authService = {
  async register(data: { name: string; email: string; password: string }): Promise<AuthResponse> {
    const res = await api.post('/auth/register', data)
    return res.data.data
  },

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const res = await api.post('/auth/login', data)
    return res.data.data
  },

  async me(): Promise<{ user: User }> {
    const res = await api.get('/auth/me')
    return res.data.data
  },
}
