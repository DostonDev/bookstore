import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Twitter, Globe, Instagram, Linkedin, BookOpen, User } from 'lucide-react'
import { useAuthor } from '@/hooks/useAuthors'
import { BookCard, BookCardSkeleton } from '@/components/cards/BookCard'

export default function AuthorDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: author, isLoading } = useAuthor(slug!)

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 animate-pulse space-y-8">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-muted shrink-0" />
          <div className="space-y-3 flex-1">
            <div className="h-8 bg-muted rounded w-1/4" />
            <div className="h-4 bg-muted rounded w-2/3" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <BookCardSkeleton key={i} />)}
        </div>
      </div>
    )
  }

  if (!author) {
    return (
      <div className="container mx-auto py-20 text-center">
        <p className="text-muted-foreground">Muallif topilmadi</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12">
      {/* Author Profile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start gap-6 mb-12 p-6 rounded-2xl border border-border/50 bg-card"
      >
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-border/50 shrink-0">
          {author.avatarUrl ? (
            <img src={author.avatarUrl} alt={author.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User className="w-10 h-10 text-violet-400" />
            </div>
          )}
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-bold">{author.name}</h1>
          {author.bio && (
            <p className="text-muted-foreground mt-2 leading-relaxed">{author.bio}</p>
          )}

          <div className="flex items-center gap-4 mt-4">
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <BookOpen className="w-4 h-4" />
              {author._count?.books || 0} ta kitob
            </span>
            {author.twitter && (
              <a href={`https://twitter.com/${author.twitter}`} target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors">
                <Twitter className="w-4 h-4" />
                Twitter
              </a>
            )}
            {author.instagram && (
              <a href={`https://instagram.com/${author.instagram}`} target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 text-sm text-pink-400 hover:text-pink-300 transition-colors">
                <Instagram className="w-4 h-4" />
                Instagram
              </a>
            )}
            {author.linkedin && (
              <a href={author.linkedin} target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 text-sm text-blue-500 hover:text-blue-400 transition-colors">
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </a>
            )}
            {author.website && (
              <a href={author.website} target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Globe className="w-4 h-4" />
                Website
              </a>
            )}
          </div>
        </div>
      </motion.div>

      {/* Books */}
      <h2 className="text-xl font-semibold mb-6">Kitoblar</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {author.books?.map((book, i) => <BookCard key={book.id} book={book} index={i} />)}
      </div>

      {(!author.books || author.books.length === 0) && (
        <div className="text-center py-20 text-muted-foreground">
          Bu muallif hali kitob chiqarmagan
        </div>
      )}
    </div>
  )
}
