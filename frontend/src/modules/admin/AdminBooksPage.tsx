import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Edit, Trash2, BookOpen, X, Loader2, Upload, ImageIcon, FileText, Star, Heart, UserCheck, Tag } from 'lucide-react'
import { useBooks, useCreateBook, useDeleteBook, useUpdateBook } from '@/hooks/useBooks'
import { useCategories } from '@/hooks/useCategories'
import { useAuthors } from '@/hooks/useAuthors'
import { formatPrice, formatNumber, formatDate, truncate } from '@/lib/utils'
import { useDebounce } from '@/hooks/useDebounce'
import { booksService } from '@/services/books.service'
import { authorsService } from '@/services/authors.service'
import { categoriesService } from '@/services/categories.service'
import api from '@/services/api'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { Book } from '@/types'

function BookFormModal({ book, onClose }: { book?: Book; onClose: () => void }) {
  const [title, setTitle] = useState(book?.title || '')
  const [description, setDescription] = useState(book?.description || '')
  const [price, setPrice] = useState(book?.price?.toString() || '0')
  const [categoryName, setCategoryName] = useState(book?.category?.name || '')
  const [authorName, setAuthorName] = useState(book?.author?.name || '')
  const [isCreatingAuthor, setIsCreatingAuthor] = useState(false)
  const [isCreatingCategory, setIsCreatingCategory] = useState(false)
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
  const isLoading = createBook.isPending || updateBook.isPending || isCreatingAuthor || isCreatingCategory

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

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/^0+(\d)/, '$1')
    setPrice(raw === '' ? '0' : raw)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('price', price)
    if (categoryName.trim()) {
      const matchedCat = allCategories.find(c => c.name.toLowerCase() === categoryName.trim().toLowerCase())
      if (matchedCat) {
        formData.append('categoryId', matchedCat.id)
      } else {
        setIsCreatingCategory(true)
        try {
          const catFormData = new FormData()
          catFormData.append('name', categoryName.trim())
          const res = await categoriesService.create(catFormData)
          const newCat = (res.data as { data?: { id: string } }).data
          if (newCat?.id) {
            formData.append('categoryId', newCat.id)
            toast.success(`"${categoryName.trim()}" kategoriya sifatida qo'shildi`)
          }
        } catch {
          toast.error('Kategoriya yaratishda xato yuz berdi')
          setIsCreatingCategory(false)
          return
        } finally {
          setIsCreatingCategory(false)
        }
      }
    }

    if (authorName.trim()) {
      const matched = authors.find(a => a.name.toLowerCase() === authorName.trim().toLowerCase())
      if (matched) {
        formData.append('authorId', matched.id)
      } else {
        setIsCreatingAuthor(true)
        try {
          const authorFormData = new FormData()
          authorFormData.append('name', authorName.trim())
          const res = await authorsService.create(authorFormData)
          const newAuthor = (res.data as { data?: { id: string } }).data
          if (newAuthor?.id) {
            formData.append('authorId', newAuthor.id)
            toast.success(`"${authorName.trim()}" muallif sifatida qo'shildi`)
          }
        } catch {
          toast.error('Muallif yaratishda xato yuz berdi')
          setIsCreatingAuthor(false)
          return
        } finally {
          setIsCreatingAuthor(false)
        }
      }
    }

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
                  value={price}
                  onChange={handlePriceChange}
                  onFocus={(e) => e.target.select()}
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
                placeholder="Kategoriya nomi (yangi bo'lsa ham yozing)..."
                className="w-full bg-muted/30 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
              <datalist id="categories-list">
                {allCategories.map(c => <option key={c.id} value={c.name} />)}
              </datalist>
              {categoryName.trim() && !allCategories.find(c => c.name.toLowerCase() === categoryName.trim().toLowerCase()) && (
                <p className="text-[11px] text-amber-400 mt-1">
                  Yangi kategoriya yaratiladi: "{categoryName.trim()}"
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Muallif</label>
              <input
                list="authors-list"
                value={authorName}
                onChange={e => setAuthorName(e.target.value)}
                placeholder="Muallif ismi (yangi bo'lsa ham yozing)..."
                className="w-full bg-muted/30 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
              <datalist id="authors-list">
                {authors.map(a => <option key={a.id} value={a.name} />)}
              </datalist>
              {authorName.trim() && !authors.find(a => a.name.toLowerCase() === authorName.trim().toLowerCase()) && (
                <p className="text-[11px] text-amber-400 mt-1">
                  Yangi muallif yaratiladi: "{authorName.trim()}"
                </p>
              )}
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
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false)
  const [isBulkDeleting, setIsBulkDeleting] = useState(false)
  const [showBulkAuthor, setShowBulkAuthor] = useState(false)
  const [bulkAuthorId, setBulkAuthorId] = useState('')
  const [isBulkAssigning, setIsBulkAssigning] = useState(false)
  const [showBulkCategory, setShowBulkCategory] = useState(false)
  const [bulkCategoryId, setBulkCategoryId] = useState('')
  const [isBulkAssigningCategory, setIsBulkAssigningCategory] = useState(false)
  const debouncedSearch = useDebounce(search, 400)

  const { data, isLoading } = useBooks({ page, limit: 10, search: debouncedSearch || undefined })
  const { data: authorsData } = useAuthors({ limit: 200 })
  const authorsList: { id: string; name: string }[] =
    ((authorsData as { data?: { id: string; name: string }[] })?.data) || []
  const { data: categoriesData = [] } = useCategories()
  const categoriesList: { id: string; name: string }[] = categoriesData.flatMap(c =>
    [{ id: c.id, name: c.name }, ...(c.children?.map(ch => ({ id: ch.id, name: `${c.name} › ${ch.name}` })) ?? [])]
  )
  const deleteBook = useDeleteBook()
  const qc = useQueryClient()

  const books = data?.books || []
  const pagination = data?.pagination

  const allPageSelected = books.length > 0 && books.every(b => selectedIds.has(b.id))
  const someSelected = selectedIds.size > 0

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (allPageSelected) {
      setSelectedIds(prev => {
        const next = new Set(prev)
        books.forEach(b => next.delete(b.id))
        return next
      })
    } else {
      setSelectedIds(prev => {
        const next = new Set(prev)
        books.forEach(b => next.add(b.id))
        return next
      })
    }
  }

  const handleQuickAssignCategory = async (bookId: string, catId: string) => {
    try {
      await api.put(`/books/${bookId}`, { categoryId: catId || null })
      qc.invalidateQueries({ queryKey: ['books'] })
      toast.success(catId ? 'Kategoriya biriktirildi' : 'Kategoriya olib tashlandi')
    } catch {
      toast.error('Xato yuz berdi')
    }
  }

  const handleBulkAssignCategory = async () => {
    setIsBulkAssigningCategory(true)
    try {
      await Promise.all([...selectedIds].map(id =>
        api.put(`/books/${id}`, { categoryId: bulkCategoryId || null })
      ))
      qc.invalidateQueries({ queryKey: ['books'] })
      toast.success(`${selectedIds.size} ta kitobga kategoriya biriktirildi`)
      setSelectedIds(new Set())
      setShowBulkCategory(false)
      setBulkCategoryId('')
    } catch {
      toast.error('Xato yuz berdi')
    } finally {
      setIsBulkAssigningCategory(false)
    }
  }

  const handleQuickAssignAuthor = async (bookId: string, authorId: string) => {
    try {
      await api.put(`/books/${bookId}`, { authorId: authorId || null })
      qc.invalidateQueries({ queryKey: ['books'] })
      toast.success(authorId ? 'Muallif biriktirildi' : 'Muallif olib tashlandi')
    } catch {
      toast.error('Xato yuz berdi')
    }
  }

  const handleBulkAssignAuthor = async () => {
    setIsBulkAssigning(true)
    try {
      await Promise.all([...selectedIds].map(id =>
        api.put(`/books/${id}`, { authorId: bulkAuthorId || null })
      ))
      qc.invalidateQueries({ queryKey: ['books'] })
      toast.success(`${selectedIds.size} ta kitobga muallif biriktirildi`)
      setSelectedIds(new Set())
      setShowBulkAuthor(false)
      setBulkAuthorId('')
    } catch {
      toast.error('Xato yuz berdi')
    } finally {
      setIsBulkAssigning(false)
    }
  }

  const handleBulkDelete = async () => {
    setIsBulkDeleting(true)
    try {
      await Promise.all([...selectedIds].map(id => booksService.deleteBook(id)))
      qc.invalidateQueries({ queryKey: ['books'] })
      toast.success(`${selectedIds.size} ta kitob o'chirildi`)
      setSelectedIds(new Set())
      setShowBulkDeleteConfirm(false)
    } catch {
      toast.error("O'chirishda xato yuz berdi")
    } finally {
      setIsBulkDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Kitoblar</h1>
          <p className="text-muted-foreground text-sm mt-1">Jami {pagination?.total || 0} ta kitob</p>
        </div>
        <div className="flex items-center gap-2">
          {someSelected && (
            <>
              <button
                onClick={() => setShowBulkCategory(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-500/20 hover:bg-violet-500/30 border border-violet-500/30 text-violet-400 text-sm font-medium transition-colors"
              >
                <Tag className="w-4 h-4" />
                Kategoriya ({selectedIds.size})
              </button>
              <button
                onClick={() => setShowBulkAuthor(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-400 text-sm font-medium transition-colors"
              >
                <UserCheck className="w-4 h-4" />
                Muallif ({selectedIds.size})
              </button>
              <button
                onClick={() => setShowBulkDeleteConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                O'chirish ({selectedIds.size})
              </button>
            </>
          )}
          <button
            onClick={() => { setEditBook(undefined); setShowForm(true) }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Kitob qo'shish
          </button>
        </div>
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
                <th className="px-4 py-3 pl-6 w-10">
                  <input
                    type="checkbox"
                    checked={allPageSelected}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded accent-amber-500 cursor-pointer"
                  />
                </th>
                {['Kitob', 'Kategoriya', 'Muallif', 'Narx', 'Reyting', 'Yuklamalar', 'Yoqtirishlar', 'Qo\'shilgan', 'Amallar'].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-muted-foreground px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 10 }).map((__, j) => (
                    <td key={j} className="px-4 py-4 first:pl-6"><div className="h-4 bg-muted rounded animate-pulse" /></td>
                  ))}</tr>
                ))
              ) : books.length === 0 ? (
                <tr><td colSpan={10} className="text-center py-12 text-muted-foreground text-sm">Kitob topilmadi</td></tr>
              ) : (
                books.map((book) => (
                  <motion.tr
                    key={book.id}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className={`hover:bg-muted/20 transition-colors ${selectedIds.has(book.id) ? 'bg-amber-500/5' : ''}`}
                  >
                    <td className="px-4 py-4 pl-6">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(book.id)}
                        onChange={() => toggleSelect(book.id)}
                        className="w-4 h-4 rounded accent-amber-500 cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-4">
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
                    <td className="px-4 py-4">
                      <select
                        value={book.category?.id || ''}
                        onChange={e => handleQuickAssignCategory(book.id, e.target.value)}
                        className="bg-muted/30 border border-border rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-violet-500/50 max-w-[140px] appearance-none"
                      >
                        <option value="">— Yo'q —</option>
                        {categoriesList.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-4">
                      <select
                        value={book.author?.id || ''}
                        onChange={e => handleQuickAssignAuthor(book.id, e.target.value)}
                        className="bg-muted/30 border border-border rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500/50 max-w-[140px] appearance-none"
                      >
                        <option value="">— Yo'q —</option>
                        {authorsList.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                      </select>
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

        {showBulkCategory && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isBulkAssigningCategory && setShowBulkCategory(false)} />
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="relative w-full max-w-sm bg-card border border-border rounded-2xl p-6 shadow-2xl">
              <h3 className="font-bold mb-1">Kategoriya biriktirish</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {selectedIds.size} ta tanlangan kitobga kategoriya belgilang
              </p>
              <select
                value={bulkCategoryId}
                onChange={e => setBulkCategoryId(e.target.value)}
                className="w-full bg-muted/30 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 appearance-none mb-5"
              >
                <option value="">— Kategoriyasiz (tozalash) —</option>
                {categoriesList.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowBulkCategory(false)}
                  disabled={isBulkAssigningCategory}
                  className="flex-1 py-2.5 rounded-xl border border-border text-sm hover:bg-accent transition-colors disabled:opacity-60"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={handleBulkAssignCategory}
                  disabled={isBulkAssigningCategory}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm disabled:opacity-60 transition-colors"
                >
                  {isBulkAssigningCategory ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Biriktirish'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showBulkAuthor && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isBulkAssigning && setShowBulkAuthor(false)} />
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="relative w-full max-w-sm bg-card border border-border rounded-2xl p-6 shadow-2xl">
              <h3 className="font-bold mb-1">Muallif biriktirish</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {selectedIds.size} ta tanlangan kitobga muallif belgilang
              </p>
              <select
                value={bulkAuthorId}
                onChange={e => setBulkAuthorId(e.target.value)}
                className="w-full bg-muted/30 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 appearance-none mb-5"
              >
                <option value="">— Muallifsiz (tozalash) —</option>
                {authorsList.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowBulkAuthor(false)}
                  disabled={isBulkAssigning}
                  className="flex-1 py-2.5 rounded-xl border border-border text-sm hover:bg-accent transition-colors disabled:opacity-60"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={handleBulkAssignAuthor}
                  disabled={isBulkAssigning}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm disabled:opacity-60 transition-colors"
                >
                  {isBulkAssigning ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Biriktirish'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="relative w-full max-w-sm bg-card border border-border rounded-2xl p-6 shadow-2xl">
              <h3 className="font-bold mb-2">Kitobni o'chirishni tasdiqlaysizmi?</h3>
              <p className="text-sm text-muted-foreground mb-6">Bu amalni ortga qaytarib bo'lmaydi.</p>
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

        {showBulkDeleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isBulkDeleting && setShowBulkDeleteConfirm(false)} />
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="relative w-full max-w-sm bg-card border border-border rounded-2xl p-6 shadow-2xl">
              <h3 className="font-bold mb-2">{selectedIds.size} ta kitobni o'chirishni tasdiqlaysizmi?</h3>
              <p className="text-sm text-muted-foreground mb-6">Bu amalni ortga qaytarib bo'lmaydi. Tanlangan barcha kitoblar o'chib ketadi.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowBulkDeleteConfirm(false)}
                  disabled={isBulkDeleting}
                  className="flex-1 py-2.5 rounded-xl border border-border text-sm hover:bg-accent transition-colors disabled:opacity-60"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={handleBulkDelete}
                  disabled={isBulkDeleting}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm disabled:opacity-60 transition-colors"
                >
                  {isBulkDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : `${selectedIds.size} tasini o'chirish`}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
