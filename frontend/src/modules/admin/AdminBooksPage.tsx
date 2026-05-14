import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Edit, Trash2, BookOpen, X, Loader2, Upload, ImageIcon, FileText, Star, Heart } from 'lucide-react'
import { useBooks, useCreateBook, useDeleteBook, useUpdateBook } from '@/hooks/useBooks'
import { useCategories } from '@/hooks/useCategories'
import { useAuthors } from '@/hooks/useAuthors'
import { formatPrice, formatNumber, formatDate, truncate } from '@/lib/utils'
import { useDebounce } from '@/hooks/useDebounce'
import type { Book } from '@/types'

function BookFormModal({ book, onClose }: { book?: Book; onClose: () => void }) {
  const [title, setTitle] = useState(book?.title || '')
  const [description, setDescription] = useState(book?.description || '')
  const [price, setPrice] = useState(book?.price?.toString() || '0')
  const [categoryName, setCategoryName] = useState(book?.category?.name || '')
  const [authorName, setAuthorName] = useState(book?.author?.name || '')
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(book?.coverUrl || null)
  const pdfRef = useRef<HTMLInputElement>(null)
  const coverRef = useRef<HTMLInputElement>(null)

  const createBook = useCreateBook()
  const updateBook = useUpdateBook(book?.id || '')
  const { data: categoriesData = [] } = useCategories()
  const { data: authorsData } = useAuthors({ limit: 100 })
  const authors: { id: string; name: string }[] =
    ((authorsData as { data?: { id: string; name: string }[] })?.data) || []
  const isLoading = createBook.isPending || updateBook.isPending

  // flat category list (root + children)
  const allCategories: { id: string; name: string }[] = []
  for (const c of categoriesData) {
    allCategories.push({ id: c.id, name: c.name })
    if (c.children) {
      for (const child of c.children) {
        allCategories.push({ id: child.id, name: `${c.name} › ${child.name}` })
      }
    }
  }

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCoverFile(file)
      setCoverPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('price', price)
    const matchedCategory = allCategories.find(c => c.name.toLowerCase() === categoryName.toLowerCase())
    if (matchedCategory) formData.append('categoryId', matchedCategory.id)
    const matchedAuthor = authors.find(a => a.name.toLowerCase() === authorName.toLowerCase())
    if (matchedAuthor) formData.append('authorId', matchedAuthor.id)
    if (pdfFile) formData.append('pdf', pdfFile)
    if (coverFile) formData.append('cover', coverFile)
    if (book) updateBook.mutate(formData, { onSuccess: onClose })
    else createBook.mutate(formData, { onSuccess: onClose })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-bold">{book ? 'Kitobni tahrirlash' : 'Yangi kitob qo\'shish'}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-accent transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Muqova rasmi</label>
              <div
                onClick={() => coverRef.current?.click()}
                className="aspect-[3/4] rounded-xl border-2 border-dashed border-border hover:border-amber-500/50 transition-colors cursor-pointer flex items-center justify-center overflow-hidden bg-muted/20"
              >
                {coverPreview ? (
                  <img src={coverPreview} alt="Muqova" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-4">
                    <ImageIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">Muqova yuklash</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG, WEBP • Max 5MB</p>
                  </div>
                )}
              </div>
              <input ref={coverRef} type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Sarlavha *</label>
                <input
                  value={title} onChange={(e) => setTitle(e.target.value)} required
                  placeholder="Kitob nomi"
                  className="w-full bg-muted/30 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Narx (so'm)</label>
                <input
                  value={price} onChange={(e) => setPrice(e.target.value)}
                  type="number" min="0" step="1" placeholder="0"
                  className="w-full bg-muted/30 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">PDF fayl {!book && '*'}</label>
                <div
                  onClick={() => pdfRef.current?.click()}
                  className="flex items-center gap-3 p-3 rounded-xl border-2 border-dashed border-border hover:border-amber-500/50 transition-colors cursor-pointer bg-muted/20"
                >
                  <FileText className="w-5 h-5 text-muted-foreground shrink-0" />
                  <p className="text-xs text-muted-foreground flex-1 min-w-0 truncate">
                    {pdfFile ? pdfFile.name : book?.pdfUrl ? 'PDF yuklangan (o\'zgartirish uchun bosing)' : 'PDF yuklash • Max 50MB'}
                  </p>
                  <Upload className="w-4 h-4 text-muted-foreground" />
                </div>
                <input ref={pdfRef} type="file" accept=".pdf" onChange={(e) => setPdfFile(e.target.files?.[0] || null)} className="hidden" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Kategoriya</label>
              <input
                list="categories-list"
                value={categoryName}
                onChange={e => setCategoryName(e.target.value)}
                placeholder="Kategoriya nomi..."
                className="w-full bg-muted/30 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
              <datalist id="categories-list">
                {allCategories.map(c => <option key={c.id} value={c.name} />)}
              </datalist>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Muallif</label>
              <input
                list="authors-list"
                value={authorName}
                onChange={e => setAuthorName(e.target.value)}
                placeholder="Muallif ismi..."
                className="w-full bg-muted/30 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
              <datalist id="authors-list">
                {authors.map(a => <option key={a.id} value={a.name} />)}
              </datalist>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Tavsif</label>
            <textarea
              value={description} onChange={(e) => setDescription(e.target.value)}
              rows={4} placeholder="Kitob haqida qisqacha..."
              className="w-full bg-muted/30 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-border text-sm hover:bg-accent transition-colors">
              Bekor qilish
            </button>
            <button
              type="submit" disabled={isLoading || (!pdfFile && !book)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm disabled:opacity-60 transition-colors"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (book ? 'Saqlash' : 'Qo\'shish')}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default function AdminBooksPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [editBook, setEditBook] = useState<Book | undefined>()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const debouncedSearch = useDebounce(search, 400)

  const { data, isLoading } = useBooks({ page, limit: 10, search: debouncedSearch || undefined })
  const deleteBook = useDeleteBook()

  const books = data?.books || []
  const pagination = data?.pagination

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Kitoblar</h1>
          <p className="text-muted-foreground text-sm mt-1">Jami {pagination?.total || 0} ta kitob</p>
        </div>
        <button
          onClick={() => { setEditBook(undefined); setShowForm(true) }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Kitob qo'shish
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          placeholder="Kitob qidirish..."
          className="w-full bg-muted/30 border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
        />
      </div>

      <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {['Kitob', 'Narx', 'Reyting', 'Yuklamalar', 'Yoqtirishlar', 'Qo\'shilgan', 'Amallar'].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-muted-foreground px-4 py-3 first:pl-6">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 7 }).map((__, j) => (
                    <td key={j} className="px-4 py-4 first:pl-6"><div className="h-4 bg-muted rounded animate-pulse" /></td>
                  ))}</tr>
                ))
              ) : books.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-muted-foreground text-sm">Kitob topilmadi</td></tr>
              ) : (
                books.map((book) => (
                  <motion.tr key={book.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-14 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 shrink-0 flex items-center justify-center overflow-hidden">
                          {book.coverUrl ? (
                            <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                          ) : (
                            <BookOpen className="w-4 h-4 text-amber-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{truncate(book.title, 30)}</p>
                          {book.description && <p className="text-xs text-muted-foreground">{truncate(book.description, 40)}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm">{formatPrice(book.price)}</td>
                    <td className="px-4 py-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        5.0
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm">{formatNumber(book.downloadCount)}</td>
                    <td className="px-4 py-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                        {formatNumber(book.likeCount)}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs text-muted-foreground">{formatDate(book.createdAt)}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setEditBook(book); setShowForm(true) }}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteId(book.id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-400/10 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 rounded-xl border border-border text-sm disabled:opacity-40 hover:bg-accent transition-colors">Oldingi</button>
          <span className="px-4 py-2 text-sm">{page} / {pagination.totalPages}</span>
          <button onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages} className="px-4 py-2 rounded-xl border border-border text-sm disabled:opacity-40 hover:bg-accent transition-colors">Keyingi</button>
        </div>
      )}

      <AnimatePresence>
        {showForm && <BookFormModal book={editBook} onClose={() => { setShowForm(false); setEditBook(undefined) }} />}

        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="relative w-full max-w-sm bg-card border border-border rounded-2xl p-6 shadow-2xl">
              <h3 className="font-bold mb-2">Kitobni o'chirishni tasdiqlaysizmi?</h3>
              <p className="text-sm text-muted-foreground mb-6">Bu amalni ortga qaytarib bo'lmaydi. Kitob va barcha bog'liq ma'lumotlar o'chib ketadi.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl border border-border text-sm hover:bg-accent transition-colors">Bekor qilish</button>
                <button
                  onClick={() => deleteBook.mutate(deleteId, { onSuccess: () => setDeleteId(null) })}
                  disabled={deleteBook.isPending}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm disabled:opacity-60 transition-colors"
                >
                  {deleteBook.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "O'chirish"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
