import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { categoriesService } from '@/services/categories.service'
import { toast } from 'sonner'

export const categoryKeys = {
  all: ['categories'] as const,
  detail: (id: string) => ['categories', id] as const,
}

export const useCategories = () =>
  useQuery({
    queryKey: categoryKeys.all,
    queryFn: async () => {
      const res = await categoriesService.getAll()
      return res.data.data as import('@/types').Category[]
    },
    staleTime: 5 * 60 * 1000,
  })

export const useCategoryById = (id: string) =>
  useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: async () => {
      const res = await categoriesService.getById(id)
      return res.data.data as import('@/types').Category
    },
    enabled: !!id,
  })

export const useCreateCategory = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: FormData) => categoriesService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: categoryKeys.all })
      toast.success('Kategoriya yaratildi')
    },
    onError: () => toast.error('Xato yuz berdi'),
  })
}

export const useUpdateCategory = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => categoriesService.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: categoryKeys.all })
      toast.success('Kategoriya yangilandi')
    },
    onError: () => toast.error('Xato yuz berdi'),
  })
}

export const useDeleteCategory = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => categoriesService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: categoryKeys.all })
      toast.success("Kategoriya o'chirildi")
    },
    onError: () => toast.error('Xato yuz berdi'),
  })
}
