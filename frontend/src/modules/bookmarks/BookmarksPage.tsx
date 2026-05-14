import { motion } from 'framer-motion'
import { Bookmark } from 'lucide-react'
import { useBookmarks } from '@/hooks/useUsers'
import { BookCard, BookCardSkeleton } from '@/components/cards/BookCard'
import { Link } from 'react-router-dom'

export default function BookmarksPage() {
  const { data, isLoading } = useBookmarks()
  const books = data?.bookmarks || []

  return (
    <div className="container mx-auto py-10">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
            <Bookmark className="w-5 h-5 text-amber-400 fill-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Saqlangan kitoblar</h1>
            <p className="text-muted-foreground text-sm">{books.length} ta kitob saqlangan</p>
          </div>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {Array.from({ length: 8 }).map((_, i) => <BookCardSkeleton key={i} />)}
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <Bookmark className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Hali saqlangan kitob yo'q</h3>
          <p className="text-muted-foreground text-sm mb-6">Kitob kartasidagi bookmark tugmasini bosib saqlang</p>
          <Link to="/books" className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm transition-colors">
            Kitoblarni ko'rish
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {books.map((book, i) => (
            <BookCard key={book.id} book={{ ...book, isBookmarked: true }} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
