import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, Globe, Twitter } from 'lucide-react'
import type { Author } from '@/types'

const GRADIENTS = [
  ['#7c3aed', '#4f46e5'],
  ['#0891b2', '#0e7490'],
  ['#d97706', '#b45309'],
  ['#059669', '#047857'],
  ['#dc2626', '#b91c1c'],
  ['#db2777', '#be185d'],
]

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('')
}

interface Props { author: Author; index?: number }

export function AuthorCard({ author, index = 0 }: Props) {
  const [from, to] = GRADIENTS[index % GRADIENTS.length]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4 }}
    >
      <Link
        to={`/authors/${author.slug}`}
        className="block rounded-2xl border border-border/40 bg-card overflow-hidden hover:border-transparent hover:shadow-lg transition-all duration-300 group"
      >
        {/* Header with gradient */}
        <div className="h-20 relative" style={{ background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)` }}>
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        </div>

        {/* Avatar overlapping header */}
        <div className="px-4 pb-4">
          <div className="flex items-end gap-3 -mt-7 mb-3">
            <div className="w-14 h-14 rounded-2xl border-2 border-card overflow-hidden shrink-0 shadow-lg">
              {author.avatarUrl
                ? <img src={author.avatarUrl} alt={author.name} className="w-full h-full object-cover" />
                : (
                  <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg"
                    style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}>
                    {getInitials(author.name)}
                  </div>
                )}
            </div>
            <div className="pb-0.5 flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate group-hover:text-amber-400 transition-colors">{author.name}</h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full mt-0.5"
                style={{ background: `${from}20`, color: from }}>
                <BookOpen className="w-2.5 h-2.5" />
                {author._count?.books ?? 0} kitob
              </span>
            </div>
          </div>

          {author.bio && (
            <p className="text-[12px] text-muted-foreground line-clamp-2 leading-relaxed">{author.bio}</p>
          )}

          {(author.twitter || author.website) && (
            <div className="flex items-center gap-2 mt-3">
              {author.twitter && (
                <span className="flex items-center gap-1 text-[11px] text-sky-400">
                  <Twitter className="w-3 h-3" /> @{author.twitter}
                </span>
              )}
              {author.website && (
                <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Globe className="w-3 h-3" /> web
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  )
}

export function AuthorCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border/40 bg-card overflow-hidden animate-pulse">
      <div className="h-20 bg-muted" />
      <div className="px-4 pb-4">
        <div className="flex items-end gap-3 -mt-7 mb-3">
          <div className="w-14 h-14 rounded-2xl bg-muted border-2 border-card shrink-0" />
          <div className="flex-1 space-y-1.5 pb-0.5">
            <div className="h-3.5 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded-full w-16" />
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="h-3 bg-muted rounded w-full" />
          <div className="h-3 bg-muted rounded w-4/5" />
        </div>
      </div>
    </div>
  )
}
