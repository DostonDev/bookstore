import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, Grid3X3, ChevronDown, ChevronRight } from 'lucide-react'
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/hooks/useCategories'
import type { Category } from '@/types'
import { cn } from '@/lib/utils'

function CategoryForm({
  editing,
  categories,
  onClose,
}: {
  editing: Category | null
  categories: Category[]
  onClose: () => void
}) {
  const createCat = useCreateCategory()
  const updateCat = useUpdateCategory()

  const [name, setName] = useState(editing?.name || '')
  const [description, setDescription] = useState(editing?.description || '')
  const [parentId, setParentId] = useState(editing?.parentId || '')

  const isLoading = createCat.isPending || updateCat.isPending

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const fd = new FormData()
    fd.append('name', name)
    fd.append('description', description)
    if (parentId) fd.append('parentId', parentId)
    else fd.append('parentId', '')

    if (editing) {
      await updateCat.mutateAsync({ id: editing.id, data: fd })
    } else {
      await createCat.mutateAsync(fd)
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-border/50 rounded-2xl p-6 w-full max-w-md"
      >
        <h2 className="text-lg font-semibold mb-5">
          {editing ? 'Kategoriyani tahrirlash' : 'Yangi kategoriya'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-1.5">Nomi *</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full px-3 py-2.5 rounded-xl bg-background border border-border/50 focus:border-amber-500 outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-1.5">Tavsif</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2.5 rounded-xl bg-background border border-border/50 focus:border-amber-500 outline-none text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-1.5">Yuqori kategoriya (ixtiyoriy)</label>
            <select
              value={parentId}
              onChange={e => setParentId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-background border border-border/50 focus:border-amber-500 outline-none text-sm"
            >
              <option value="">— Asosiy kategoriya (yuqori yo'q) —</option>
              {categories
                .filter(c => !c.parentId && c.id !== editing?.id)
                .map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-border/50 text-sm hover:bg-accent transition-colors"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-60 text-white text-sm font-medium transition-colors"
            >
              {editing ? 'Saqlash' : 'Yaratish'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

function CategoryRow({
  cat,
  onEdit,
  onDelete,
  depth = 0,
}: {
  cat: Category
  onEdit: (c: Category) => void
  onDelete: (id: string) => void
  depth?: number
}) {
  const [open, setOpen] = useState(true)
  const hasChildren = cat.children && cat.children.length > 0

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-card',
          depth > 0 && 'ml-6 border-l-2 border-l-amber-500/20'
        )}
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center shrink-0">
          {cat.imageUrl
            ? <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover rounded-xl" />
            : <Grid3X3 className="w-4 h-4 text-amber-400/60" />
          }
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {depth === 0 && hasChildren && (
              <button onClick={() => setOpen(o => !o)} className="text-muted-foreground hover:text-foreground transition-colors">
                {open ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            )}
            <p className="font-medium text-sm truncate">{cat.name}</p>
            {depth > 0 && (
              <span className="text-xs text-muted-foreground/50 shrink-0">fan</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {cat._count?.books || 0} kitob
            {hasChildren && ` · ${cat.children!.length} ta fan`}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onEdit(cat)}
            className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(cat.id)}
            className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Children */}
      <AnimatePresence>
        {hasChildren && open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2 overflow-hidden"
          >
            {cat.children!.map(child => (
              <CategoryRow key={child.id} cat={child} onEdit={onEdit} onDelete={onDelete} depth={depth + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default function AdminCategoriesPage() {
  const { data: categories = [], isLoading } = useCategories()
  const deleteCat = useDeleteCategory()

  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)

  // flat list (root + children) for the form's parent selector
  const allCategories: Category[] = []
  for (const c of categories) {
    allCategories.push(c)
    if (c.children) allCategories.push(...c.children)
  }

  const openCreate = () => { setEditing(null); setShowForm(true) }
  const openEdit = (cat: Category) => { setEditing(cat); setShowForm(true) }

  const handleDelete = (id: string) => {
    if (confirm("Kategoriyani o'chirishni tasdiqlaysizmi?")) deleteCat.mutate(id)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Kategoriyalar</h1>
          <p className="text-muted-foreground text-sm mt-1">{allCategories.length} ta kategoriya</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Yangi kategoriya
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 bg-muted rounded-xl" />)}
        </div>
      ) : (
        <div className="space-y-2">
          {categories.map(cat => (
            <CategoryRow key={cat.id} cat={cat} onEdit={openEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {showForm && (
        <CategoryForm
          editing={editing}
          categories={allCategories}
          onClose={() => { setShowForm(false); setEditing(null) }}
        />
      )}
    </div>
  )
}
