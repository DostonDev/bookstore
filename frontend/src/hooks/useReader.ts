import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { readerService } from '@/services/reader.service'
import type { ReadingProgress } from '@/types'

export const readerKeys = {
  url: (bookId: string) => ['reader', 'url', bookId] as const,
  progress: (bookId: string) => ['reader', 'progress', bookId] as const,
  allProgress: ['reader', 'progress'] as const,
}

export const useReadUrl = (bookId: string) =>
  useQuery({
    queryKey: readerKeys.url(bookId),
    queryFn: async () => {
      const res = await readerService.getReadUrl(bookId)
      return res.data.data as { url: string; progress: ReadingProgress | null }
    },
    enabled: !!bookId,
    staleTime: 50 * 60 * 1000,
    retry: false,
  })

export const useReadingProgress = (bookId: string) =>
  useQuery({
    queryKey: readerKeys.progress(bookId),
    queryFn: async () => {
      const res = await readerService.getProgress(bookId)
      return res.data.data as ReadingProgress | null
    },
    enabled: !!bookId,
  })

export const useAllReadingProgress = () =>
  useQuery({
    queryKey: readerKeys.allProgress,
    queryFn: async () => {
      const res = await readerService.getUserProgress()
      return res.data.data as ReadingProgress[]
    },
  })

export const useUpdateProgress = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ bookId, ...data }: { bookId: string; currentPage: number; totalPages: number; readingTime?: number }) =>
      readerService.updateProgress(bookId, data),
    onSuccess: (_, { bookId }) => {
      qc.invalidateQueries({ queryKey: readerKeys.progress(bookId) })
      qc.invalidateQueries({ queryKey: readerKeys.allProgress })
    },
  })
}
