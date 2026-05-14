import api from './api'
import type { Comment } from '@/types'

export const commentsService = {
  async getComments(bookId: string): Promise<{ comments: Comment[] }> {
    const res = await api.get(`/books/${bookId}/comments`)
    return res.data.data
  },

  async addComment(bookId: string, text: string): Promise<{ comment: Comment }> {
    const res = await api.post(`/books/${bookId}/comments`, { text })
    return res.data.data
  },

  async deleteComment(id: string): Promise<void> {
    await api.delete(`/comments/${id}`)
  },
}
