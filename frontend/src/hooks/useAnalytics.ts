import { useQuery } from '@tanstack/react-query'
import { analyticsService } from '@/services/analytics.service'
import type { AdminStats, UserDashboard } from '@/types'

export const useAdminStats = () =>
  useQuery({
    queryKey: ['analytics', 'admin'],
    queryFn: async () => {
      const res = await analyticsService.getAdminStats()
      return res.data.data as AdminStats
    },
    staleTime: 2 * 60 * 1000,
  })

export const useUserDashboard = () =>
  useQuery({
    queryKey: ['analytics', 'dashboard'],
    queryFn: async () => {
      const res = await analyticsService.getUserDashboard()
      return res.data.data as UserDashboard
    },
    staleTime: 60 * 1000,
  })
