import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, BookOpen, Twitter, Globe } from 'lucide-react'
import type { Author } from '@/types'

interface Props {
  author: Author
  index?: number
}

export function AuthorCard({ author, index = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4 }}
    >
      <Link
        to={`/authors/${author.slug}`}
        className="block rounded-2xl border border-border/50 bg-card p-6 hover:border-border hover:shadow-card-hover transition-all duration-300 group"
      >
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-border/50 shrink-0">
            {author.avatarUrl ? (
              <img src={author.avatarUrl} alt={author.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-6 h-6 text-violet-400" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm group-hover:text-violet-400 transition-colors truncate">{author.name}</h3>
            {author.bio && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{author.bio}</p>
            )}
            <div className="flex items-center gap-3 mt-3">
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <BookOpen className="w-3 h-3" />
                {author._count?.books || 0} kitob
              </span>
              {author.twitter && (
                <span className="flex items-center gap-1 text-xs text-blue-400">
                  <Twitter className="w-3 h-3" />
                </span>
              )}
              {author.website && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Globe className="w-3 h-3" />
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export function AuthorCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border/50 bg-card p-6 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-full bg-muted shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted rounded w-1/2" />
          <div className="h-3 bg-muted rounded w-full" />
          <div className="h-3 bg-muted rounded w-2/3" />
        </div>
      </div>
    </div>
  )
}
