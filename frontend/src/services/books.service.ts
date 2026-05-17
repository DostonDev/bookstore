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

  async _uploadFileDirect(file: File, folder: 'pdfs' | 'covers'): Promise<string> {
    const urlRes = await api.post('/books/upload-url', { folder, filename: file.name })
    const { signedUrl, publicUrl } = urlRes.data.data
    await fetch(signedUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } })
    return publicUrl
  },

  async createBook(data: FormData): Promise<{ book: Book }> {
    const pdfFile = data.get('pdf') as File | null
    const coverFile = data.get('cover') as File | null

    const payload: Record<string, string> = {}
    for (const [key, val] of data.entries()) {
      if (key !== 'pdf' && key !== 'cover') payload[key] = val as string
    }

    if (pdfFile) payload.pdfUrl = await this._uploadFileDirect(pdfFile, 'pdfs')
    if (coverFile) payload.coverUrl = await this._uploadFileDirect(coverFile, 'covers')

    const res = await api.post('/books', payload)
    return res.data.data
  },

  async updateBook(id: string, data: FormData): Promise<{ book: Book }> {
    const pdfFile = data.get('pdf') as File | null
    const coverFile = data.get('cover') as File | null

    const payload: Record<string, string> = {}
    for (const [key, val] of data.entries()) {
      if (key !== 'pdf' && key !== 'cover') payload[key] = val as string
    }

    if (pdfFile) payload.pdfUrl = await this._uploadFileDirect(pdfFile, 'pdfs')
    if (coverFile) payload.coverUrl = await this._uploadFileDirect(coverFile, 'covers')

    const res = await api.put(`/books/${id}`, payload)
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
