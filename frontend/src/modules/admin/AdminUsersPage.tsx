import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Shield, User } from 'lucide-react'
import { useAllUsers } from '@/hooks/useUsers'
import { formatDate, getInitials, cn } from '@/lib/utils'
import { useDebounce } from '@/hooks/useDebounce'

export default function AdminUsersPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const debouncedSearch = useDebounce(search, 400)

  const { data, isLoading } = useAllUsers({ page, limit: 10, search: debouncedSearch || undefined })

  const users = data?.users || []
  const pagination = data?.pagination

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Foydalanuvchilar</h1>
          <p className="text-muted-foreground text-sm mt-1">Jami {pagination?.total || 0} ta foydalanuvchi</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          placeholder="Foydalanuvchi qidirish..."
          className="w-full bg-muted/30 border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
        />
      </div>

      <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {['Foydalanuvchi', 'Rol', 'Email', "Qo'shilgan", 'Yoqtirishlar', 'Yuklamalar'].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-muted-foreground px-4 py-3 first:pl-6">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 6 }).map((__, j) => (
                    <td key={j} className="px-4 py-4 first:pl-6"><div className="h-4 bg-muted rounded animate-pulse" /></td>
                  ))}</tr>
                ))
              ) : users.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-muted-foreground text-sm">Foydalanuvchi topilmadi</td></tr>
              ) : (
                users.map((user) => (
                  <motion.tr key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xs font-bold shrink-0">
                          {getInitials(user.name)}
                        </div>
                        <span className="text-sm font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={cn(
                        'flex items-center gap-1.5 text-xs font-medium w-fit px-2.5 py-1 rounded-full',
                        user.role === 'ADMIN' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-500/20 text-slate-400'
                      )}>
                        {user.role === 'ADMIN' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                        {user.role === 'ADMIN' ? 'Admin' : 'Kitobxon'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">{user.email}</td>
                    <td className="px-4 py-4 text-xs text-muted-foreground">{formatDate(user.createdAt)}</td>
                    <td className="px-4 py-4 text-sm">{user._count?.likes ?? 0}</td>
                    <td className="px-4 py-4 text-sm">{user._count?.downloads ?? 0}</td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 rounded-xl border border-border text-sm disabled:opacity-40 hover:bg-accent transition-colors">Oldingi</button>
          <span className="px-4 py-2 text-sm">{page} / {pagination.totalPages}</span>
          <button onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages} className="px-4 py-2 rounded-xl border border-border text-sm disabled:opacity-40 hover:bg-accent transition-colors">Keyingi</button>
        </div>
      )}
    </div>
  )
}
