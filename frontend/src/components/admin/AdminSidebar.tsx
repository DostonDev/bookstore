import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, BookOpen, Users, BarChart3,
  ChevronLeft, ChevronRight, LogOut, Home, Grid3X3, User,
  Newspaper, TrendingUp,
} from 'lucide-react'
import { useUIStore } from '@/stores/ui.store'
import { useAuthStore } from '@/stores/auth.store'
import { cn } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Boshqaruv', href: '/admin' },
  { icon: BookOpen, label: 'Kitoblar', href: '/admin/books' },
  { icon: Grid3X3, label: 'Kategoriyalar', href: '/admin/categories' },
  { icon: User, label: 'Mualliflar', href: '/admin/authors' },
  { icon: Newspaper, label: 'Blog', href: '/admin/blogs' },
  { icon: Users, label: 'Foydalanuvchilar', href: '/admin/users' },
  { icon: TrendingUp, label: 'Analitika', href: '/admin/analytics' },
]

export function AdminSidebar() {
  const { sidebarOpen, toggleSidebar } = useUIStore()
  const { logout } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      <motion.aside
        animate={{ width: sidebarOpen ? 256 : 80 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={cn(
          'fixed left-0 top-0 h-full z-40 border-r border-border bg-card flex flex-col',
          !sidebarOpen && 'lg:flex hidden'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-border shrink-0">
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-2"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <span className="font-bold text-sm">EllikqalaBooks Admin</span>
              </motion.div>
            )}
          </AnimatePresence>
          {!sidebarOpen && (
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className={cn(
              'w-7 h-7 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors',
              !sidebarOpen && 'hidden lg:flex mx-auto'
            )}
          >
            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
          {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
            const isActive = location.pathname === href
            return (
              <Link key={href} to={href}>
                <motion.div
                  whileHover={{ x: 2 }}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors',
                    isActive
                      ? 'bg-amber-500/15 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/25 dark:border-amber-500/20 font-semibold'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  )}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <AnimatePresence>
                    {sidebarOpen && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className="text-sm font-medium overflow-hidden whitespace-nowrap"
                      >
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-border space-y-2">
          <Link to="/">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
              <Home className="w-5 h-5 shrink-0" />
              {sidebarOpen && <span className="text-sm font-medium">Saytga qaytish</span>}
            </div>
          </Link>
          <button onClick={handleLogout} className="w-full">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-400/10 transition-colors">
              <LogOut className="w-5 h-5 shrink-0" />
              {sidebarOpen && <span className="text-sm font-medium">Chiqish</span>}
            </div>
          </button>
        </div>
      </motion.aside>
    </>
  )
}
