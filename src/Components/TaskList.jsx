import TaskItem from './TaskItem'

export default function TaskList({ tasks, onEdit, onDelete, onToggleDone }) {
  if (tasks.length === 0) {
    return (
      <div className="animate-fade-up rounded-2xl border border-dashed border-line bg-panel/70 px-6 py-12 text-center">
        <p className="font-display text-lg font-semibold text-ink">Henüz görev yok</p>
        <p className="mt-1 text-sm text-ink-muted">
          Soldaki formdan ilk görevi ekleyerek listelemeyi başlat.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-3">
      {tasks.map((task, index) => (
        <div key={task.id} style={{ animationDelay: `${index * 40}ms` }}>
          <TaskItem
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleDone={onToggleDone}
          />
        </div>
      ))}
    </div>
  )
}
