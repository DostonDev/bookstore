import api from './api'
import type { ApiResponse, ReadingProgress } from '@/types'

export const readerService = {
  getReadUrl: (bookId: string) =>
    api.get<ApiResponse<{ url: string; progress: ReadingProgress | null }>>(`/reader/${bookId}/url`),
  updateProgress: (bookId: string, data: { currentPage: number; totalPages: number; readingTime?: number }) =>
    api.put<ApiResponse<ReadingProgress>>(`/reader/${bookId}/progress`, data),
  getUserProgress: () =>
    api.get<ApiResponse<ReadingProgress[]>>('/reader/progress'),
  getProgress: (bookId: string) =>
    api.get<ApiResponse<ReadingProgress | null>>(`/reader/${bookId}/progress`),
}
