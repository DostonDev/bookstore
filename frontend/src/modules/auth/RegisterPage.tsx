import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/stores/auth.store'
import { toast } from 'sonner'

const schema = z.object({
  name: z.string().min(2, 'Ism kamida 2 ta belgidan iborat bo\'lishi kerak'),
  email: z.string().email('Email manzil noto\'g\'ri'),
  password: z.string().min(6, 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Parollar mos kelmadi',
  path: ['confirmPassword'],
})

type FormData = z.infer<typeof schema>

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const { mutate, isPending } = useMutation({
    mutationFn: (d: { name: string; email: string; password: string }) => authService.register(d),
    onSuccess: (data) => {
      setAuth(data.user, data.token)
      toast.success(`Kitobxonaga xush kelibsiz, ${data.user.name}!`)
      navigate('/')
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message || 'Ro\'yxatdan o\'tishda xato')
    },
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold">Hisob yaratish</h1>
        <p className="text-muted-foreground mt-1 text-sm">Kitobxonaga qo'shiling va bugundan o'qishni boshlang</p>
      </div>

      <form
        onSubmit={handleSubmit((d) => mutate({ name: d.name, email: d.email, password: d.password }))}
        className="space-y-4"
      >
        <div>
          <label className="block text-sm font-medium mb-1.5">To'liq ism</label>
          <input
            {...register('name')}
            placeholder="Ism Familiya"
            className="w-full bg-muted/30 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all"
          />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Email</label>
          <input
            {...register('email')}
            type="email"
            placeholder="sizning@email.com"
            className="w-full bg-muted/30 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all"
          />
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Parol</label>
          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="w-full bg-muted/30 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Parolni tasdiqlang</label>
          <input
            {...register('confirmPassword')}
            type="password"
            placeholder="••••••••"
            className="w-full bg-muted/30 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all"
          />
          {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-60 text-white rounded-xl px-4 py-2.5 font-medium text-sm transition-colors"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : (
            <>Hisob yaratish <ArrowRight className="w-4 h-4" /></>
          )}
        </button>
      </form>

      <p className="text-xs text-muted-foreground text-center">
        Ro'yxatdan o'tish orqali siz{' '}
        <a href="#" className="text-amber-400 hover:underline">Foydalanish shartlari</a> va{' '}
        <a href="#" className="text-amber-400 hover:underline">Maxfiylik siyosati</a>ga rozilik bildirasiz.
      </p>

      <div className="text-center text-sm text-muted-foreground">
        Hisobingiz bormi?{' '}
        <Link to="/login" className="text-amber-400 hover:text-amber-300 font-medium">Kirish</Link>
      </div>
    </motion.div>
  )
}
