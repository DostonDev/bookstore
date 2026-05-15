import { Outlet } from 'react-router-dom'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminNavbar } from '@/components/admin/AdminNavbar'
import { useUIStore } from '@/stores/ui.store'
import { cn } from '@/lib/utils'

export function AdminLayout() {
  const { sidebarOpen } = useUIStore()

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      <div
        className={cn(
          'flex-1 flex flex-col min-w-0 transition-all duration-300',
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
        )}
      >
        <AdminNavbar />
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
