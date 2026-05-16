import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, Feather, Globe, BookMarked, Wand2, Baby, Lightbulb, Languages } from 'lucide-react'
import type { Category } from '@/types'

const STYLES = [
  { from: '#7c3aed', to: '#4f46e5', icon: BookOpen },
  { from: '#0891b2', to: '#0e7490', icon: Feather },
  { from: '#059669', to: '#047857', icon: BookMarked },
  { from: '#d97706', to: '#b45309', icon: Wand2 },
  { from: '#dc2626', to: '#b91c1c', icon: Globe },
  { from: '#db2777', to: '#be185d', icon: Languages },
  { from: '#65a30d', to: '#4d7c0f', icon: Baby },
  { from: '#6366f1', to: '#4338ca', icon: Lightbulb },
]

interface Props { category: Category; index?: number }

export function CategoryCard({ category, index = 0 }: Props) {
  const { from, to, icon: Icon } = STYLES[index % STYLES.length]
  const totalBooks = (category._count?.books ?? 0) +
    (category.children?.reduce((s, c) => s + (c._count?.books ?? 0), 0) ?? 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -5 }}
    >
      <Link
        to={`/categories/${category.id}`}
        className="block rounded-2xl overflow-hidden border border-border/40 bg-card hover:border-transparent hover:shadow-lg transition-all duration-300 group"
      >
        {/* Gradient header */}
        <div className="h-28 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)` }}>
          {category.imageUrl
            ? <img src={category.imageUrl} alt={category.name} className="w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-500" />
            : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            )}
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        </div>

        {/* Body */}
        <div className="p-3.5">
          <h3 className="font-semibold text-sm leading-tight line-clamp-1">{category.name}</h3>
          {category.description && (
            <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{category.description}</p>
          )}
          <div className="mt-2.5">
            <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full"
              style={{ background: `${from}20`, color: from }}>
              <BookOpen className="w-2.5 h-2.5" />
              {totalBooks} kitob
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export function CategoryCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border/40 bg-card overflow-hidden animate-pulse">
      <div className="h-28 bg-muted" />
      <div className="p-3.5 space-y-2">
        <div className="h-3.5 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-full" />
        <div className="h-5 bg-muted rounded-full w-16" />
      </div>
    </div>
  )
}
