import { Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/20 mt-12 sm:mt-20">
      <div className="container mx-auto py-10 sm:py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group w-fit">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-sm">
                <BookOpen className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="font-bold text-lg">
                <span className="text-amber-500">Ellikqala</span>Books
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
              O'zbek va jahon adabiyotining eng yaxshi asarlarini bir joyda toping. O'qing, o'rganing va ruhlanib yashang.
            </p>
            <p className="text-muted-foreground text-xs mt-5 italic border-l-2 border-amber-500/40 pl-3">
              "Kitob o'qigan kishi hech qachon yolg'iz qolmaydi." — Alisher Navoiy
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
          <p className="text-xs text-muted-foreground">DastonDev tomonidan <span className="text-red-500">♥</span> bilan yaratildi</p>
        </div>
      </div>
    </footer>
  )
}
