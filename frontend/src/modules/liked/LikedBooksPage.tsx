import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { useLikedBooks } from '@/hooks/useUsers'
import { BookCard, BookCardSkeleton } from '@/components/cards/BookCard'
import { Link } from 'react-router-dom'

export default function LikedBooksPage() {
  const { data, isLoading } = useLikedBooks()
  const books = data?.likes || []

  return (
    <div className="container mx-auto py-10">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center">
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Yoqtirilgan kitoblar</h1>
            <p className="text-muted-foreground text-sm">{books.length} ta kitob yoqtirilgan</p>
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
            <Heart className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Hali yoqtirilgan kitob yo'q</h3>
          <p className="text-muted-foreground text-sm mb-6">Kitob kartasidagi yurak tugmasini bosib yoqtiring</p>
          <Link to="/books" className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm transition-colors">
            Kitoblarni ko'rish
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {books.map((book, i) => (
            <BookCard key={book.id} book={{ ...book, isLiked: true }} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
