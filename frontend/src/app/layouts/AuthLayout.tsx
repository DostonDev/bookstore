import { Outlet, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/stores/auth.store'
import { BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'

export function AuthLayout() {
  const { isAuthenticated } = useAuthStore()
  if (isAuthenticated) return <Navigate to="/" replace />

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-amber-950 via-slate-900 to-slate-950">
        <div className="absolute inset-0 bg-gradient-radial from-amber-600/20 via-transparent to-transparent" />
        <div className="absolute top-20 left-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-xl font-bold text-white">EllikqalaBooks</span>
          </Link>

          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold text-white leading-tight">
                So'z san'ati —<br />
                <span className="gradient-text">qalbning oynasi</span>
              </h2>
              <p className="mt-4 text-slate-400 text-lg leading-relaxed italic">
                "Kitob o'qigan kishi hech qachon yolg'iz qolmaydi." — Alisher Navoiy
              </p>
              <p className="mt-3 text-slate-400 leading-relaxed">
                O'zbek va jahon adabiyotining eng sara asarlarini bir joyda toping.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { label: '5,000+', desc: 'Adabiy asar' },
                { label: '30K+', desc: 'Kitobxon' },
                { label: '200K+', desc: 'Yuklanmalar' },
                { label: '4.9★', desc: 'O\'rtacha baho' },
              ].map((stat) => (
                <div key={stat.label} className="glass rounded-2xl p-4">
                  <div className="text-2xl font-bold text-white">{stat.label}</div>
                  <div className="text-sm text-slate-400">{stat.desc}</div>
                </div>
              ))}
            </motion.div>
          </div>

          <p className="text-slate-600 text-sm">© 2026 EllikqalaBooks. Barcha huquqlar himoyalangan.</p>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-xl font-bold">EllikqalaBooks</span>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
