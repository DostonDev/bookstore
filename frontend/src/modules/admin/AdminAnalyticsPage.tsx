import { motion } from 'framer-motion'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar
} from 'recharts'
import { Users, BookOpen, Download, TrendingUp, DollarSign } from 'lucide-react'
import { useAdminStats } from '@/hooks/useAnalytics'
import { formatNumber, formatPrice } from '@/lib/utils'

const STAT_CARDS = [
  { key: 'totalUsers', label: 'Foydalanuvchilar', icon: Users, color: 'violet' },
  { key: 'totalBooks', label: 'Kitoblar', icon: BookOpen, color: 'blue' },
  { key: 'totalDownloads', label: 'Yuklab olishlar', icon: Download, color: 'amber' },
]

export default function AdminAnalyticsPage() {
  const { data, isLoading } = useAdminStats()

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 space-y-4 animate-pulse">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-muted rounded-2xl" />
          ))}
        </div>
        <div className="h-64 bg-muted rounded-2xl" />
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analitika</h1>
        <p className="text-muted-foreground mt-1">Loyiha statistikasi</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map(({ key, label, icon: Icon, color }, i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-border/50 bg-card p-5"
          >
            <div className={`w-10 h-10 rounded-xl bg-${color}-500/10 flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 text-${color}-400`} />
            </div>
            <p className="text-2xl font-bold">{formatNumber(data.stats[key as keyof typeof data.stats] as number)}</p>
            <p className="text-sm text-muted-foreground mt-1">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Revenue */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-border/50 bg-card p-5"
      >
        <div className="flex items-center gap-3 mb-1">
          <DollarSign className="w-5 h-5 text-emerald-400" />
          <h3 className="font-semibold">Daromad</h3>
        </div>
        <p className="text-3xl font-bold text-emerald-400">{formatPrice(data.stats.revenue)}</p>
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-border/50 bg-card p-5"
        >
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            Foydalanuvchilar o'sishi
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data.charts.userGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#71717a' }} />
              <YAxis tick={{ fontSize: 11, fill: '#71717a' }} />
              <Tooltip
                contentStyle={{ background: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                labelStyle={{ color: '#e4e4e7' }}
              />
              <Area type="monotone" dataKey="value" stroke="#f59e0b" fill="#f59e0b20" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-2xl border border-border/50 bg-card p-5"
        >
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Download className="w-4 h-4 text-amber-400" />
            Yuklab olishlar
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.charts.downloadGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#71717a' }} />
              <YAxis tick={{ fontSize: 11, fill: '#71717a' }} />
              <Tooltip
                contentStyle={{ background: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
              />
              <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Top Books */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl border border-border/50 bg-card p-5"
      >
        <h3 className="font-semibold mb-4">Top 10 Kitob</h3>
        <div className="space-y-3">
          {data.topBooks.map((book, i) => (
            <div key={book.id} className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground w-5 text-right">{i + 1}</span>
              <div className="w-8 h-10 bg-muted rounded overflow-hidden shrink-0">
                {book.coverUrl && <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{book.title}</p>
                <p className="text-xs text-muted-foreground">{book.author?.name}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-medium">{formatNumber(book.downloadCount)}</p>
                <p className="text-xs text-muted-foreground">yuklab olindi</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
