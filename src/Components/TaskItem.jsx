import { TASK_STATUSES } from '../Interfaces'

const statusStyles = {
  pending: 'bg-warn-soft text-warn',
  'in-progress': 'bg-accent-soft text-accent',
  done: 'bg-emerald-100 text-emerald-800',
}

export default function TaskItem({ task, onEdit, onDelete, onToggleDone }) {
  const statusLabel =
    TASK_STATUSES.find((item) => item.value === task.status)?.label || task.status

  return (
    <article className="animate-fade-up group rounded-2xl border border-line bg-panel p-4 transition hover:border-accent/40 hover:shadow-md hover:shadow-teal-900/5">
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => onToggleDone(task)}
          aria-label={task.status === 'done' ? 'Tamamlanmadı işaretle' : 'Tamamlandı işaretle'}
          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition ${
            task.status === 'done'
              ? 'animate-check-pop border-accent bg-accent text-white'
              : 'border-line bg-surface text-transparent hover:border-accent'
          }`}
        >
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
            <path
              d="M3.5 8.5l3 3 6-7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className={`truncate text-base font-semibold ${
                task.status === 'done' ? 'text-ink-muted line-through' : 'text-ink'
              }`}
            >
              {task.title}
            </h3>
            <span
              className={`rounded-md px-2 py-0.5 text-xs font-semibold ${statusStyles[task.status]}`}
            >
              {statusLabel}
            </span>
          </div>

          {task.description ? (
            <p className="mt-1 text-sm leading-relaxed text-ink-muted">{task.description}</p>
          ) : null}

          <p className="mt-2 text-xs text-ink-muted/80">
            Güncellendi:{' '}
            {new Date(task.updatedAt).toLocaleString('tr-TR', {
              dateStyle: 'short',
              timeStyle: 'short',
            })}
          </p>
        </div>

        <div className="flex shrink-0 gap-2 opacity-100 sm:opacity-0 sm:transition sm:group-hover:opacity-100">
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="rounded-lg border border-line px-2.5 py-1.5 text-xs font-semibold text-ink-muted transition hover:border-accent hover:text-accent"
          >
            Düzenle
          </button>
          <button
            type="button"
            onClick={() => onDelete(task.id)}
            className="rounded-lg border border-transparent bg-danger-soft px-2.5 py-1.5 text-xs font-semibold text-danger transition hover:bg-red-200"
          >
            Sil
          </button>
        </div>
      </div>
    </article>
  )
}
