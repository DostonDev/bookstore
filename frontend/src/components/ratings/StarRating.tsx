import { useState } from 'react'
import { Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useRating, useRateBook } from '@/hooks/useRatings'
import { useAuthStore } from '@/stores/auth.store'

interface StarRatingProps {
  bookId: string
  showStats?: boolean
}

export function StarRating({ bookId, showStats = true }: StarRatingProps) {
  const { isAuthenticated } = useAuthStore()
  const [hovered, setHovered] = useState(0)
  const { data, isLoading } = useRating(bookId, isAuthenticated)
  const rateBook = useRateBook(bookId)

  const userRating = data?.userRating || 0
  const displayRating = hovered || userRating

  const handleRate = (value: number) => {
    if (!isAuthenticated) return
    rateBook.mutate(value)
  }

  return (
    <div className="space-y-3">
      {showStats && (
        <div className="flex items-center gap-3">
          <div className="text-3xl font-bold">{data?.average?.toFixed(1) || '—'}</div>
          <div>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'w-4 h-4',
                    i < Math.round(data?.average || 0)
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-muted-foreground'
                  )}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {data?.total || 0} {data?.total === 1 ? 'rating' : 'ratings'}
            </p>
          </div>
        </div>
      )}

      {isAuthenticated && (
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">
            {userRating ? 'Your rating' : 'Rate this book'}
          </p>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onMouseEnter={() => setHovered(i + 1)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => handleRate(i + 1)}
                disabled={rateBook.isPending}
                className="focus:outline-none"
              >
                <Star
                  className={cn(
                    'w-6 h-6 transition-colors duration-150',
                    i < displayRating
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-muted-foreground hover:text-amber-400'
                  )}
                />
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
