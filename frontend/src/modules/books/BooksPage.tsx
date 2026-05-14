import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Grid, List, X, SlidersHorizontal, BookOpen, Tag, ChevronDown } from 'lucide-react'
import { useBooks } from '@/hooks/useBooks'
import { useCategories } from '@/hooks/useCategories'
import { BookCard, BookCardSkeleton } from '@/components/cards/BookCard'
import { useDebounce } from '@/hooks/useDebounce'
import { cn } from '@/lib/utils'
import type { Category } from '@/types'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Yangilari' },
  { value: 'popular', label: 'Mashhur' },
  { value: 'price_asc', label: 'Arzon' },
  { value: 'price_desc', label: 'Qimmat' },
]

// ── Category list (desktop + mobile) ────────────────────────────────────────
function CategoryList({
  categories,
  categoryId,
  onSelect,
  expanded,
  onToggleExpand,
  size = 'default',
}: {
  categories: Category[]
  categoryId: string
  onSelect: (id: string) => void
  expanded: Set<string>
  onToggleExpand: (id: string) => void
  size?: 'default' | 'mobile'
}) {
  const py = size === 'mobile' ? 'py-2.5' : 'py-2'

  return (
    <>
      {/* All */}
      <button
        onClick={() => onSelect('')}
        className={cn(
          `w-full text-left px-3 ${py} rounded-lg text-sm transition-colors flex items-center gap-2`,
          !categoryId ? 'bg-amber-500/15 text-amber-400 font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
        )}
      >
        <BookOpen className="w-3.5 h-3.5 shrink-0" />
        Barchasi
      </button>

      {categories.map((cat) => {
        const hasChildren = cat.children && cat.children.length > 0
        const isOpen = expanded.has(cat.id)
        const childSelected = hasChildren && cat.children!.some(c => c.id === categoryId)
        const isActive = categoryId === cat.id

        return (
          <div key={cat.id}>
            {/* Parent button */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => hasChildren ? onToggleExpand(cat.id) : onSelect(cat.id)}
                className={cn(
                  `flex-1 text-left px-3 ${py} rounded-lg text-sm transition-colors flex items-center gap-2`,
                  (isActive || childSelected)
                    ? 'bg-amber-500/15 text-amber-400 font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
                )}
              >
                <Tag className="w-3.5 h-3.5 shrink-0 opacity-60" />
                <span className="truncate flex-1">{cat.name}</span>
                {!hasChildren && cat._count?.books !== undefined && (
                  <span className="text-xs opacity-50 shrink-0">{cat._count.books}</span>
                )}
              </button>
              {hasChildren && (
                <button
                  onClick={() => onToggleExpand(cat.id)}
                  className="p-1.5 text-muted-foreground hover:text-foreground transition-colors shrink-0"
                >
                  <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', isOpen && 'rotate-180')} />
                </button>
              )}
            </div>

            {/* Children (animated dropdown) */}
            {hasChildren && (
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="ml-3 border-l border-border/50 pl-2 mt-0.5 mb-1 space-y-0.5">
                      {cat.children!.map((child) => (
                        <button
                          key={child.id}
                          onClick={() => onSelect(child.id)}
                          className={cn(
                            `w-full text-left px-2.5 py-1.5 rounded-lg text-sm transition-colors flex items-center justify-between gap-2`,
                            categoryId === child.id
                              ? 'bg-amber-500/15 text-amber-400 font-medium'
                              : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
                          )}
                        >
                          <span className="truncate">{child.name}</span>
                          {child._count?.books !== undefined && (
                            <span className="text-xs opacity-50 shrink-0">{child._count.books}</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        )
      })}
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

export default function BooksPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [sort, setSort] = useState('newest')
  const [categoryId, setCategoryId] = useState('')
  const [mobileSidebar, setMobileSidebar] = useState(false)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const debouncedSearch = useDebounce(search, 400)

  const { data: categoriesData } = useCategories()
  const categories = categoriesData ?? []

  // flat list for chip name lookup
  const allCategories = useMemo(() => {
    const flat: Category[] = []
    for (const c of categories) {
      flat.push(c)
      if (c.children) flat.push(...c.children)
    }
    return flat
  }, [categories])

  const { data, isLoading } = useBooks({
    page, limit: 15,
    search: debouncedSearch || undefined,
    sort,
    categoryId: categoryId || undefined,
  })

  const books = data?.books || []
  const pagination = data?.pagination
  const hasFilters = !!search || !!categoryId || sort !== 'newest'

  const handleReset = () => {
    setSearch(''); setCategoryId(''); setSort('newest'); setPage(1)
  }

  const handleCategorySelect = (id: string) => {
    setCategoryId(id); setPage(1); setMobileSidebar(false)
  }

  const handleToggleExpand = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const selectedCategoryName = allCategories.find(c => c.id === categoryId)?.name

  return (
    <div className="container mx-auto py-6 sm:py-8">
      {/* Page header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1">Kitoblar</h1>
        <p className="text-muted-foreground text-sm">
          {pagination ? `${pagination.total} ta asar` : 'Kutubxona'}
        </p>
      </motion.div>

      <div className="flex gap-6">
        {/* ── LEFT SIDEBAR (desktop) ── */}
        <aside className="hidden lg:flex flex-col w-56 shrink-0 gap-1 sticky top-20 self-start max-h-[calc(100vh-5rem)] overflow-y-auto">
          {/* Sort */}
          <div className="mb-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">Saralash</p>
            {SORT_OPTIONS.map((o) => (
              <button
                key={o.value}
                onClick={() => { setSort(o.value); setPage(1) }}
                className={cn(
                  'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                  sort === o.value ? 'bg-amber-500/15 text-amber-400 font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
                )}
              >
                {o.label}
              </button>
            ))}
          </div>

          {/* Categories */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">Kategoriya</p>
            <CategoryList
              categories={categories}
              categoryId={categoryId}
              onSelect={handleCategorySelect}
              expanded={expanded}
              onToggleExpand={handleToggleExpand}
            />
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <div className="flex-1 min-w-0">
          {/* Top bar */}
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                placeholder="Asar qidirish..."
                className="w-full bg-muted/30 border border-border rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 transition-all"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              onClick={() => setMobileSidebar(true)}
              className={cn(
                'lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm transition-colors shrink-0',
                hasFilters ? 'border-amber-500/50 text-amber-400 bg-amber-500/10' : 'border-border text-muted-foreground'
              )}
            >
              <SlidersHorizontal className="w-4 h-4" />
              {hasFilters && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
            </button>

            <div className="hidden sm:flex items-center rounded-xl border border-border overflow-hidden shrink-0">
              <button onClick={() => setView('grid')} className={cn('p-2.5 transition-colors', view === 'grid' ? 'bg-accent' : 'text-muted-foreground hover:text-foreground')}>
                <Grid className="w-4 h-4" />
              </button>
              <button onClick={() => setView('list')} className={cn('p-2.5 transition-colors', view === 'list' ? 'bg-accent' : 'text-muted-foreground hover:text-foreground')}>
                <List className="w-4 h-4" />
              </button>
            </div>

            {hasFilters && (
              <button onClick={handleReset} className="hidden lg:flex items-center gap-1 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground border border-dashed border-border transition-colors">
                <X className="w-3.5 h-3.5" /> Tozalash
              </button>
            )}
          </div>

          {/* Active filter chips */}
          {hasFilters && (
            <div className="flex flex-wrap gap-2 mb-4">
              {categoryId && (
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium">
                  {selectedCategoryName}
                  <button onClick={() => { setCategoryId(''); setPage(1) }}><X className="w-3 h-3" /></button>
                </span>
              )}
              {sort !== 'newest' && (
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted text-xs text-muted-foreground">
                  {SORT_OPTIONS.find(o => o.value === sort)?.label}
                  <button onClick={() => { setSort('newest'); setPage(1) }}><X className="w-3 h-3" /></button>
                </span>
              )}
            </div>
          )}

          {/* Books grid */}
          {isLoading ? (
            <div className={cn('grid gap-3', view === 'grid' ? 'grid-cols-2 sm:grid-cols-3 xl:grid-cols-5' : 'grid-cols-1 sm:grid-cols-2')}>
              {Array.from({ length: 15 }).map((_, i) => <BookCardSkeleton key={i} />)}
            </div>
          ) : books.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <Search className="w-7 h-7 text-muted-foreground" />
              </div>
              <h3 className="text-base font-semibold mb-2">Kitob topilmadi</h3>
              <p className="text-muted-foreground text-sm mb-4">
                {search ? `"${search}" bo'yicha natija yo'q` : 'Bu kategoriyada hali kitob yo\'q'}
              </p>
              {hasFilters && (
                <button onClick={handleReset} className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm transition-colors">
                  Filtrlarni tozalash
                </button>
              )}
            </div>
          ) : (
            <div className={cn('grid gap-3', view === 'grid' ? 'grid-cols-2 sm:grid-cols-3 xl:grid-cols-5' : 'grid-cols-1 sm:grid-cols-2')}>
              {books.map((book, i) => <BookCard key={book.id} book={book} index={i} />)}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-8 flex-wrap">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
                className="px-3 py-2 rounded-xl border border-border text-sm disabled:opacity-40 hover:bg-accent transition-colors">←</button>
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const p = Math.max(1, Math.min(pagination.totalPages - 4, page - 2)) + i
                return (
                  <button key={p} onClick={() => setPage(p)}
                    className={cn('w-9 h-9 rounded-xl text-sm transition-colors',
                      p === page ? 'bg-amber-600 text-white' : 'border border-border hover:bg-accent')}>
                    {p}
                  </button>
                )
              })}
              <button onClick={() => setPage(Math.min(pagination.totalPages, page + 1))} disabled={page === pagination.totalPages}
                className="px-3 py-2 rounded-xl border border-border text-sm disabled:opacity-40 hover:bg-accent transition-colors">→</button>
            </div>
          )}
        </div>
      </div>

      {/* ── MOBILE SIDEBAR ── */}
      <AnimatePresence>
        {mobileSidebar && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setMobileSidebar(false)}
            />
            <motion.div
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 h-full w-72 bg-background border-r border-border z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-semibold">Filtrlar</h2>
                  <button onClick={() => setMobileSidebar(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-accent transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="mb-5">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Saralash</p>
                  {SORT_OPTIONS.map((o) => (
                    <button
                      key={o.value}
                      onClick={() => { setSort(o.value); setPage(1); setMobileSidebar(false) }}
                      className={cn(
                        'w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors',
                        sort === o.value ? 'bg-amber-500/15 text-amber-400 font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
                      )}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>

                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Kategoriya</p>
                  <CategoryList
                    categories={categories}
                    categoryId={categoryId}
                    onSelect={handleCategorySelect}
                    expanded={expanded}
                    onToggleExpand={handleToggleExpand}
                    size="mobile"
                  />
                </div>

                {hasFilters && (
                  <button onClick={() => { handleReset(); setMobileSidebar(false) }}
                    className="w-full mt-5 py-2.5 rounded-xl border border-dashed border-border text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Filtrlarni tozalash
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
