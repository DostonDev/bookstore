import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Download, Heart, Bookmark, Star,
  ArrowLeft, Loader2, Clock, User, Tag, BookMarked,
} from 'lucide-react'
import { useBook, useToggleLike, useToggleBookmark, useDownloadBook, useRelatedBooks } from '@/hooks/useBooks'
import { useAuthStore } from '@/stores/auth.store'
import { StarRating } from '@/components/ratings/StarRating'
import { CommentSection } from '@/components/comments/CommentSection'
import { BookCard, BookCardSkeleton, DefaultCover } from '@/components/cards/BookCard'
import { formatPrice, formatNumber, formatDate, cn } from '@/lib/utils'
import { PageLoader } from '@/components/shared/LoadingScreen'

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { isAuthenticated } = useAuthStore()
  const { data, isLoading } = useBook(id!)
  const { data: relatedData, isLoading: relatedLoading } = useRelatedBooks(id!)
  const toggleLike = useToggleLike()
  const toggleBookmark = useToggleBookmark()
  const download = useDownloadBook()

  if (isLoading) return <PageLoader />
  if (!data?.book) return (
    <div className="container mx-auto py-20 text-center">
      <p className="text-muted-foreground">Kitob topilmadi</p>
      <Link to="/books" className="text-amber-400 hover:underline mt-2 inline-block">← Kitoblarga qaytish</Link>
    </div>
  )

  const book = data.book

  return (
    <>
    <div className="container mx-auto py-6 sm:py-10">
      <Link to="/books" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 sm:mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Kitoblarga qaytish
      </Link>

      {/* Mobile: stacked layout. Desktop: side by side */}
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 lg:gap-10">

        {/* Cover + Actions (mobile: horizontal strip, desktop: left column sticky) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1"
        >
          {/* Mobile: cover + CTA side by side */}
          <div className="flex gap-4 sm:gap-6 lg:block">
            {/* Cover */}
            <div className="w-24 sm:w-32 lg:w-3/4 lg:mx-auto shrink-0 aspect-[3/4] rounded-2xl border border-border overflow-hidden shadow-lg lg:shadow-2xl">
              {book.coverUrl ? (
                <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
              ) : (
                <DefaultCover title={book.title} />
              )}
            </div>

            {/* Mobile: Title + price + quick actions next to cover */}
            <div className="flex-1 lg:hidden">
              <span className={cn(
                'inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border mb-2',
                book.price === 0
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              )}>
                {formatPrice(book.price)}
              </span>
              <h1 className="text-lg sm:text-xl font-bold leading-tight mb-2">{book.title}</h1>

              {book.author && (
                <Link to={`/authors/${book.author.slug}`}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-amber-400 transition-colors mb-2">
                  <User className="w-3 h-3" />{book.author.name}
                </Link>
              )}
              {book.category && (
                <Link to={`/categories/${book.categoryId}`}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-amber-400 transition-colors mb-3">
                  <Tag className="w-3 h-3" />{book.category.name}
                </Link>
              )}

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  5.0
                </span>
                <span className="flex items-center gap-1">
                  <Download className="w-3 h-3" />
                  {formatNumber(book.downloadCount)}
                </span>
              </div>

              {isAuthenticated && (
                <Link to={`/read/${book.id}`}
                  className="mt-3 flex items-center gap-1.5 text-xs text-amber-400 font-medium">
                  <BookMarked className="w-3.5 h-3.5" /> O'qishni davom ettirish
                </Link>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-4 lg:mt-4 space-y-2.5 lg:sticky lg:top-24">
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
              <button onClick={() => isAuthenticated ? download.mutate(book.id) : undefined}
                disabled={download.isPending || !isAuthenticated}
                className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white rounded-xl py-3 font-medium text-sm transition-colors">
                {download.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                {!isAuthenticated ? 'Kirish kerak' : 'Yuklab olish'}
              </button>
              {isAuthenticated && (
                <Link to={`/read/${book.id}`}
                  className="flex-1 flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl py-3 font-medium text-sm transition-colors">
                  <BookMarked className="w-4 h-4" /> O'qish
                </Link>
              )}
            </div>

            <div className="flex gap-2">
              <button onClick={() => isAuthenticated && toggleLike.mutate(book.id)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1.5 border border-border rounded-xl py-2.5 text-sm transition-colors hover:bg-accent',
                  book.isLiked ? 'text-red-500 border-red-500/40 bg-red-500/10' : ''
                )}>
                <Heart className={cn('w-4 h-4', book.isLiked ? 'fill-red-500 text-red-500' : '')} />
                {formatNumber(book.likeCount)}
              </button>
              <button onClick={() => isAuthenticated && toggleBookmark.mutate(book.id)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1.5 border border-border rounded-xl py-2.5 text-sm transition-colors hover:bg-accent',
                  book.isBookmarked ? 'text-amber-400 border-amber-400/40 bg-amber-400/10' : ''
                )}>
                <Bookmark className={cn('w-4 h-4', book.isBookmarked ? 'fill-amber-400 text-amber-400' : '')} />
                Saqlash
              </button>
            </div>

            {/* Stats grid — desktop only */}
            <div className="hidden lg:grid grid-cols-2 gap-2">
              {[
                { icon: Download, label: 'Yuklashlar', value: formatNumber(book.downloadCount) },
                { icon: Heart, label: "Layklar", value: formatNumber(book.likeCount) },
                { icon: Star, label: 'Reyting', value: '5.0' },
                { icon: Clock, label: "Qo'shilgan", value: formatDate(book.createdAt) },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="rounded-xl border border-border/50 bg-muted/20 p-3 text-center">
                  <Icon className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                  <p className="text-sm font-semibold">{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 space-y-6 sm:space-y-8"
        >
          {/* Title (desktop only — mobile shows it next to cover) */}
          <div className="hidden lg:block">
            <div className="flex items-start justify-between gap-4 mb-3">
              <h1 className="text-3xl font-bold leading-tight">{book.title}</h1>
              <span className={cn(
                'shrink-0 px-3 py-1 rounded-full text-sm font-bold border',
                book.price === 0
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              )}>
                {formatPrice(book.price)}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
              {book.author && (
                <Link to={`/authors/${book.author.slug}`}
                  className="flex items-center gap-1.5 hover:text-amber-400 transition-colors">
                  <User className="w-3.5 h-3.5" />{book.author.name}
                </Link>
              )}
              {book.category && (
                <Link to={`/categories/${book.categoryId}`}
                  className="flex items-center gap-1.5 hover:text-amber-400 transition-colors">
                  <Tag className="w-3.5 h-3.5" />{book.category.name}
                </Link>
              )}
            </div>
          </div>

          {/* Tags */}
          {book.tags && book.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {book.tags.map((tag) => (
                <span key={tag.id} className="px-2.5 py-1 rounded-full bg-muted text-xs text-muted-foreground">
                  #{tag.name}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          {book.description && (
            <div>
              <h2 className="text-base sm:text-lg font-semibold mb-3">Kitob haqida</h2>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">{book.description}</p>
            </div>
          )}

          {/* Mobile stats row */}
          <div className="flex items-center gap-4 sm:gap-6 text-sm text-muted-foreground lg:hidden flex-wrap">
            <span className="flex items-center gap-1.5"><Download className="w-4 h-4" />{formatNumber(book.downloadCount)}</span>
            <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-amber-400 fill-amber-400" />5.0</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{formatDate(book.createdAt)}</span>
          </div>

          {/* Rating */}
          <div>
            <h2 className="text-base sm:text-lg font-semibold mb-4">Baho berish</h2>
            <StarRating bookId={book.id} />
          </div>

          {/* Comments */}
          <div className="border-t border-border/50 pt-6 sm:pt-8">
            <CommentSection bookId={book.id} />
          </div>
        </motion.div>
      </div>
    </div>

      {/* Related Books */}
      {(relatedLoading || (relatedData?.books && relatedData.books.length > 0)) && (
        <div className="container mx-auto pb-10">
          <div className="border-t border-border/50 pt-8">
            <h2 className="text-lg sm:text-xl font-semibold mb-5">O'xshash kitoblar</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {relatedLoading
                ? Array.from({ length: 6 }).map((_, i) => <BookCardSkeleton key={i} />)
                : relatedData!.books.map((b, i) => <BookCard key={b.id} book={b} index={i} />)
              }
            </div>
          </div>
        </div>
      )}
    </>
  )
}
