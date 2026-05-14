import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, BookOpen, TrendingUp } from 'lucide-react'
import { useUIStore } from '@/stores/ui.store'
import { useBooks } from '@/hooks/useBooks'
import { useNavigate } from 'react-router-dom'
import { formatPrice } from '@/lib/utils'
import { useDebounce } from '@/hooks/useDebounce'

export function SearchModal() {
  const { searchOpen, setSearchOpen } = useUIStore()
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const { data, isLoading } = useBooks(
    debouncedQuery ? { search: debouncedQuery, limit: 6 } : undefined
  )

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
      if (e.key === 'Escape') setSearchOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [setSearchOpen])

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setQuery('')
    }
  }, [searchOpen])

  const handleSelect = (id: string) => {
    navigate(`/books/${id}`)
    setSearchOpen(false)
  }

  if (!searchOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setSearchOpen(false)}
        />
        <div className="relative flex items-start justify-center pt-[8vh] sm:pt-[15vh] px-3 sm:px-4">
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
              <Search className="w-5 h-5 text-muted-foreground shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Asar, muallif qidiring..."
                className="flex-1 bg-transparent text-foreground placeholder-muted-foreground focus:outline-none text-sm"
              />
              {query && (
                <button onClick={() => setQuery('')}>
                  <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                </button>
              )}
              <kbd className="text-xs text-muted-foreground bg-muted border border-border rounded px-1.5 py-0.5">ESC</kbd>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {isLoading && query ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : query && data?.books?.length ? (
                <div className="p-2">
                  <p className="text-xs text-muted-foreground px-2 pb-2">Kitoblar</p>
                  {data.books.map((book) => (
                    <button
                      key={book.id}
                      onClick={() => handleSelect(book.id)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-accent transition-colors text-left"
                    >
                      <div className="w-10 h-12 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                        {book.coverUrl ? (
                          <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <BookOpen className="w-5 h-5 text-amber-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{book.title}</p>
                        <p className="text-xs text-muted-foreground">{formatPrice(book.price)}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : query ? (
                <div className="py-10 text-center">
                  <p className="text-muted-foreground text-sm">"{query}" bo'yicha hech narsa topilmadi</p>
                </div>
              ) : (
                <div className="p-4 space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <TrendingUp className="w-3.5 h-3.5" />
                      Mashhur qidiruvlar
                    </div>
                    {['Navoiy', 'O\'tkan kunlar', 'Cho\'lpon', 'Oydin'].map((term) => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-accent transition-colors text-left"
                      >
                        <Search className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-sm">{term}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-border px-4 py-2 flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-3">
                <span>↵ tanlash</span>
                <span>↑↓ harakatlanish</span>
              </div>
              <button
                onClick={() => setSearchOpen(false)}
                className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-accent hover:text-foreground transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Yopish
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  )
}
