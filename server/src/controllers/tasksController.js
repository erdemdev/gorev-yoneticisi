import { v4 as uuidv4 } from 'uuid'
import { PRIORITY_ORDER, TASK_PRIORITIES, TASK_STATUSES } from '../constants.js'
import { createHttpError } from '../middleware/errorHandler.js'
import { readDb, updateDb } from '../services/store.js'

function assertProjectExists(db, projectId) {
  if (projectId == null) return
  if (!db.projects.some((project) => project.id === projectId)) {
    throw createHttpError(400, 'projectId geçersiz.', { projectId })
  }
}

function assertAssigneeExists(db, assigneeId) {
  if (assigneeId == null) return
  if (!db.employees.some((employee) => employee.id === assigneeId)) {
    throw createHttpError(400, 'assigneeId geçersiz.', { assigneeId })
  }
}

function sortTasks(tasks, sortBy = 'priority', order = 'desc') {
  const direction = order === 'asc' ? 1 : -1
  const sorted = [...tasks]

  sorted.sort((a, b) => {
    if (sortBy === 'priority') {
      const diff =
        (PRIORITY_ORDER[a.priority] || 0) - (PRIORITY_ORDER[b.priority] || 0)
      if (diff !== 0) return diff * direction
    }

    if (sortBy === 'dueDate') {
      const aDate = a.dueDate || '9999-12-31'
      const bDate = b.dueDate || '9999-12-31'
      if (aDate !== bDate) return aDate < bDate ? -1 * direction : 1 * direction
    }

    if (sortBy === 'createdAt') {
      if (a.createdAt !== b.createdAt) {
        return a.createdAt < b.createdAt ? -1 * direction : 1 * direction
      }
    }

    return a.title.localeCompare(b.title, 'tr')
  })

  return sorted
}

export async function listTasks(req, res, next) {
  try {
    const db = await readDb()
    let tasks = [...db.tasks]

    const {
      status,
      priority,
      projectId,
      assigneeId,
      unassigned,
      q,
      sortBy = 'priority',
      order = 'desc',
    } = req.query

    if (status) {
      if (!TASK_STATUSES.includes(status)) {
        throw createHttpError(
          400,
          `status şunlardan biri olmalı: ${TASK_STATUSES.join(', ')}`,
        )
      }
      tasks = tasks.filter((task) => task.status === status)
    }

    if (priority) {
      if (!TASK_PRIORITIES.includes(priority)) {
        throw createHttpError(
          400,
          `priority şunlardan biri olmalı: ${TASK_PRIORITIES.join(', ')}`,
        )
      }
      tasks = tasks.filter((task) => task.priority === priority)
    }

    if (projectId) {
      tasks = tasks.filter((task) => task.projectId === projectId)
    }

    if (assigneeId) {
      tasks = tasks.filter((task) => task.assigneeId === assigneeId)
    }

    if (unassigned === 'true') {
      tasks = tasks.filter((task) => task.assigneeId == null)
    }

    if (q) {
      const needle = String(q).toLowerCase()
      tasks = tasks.filter(
        (task) =>
          task.title.toLowerCase().includes(needle) ||
          (task.description || '').toLowerCase().includes(needle),
      )
    }

    const allowedSort = ['priority', 'dueDate', 'createdAt', 'title']
    if (!allowedSort.includes(sortBy)) {
      throw createHttpError(
        400,
        `sortBy şunlardan biri olmalı: ${allowedSort.join(', ')}`,
      )
    }

    tasks = sortTasks(tasks, sortBy, order === 'asc' ? 'asc' : 'desc')

    res.json({ data: tasks, count: tasks.length })
  } catch (error) {
    next(error)
  }
}

export async function getTask(req, res, next) {
  try {
    const db = await readDb()
    const task = db.tasks.find((item) => item.id === req.params.id)
    if (!task) throw createHttpError(404, 'Görev bulunamadı.')

    const project = db.projects.find((item) => item.id === task.projectId) || null
    const assignee =
      db.employees.find((item) => item.id === task.assigneeId) || null

    res.json({
      data: {
        ...task,
        project,
        assignee,
      },
    })
  } catch (error) {
    next(error)
  }
}

export async function createTask(req, res, next) {
  try {
    const now = new Date().toISOString()

    const task = await updateDb((db) => {
      const projectId = req.body.projectId ?? null
      const assigneeId = req.body.assigneeId ?? null
      assertProjectExists(db, projectId)
      assertAssigneeExists(db, assigneeId)

      const created = {
        id: uuidv4(),
        title: req.body.title.trim(),
        description: (req.body.description || '').trim(),
        status: req.body.status || 'pending',
        priority: req.body.priority || 'medium',
        projectId,
        assigneeId,
        dueDate: req.body.dueDate ?? null,
        createdAt: now,
        updatedAt: now,
      }

      db.tasks.push(created)
      return created
    })

    res.status(201).json({ data: task })
  } catch (error) {
    next(error)
  }
}

export async function updateTask(req, res, next) {
  try {
    const updated = await updateDb((db) => {
      const index = db.tasks.findIndex((item) => item.id === req.params.id)
      if (index === -1) throw createHttpError(404, 'Görev bulunamadı.')

      const current = db.tasks[index]
      const projectId =
        req.body.projectId !== undefined ? req.body.projectId : current.projectId
      const assigneeId =
        req.body.assigneeId !== undefined ? req.body.assigneeId : current.assigneeId

      assertProjectExists(db, projectId)
      assertAssigneeExists(db, assigneeId)

      const task = {
        ...current,
        title: req.body.title !== undefined ? req.body.title.trim() : current.title,
        description:
          req.body.description !== undefined
            ? String(req.body.description).trim()
            : current.description,
        status: req.body.status !== undefined ? req.body.status : current.status,
        priority:
          req.body.priority !== undefined ? req.body.priority : current.priority,
        projectId,
        assigneeId,
        dueDate: req.body.dueDate !== undefined ? req.body.dueDate : current.dueDate,
        updatedAt: new Date().toISOString(),
      }

      db.tasks[index] = task
      return task
    })

    res.json({ data: updated })
  } catch (error) {
    next(error)
  }
}

export async function assignTask(req, res, next) {
  try {
    const updated = await updateDb((db) => {
      const index = db.tasks.findIndex((item) => item.id === req.params.id)
      if (index === -1) throw createHttpError(404, 'Görev bulunamadı.')

      const assigneeId = req.body.assigneeId ?? null
      assertAssigneeExists(db, assigneeId)

      const task = {
        ...db.tasks[index],
        assigneeId,
        updatedAt: new Date().toISOString(),
      }
      db.tasks[index] = task
      return task
    })

    res.json({ data: updated })
  } catch (error) {
    next(error)
  }
}

export async function updateTaskStatus(req, res, next) {
  try {
    const updated = await updateDb((db) => {
      const index = db.tasks.findIndex((item) => item.id === req.params.id)
      if (index === -1) throw createHttpError(404, 'Görev bulunamadı.')

      const task = {
        ...db.tasks[index],
        status: req.body.status,
        updatedAt: new Date().toISOString(),
      }
      db.tasks[index] = task
      return task
    })

    res.json({ data: updated })
  } catch (error) {
    next(error)
  }
}

export async function deleteTask(req, res, next) {
  try {
    await updateDb((db) => {
      const index = db.tasks.findIndex((item) => item.id === req.params.id)
      if (index === -1) throw createHttpError(404, 'Görev bulunamadı.')
      db.tasks.splice(index, 1)
    })

    res.status(204).send()
  } catch (error) {
    next(error)
  }
}
