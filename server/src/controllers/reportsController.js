import { PRIORITY_ORDER, TASK_PRIORITIES, TASK_STATUSES } from '../constants.js'
import { readDb } from '../services/store.js'

function countBy(items, key, allowedValues) {
  const counts = Object.fromEntries(allowedValues.map((value) => [value, 0]))
  for (const item of items) {
    if (counts[item[key]] !== undefined) counts[item[key]] += 1
  }
  return counts
}

export async function getSummary(_req, res, next) {
  try {
    const db = await readDb()
    const today = new Date().toISOString().slice(0, 10)

    const overdue = db.tasks.filter(
      (task) =>
        task.dueDate &&
        task.dueDate < today &&
        task.status !== 'done',
    )

    const unassigned = db.tasks.filter((task) => task.assigneeId == null)

    res.json({
      data: {
        totals: {
          employees: db.employees.length,
          projects: db.projects.length,
          tasks: db.tasks.length,
          overdue: overdue.length,
          unassigned: unassigned.length,
        },
        tasksByStatus: countBy(db.tasks, 'status', TASK_STATUSES),
        tasksByPriority: countBy(db.tasks, 'priority', TASK_PRIORITIES),
        projectsByStatus: countBy(
          db.projects,
          'status',
          ['planning', 'active', 'on-hold', 'completed'],
        ),
      },
    })
  } catch (error) {
    next(error)
  }
}

export async function getWorkload(_req, res, next) {
  try {
    const db = await readDb()

    const workload = db.employees.map((employee) => {
      const assigned = db.tasks.filter((task) => task.assigneeId === employee.id)
      const open = assigned.filter((task) => task.status !== 'done')
      const done = assigned.filter((task) => task.status === 'done')
      const criticalOpen = open.filter((task) => task.priority === 'critical').length

      return {
        employee: {
          id: employee.id,
          name: employee.name,
          role: employee.role,
          department: employee.department,
        },
        totals: {
          assigned: assigned.length,
          open: open.length,
          done: done.length,
          criticalOpen,
        },
        openTasks: open
          .slice()
          .sort(
            (a, b) =>
              (PRIORITY_ORDER[b.priority] || 0) - (PRIORITY_ORDER[a.priority] || 0),
          )
          .map((task) => ({
            id: task.id,
            title: task.title,
            status: task.status,
            priority: task.priority,
            dueDate: task.dueDate,
            projectId: task.projectId,
          })),
      }
    })

    res.json({ data: workload, count: workload.length })
  } catch (error) {
    next(error)
  }
}

export async function getOverdue(_req, res, next) {
  try {
    const db = await readDb()
    const today = new Date().toISOString().slice(0, 10)

    const overdue = db.tasks
      .filter(
        (task) =>
          task.dueDate &&
          task.dueDate < today &&
          task.status !== 'done',
      )
      .map((task) => {
        const assignee =
          db.employees.find((employee) => employee.id === task.assigneeId) || null
        const project =
          db.projects.find((item) => item.id === task.projectId) || null
        return {
          ...task,
          assignee: assignee
            ? { id: assignee.id, name: assignee.name }
            : null,
          project: project ? { id: project.id, name: project.name } : null,
        }
      })
      .sort((a, b) => (a.dueDate < b.dueDate ? -1 : 1))

    res.json({ data: overdue, count: overdue.length })
  } catch (error) {
    next(error)
  }
}
