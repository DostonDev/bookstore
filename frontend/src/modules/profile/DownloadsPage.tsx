import { motion } from 'framer-motion'
import { Download, BookOpen } from 'lucide-react'
import { useDownloads } from '@/hooks/useUsers'
import { formatDate } from '@/lib/utils'
import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function DownloadsPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useDownloads({ page, limit: 10 })
  const downloads = data?.downloads || []
  const pagination = data?.pagination

  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
            <Download className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Yuklash tarixi</h1>
            <p className="text-muted-foreground text-sm">Jami {pagination?.total || 0} ta yuklama</p>
          </div>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : downloads.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <Download className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Hali yuklama yo'q</h3>
          <p className="text-muted-foreground text-sm mb-6">Kitoblarni yuklab olish tarixingiz shu yerda ko'rinadi</p>
          <Link to="/books" className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm transition-colors">
            Kitoblarni ko'rish
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {downloads.map((dl, i) => (
            <motion.div
              key={dl.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-card hover:border-border transition-colors"
            >
              <div className="w-10 h-14 rounded-lg bg-gradient-to-br from-emerald-500/20 to-amber-500/20 shrink-0 overflow-hidden flex items-center justify-center">
                {dl.book?.coverUrl ? (
                  <img src={dl.book.coverUrl} alt={dl.book.title} className="w-full h-full object-cover" />
                ) : (
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Link to={`/books/${dl.bookId}`} className="text-sm font-medium hover:text-amber-400 transition-colors truncate block">
                  {dl.book?.title || 'Noma\'lum kitob'}
                </Link>
                <p className="text-xs text-muted-foreground">{formatDate(dl.createdAt)}</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            </motion.div>
          ))}
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 rounded-xl border border-border text-sm disabled:opacity-40 hover:bg-accent transition-colors">Oldingi</button>
          <span className="px-4 py-2 text-sm">{page} / {pagination.totalPages}</span>
          <button onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages} className="px-4 py-2 rounded-xl border border-border text-sm disabled:opacity-40 hover:bg-accent transition-colors">Keyingi</button>
        </div>
      )}
    </div>
  )
}
