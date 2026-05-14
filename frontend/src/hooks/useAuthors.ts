import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authorsService } from '@/services/authors.service'
import { toast } from 'sonner'

export const authorKeys = {
  all: (params?: unknown) => ['authors', params] as const,
  detail: (slug: string) => ['authors', 'detail', slug] as const,
}

export const useAuthors = (params?: Record<string, unknown>) =>
  useQuery({
    queryKey: authorKeys.all(params),
    queryFn: async () => {
      const res = await authorsService.getAll(params)
      return res.data
    },
  })

export const useAuthor = (slug: string) =>
  useQuery({
    queryKey: authorKeys.detail(slug),
    queryFn: async () => {
      const res = await authorsService.getBySlug(slug)
      return res.data.data as import('@/types').Author
    },
    enabled: !!slug,
  })

export const useCreateAuthor = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: FormData) => authorsService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['authors'] })
      toast.success('Muallif yaratildi')
    },
    onError: () => toast.error('Xato yuz berdi'),
  })
}

export const useUpdateAuthor = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => authorsService.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['authors'] })
      toast.success('Muallif yangilandi')
    },
    onError: () => toast.error('Xato yuz berdi'),
  })
}

export const useDeleteAuthor = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => authorsService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['authors'] })
      toast.success("Muallif o'chirildi")
    },
    onError: () => toast.error('Xato yuz berdi'),
  })
}
