import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Pencil, Trash2, User, BookOpen } from 'lucide-react'
import { useAuthors, useCreateAuthor, useUpdateAuthor, useDeleteAuthor } from '@/hooks/useAuthors'
import type { Author } from '@/types'

export default function AdminAuthorsPage() {
  const { data, isLoading } = useAuthors()
  const authors: Author[] = data?.data ?? []
  const createAuthor = useCreateAuthor()
  const updateAuthor = useUpdateAuthor()
  const deleteAuthor = useDeleteAuthor()

  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Author | null>(null)
  const [form, setForm] = useState({ name: '', bio: '', website: '', twitter: '', instagram: '', linkedin: '' })

  const openCreate = () => {
    setEditing(null)
    setForm({ name: '', bio: '', website: '', twitter: '', instagram: '', linkedin: '' })
    setShowForm(true)
  }

  const openEdit = (author: Author) => {
    setEditing(author)
    setForm({ name: author.name, bio: author.bio || '', website: author.website || '', twitter: author.twitter || '', instagram: author.instagram || '', linkedin: author.linkedin || '' })
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => v && fd.append(k, v))

    if (editing) await updateAuthor.mutateAsync({ id: editing.id, data: fd })
    else await createAuthor.mutateAsync(fd)
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mualliflar</h1>
          <p className="text-muted-foreground mt-1">{authors.length} ta muallif</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Yangi muallif
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border/50 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-lg font-semibold mb-5">
              {editing ? 'Muallifni tahrirlash' : 'Yangi muallif'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { key: 'name', label: 'Ismi *', required: true },
                { key: 'bio', label: 'Bio', textarea: true },
                { key: 'website', label: 'Website' },
                { key: 'twitter', label: 'Twitter username' },
                { key: 'instagram', label: 'Instagram username' },
                { key: 'linkedin', label: 'LinkedIn URL' },
              ].map(({ key, label, required, textarea }) => (
                <div key={key}>
                  <label className="block text-sm text-muted-foreground mb-1.5">{label}</label>
                  {textarea ? (
                    <textarea
                      value={form[key as keyof typeof form]}
                      onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2.5 rounded-xl bg-background border border-border/50 focus:border-amber-500 outline-none text-sm resize-none"
                    />
                  ) : (
                    <input
                      required={required}
                      value={form[key as keyof typeof form]}
                      onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl bg-background border border-border/50 focus:border-amber-500 outline-none text-sm"
                    />
                  )}
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 rounded-xl border border-border/50 text-sm hover:bg-accent transition-colors">
                  Bekor qilish
                </button>
                <button type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium transition-colors">
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
          {authors.map((author, i) => (
            <motion.div
              key={author.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-card"
            >
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-amber-500/20 to-orange-500/10 shrink-0">
                {author.avatarUrl ? (
                  <img src={author.avatarUrl} alt={author.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-5 h-5 text-amber-400/50" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{author.name}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <BookOpen className="w-3 h-3" />
                  {author._count?.books || 0} kitob
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => openEdit(author)}
                  className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => { if (confirm("O'chirishni tasdiqlaysizmi?")) deleteAuthor.mutate(author.id) }}
                  className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
