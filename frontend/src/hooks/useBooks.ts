import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { booksService } from '@/services/books.service'
import { QUERY_KEYS } from '@/constants'
import { toast } from 'sonner'

export const useBooks = (params?: { page?: number; limit?: number | string; search?: string; categoryId?: string; authorId?: string; tagId?: string; sort?: string }) =>
  useQuery({
    queryKey: [QUERY_KEYS.books, params],
    queryFn: () => booksService.getBooks(params as { page?: number; limit?: number; search?: string }),
  })

export const useNewBooks = (limit = 10) =>
  useQuery({
    queryKey: [QUERY_KEYS.newBooks, limit],
    queryFn: () => booksService.getNewBooks(limit),
  })

export const usePopularBooks = (limit = 10) =>
  useQuery({
    queryKey: [QUERY_KEYS.popularBooks, limit],
    queryFn: () => booksService.getPopularBooks(limit),
  })

export const useBook = (id: string) =>
  useQuery({
    queryKey: [QUERY_KEYS.book, id],
    queryFn: () => booksService.getBook(id),
    enabled: !!id,
  })

export const useInfiniteBooks = (search?: string) =>
  useInfiniteQuery({
    queryKey: [QUERY_KEYS.books, 'infinite', search],
    queryFn: ({ pageParam = 1 }) =>
      booksService.getBooks({ page: pageParam as number, limit: 12, search }),
    getNextPageParam: (last) => {
      const p = (last?.pagination ?? last?.meta) as { page?: number; totalPages?: number } | undefined
      if (!p?.page || !p?.totalPages) return undefined
      return p.page < p.totalPages ? p.page + 1 : undefined
    },
    initialPageParam: 1,
  })

export const useRelatedBooks = (id: string, limit = 6) =>
  useQuery({
    queryKey: [QUERY_KEYS.book, id, 'related'],
    queryFn: () => booksService.getRelatedBooks(id, limit),
    enabled: !!id,
  })

export const useCreateBook = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: FormData) => booksService.createBook(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.books] })
      toast.success("Kitob muvaffaqiyatli qo'shildi!")
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message || "Kitob qo'shishda xato yuz berdi")
    },
  })
}

export const useUpdateBook = (id: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: FormData) => booksService.updateBook(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.books] })
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.book, id] })
      toast.success('Kitob muvaffaqiyatli yangilandi!')
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message || 'Kitobni yangilashda xato yuz berdi')
    },
  })
}

export const useDeleteBook = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => booksService.deleteBook(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.books] })
      toast.success("Kitob muvaffaqiyatli o'chirildi!")
    },
    onError: () => {
      toast.error("Kitobni o'chirishda xato yuz berdi")
    },
  })
}

export const useToggleLike = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (bookId: string) => booksService.toggleLike(bookId),
    onSuccess: (data, bookId) => {
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.books] })
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.book, bookId] })
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.likes] })
      toast.success(data.liked ? 'Yoqtirildi!' : 'Yoqtirishdan olib tashlandi')
    },
    onError: () => toast.error('Xato yuz berdi'),
  })
}

export const useToggleBookmark = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (bookId: string) => booksService.toggleBookmark(bookId),
    onSuccess: (data, bookId) => {
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.books] })
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.book, bookId] })
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.bookmarks] })
      toast.success(data.saved ? 'Saqlandi!' : 'Saqlangandan olib tashlandi')
    },
  })
}

export const useDownloadBook = () =>
  useMutation({
    mutationFn: (id: string) => booksService.downloadBook(id),
    onSuccess: (data) => {
      window.open(data.url, '_blank')
      toast.success('Download started!')
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message || 'Download failed')
    },
  })
