import { Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background/50 mt-12 sm:mt-20">
      <div className="container mx-auto py-8 sm:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div className="col-span-2 md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-amber-400" />
              </div>
              <span className="font-bold text-lg">EllikqalaBooks</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
              O'zbek va jahon adabiyotining eng yaxshi asarlarini bir joyda toping. O'qing, o'rganing va ruhlanib yashang.
            </p>
            <p className="text-muted-foreground text-xs mt-4 italic">
              "Kitob — eng yaxshi do'st." — Alisher Navoiy
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4">Kutubxona</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[
                { label: 'Kitoblar', href: '/books' },
                { label: 'Saqlangan', href: '/bookmarks' },
                { label: 'Yuklamalar', href: '/downloads' },
              ].map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4">Sayt haqida</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[
                { label: 'Biz haqimizda', href: '#' },
                { label: 'Blog', href: '/blog' },
                { label: 'Mualliflar', href: '/authors' },
                { label: 'Maxfiylik', href: '#' },
                { label: 'Shartlar', href: '#' },
              ].map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="hover:text-foreground transition-colors">{item.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 mt-8 sm:mt-12 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">© 2026 EllikqalaBooks. Barcha huquqlar himoyalangan.</p>
          <p className="text-xs text-muted-foreground">DastonDev tomonidan ♥ bilan yaratildi</p>
        </div>
      </div>
    </footer>
  )
}
