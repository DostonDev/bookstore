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
        className="block rounded-2xl border border-border/40 bg-card overflow-hidden hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-300 group"
      >
        {/* Header with gradient */}
        <div className="h-24 relative" style={{ background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)` }}>
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          {/* Book count badge top-right */}
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-black/25 text-white backdrop-blur-sm">
              <BookOpen className="w-3 h-3" />
              {author._count?.books ?? 0}
            </span>
          </div>
        </div>

        {/* Avatar overlapping header */}
        <div className="px-4 pb-4">
          <div className="flex items-end gap-3 -mt-8 mb-3">
            <div className="w-16 h-16 rounded-2xl border-[3px] border-card overflow-hidden shrink-0 shadow-xl">
              {author.avatarUrl
                ? <img src={author.avatarUrl} alt={author.name} className="w-full h-full object-cover" />
                : (
                  <div className="w-full h-full flex items-center justify-center text-white font-bold text-xl"
                    style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}>
                    {getInitials(author.name)}
                  </div>
                )}
            </div>
            <div className="pb-1 flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate group-hover:text-amber-400 transition-colors leading-snug">{author.name}</h3>
              {author.bio
                ? <p className="text-[11px] text-muted-foreground truncate mt-0.5">{author.bio}</p>
                : <p className="text-[11px] text-muted-foreground mt-0.5">{author._count?.books ?? 0} ta kitob</p>
              }
            </div>
          </div>

          {author.bio && (
            <p className="text-[12px] text-muted-foreground line-clamp-2 leading-relaxed">{author.bio}</p>
          )}

          {(author.twitter || author.website) && (
            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border/50">
              {author.twitter && (
                <span className="flex items-center gap-1 text-[11px] text-sky-400 truncate">
                  <Twitter className="w-3 h-3 shrink-0" />
                  <span className="truncate">@{author.twitter}</span>
                </span>
              )}
              {author.website && (
                <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Globe className="w-3 h-3 shrink-0" /> web
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
      <div className="h-24 bg-muted" />
      <div className="px-4 pb-4">
        <div className="flex items-end gap-3 -mt-8 mb-3">
          <div className="w-16 h-16 rounded-2xl bg-muted border-[3px] border-card shrink-0" />
          <div className="flex-1 space-y-1.5 pb-1">
            <div className="h-3.5 bg-muted rounded w-3/4" />
            <div className="h-3 bg-muted rounded w-1/2" />
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
