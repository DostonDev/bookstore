import { motion } from 'framer-motion'
import { Users } from 'lucide-react'
import { useAuthors } from '@/hooks/useAuthors'
import { AuthorCard, AuthorCardSkeleton } from '@/components/cards/AuthorCard'

export default function AuthorsPage() {
  const { data, isLoading } = useAuthors()
  const authors = data?.data ?? []

  return (
    <div className="container mx-auto py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <div className="flex items-center gap-2 text-violet-400 text-sm font-medium mb-3">
          <Users className="w-4 h-4" />
          Mualliflar
        </div>
        <h1 className="text-3xl font-bold">Barcha Mualliflar</h1>
        <p className="text-muted-foreground mt-2">Sevimli muallifingizni toping</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading
          ? Array.from({ length: 9 }).map((_, i) => <AuthorCardSkeleton key={i} />)
          : authors.map((author, i) => <AuthorCard key={author.id} author={author} index={i} />)
        }
      </div>

      {!isLoading && authors.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          Hali mualliflar yo'q
        </div>
      )}
    </div>
  )
}
