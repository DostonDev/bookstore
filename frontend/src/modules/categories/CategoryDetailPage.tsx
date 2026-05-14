import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { BookOpen, ChevronRight, ArrowLeft } from 'lucide-react'
import { categoriesService } from '@/services/categories.service'
import { useBooks } from '@/hooks/useBooks'
import { BookCard, BookCardSkeleton } from '@/components/cards/BookCard'
import type { Category } from '@/types'

const subColors = [
  'bg-violet-500/10 hover:bg-violet-500/20 text-violet-600 dark:text-violet-400 border-violet-500/20',
  'bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/20',
  'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  'bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/20',
  'bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/20',
  'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
  'bg-teal-500/10 hover:bg-teal-500/20 text-teal-600 dark:text-teal-400 border-teal-500/20',
  'bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-500/20',
  'bg-pink-500/10 hover:bg-pink-500/20 text-pink-600 dark:text-pink-400 border-pink-500/20',
]

export default function CategoryDetailPage() {
  const { id } = useParams<{ id: string }>()

  const { data: category, isLoading: catLoading } = useQuery({
    queryKey: ['categories', id],
    queryFn: async () => {
      const res = await categoriesService.getById(id!)
      return res.data.data as Category
    },
    enabled: !!id,
  })

  const hasChildren = category?.children && category.children.length > 0
  const { data, isLoading: booksLoading } = useBooks({
    categoryId: id,
    limit: 20,
  })

  return (
    <div className="container mx-auto py-12">
      {/* Breadcrumb */}
      {category?.parent && (
        <Link to={`/categories/${category.parent.id}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          {category.parent.name}
        </Link>
      )}

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        {category?.imageUrl && (
          <div className="relative h-48 rounded-2xl overflow-hidden mb-6">
            <img src={category.imageUrl} alt={category.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          </div>
        )}

        {catLoading ? (
          <div className="space-y-2 animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-4 bg-muted rounded w-2/3" />
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 text-amber-400 text-sm font-medium mb-3">
              <BookOpen className="w-4 h-4" />
              {category?.parent ? category.parent.name : 'Kategoriya'}
            </div>
            <h1 className="text-3xl font-bold">{category?.name}</h1>
            {category?.description && (
              <p className="text-muted-foreground mt-2">{category.description}</p>
            )}
            {!hasChildren && (
              <p className="text-sm text-muted-foreground mt-2">{category?._count?.books || 0} ta kitob</p>
            )}
          </>
        )}
      </motion.div>

      {/* Subcategories */}
      {hasChildren && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-12">
          <h2 className="text-lg font-semibold mb-4">Fanlar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {category!.children!.map((child, i) => (
              <Link key={child.id} to={`/categories/${child.id}`}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className={`flex items-center justify-between px-4 py-3.5 rounded-xl border ${subColors[i % subColors.length]} transition-all group cursor-pointer`}
                >
                  <div>
                    <p className="font-medium text-sm">{child.name}</p>
                    {child.description && (
                      <p className="text-xs opacity-60 mt-0.5 line-clamp-1">{child.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs opacity-50">{child._count?.books || 0} ta</span>
                    <ChevronRight className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      {/* Books grid */}
      {!hasChildren && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {booksLoading
              ? Array.from({ length: 10 }).map((_, i) => <BookCardSkeleton key={i} />)
              : data?.books?.map((book, i) => <BookCard key={book.id} book={book} index={i} />)
            }
          </div>
          {!booksLoading && data?.books?.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              Bu kategoriyada hali kitoblar yo'q
            </div>
          )}
        </>
      )}
    </div>
  )
}
