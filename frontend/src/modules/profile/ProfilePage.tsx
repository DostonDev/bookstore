import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Download, Bookmark, MessageSquare, Heart, Camera, Loader2, Lock, Eye, EyeOff } from 'lucide-react'
import { useProfile, useUploadAvatar, useChangePassword } from '@/hooks/useUsers'
import { useAuthStore } from '@/stores/auth.store'
import { formatDate, getInitials } from '@/lib/utils'
import { Link } from 'react-router-dom'
import { PageLoader } from '@/components/shared/LoadingScreen'
import { toast } from 'sonner'

const STAT_ITEMS = [
  { icon: Bookmark, label: 'Saqlangan', key: 'bookmarks', href: '/bookmarks', color: 'text-blue-400 bg-blue-500/10' },
  { icon: Download, label: 'Yuklamalar', key: 'downloads', href: '/downloads', color: 'text-emerald-400 bg-emerald-500/10' },
  { icon: MessageSquare, label: 'Izohlar', key: 'comments', href: '#', color: 'text-orange-400 bg-orange-500/10' },
  { icon: Heart, label: 'Yoqtirilgan', key: 'likes', href: '/liked', color: 'text-red-400 bg-red-500/10' },
]

export default function ProfilePage() {
  const { user: authUser } = useAuthStore()
  const { data, isLoading } = useProfile()
  const { mutate: uploadAvatar, isPending } = useUploadAvatar()
  const changePassword = useChangePassword()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)

  if (isLoading) return <PageLoader />

  const user = data?.user || authUser

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Rasm hajmi 5MB dan oshmasligi kerak')
      return
    }
    uploadAvatar(file, {
      onSuccess: () => toast.success('Avatar yangilandi'),
      onError: () => toast.error('Xatolik yuz berdi'),
    })
    e.target.value = ''
  }

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      toast.error('Yangi parollar mos kelmaydi')
      return
    }
    changePassword.mutate(
      { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword },
      {
        onSuccess: () => {
          toast.success("Parol muvaffaqiyatli o'zgartirildi")
          setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
        },
        onError: (err: unknown) => {
          const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
          toast.error(msg || "Parolni o'zgartirishda xato")
        },
      }
    )
  }

  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        {/* Profile header */}
        <div className="rounded-2xl border border-border/50 bg-card p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-amber-500/30 to-orange-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 text-2xl font-bold shrink-0">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  getInitials(user?.name || 'U')
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isPending}
                className="absolute inset-0 rounded-2xl bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                {isPending ? (
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                ) : (
                  <Camera className="w-5 h-5 text-white" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold">{user?.name}</h1>
              <p className="text-muted-foreground">{user?.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                  user?.role === 'ADMIN' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-500/20 text-slate-400'
                }`}>
                  {user?.role === 'ADMIN' ? 'Admin' : 'Kitobxon'}
                </span>
                {user?.createdAt && (
                  <span className="text-xs text-muted-foreground">
                    A'zo bo'lgan: {formatDate(user.createdAt)}
                  </span>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isPending}
                className="mt-3 text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
              >
                <Camera className="w-3 h-3" />
                {isPending ? 'Yuklanmoqda...' : "Rasmni o'zgartirish"}
              </button>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {STAT_ITEMS.map(({ icon: Icon, label, key, href, color }) => (
            <Link key={key} to={href}>
              <motion.div
                whileHover={{ y: -2 }}
                className="rounded-2xl border border-border/50 bg-card p-4 text-center hover:border-border transition-colors cursor-pointer"
              >
                <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mx-auto mb-2`}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-2xl font-bold">{data?.user?._count?.[key as keyof typeof data.user._count] ?? 0}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Change password */}
        <div className="rounded-2xl border border-border/50 bg-card p-6 mb-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Lock className="w-4 h-4 text-amber-400" />
            </div>
            <h2 className="font-semibold">Parolni o'zgartirish</h2>
          </div>
          <form onSubmit={handleChangePassword} className="space-y-3 max-w-md">
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                placeholder="Eski parol"
                value={pwForm.currentPassword}
                onChange={e => setPwForm(f => ({ ...f, currentPassword: e.target.value }))}
                required
                className="w-full bg-muted/30 border border-border rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
              <button type="button" onClick={() => setShowCurrent(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                placeholder="Yangi parol (kamida 6 ta belgi)"
                value={pwForm.newPassword}
                onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))}
                required
                className="w-full bg-muted/30 border border-border rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
              <button type="button" onClick={() => setShowNew(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <input
              type="password"
              placeholder="Yangi parolni tasdiqlang"
              value={pwForm.confirmPassword}
              onChange={e => setPwForm(f => ({ ...f, confirmPassword: e.target.value }))}
              required
              className="w-full bg-muted/30 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            />
            <button
              type="submit"
              disabled={changePassword.isPending}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium disabled:opacity-60 transition-colors"
            >
              {changePassword.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              Parolni o'zgartirish
            </button>
          </form>
        </div>

        {/* Quick actions */}
        <div className="rounded-2xl border border-border/50 bg-card p-6">
          <h2 className="font-semibold mb-4">Tezkor havolalar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: Bookmark, label: 'Saqlangan', desc: "Saqlab qo'yilgan kitoblar", href: '/bookmarks', color: 'blue' },
              { icon: Download, label: 'Yuklamalar', desc: 'Yuklash tarixi', href: '/downloads', color: 'emerald' },
              { icon: BookOpen, label: 'Kitoblar', desc: 'Yangi asarlarni kashf eting', href: '/books', color: 'orange' },
            ].map(({ icon: Icon, label, desc, href, color }) => (
              <Link key={href} to={href}>
                <div className="flex items-center gap-4 p-4 rounded-xl border border-border/50 hover:border-border hover:bg-accent/50 transition-colors">
                  <div className={`w-10 h-10 rounded-xl bg-${color}-500/10 border border-${color}-500/20 flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 text-${color}-400`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
