import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { blogsService } from '@/services/blogs.service'
import { toast } from 'sonner'
import type { Blog } from '@/types'

export const blogKeys = {
  all: (params?: unknown) => ['blogs', params] as const,
  detail: (slug: string) => ['blogs', 'detail', slug] as const,
  admin: (params?: unknown) => ['blogs', 'admin', params] as const,
}

export const useBlogs = (params?: Record<string, unknown>) =>
  useQuery({
    queryKey: blogKeys.all(params),
    queryFn: async () => {
      const res = await blogsService.getAll(params)
      return res.data
    },
  })

export const useBlogsAdmin = (params?: Record<string, unknown>) =>
  useQuery({
    queryKey: blogKeys.admin(params),
    queryFn: async () => {
      const res = await blogsService.getAllAdmin(params)
      return res.data
    },
  })

export const useBlog = (slug: string) =>
  useQuery({
    queryKey: blogKeys.detail(slug),
    queryFn: async () => {
      const res = await blogsService.getBySlug(slug)
      return res.data.data as Blog
    },
    enabled: !!slug,
  })

export const useCreateBlog = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: FormData) => blogsService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['blogs'] })
      toast.success('Blog yaratildi')
    },
    onError: () => toast.error('Xato yuz berdi'),
  })
}

export const useUpdateBlog = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => blogsService.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['blogs'] })
      toast.success('Blog yangilandi')
    },
    onError: () => toast.error('Xato yuz berdi'),
  })
}

export const useDeleteBlog = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => blogsService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['blogs'] })
      toast.success("Blog o'chirildi")
    },
    onError: () => toast.error('Xato yuz berdi'),
  })
}
