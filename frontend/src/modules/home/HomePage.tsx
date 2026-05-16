import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Download, Star, Users, TrendingUp, Sparkles, Grid3X3, Search, Feather } from 'lucide-react'
import { useNewBooks, usePopularBooks } from '@/hooks/useBooks'
import { useCategories } from '@/hooks/useCategories'
import { useAuthors } from '@/hooks/useAuthors'
import { BookCard, BookCardSkeleton } from '@/components/cards/BookCard'
import { CategoryCard, CategoryCardSkeleton } from '@/components/cards/CategoryCard'
import { AuthorCard, AuthorCardSkeleton } from '@/components/cards/AuthorCard'
import { TESTIMONIALS, STATS } from '@/constants'
import { useUIStore } from '@/stores/ui.store'

function HeroSection() {
  const { setSearchOpen } = useUIStore()

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-background to-background dark:from-amber-950/40" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-amber-600/8 rounded-full blur-3xl" />
      <div className="absolute top-20 right-0 w-64 h-64 bg-orange-600/8 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-600/8 rounded-full blur-3xl" />

      {/* Floating card */}
      <div className="absolute right-8 top-1/4 hidden xl:block">
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="w-48 glass-card rounded-2xl p-4 shadow-premium"
        >
          <div className="w-full h-28 bg-gradient-to-br from-amber-500/30 to-orange-500/20 rounded-xl mb-3 flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-amber-300" />
          </div>
          <p className="text-xs font-semibold text-foreground">O'tkan kunlar</p>
          <div className="flex items-center gap-1 mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
            ))}
          </div>
        </motion.div>
      </div>

      <div className="absolute left-8 bottom-1/4 hidden xl:block">
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="w-40 glass-card rounded-2xl p-3 shadow-premium"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Download className="w-3 h-3 text-emerald-400" />
            </div>
            <span className="text-xs text-muted-foreground">Yuklamalar</span>
          </div>
          <p className="text-xl font-bold text-foreground">200K+</p>
          <p className="text-xs text-emerald-400 mt-0.5">↑ Bu oy o'sdi</p>
        </motion.div>
      </div>

      <div className="container mx-auto relative z-10 py-12 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs sm:text-sm font-medium mb-5 sm:mb-6">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            O'zbek va jahon adabiyoti kutubxonasi
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-snug text-balance">
            So'z san'ati —
            <span className="gradient-text block pb-2">qalbning oynasi</span>
          </h1>

          <p className="mt-4 sm:mt-6 text-sm sm:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto italic">
            "Kitob o'qigan kishi hech qachon yolg'iz qolmaydi." — Alisher Navoiy
          </p>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-xl mx-auto">
            Minglab adabiy asarlarni kashf eting. O'qing, o'rganing va ruhlanib yashang.
          </p>

          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto px-5 py-3 rounded-2xl bg-muted/30 border border-border/50 hover:border-border text-muted-foreground hover:text-foreground transition-all text-sm"
            >
              <Search className="w-4 h-4 shrink-0" />
              <span>Asar qidirish...</span>
            </button>
            <Link
              to="/books"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-medium text-sm transition-colors"
            >
              Kutubxonaga kirish
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-10 sm:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="text-center"
              >
                <p className="text-xl sm:text-2xl font-bold gradient-text">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function SectionHeader({ color, icon: Icon, subtitle, title, href }: {
  color: string; icon: React.ElementType; subtitle: string; title: string; href: string
}) {
  return (
    <div className="flex items-center justify-between mb-6 sm:mb-8">
      <div>
        <div className={`flex items-center gap-2 text-${color}-400 text-sm font-medium mb-1.5`}>
          <Icon className="w-4 h-4" />
          {subtitle}
        </div>
        <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
      </div>
      <Link to={href} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors shrink-0">
        Barchasi <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  )
}

function FeaturedBooks() {
  const { data, isLoading } = useNewBooks(8)

  return (
    <section className="container mx-auto py-10 sm:py-16">
      <SectionHeader color="amber" icon={Feather} subtitle="Yangi qo'shilganlar" title="Yangi Asarlar" href="/books" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <BookCardSkeleton key={i} />)
          : data?.books?.map((book, i) => <BookCard key={book.id} book={book} index={i} />)
        }
      </div>
    </section>
  )
}

function PopularBooks() {
  const { data, isLoading } = usePopularBooks(8)

  return (
    <section className="container mx-auto py-10 sm:py-16 border-t border-border/50">
      <SectionHeader color="amber" icon={TrendingUp} subtitle="Ko'p o'qilganlar" title="Eng Mashhur Asarlar" href="/books?sort=popular" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <BookCardSkeleton key={i} />)
          : data?.books?.map((book, i) => <BookCard key={book.id} book={book} index={i} />)
        }
      </div>
    </section>
  )
}

function TestimonialsSection() {
  return (
    <section className="container mx-auto py-16 border-t border-border/50">
      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold">Kitobxonlarimiz fikri</h2>
        <p className="text-muted-foreground mt-2">Ming-minglab o'quvchilar allaqachon ularga qo'shildi</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((testimonial, i) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-border/50 bg-card p-6 hover:border-border transition-colors"
          >
            <div className="flex items-center gap-1 mb-4">
              {Array.from({ length: testimonial.rating }).map((_, i) => (
                <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4 italic">"{testimonial.content}"</p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xs font-bold">
                {testimonial.avatar}
              </div>
              <div>
                <p className="text-sm font-medium">{testimonial.name}</p>
                <p className="text-xs text-muted-foreground">{testimonial.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="container mx-auto py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative rounded-3xl bg-gradient-to-br from-amber-600/20 via-orange-600/10 to-yellow-600/20 border border-amber-500/20 p-12 text-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-radial from-amber-600/10 to-transparent" />
        <div className="relative z-10">
          <BookOpen className="w-12 h-12 text-amber-400/60 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">O'qishni bugun boshlang</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            EllikqalaBooksga qo'shiling va minglab adabiy asarlarga bepul kiring. Bilim — eng katta boylik.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-medium transition-colors"
          >
            Bepul ro'yxatdan o'tish
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    </section>
  )
}

function CategoriesSection() {
  const { data: categories, isLoading } = useCategories()
  const displayCats = categories?.slice(0, 6) ?? []

  return (
    <section className="container mx-auto py-10 sm:py-16 border-t border-border/50">
      <SectionHeader color="amber" icon={Grid3X3} subtitle="Yo'nalishlar" title="Janrlar bo'yicha" href="/categories" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <CategoryCardSkeleton key={i} />)
          : displayCats.map((cat, i) => <CategoryCard key={cat.id} category={cat} index={i} />)
        }
      </div>
    </section>
  )
}

function AuthorsSection() {
  const { data, isLoading } = useAuthors({ limit: '6' })
  const authors = data?.data?.slice(0, 6) ?? []

  return (
    <section className="container mx-auto py-10 sm:py-16 border-t border-border/50">
      <SectionHeader color="amber" icon={Users} subtitle="Ijodkorlar" title="Mashhur Mualliflar" href="/authors" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <AuthorCardSkeleton key={i} />)
          : authors.map((author, i) => <AuthorCard key={author.id} author={author} index={i} />)
        }
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <FeaturedBooks />
      <CategoriesSection />
      <PopularBooks />
      <AuthorsSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  )
}
