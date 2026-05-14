import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ratingsService } from '@/services/ratings.service'
import { QUERY_KEYS } from '@/constants'
import { toast } from 'sonner'

export const useRating = (bookId: string, enabled = true) =>
  useQuery({
    queryKey: [QUERY_KEYS.ratings, bookId],
    queryFn: () => ratingsService.getRating(bookId),
    enabled: !!bookId && enabled,
  })

export const useRateBook = (bookId: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (value: number) => ratingsService.rateBook(bookId, value),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.ratings, bookId] })
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.book, bookId] })
      toast.success('Baho muvaffaqiyatli berildi!')
    },
    onError: () => toast.error('Baho berishda xato yuz berdi'),
  })
}
