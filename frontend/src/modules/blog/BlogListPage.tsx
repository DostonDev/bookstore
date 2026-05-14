import { useState } from 'react'
import { motion } from 'framer-motion'
import { Newspaper } from 'lucide-react'
import { useBlogs } from '@/hooks/useBlogs'
import { BlogCard, BlogCardSkeleton } from '@/components/cards/BlogCard'

export default function BlogListPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useBlogs({ page, limit: 12 })
  const blogs = data?.data ?? []
  const meta = data?.meta

  return (
    <div className="container mx-auto py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <div className="flex items-center gap-2 text-violet-400 text-sm font-medium mb-3">
          <Newspaper className="w-4 h-4" />
          Blog
        </div>
        <h1 className="text-3xl font-bold">Maqolalar</h1>
        <p className="text-muted-foreground mt-2">Yangiliklar, qo'llanmalar va maslahatlar</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <BlogCardSkeleton key={i} />)
          : blogs.map((blog, i) => <BlogCard key={blog.id} blog={blog} index={i} />)
        }
      </div>

      {!isLoading && blogs.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          Hali maqolalar yo'q
        </div>
      )}

      {meta && meta.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                page === p
                  ? 'bg-violet-600 text-white'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
