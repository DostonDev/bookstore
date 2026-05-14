import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, BookOpen, User, Grid3X3, Newspaper, Filter } from 'lucide-react'
import { useSearch } from '@/hooks/useSearch'
import { BookCard } from '@/components/cards/BookCard'
import { AuthorCard } from '@/components/cards/AuthorCard'
import { CategoryCard } from '@/components/cards/CategoryCard'
import { BlogCard } from '@/components/cards/BlogCard'
import type { SearchResult } from '@/types'

const TYPES = [
  { value: 'all', label: 'Hammasi', icon: Filter },
  { value: 'books', label: 'Kitoblar', icon: BookOpen },
  { value: 'authors', label: 'Mualliflar', icon: User },
  { value: 'categories', label: 'Kategoriyalar', icon: Grid3X3 },
  { value: 'blogs', label: 'Bloglar', icon: Newspaper },
]

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [type, setType] = useState(searchParams.get('type') || 'all')

  const { data, isLoading } = useSearch({ q: query, type })

  useEffect(() => {
    setSearchParams({ q: query, type })
  }, [query, type, setSearchParams])

  return (
    <div className="container mx-auto py-12">
      {/* Search Input */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Kitob, muallif, kategoriya qidiring..."
            autoFocus
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-card border border-border/50 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 outline-none text-lg transition-all"
          />
        </div>
      </motion.div>

      {/* Type Filter */}
      <div className="flex items-center gap-2 mb-8 flex-wrap">
        {TYPES.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setType(value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              type === value
                ? 'bg-violet-600 text-white'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Results */}
      {query.length < 2 ? (
        <div className="text-center py-20">
          <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">Qidiruv so'zini kiriting</p>
        </div>
      ) : isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-48 bg-muted rounded-2xl" />
          ))}
        </div>
      ) : !data?.data?.length ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground">
            <span className="text-foreground font-medium">"{query}"</span> uchun natija topilmadi
          </p>
        </div>
      ) : (
        <div>
          <p className="text-sm text-muted-foreground mb-6">
            {data.meta?.total || 0} ta natija topildi
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {data.data.map((result: SearchResult, i) => {
              if (result.type === 'book') return <BookCard key={result.id} book={result as never} index={i} />
              if (result.type === 'author') return <AuthorCard key={result.id} author={result as never} index={i} />
              if (result.type === 'category') return <CategoryCard key={result.id} category={result as never} index={i} />
              if (result.type === 'blog') return <BlogCard key={result.id} blog={result as never} index={i} />
              return null
            })}
          </div>
        </div>
      )}
    </div>
  )
}
