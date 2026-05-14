import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Heart, Bookmark, Download, Star, BookOpen } from 'lucide-react'
import { cn, formatPrice, formatNumber } from '@/lib/utils'
import type { Book } from '@/types'
import { useToggleLike, useToggleBookmark } from '@/hooks/useBooks'
import { useAuthStore } from '@/stores/auth.store'

const COVER_GRADIENTS = [
  'from-amber-600 to-orange-700',
  'from-blue-600 to-cyan-700',
  'from-emerald-600 to-teal-700',
  'from-rose-600 to-pink-700',
  'from-amber-600 to-orange-700',
  'from-fuchsia-600 to-purple-700',
  'from-sky-600 to-blue-700',
  'from-green-600 to-emerald-700',
]

export function DefaultCover({ title, size = 'default' }: { title: string; size?: 'default' | 'compact' }) {
  const index = title.charCodeAt(0) % COVER_GRADIENTS.length
  const gradient = COVER_GRADIENTS[index]
  const initials = title
    .split(' ')
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() ?? '')
    .join('')

  if (size === 'compact') {
    return (
      <div className={cn('w-full h-full flex items-center justify-center bg-gradient-to-br', gradient)}>
        <span className="text-white font-bold text-base">{initials}</span>
      </div>
    )
  }

  return (
    <div className={cn('w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br', gradient, 'px-3')}>
      <BookOpen className="w-7 h-7 text-white/60" />
      <span className="text-white font-bold text-xl tracking-wide">{initials}</span>
      <span className="text-white/60 text-xs text-center line-clamp-2 leading-tight">{title}</span>
    </div>
  )
}

interface BookCardProps {
  book: Book
  variant?: 'default' | 'compact'
  index?: number
}

export function BookCard({ book, variant = 'default', index = 0 }: BookCardProps) {
  const { isAuthenticated } = useAuthStore()
  const toggleLike = useToggleLike()
  const toggleBookmark = useToggleBookmark()

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isAuthenticated) toggleLike.mutate(book.id)
  }

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isAuthenticated) toggleBookmark.mutate(book.id)
  }

  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <Link to={`/books/${book.id}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent/50 transition-colors group">
          <div className="w-12 h-16 rounded-lg shrink-0 overflow-hidden">
            {book.coverUrl ? (
              <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover rounded-lg" />
            ) : (
              <DefaultCover title={book.title} size="compact" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate group-hover:text-amber-400 transition-colors">{book.title}</p>
            <p className="text-xs text-muted-foreground">{formatPrice(book.price)}</p>
          </div>
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Link to={`/books/${book.id}`}>
        <div className="relative rounded-2xl border border-border/50 bg-card overflow-hidden hover:border-border hover:shadow-card-hover transition-all duration-300">
          {/* Cover */}
          <div className="relative aspect-[2/3] bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-yellow-500/10 overflow-hidden">
            {book.coverUrl ? (
              <img
                src={book.coverUrl}
                alt={book.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <DefaultCover title={book.title} />
            )}

            {/* Overlay actions */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Price badge */}
            <div className="absolute top-3 left-3">
              <span className={cn(
                'text-xs font-bold px-2.5 py-1 rounded-full',
                book.price === 0
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              )}>
                {formatPrice(book.price)}
              </span>
            </div>

            {/* Action buttons */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
              <button
                onClick={handleLike}
                className={cn(
                  'w-8 h-8 rounded-lg bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center transition-colors',
                  book.isLiked ? 'text-red-500' : 'text-white hover:text-red-400'
                )}
              >
                <Heart className={cn('w-3.5 h-3.5', book.isLiked ? 'fill-red-500 text-red-500' : '')} />
              </button>
              <button
                onClick={handleBookmark}
                className={cn(
                  'w-8 h-8 rounded-lg bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center transition-colors',
                  book.isBookmarked ? 'text-amber-400' : 'text-white hover:text-amber-400'
                )}
              >
                <Bookmark className={cn('w-3.5 h-3.5', book.isBookmarked ? 'fill-amber-400 text-amber-400' : '')} />
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="p-3">
            <h3 className="font-semibold text-xs leading-tight mb-1 group-hover:text-amber-400 transition-colors line-clamp-2">
              {book.title}
            </h3>

            {book.description && (
              <p className="text-xs text-muted-foreground line-clamp-1 mb-2">{book.description}</p>
            )}

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  5.0
                </span>
                <span className="flex items-center gap-1">
                  <Download className="w-3 h-3" />
                  {formatNumber(book.downloadCount ?? 0)}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className={cn('w-3 h-3', book.isLiked ? 'fill-red-500 text-red-500' : '')} />
                  {formatNumber(book.likeCount ?? 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export function BookCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border/50 bg-card overflow-hidden animate-pulse">
      <div className="aspect-[3/4] bg-muted shimmer-effect" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-muted rounded-lg w-3/4" />
        <div className="h-3 bg-muted rounded-lg w-1/2" />
        <div className="h-3 bg-muted rounded-lg w-2/3" />
      </div>
    </div>
  )
}
