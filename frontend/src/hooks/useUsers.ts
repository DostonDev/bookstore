import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersService } from '@/services/users.service'
import { useAuthStore } from '@/stores/auth.store'
import { QUERY_KEYS } from '@/constants'

export const useProfile = () =>
  useQuery({
    queryKey: [QUERY_KEYS.profile],
    queryFn: () => usersService.getProfile(),
  })

export const useDownloads = (params?: { page?: number; limit?: number }) =>
  useQuery({
    queryKey: [QUERY_KEYS.downloads, params],
    queryFn: () => usersService.getDownloads(params),
  })

export const useBookmarks = () =>
  useQuery({
    queryKey: [QUERY_KEYS.bookmarks],
    queryFn: () => usersService.getBookmarks(),
    select: (data) => ({ bookmarks: data.bookmarks }),
  })

export const useLikedBooks = () =>
  useQuery({
    queryKey: [QUERY_KEYS.likes],
    queryFn: () => usersService.getLikes(),
    select: (data) => ({ likes: data.likes }),
  })

export const useUploadAvatar = () => {
  const queryClient = useQueryClient()
  const { updateUser } = useAuthStore()
  return useMutation({
    mutationFn: (file: File) => usersService.uploadAvatar(file),
    onSuccess: (data) => {
      updateUser({ avatarUrl: data.user.avatarUrl })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.profile] })
    },
  })
}

export const useChangePassword = () =>
  useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      usersService.changePassword(data),
  })

export const useAllUsers = (params?: { page?: number; limit?: number; search?: string }) =>
  useQuery({
    queryKey: [QUERY_KEYS.allUsers, params],
    queryFn: () => usersService.getAllUsers(params),
  })
