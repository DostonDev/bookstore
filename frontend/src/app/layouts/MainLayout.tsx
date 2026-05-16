import { Outlet } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { SearchModal } from '@/components/shared/SearchModal'
import { TopLoader } from '@/components/shared/TopLoader'

const MARQUEE_TEXT = '🚧 Bu sayt hozircha sinov (test) rejimida ishlayabdi — ba\'zi funksiyalar to\'liq ishlamasligi mumkin'

function TestModeBanner() {
  const content = Array(6).fill(MARQUEE_TEXT).join('   ·   ')
  return (
    <div className="bg-amber-500/10 border-b border-amber-500/20 overflow-hidden py-1.5 select-none">
      <div className="animate-marquee flex whitespace-nowrap w-max">
        <span className="text-xs text-amber-400 font-medium px-6">{content}</span>
        <span className="text-xs text-amber-400 font-medium px-6" aria-hidden>{content}</span>
      </div>
    </div>
  )
}

export function MainLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopLoader />
      <TestModeBanner />
      <Navbar />
      <SearchModal />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}
