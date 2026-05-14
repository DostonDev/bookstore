import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, ArrowRight } from 'lucide-react'
import type { Category } from '@/types'

interface Props {
  category: Category
  index?: number
}

const gradients = [
  { bg: 'from-violet-500/30 to-purple-500/20', icon: 'text-violet-500' },
  { bg: 'from-blue-500/30 to-cyan-500/20',     icon: 'text-blue-500' },
  { bg: 'from-emerald-500/30 to-teal-500/20',  icon: 'text-emerald-500' },
  { bg: 'from-amber-500/30 to-orange-500/20',  icon: 'text-amber-500' },
  { bg: 'from-rose-500/30 to-pink-500/20',     icon: 'text-rose-500' },
  { bg: 'from-indigo-500/30 to-violet-500/20', icon: 'text-indigo-500' },
]

export function CategoryCard({ category, index = 0 }: Props) {
  const { bg, icon } = gradients[index % gradients.length]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4 }}
    >
      <Link
        to={`/categories/${category.id}`}
        className="block rounded-2xl border border-border/50 bg-card overflow-hidden hover:border-border hover:shadow-card-hover transition-all duration-300 group"
      >
        <div className={`h-24 bg-gradient-to-br ${bg} relative overflow-hidden`}>
          {category.imageUrl ? (
            <img src={category.imageUrl} alt={category.name} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className={`w-8 h-8 ${icon} opacity-70`} />
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-sm group-hover:text-violet-400 transition-colors">{category.name}</h3>
          {category.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{category.description}</p>
          )}
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-muted-foreground">{category._count?.books || 0} kitob</span>
            <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export function CategoryCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border/50 bg-card overflow-hidden animate-pulse">
      <div className="h-24 bg-muted" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-muted rounded w-2/3" />
        <div className="h-3 bg-muted rounded w-full" />
        <div className="h-3 bg-muted rounded w-1/3" />
      </div>
    </div>
  )
}
