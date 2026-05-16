import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, User, LogOut,
  Bookmark, LayoutDashboard, Menu, X, Sun, Moon,
  Grid3X3, Users, Newspaper, Heart,
} from 'lucide-react'
import { useAuthStore } from '@/stores/auth.store'
import { useTheme } from 'next-themes'
import { cn, getInitials } from '@/lib/utils'
import { useState } from 'react'

const NAV_LINKS = [
  { label: 'Kitoblar', href: '/books', icon: BookOpen },
  { label: 'Kategoriyalar', href: '/categories', icon: Grid3X3 },
  { label: 'Mualliflar', href: '/authors', icon: Users },
  { label: 'Blog', href: '/blog', icon: Newspaper },
]

const AUTH_LINKS = [
  { label: 'Yoqtirilgan', href: '/liked', icon: Heart },
  { label: 'Saqlangan', href: '/bookmarks', icon: Bookmark },
]

export function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuthStore()
  const { theme, setTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const closeAll = () => { setMenuOpen(false); setDropdownOpen(false) }

  const handleLogout = () => {
    logout()
    navigate('/')
    closeAll()
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto flex h-14 sm:h-16 items-center gap-2 sm:gap-4">
          {/* Logo */}
          <Link to="/" onClick={closeAll} className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            </div>
            <span className="font-bold text-base hidden sm:block">EllikqalaBooks</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5 ml-2">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} to={link.href}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  location.pathname.startsWith(link.href)
                    ? 'text-foreground bg-accent'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                )}>
                {link.label}
              </Link>
            ))}
            {isAuthenticated && AUTH_LINKS.map((link) => (
              <Link key={link.href} to={link.href}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  location.pathname === link.href
                    ? 'text-foreground bg-accent'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                )}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex-1" />

          <div className="flex items-center gap-1 sm:gap-2">
            {/* Theme */}
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* User dropdown (desktop only) */}
            {isAuthenticated ? (
              <div className="relative hidden sm:block">
                <button onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xs sm:text-sm font-bold hover:bg-amber-500/30 transition-colors">
                  {getInitials(user?.name || 'U')}
                </button>
                <AnimatePresence>
                  {dropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-11 z-20 w-52 rounded-xl border border-border bg-card shadow-xl p-1">
                        <div className="px-3 py-2 mb-1">
                          <p className="text-sm font-medium truncate">{user?.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                        </div>
                        <div className="h-px bg-border mb-1" />
                        {isAdmin && (
                          <Link to="/admin" onClick={closeAll}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-accent transition-colors">
                            <LayoutDashboard className="w-4 h-4 shrink-0" /> Admin Panel
                          </Link>
                        )}
                        <Link to="/profile" onClick={closeAll}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-accent transition-colors">
                          <User className="w-4 h-4 shrink-0" /> Profil
                        </Link>
                        <Link to="/liked" onClick={closeAll}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-accent transition-colors">
                          <Heart className="w-4 h-4 shrink-0" /> Yoqtirilgan
                        </Link>
                        <Link to="/bookmarks" onClick={closeAll}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-accent transition-colors">
                          <Bookmark className="w-4 h-4 shrink-0" /> Saqlangan
                        </Link>
                        <div className="h-px bg-border my-1" />
                        <button onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-400/10 transition-colors">
                          <LogOut className="w-4 h-4 shrink-0" /> Chiqish
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login"
                  className="px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Kirish
                </Link>
                <Link to="/register"
                  className="px-3 py-1.5 rounded-lg text-sm font-medium bg-amber-600 hover:bg-amber-500 text-white transition-colors">
                  Ro'yxat
                </Link>
              </div>
            )}

            {/* Hamburger */}
            <button
              className="lg:hidden w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-border/50 lg:hidden overflow-hidden">
              <div className="container mx-auto py-2 pb-3 flex flex-col gap-0.5">
                {NAV_LINKS.map(({ href, label, icon: Icon }) => (
                  <Link key={href} to={href} onClick={closeAll}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                      location.pathname.startsWith(href)
                        ? 'text-foreground bg-accent'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                    )}>
                    <Icon className="w-4 h-4 shrink-0" />{label}
                  </Link>
                ))}

                {isAuthenticated ? (
                  <>
                    <div className="h-px bg-border/50 my-1.5" />
                    {AUTH_LINKS.map(({ href, label, icon: Icon }) => (
                      <Link key={href} to={href} onClick={closeAll}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors">
                        <Icon className="w-4 h-4 shrink-0" />{label}
                      </Link>
                    ))}
                    <div className="h-px bg-border/50 my-1.5" />
                    <div className="flex items-center gap-3 px-3 py-2">
                      <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 text-sm font-bold shrink-0">
                        {getInitials(user?.name || 'U')}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{user?.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                      </div>
                    </div>
                    {isAdmin && (
                      <Link to="/admin" onClick={closeAll}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors">
                        <LayoutDashboard className="w-4 h-4 shrink-0" /> Admin Panel
                      </Link>
                    )}
                    <button onClick={handleLogout}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-400/10 transition-colors w-full">
                      <LogOut className="w-4 h-4 shrink-0" /> Chiqish
                    </button>
                  </>
                ) : (
                  <>
                    <div className="h-px bg-border/50 my-1.5" />
                    <div className="flex gap-2 pb-1">
                      <Link to="/login" onClick={closeAll}
                        className="flex-1 text-center py-2.5 rounded-xl border border-border/50 text-sm font-medium hover:bg-accent transition-colors">
                        Kirish
                      </Link>
                      <Link to="/register" onClick={closeAll}
                        className="flex-1 text-center py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium transition-colors">
                        Ro'yxatdan o'tish
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}
