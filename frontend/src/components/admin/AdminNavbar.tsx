import { Menu, Sun, Moon, Bell } from 'lucide-react'
import { useUIStore } from '@/stores/ui.store'
import { useAuthStore } from '@/stores/auth.store'
import { useTheme } from 'next-themes'
import { getInitials } from '@/lib/utils'

export function AdminNavbar() {
  const { toggleSidebar } = useUIStore()
  const { user } = useAuthStore()
  const { theme, setTheme } = useTheme()

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-xl flex items-center px-6 gap-4 sticky top-0 z-30">
      <button
        onClick={toggleSidebar}
        className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors lg:hidden"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex-1">
        <h1 className="text-sm font-semibold text-muted-foreground hidden sm:block">Boshqaruv paneli</h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <button className="relative w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500" />
        </button>

        <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xs font-bold">
          {getInitials(user?.name || 'A')}
        </div>
      </div>
    </header>
  )
}
