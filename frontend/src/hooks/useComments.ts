import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { commentsService } from '@/services/comments.service'
import { QUERY_KEYS } from '@/constants'
import { toast } from 'sonner'

export const useComments = (bookId: string) =>
  useQuery({
    queryKey: [QUERY_KEYS.comments, bookId],
    queryFn: () => commentsService.getComments(bookId),
    enabled: !!bookId,
  })

export const useAddComment = (bookId: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (text: string) => commentsService.addComment(bookId, text),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.comments, bookId] })
      toast.success("Izoh qo'shildi!")
    },
    onError: () => toast.error("Izoh qo'shishda xato yuz berdi"),
  })
}

export const useDeleteComment = (bookId: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => commentsService.deleteComment(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.comments, bookId] })
      toast.success("Izoh o'chirildi!")
    },
    onError: () => toast.error("Izohni o'chirishda xato yuz berdi"),
  })
}
