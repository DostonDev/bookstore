import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, Eye, EyeOff, Clock, ImagePlus, X, Loader2 } from 'lucide-react'
import { useBlogsAdmin, useCreateBlog, useUpdateBlog, useDeleteBlog } from '@/hooks/useBlogs'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { Blog } from '@/types'

export default function AdminBlogsPage() {
  const { data, isLoading } = useBlogsAdmin({ limit: 20 })
  const blogs: Blog[] = data?.data ?? []
  const createBlog = useCreateBlog()
  const updateBlog = useUpdateBlog()
  const deleteBlog = useDeleteBlog()

  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Blog | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState({ title: '', content: '', excerpt: '', status: 'DRAFT' })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const openCreate = () => {
    setEditing(null)
    setForm({ title: '', content: '', excerpt: '', status: 'DRAFT' })
    setImageFile(null)
    setImagePreview(null)
    setShowForm(true)
  }

  const openEdit = (blog: Blog) => {
    setEditing(blog)
    setForm({ title: blog.title, content: blog.content, excerpt: blog.excerpt || '', status: blog.status })
    setImageFile(null)
    setImagePreview(blog.featuredImage || null)
    setShowForm(true)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    e.target.value = ''
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => v && fd.append(k, v))
    if (imageFile) fd.append('featuredImage', imageFile)

    if (editing) await updateBlog.mutateAsync({ id: editing.id, data: fd })
    else await createBlog.mutateAsync(fd)
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Blog</h1>
          <p className="text-muted-foreground mt-1">{blogs.length} ta maqola</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" />
          Yangi maqola
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border/50 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-lg font-semibold mb-5">{editing ? 'Maqolani tahrirlash' : 'Yangi maqola'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-1.5">Sarlavha *</label>
                <input required value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl bg-background border border-border/50 focus:border-amber-500 outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1.5">Qisqa matn</label>
                <input value={form.excerpt} onChange={(e) => setForm(f => ({ ...f, excerpt: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl bg-background border border-border/50 focus:border-amber-500 outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1.5">Kontent *</label>
                <textarea required value={form.content} onChange={(e) => setForm(f => ({ ...f, content: e.target.value }))}
                  rows={10}
                  className="w-full px-3 py-2.5 rounded-xl bg-background border border-border/50 focus:border-amber-500 outline-none text-sm resize-none font-mono" />
              </div>

              {/* Featured Image */}
              <div>
                <label className="block text-sm text-muted-foreground mb-1.5">Muqova rasm</label>
                {imagePreview ? (
                  <div className="relative w-full h-48 rounded-xl overflow-hidden border border-border/50">
                    <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={removeImage}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button type="button" onClick={() => fileInputRef.current?.click()}
                    className="w-full h-32 rounded-xl border-2 border-dashed border-border/50 hover:border-amber-500/50 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-amber-400 transition-colors">
                    <ImagePlus className="w-6 h-6" />
                    <span className="text-sm">Rasm tanlash</span>
                    <span className="text-xs">JPG, PNG, WEBP — 5MB gacha</span>
                  </button>
                )}
                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp"
                  className="hidden" onChange={handleImageChange} />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1.5">Holat</label>
                <select value={form.status} onChange={(e) => setForm(f => ({ ...f, status: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl bg-background border border-border/50 focus:border-amber-500 outline-none text-sm">
                  <option value="DRAFT">Qoralama</option>
                  <option value="PUBLISHED">Chop etilgan</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 rounded-xl border border-border/50 text-sm hover:bg-accent transition-colors">
                  Bekor qilish
                </button>
                <button type="submit" disabled={createBlog.isPending || updateBlog.isPending}
                  className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-60 text-white text-sm font-medium transition-colors">
                  {editing ? 'Saqlash' : 'Yaratish'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-20 bg-muted rounded-xl" />)}
        </div>
      ) : (
        <div className="space-y-3">
          {blogs.map((blog, i) => (
            <motion.div key={blog.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className="flex items-start gap-4 p-4 rounded-xl border border-border/50 bg-card">
              <div className="w-16 h-12 rounded-lg overflow-hidden bg-muted shrink-0 border border-border/30">
                {blog.featuredImage
                  ? <img src={blog.featuredImage} alt={blog.title} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center"><ImagePlus className="w-4 h-4 text-muted-foreground/40" /></div>
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{blog.title}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium',
                    blog.status === 'PUBLISHED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400')}>
                    {blog.status === 'PUBLISHED' ? <Eye className="w-3 h-3 inline mr-1" /> : <EyeOff className="w-3 h-3 inline mr-1" />}
                    {blog.status === 'PUBLISHED' ? 'Chop etilgan' : 'Qoralama'}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {blog.readingTime} min
                  </span>
                  <span className="text-xs text-muted-foreground">{formatDate(blog.createdAt)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => openEdit(blog)}
                  className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => setDeleteId(blog.id)}
                  className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="relative w-full max-w-sm bg-card border border-border rounded-2xl p-6 shadow-2xl">
              <h3 className="font-bold mb-2">Maqolani o'chirishni tasdiqlaysizmi?</h3>
              <p className="text-sm text-muted-foreground mb-6">Bu amalni ortga qaytarib bo'lmaydi.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)}
                  className="flex-1 py-2.5 rounded-xl border border-border text-sm hover:bg-accent transition-colors">
                  Bekor qilish
                </button>
                <button
                  onClick={() => deleteBlog.mutate(deleteId, { onSuccess: () => setDeleteId(null) })}
                  disabled={deleteBlog.isPending}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm disabled:opacity-60 transition-colors"
                >
                  {deleteBlog.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "O'chirish"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
