import { motion } from 'framer-motion'
import { Grid3X3, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCategories } from '@/hooks/useCategories'
import { CategoryCard, CategoryCardSkeleton } from '@/components/cards/CategoryCard'
import type { Category } from '@/types'

const subGradients = [
  'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
  'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
  'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
  'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
  'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
  'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20',
]

function SubCategoryRow({ category, index }: { category: Category; index: number }) {
  const color = subGradients[index % subGradients.length]
  return (
    <Link to={`/categories/${category.id}`}>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.04 }}
        whileHover={{ x: 4 }}
        className={`flex items-center justify-between px-4 py-3 rounded-xl border ${color} transition-all cursor-pointer group`}
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">{category.name}</span>
          {category.description && (
            <span className="text-xs opacity-60 hidden sm:block truncate max-w-[200px]">{category.description}</span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs opacity-60">{category._count?.books || 0} ta</span>
          <ChevronRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
        </div>
      </motion.div>
    </Link>
  )
}

export default function CategoriesPage() {
  const { data: categories, isLoading } = useCategories()

  const withChildren = categories?.filter(c => c.children && c.children.length > 0) || []
  const withoutChildren = categories?.filter(c => !c.children || c.children.length === 0) || []

  return (
    <div className="container mx-auto py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="flex items-center gap-2 text-amber-400 text-sm font-medium mb-3">
          <Grid3X3 className="w-4 h-4" />
          Kategoriyalar
        </div>
        <h1 className="text-3xl font-bold">Barcha Kategoriyalar</h1>
        <p className="text-muted-foreground mt-2">Qiziqtirgan yo'nalishingizni tanlang</p>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => <CategoryCardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="space-y-10">
          {/* Categories with subcategories */}
          {withChildren.map((cat, i) => (
            <motion.div key={cat.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold">{cat.name}</h2>
                  {cat.description && <p className="text-muted-foreground text-sm mt-0.5">{cat.description}</p>}
                </div>
                <Link to={`/categories/${cat.id}`} className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors">
                  Barchasini ko'rish <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {cat.children!.map((child, j) => (
                  <SubCategoryRow key={child.id} category={child} index={j} />
                ))}
              </div>
            </motion.div>
          ))}

          {/* Regular categories (no children) */}
          {withoutChildren.length > 0 && (
            <div>
              {withChildren.length > 0 && (
                <h2 className="text-xl font-bold mb-4">Boshqa kategoriyalar</h2>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {withoutChildren.map((cat, i) => (
                  <CategoryCard key={cat.id} category={cat} index={i} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!isLoading && categories?.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">Hali kategoriyalar yo'q</div>
      )}
    </div>
  )
}
