import { useState, useCallback, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Document, Page, pdfjs } from 'react-pdf'
import {
  ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2,
  Minimize2, BookOpen, ArrowLeft, Loader2, BookMarked
} from 'lucide-react'
import { useReadUrl, useUpdateProgress } from '@/hooks/useReader'
import { useAuthStore } from '@/stores/auth.store'
import { cn } from '@/lib/utils'

import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

export default function PDFReaderPage() {
  const { bookId } = useParams<{ bookId: string }>()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()

  const [numPages, setNumPages] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [scale, setScale] = useState(1.0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [pdfBlob, setPdfBlob] = useState<string | null>(null)
  const [blobLoading, setBlobLoading] = useState(false)
  const controlsTimer = useRef<ReturnType<typeof setTimeout>>()
  const startTimeRef = useRef(Date.now())
  const currentPageRef = useRef(1)
  const numPagesRef = useRef(0)
  const blobUrlRef = useRef<string | null>(null)

  const { data, isLoading, error } = useReadUrl(bookId!)
  const updateProgress = useUpdateProgress()
  const updateProgressRef = useRef(updateProgress)
  updateProgressRef.current = updateProgress

  useEffect(() => {
    if (!isAuthenticated) navigate('/login')
  }, [isAuthenticated, navigate])

  useEffect(() => {
    if (data?.progress) {
      setCurrentPage(data.progress.currentPage)
      currentPageRef.current = data.progress.currentPage
    }
  }, [data?.progress?.currentPage])

  useEffect(() => {
    if (!data?.url) return
    setBlobLoading(true)
    let blobUrl: string
    fetch(data.url)
      .then(res => res.blob())
      .then(blob => {
        blobUrl = URL.createObjectURL(blob)
        blobUrlRef.current = blobUrl
        setPdfBlob(blobUrl)
        setBlobLoading(false)
      })
      .catch(() => setBlobLoading(false))
    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl)
    }
  }, [data?.url])

  useEffect(() => {
    const saveProgress = () => {
      if (!bookId || !numPagesRef.current) return
      const readingTime = Math.floor((Date.now() - startTimeRef.current) / 60000)
      updateProgressRef.current.mutate({
        bookId,
        currentPage: currentPageRef.current,
        totalPages: numPagesRef.current,
        readingTime,
      })
    }
    const interval = setInterval(saveProgress, 30000)
    return () => clearInterval(interval)
  }, [bookId])

  const handleMouseMove = useCallback(() => {
    setShowControls(true)
    clearTimeout(controlsTimer.current)
    controlsTimer.current = setTimeout(() => setShowControls(false), 3000)
  }, [])

  const onDocumentLoad = ({ numPages: n }: { numPages: number }) => {
    setNumPages(n)
    numPagesRef.current = n
  }

  const goToPage = (page: number) => {
    const p = Math.max(1, Math.min(page, numPages))
    setCurrentPage(p)
    currentPageRef.current = p
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const progress = numPages > 0 ? Math.round((currentPage / numPages) * 100) : 0

  if (isLoading || blobLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-violet-400 mx-auto mb-3" />
          <p className="text-zinc-400">PDF yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  if (error || !pdfBlob) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">PDF ochilmadi</h2>
          <p className="text-muted-foreground mb-6">
            {error ? 'Bu kitobni o\'qish uchun avval sotib olishingiz kerak.' : 'Xato yuz berdi.'}
          </p>
          <Link
            to={`/books/${bookId}`}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kitob sahifasiga qaytish
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn('min-h-screen bg-zinc-950 flex flex-col', isFullscreen && 'fixed inset-0 z-50')}
      onMouseMove={handleMouseMove}
      onTouchStart={handleMouseMove}
    >
      {/* Top Bar */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-3 sm:px-4 py-2.5 bg-zinc-900/95 backdrop-blur border-b border-white/5"
          >
            <Link to={`/books/${bookId}`}
              className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors shrink-0">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Orqaga</span>
            </Link>

            <div className="flex items-center gap-1.5 text-sm text-zinc-400">
              <span className="font-medium text-white">{currentPage}</span>
              <span className="text-zinc-600">/</span>
              <span>{numPages}</span>
              <span className="ml-1 text-xs bg-violet-600/20 text-violet-400 px-2 py-0.5 rounded-full">
                {progress}%
              </span>
            </div>

            <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
              <button onClick={() => setScale(s => Math.max(0.5, s - 0.25))}
                className="p-2 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors">
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs text-zinc-500 hidden sm:block w-9 text-center">{Math.round(scale * 100)}%</span>
              <button onClick={() => setScale(s => Math.min(3, s + 0.25))}
                className="p-2 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors">
                <ZoomIn className="w-4 h-4" />
              </button>
              <button onClick={toggleFullscreen}
                className="p-2 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors hidden sm:flex">
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PDF Viewer */}
      <div className="flex-1 flex items-start justify-center overflow-auto pt-14 sm:pt-16 pb-16 sm:pb-20 px-2 sm:px-4">
        <Document
          file={pdfBlob}
          onLoadSuccess={onDocumentLoad}
          loading={
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-violet-400" />
            </div>
          }
        >
          <motion.div
            key={currentPage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Page
              pageNumber={currentPage}
              scale={scale}
              className="shadow-2xl"
              renderAnnotationLayer={false}
              renderTextLayer={false}
            />
          </motion.div>
        </Document>
      </div>

      {/* Progress bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30">
        <div className="h-0.5 bg-zinc-800">
          <motion.div
            className="h-full bg-violet-500"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Bottom Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 bg-zinc-900/95 backdrop-blur rounded-2xl border border-white/10 shadow-2xl"
          >
            <button
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
              className="p-1 text-zinc-400 hover:text-white disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <ChevronLeft className="w-4 h-4 -ml-3" />
            </button>
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={currentPage}
                onChange={(e) => goToPage(Number(e.target.value))}
                min={1}
                max={numPages}
                className="w-12 text-center text-sm bg-white/5 border border-white/10 rounded-lg py-1 text-white focus:outline-none focus:border-violet-500"
              />
              <span className="text-zinc-500 text-sm">/ {numPages}</span>
            </div>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === numPages}
              className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => goToPage(numPages)}
              disabled={currentPage === numPages}
              className="p-1 text-zinc-400 hover:text-white disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
              <ChevronRight className="w-4 h-4 -ml-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
