import { useEffect, useMemo, useState } from 'react'
import { Header, TaskForm, TaskList } from '../Components'
import { createTask } from '../Interfaces'

const STORAGE_KEY = 'gorev-yoneticisi-tasks'

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export default function HomePage() {
  const [tasks, setTasks] = useState(loadTasks)
  const [editingTask, setEditingTask] = useState(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  const doneCount = useMemo(
    () => tasks.filter((task) => task.status === 'done').length,
    [tasks],
  )

  function handleCreate(formData) {
    const task = createTask(formData)
    setTasks((prev) => [task, ...prev])
  }

  function handleUpdate(formData) {
    if (!editingTask) return
    setTasks((prev) =>
      prev.map((task) =>
        task.id === editingTask.id
          ? {
              ...task,
              title: formData.title.trim(),
              description: formData.description.trim(),
              status: formData.status,
              updatedAt: new Date().toISOString(),
            }
          : task,
      ),
    )
    setEditingTask(null)
  }

  function handleDelete(id) {
    const confirmed = window.confirm('Bu görevi silmek istediğine emin misin?')
    if (!confirmed) return
    setTasks((prev) => prev.filter((task) => task.id !== id))
    if (editingTask?.id === id) setEditingTask(null)
  }

  function handleToggleDone(task) {
    setTasks((prev) =>
      prev.map((item) =>
        item.id === task.id
          ? {
              ...item,
              status: item.status === 'done' ? 'pending' : 'done',
              updatedAt: new Date().toISOString(),
            }
          : item,
      ),
    )
  }

  return (
    <div className="mx-auto min-h-screen max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <Header total={tasks.length} done={doneCount} />

      <main className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:items-start">
        <TaskForm
          initialTask={editingTask}
          onSubmit={editingTask ? handleUpdate : handleCreate}
          onCancel={() => setEditingTask(null)}
        />

        <section>
          <div className="mb-3 flex items-end justify-between gap-3">
            <h2 className="font-display text-xl font-semibold text-ink">Görev listesi</h2>
            <p className="text-sm text-ink-muted">Listele · Güncelle · Sil</p>
          </div>
          <TaskList
            tasks={tasks}
            onEdit={setEditingTask}
            onDelete={handleDelete}
            onToggleDone={handleToggleDone}
          />
        </section>
      </main>
    </div>
  )
}
