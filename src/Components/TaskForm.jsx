import { useEffect, useState } from 'react'
import { TASK_STATUSES } from '../Interfaces'

const emptyForm = {
  title: '',
  description: '',
  status: 'pending',
}

export default function TaskForm({ initialTask = null, onSubmit, onCancel }) {
  const [form, setForm] = useState(emptyForm)
  const isEditing = Boolean(initialTask)

  useEffect(() => {
    if (initialTask) {
      setForm({
        title: initialTask.title,
        description: initialTask.description,
        status: initialTask.status,
      })
    } else {
      setForm(emptyForm)
    }
  }, [initialTask])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!form.title.trim()) return
    onSubmit(form)
    if (!isEditing) setForm(emptyForm)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="animate-fade-up rounded-2xl border border-line bg-panel p-5 shadow-sm shadow-teal-900/5"
    >
      <h2 className="font-display text-xl font-semibold text-ink">
        {isEditing ? 'Görevi güncelle' : 'Yeni görev ekle'}
      </h2>
      <p className="mt-1 text-sm text-ink-muted">
        {isEditing
          ? 'Başlık, açıklama veya durumu düzenleyebilirsin.'
          : 'Başlık zorunlu. Görevler tarayıcı LocalStorage’da saklanır.'}
      </p>

      <div className="mt-5 grid gap-4">
        <label className="grid gap-1.5 text-sm font-medium text-ink">
          Başlık
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Örn. Netlify’ye deploy et"
            required
            className="rounded-xl border border-line bg-surface px-3.5 py-2.5 text-base font-normal outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </label>

        <label className="grid gap-1.5 text-sm font-medium text-ink">
          Açıklama
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="İsteğe bağlı detay..."
            className="resize-y rounded-xl border border-line bg-surface px-3.5 py-2.5 text-base font-normal outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </label>

        <label className="grid gap-1.5 text-sm font-medium text-ink">
          Durum
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="rounded-xl border border-line bg-surface px-3.5 py-2.5 text-base font-normal outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
          >
            {TASK_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="submit"
          className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover"
        >
          {isEditing ? 'Kaydet' : 'Ekle'}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-line px-4 py-2.5 text-sm font-semibold text-ink-muted transition hover:bg-surface"
          >
            İptal
          </button>
        )}
      </div>
    </form>
  )
}
