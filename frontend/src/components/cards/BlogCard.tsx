import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, User, Tag } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Blog } from '@/types'

interface Props {
  blog: Blog
  index?: number
}

export function BlogCard({ blog, index = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4 }}
    >
      <Link
        to={`/blog/${blog.slug}`}
        className="block rounded-2xl border border-border/50 bg-card overflow-hidden hover:border-border hover:shadow-card-hover transition-all duration-300 group"
      >
        {blog.featuredImage ? (
          <div className="aspect-[16/9] overflow-hidden">
            <img
              src={blog.featuredImage}
              alt={blog.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        ) : (
          <div className="aspect-[16/9] bg-gradient-to-br from-violet-500/10 to-blue-500/10 flex items-center justify-center">
            <Tag className="w-8 h-8 text-violet-400/30" />
          </div>
        )}
        <div className="p-5">
          {blog.category && (
            <span className="text-xs font-medium text-violet-400 mb-2 block">{blog.category.name}</span>
          )}
          <h3 className="font-semibold text-sm leading-snug group-hover:text-violet-400 transition-colors line-clamp-2">
            {blog.title}
          </h3>
          {blog.excerpt && (
            <p className="text-xs text-muted-foreground mt-2 line-clamp-3">{blog.excerpt}</p>
          )}
          <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
            {blog.author && (
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {blog.author.name}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {blog.readingTime} min read
            </span>
            <span className="ml-auto">{formatDate(blog.createdAt)}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export function BlogCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border/50 bg-card overflow-hidden animate-pulse">
      <div className="aspect-[16/9] bg-muted" />
      <div className="p-5 space-y-2">
        <div className="h-3 bg-muted rounded w-1/4" />
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-2/3" />
      </div>
    </div>
  )
}
