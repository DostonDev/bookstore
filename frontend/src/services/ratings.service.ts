import api from './api'
import type { RatingStats } from '@/types'

export const ratingsService = {
  async getRating(bookId: string): Promise<RatingStats> {
    const res = await api.get(`/books/${bookId}/rating`)
    return res.data.data
  },

  async rateBook(bookId: string, value: number): Promise<RatingStats & { rating: unknown }> {
    const res = await api.post(`/books/${bookId}/rating`, { value })
    return res.data.data
  },
}
