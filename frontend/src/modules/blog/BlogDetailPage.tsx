import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, User, ArrowLeft, Tag } from 'lucide-react'
import { useBlog } from '@/hooks/useBlogs'
import { formatDate } from '@/lib/utils'

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: blog, isLoading } = useBlog(slug!)

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 max-w-3xl animate-pulse space-y-6">
        <div className="h-64 bg-muted rounded-2xl" />
        <div className="h-8 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-1/2" />
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-4 bg-muted rounded w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="container mx-auto py-20 text-center">
        <p className="text-muted-foreground">Blog topilmadi</p>
        <Link to="/blog" className="text-violet-400 hover:text-violet-300 mt-4 inline-block">
          Barcha maqolalar
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Orqaga
        </Link>

        {blog.featuredImage && (
          <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-8">
            <img src={blog.featuredImage} alt={blog.title} className="w-full h-full object-cover" />
          </div>
        )}

        {blog.category && (
          <span className="text-sm font-medium text-violet-400 mb-3 block">{blog.category.name}</span>
        )}

        <h1 className="text-3xl font-bold leading-tight mb-4">{blog.title}</h1>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b border-border/50">
          {blog.author && (
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              {blog.author.name}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {blog.readingTime} min read
          </span>
          <span>{formatDate(blog.createdAt)}</span>
        </div>

        <div
          className="prose prose-invert prose-violet max-w-none leading-relaxed text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br/>') }}
        />

        {blog.tags && blog.tags.length > 0 && (
          <div className="flex items-center gap-2 mt-10 pt-8 border-t border-border/50 flex-wrap">
            <Tag className="w-4 h-4 text-muted-foreground" />
            {blog.tags.map((tag) => (
              <span key={tag.id} className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground">
                #{tag.name}
              </span>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
