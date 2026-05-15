import { motion } from 'framer-motion'
import {
  Users, BookOpen, Download, TrendingUp, TrendingDown,
  ArrowRight, Activity,
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useBooks } from '@/hooks/useBooks'
import { useAllUsers } from '@/hooks/useUsers'
import { formatNumber, cn } from '@/lib/utils'
import { Link } from 'react-router-dom'
import { useTheme } from 'next-themes'

const downloadsData = [
  { month: 'Yan', downloads: 400, revenue: 2400 },
  { month: 'Fev', downloads: 300, revenue: 1800 },
  { month: 'Mar', downloads: 600, revenue: 3600 },
  { month: 'Apr', downloads: 800, revenue: 4800 },
  { month: 'May', downloads: 500, revenue: 3000 },
  { month: 'Iyn', downloads: 900, revenue: 5400 },
  { month: 'Iyl', downloads: 1100, revenue: 6600 },
]


function StatCard({ icon: Icon, label, value, change, color }: {
  icon: React.FC<{ className?: string }>
  label: string
  value: string
  change?: number
  color: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="rounded-2xl border border-border/50 bg-card p-6 hover:border-border transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
        {change !== undefined && (
          <div className={cn(
            'flex items-center gap-1 text-xs font-medium',
            change >= 0 ? 'text-emerald-400' : 'text-red-400'
          )}>
            {change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-muted-foreground mt-1">{label}</p>
    </motion.div>
  )
}

export default function AdminDashboardPage() {
  const { data: booksData } = useBooks({ limit: 5 })
  const { data: usersData } = useAllUsers({ limit: 5 })
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)'
  const tickColor = isDark ? '#a1a1aa' : '#71717a'

  const totalBooks = booksData?.pagination?.total || 0
  const totalUsers = usersData?.pagination?.total || 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Boshqaruv paneli</h1>
        <p className="text-muted-foreground text-sm mt-1">Platforma umumiy ko'rinishi</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={Users} label="Jami foydalanuvchilar" value={formatNumber(totalUsers)} change={12} color="bg-amber-500/10 text-amber-400" />
        <StatCard icon={BookOpen} label="Jami kitoblar" value={formatNumber(totalBooks)} change={8} color="bg-blue-500/10 text-blue-400" />
        <StatCard icon={Download} label="Yuklamalar" value="—" change={18} color="bg-emerald-500/10 text-emerald-400" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6">
        <div className="rounded-2xl border border-border/50 bg-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold">Yuklamalar va daromad</h3>
              <p className="text-xs text-muted-foreground">Oxirgi 7 oy</p>
            </div>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={downloadsData}>
              <defs>
                <linearGradient id="downloadGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
                </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: tickColor }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: tickColor }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                itemStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Area type="monotone" dataKey="downloads" stroke="#f59e0b" strokeWidth={2} fill="url(#downloadGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent data */}
      <div className="grid grid-cols-1 gap-6">
        <div className="rounded-2xl border border-border/50 bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Yangi foydalanuvchilar</h3>
            <Link to="/admin/users" className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1">
              Barchasini ko'rish <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {usersData?.users?.slice(0, 5).map((user) => (
              <div key={user.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xs font-bold shrink-0">
                  {user.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <span className={cn(
                  'text-xs font-medium px-2 py-0.5 rounded-full',
                  user.role === 'ADMIN' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-500/20 text-slate-400'
                )}>
                  {user.role === 'ADMIN' ? 'Admin' : 'Kitobxon'}
                </span>
              </div>
            ))}
            {!usersData?.users?.length && (
              <p className="text-sm text-muted-foreground text-center py-4">Hali foydalanuvchi yo'q</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
