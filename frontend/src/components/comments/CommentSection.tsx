import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Trash2, Send } from 'lucide-react'
import { useComments, useAddComment, useDeleteComment } from '@/hooks/useComments'
import { useAuthStore } from '@/stores/auth.store'
import { formatRelativeTime, getInitials } from '@/lib/utils'

interface CommentSectionProps {
  bookId: string
}

export function CommentSection({ bookId }: CommentSectionProps) {
  const { user, isAuthenticated } = useAuthStore()
  const [text, setText] = useState('')
  const { data, isLoading } = useComments(bookId)
  const addComment = useAddComment(bookId)
  const deleteComment = useDeleteComment(bookId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    addComment.mutate(text, {
      onSuccess: () => setText(''),
    })
  }

  const comments = data?.comments || []

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-amber-400" />
        <h3 className="font-semibold">Izohlar ({comments.length})</h3>
      </div>

      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xs font-bold shrink-0">
            {getInitials(user?.name || 'U')}
          </div>
          <div className="flex-1 flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Izoh qoldiring..."
              className="flex-1 bg-muted/30 border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all"
            />
            <button
              type="submit"
              disabled={!text.trim() || addComment.isPending}
              className="w-10 h-10 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 flex items-center justify-center transition-colors"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
        </form>
      ) : (
        <div className="rounded-xl border border-border/50 bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
          Izoh qoldirish uchun <a href="/login" className="text-amber-400 hover:underline">tizimga kiring</a>.
        </div>
      )}

      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-muted shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-muted rounded w-1/4" />
                <div className="h-4 bg-muted rounded w-3/4" />
              </div>
            </div>
          ))
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            Hali izoh yo'q. Birinchi bo'lib fikr qoldiring!
          </div>
        ) : (
          <AnimatePresence>
            {comments.map((comment, i) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: i * 0.05 }}
                className="flex gap-3 group"
              >
                <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xs font-bold shrink-0">
                  {getInitials(comment.user?.name || 'U')}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{comment.user?.name || 'Foydalanuvchi'}</span>
                    <span className="text-xs text-muted-foreground">{formatRelativeTime(comment.createdAt)}</span>
                  </div>
                  <div className="rounded-xl bg-muted/30 border border-border/50 px-4 py-2.5 text-sm relative">
                    {comment.text}
                    {(user?.id === comment.userId || user?.role === 'ADMIN') && (
                      <button
                        onClick={() => deleteComment.mutate(comment.id)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 w-6 h-6 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-400/10 transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
