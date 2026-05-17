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
        className="block rounded-2xl border border-border/40 bg-card hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-300 group overflow-hidden"
      >
        {/* Gradient header — avatar absolute bottom-left */}
        <div className="h-20 relative" style={{ background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)` }}>
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

          {/* book count badge */}
          <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-black/25 text-white backdrop-blur-sm">
            <BookOpen className="w-3 h-3" />
            {author._count?.books ?? 0}
          </span>

          {/* avatar pinned to bottom-left, half overlapping header */}
          <div className="absolute -bottom-7 left-4 w-14 h-14 rounded-2xl border-[3px] border-card overflow-hidden shadow-lg">
            {author.avatarUrl
              ? <img src={author.avatarUrl} alt={author.name} className="w-full h-full object-cover" />
              : (
                <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg"
                  style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}>
                  {getInitials(author.name)}
                </div>
              )}
          </div>
        </div>

        {/* Content — pt leaves room for overlapping avatar */}
        <div className="px-4 pt-9 pb-4">
          <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-amber-400 transition-colors">
            {author.name}
          </h3>

          {author.bio && (
            <p className="text-[12px] text-muted-foreground line-clamp-2 leading-relaxed mt-1">{author.bio}</p>
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
      <div className="h-20 bg-muted relative">
        <div className="absolute -bottom-7 left-4 w-14 h-14 rounded-2xl bg-muted/70 border-[3px] border-card" />
      </div>
      <div className="px-4 pt-9 pb-4 space-y-2">
        <div className="h-3.5 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-1/2" />
      </div>
    </div>
  )
}
