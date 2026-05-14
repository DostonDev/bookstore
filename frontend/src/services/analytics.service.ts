import api from './api'
import type { ApiResponse, AdminStats, UserDashboard } from '@/types'

export const analyticsService = {
  getAdminStats: () => api.get<ApiResponse<AdminStats>>('/analytics/admin'),
  getUserDashboard: () => api.get<ApiResponse<UserDashboard>>('/analytics/dashboard'),
}
