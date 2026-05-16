import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Heart, Bookmark, Download, Star, BookOpen } from 'lucide-react'
import { cn, formatPrice, formatNumber } from '@/lib/utils'
import type { Book } from '@/types'
import { useToggleLike, useToggleBookmark } from '@/hooks/useBooks'
import { useAuthStore } from '@/stores/auth.store'

const COVER_GRADIENTS = [
  ['#d97706', '#b45309'],
  ['#2563eb', '#1d4ed8'],
  ['#059669', '#047857'],
  ['#dc2626', '#b91c1c'],
  ['#7c3aed', '#6d28d9'],
  ['#0891b2', '#0e7490'],
  ['#65a30d', '#4d7c0f'],
  ['#db2777', '#be185d'],
]

export function DefaultCover({ title, size = 'default' }: { title: string; size?: 'default' | 'compact' }) {
  const idx = title.charCodeAt(0) % COVER_GRADIENTS.length
  const [from, to] = COVER_GRADIENTS[idx]
  const initials = title.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('')

  if (size === 'compact') {
    return (
      <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}>
        <span className="text-white font-bold text-sm">{initials}</span>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3 px-4"
      style={{ background: `linear-gradient(160deg, ${from} 0%, ${to} 100%)` }}>
      <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
        <BookOpen className="w-5 h-5 text-white/80" />
      </div>
      <span className="text-white font-bold text-2xl tracking-widest">{initials}</span>
      <span className="text-white/60 text-xs text-center line-clamp-2 leading-snug">{title}</span>
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
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
        <Link to={`/books/${book.id}`} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-accent/60 transition-colors group">
          <div className="w-10 h-14 rounded-lg shrink-0 overflow-hidden shadow-sm">
            {book.coverUrl
              ? <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
              : <DefaultCover title={book.title} size="compact" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate group-hover:text-amber-400 transition-colors leading-tight">{book.title}</p>
            {book.author && <p className="text-xs text-muted-foreground truncate mt-0.5">{book.author.name}</p>}
            <p className="text-xs text-amber-400 font-medium mt-1">{formatPrice(book.price)}</p>
          </div>
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Link to={`/books/${book.id}`}>
        <div className="rounded-2xl border border-border/40 bg-card overflow-hidden hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-300">

          {/* Cover */}
          <div className="relative aspect-[2/3] overflow-hidden">
            {book.coverUrl
              ? <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
              : <DefaultCover title={book.title} />}

            {/* Dark overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Price badge */}
            <div className="absolute top-2.5 left-2.5">
              <span className={cn(
                'text-[11px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm',
                book.price === 0
                  ? 'bg-emerald-500/90 text-white'
                  : 'bg-amber-500/90 text-white'
              )}>
                {formatPrice(book.price)}
              </span>
            </div>

            {/* Hover actions */}
            <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-3 group-hover:translate-x-0">
              <button onClick={handleLike}
                className={cn('w-7 h-7 rounded-lg backdrop-blur-sm border border-white/20 flex items-center justify-center transition-colors',
                  book.isLiked ? 'bg-red-500 text-white' : 'bg-black/40 text-white hover:bg-red-500')}>
                <Heart className={cn('w-3.5 h-3.5', book.isLiked && 'fill-white')} />
              </button>
              <button onClick={handleBookmark}
                className={cn('w-7 h-7 rounded-lg backdrop-blur-sm border border-white/20 flex items-center justify-center transition-colors',
                  book.isBookmarked ? 'bg-amber-500 text-white' : 'bg-black/40 text-white hover:bg-amber-500')}>
                <Bookmark className={cn('w-3.5 h-3.5', book.isBookmarked && 'fill-white')} />
              </button>
            </div>

            {/* Bottom info on hover */}
            <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <p className="text-white text-xs font-semibold line-clamp-1">{book.title}</p>
              {book.author && <p className="text-white/70 text-[10px]">{book.author.name}</p>}
            </div>
          </div>

          {/* Info */}
          <div className="p-3">
            <h3 className="font-semibold text-[13px] leading-snug line-clamp-1 group-hover:text-amber-400 transition-colors">
              {book.title}
            </h3>
            {book.author && (
              <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{book.author.name}</p>
            )}
            <div className="flex items-center gap-2.5 mt-2 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-0.5">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                5.0
              </span>
              <span className="flex items-center gap-0.5">
                <Download className="w-3 h-3" />
                {formatNumber(book.downloadCount ?? 0)}
              </span>
              <span className="flex items-center gap-0.5">
                <Heart className={cn('w-3 h-3', book.isLiked ? 'fill-red-400 text-red-400' : '')} />
                {formatNumber(book.likeCount ?? 0)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export function BookCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border/40 bg-card overflow-hidden animate-pulse">
      <div className="aspect-[2/3] bg-muted" />
      <div className="p-3 space-y-2">
        <div className="h-3.5 bg-muted rounded w-4/5" />
        <div className="h-3 bg-muted rounded w-2/3" />
        <div className="h-3 bg-muted rounded w-1/2" />
      </div>
    </div>
  )
}
