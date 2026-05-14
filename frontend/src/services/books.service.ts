import api from './api'
import type { Book, BooksResponse } from '@/types'

export const booksService = {
  async getBooks(params?: {
    page?: number
    limit?: number
    search?: string
    categoryId?: string
    authorId?: string
    tagId?: string
    sort?: string
  }): Promise<BooksResponse> {
    const res = await api.get('/books', { params })
    const { data, meta } = res.data
    return { books: data, pagination: meta }
  },

  async getNewBooks(limit = 10): Promise<{ books: Book[] }> {
    const res = await api.get('/books/new', { params: { limit } })
    return res.data.data
  },

  async getPopularBooks(limit = 10): Promise<{ books: Book[] }> {
    const res = await api.get('/books/popular', { params: { limit } })
    return res.data.data
  },

  async getBook(id: string): Promise<{ book: Book }> {
    const res = await api.get(`/books/${id}`)
    return res.data.data
  },

  async createBook(data: FormData): Promise<{ book: Book }> {
    const res = await api.post('/books', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data.data
  },

  async updateBook(id: string, data: FormData): Promise<{ book: Book }> {
    const res = await api.put(`/books/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data.data
  },

  async deleteBook(id: string): Promise<void> {
    await api.delete(`/books/${id}`)
  },

  async downloadBook(id: string): Promise<{ url: string }> {
    const res = await api.get(`/books/${id}/download`)
    return res.data.data
  },

  async getRelatedBooks(id: string, limit = 6): Promise<{ books: Book[] }> {
    const res = await api.get(`/books/${id}/related`, { params: { limit } })
    return res.data.data
  },

  async toggleLike(bookId: string): Promise<{ liked: boolean }> {
    const res = await api.post(`/books/${bookId}/like`)
    return res.data.data
  },

  async toggleBookmark(bookId: string): Promise<{ saved: boolean }> {
    const res = await api.post(`/books/${bookId}/bookmark`)
    return res.data.data
  },
}
