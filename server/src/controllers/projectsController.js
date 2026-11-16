import { v4 as uuidv4 } from 'uuid'
import { readDb, updateDb } from '../services/store.js'
import { createHttpError } from '../middleware/errorHandler.js'
import { PROJECT_STATUSES } from '../constants.js'

function assertMembersExist(db, memberIds) {
  if (!memberIds?.length) return
  const missing = memberIds.filter(
    (id) => !db.employees.some((employee) => employee.id === id),
  )
  if (missing.length) {
    throw createHttpError(400, 'Bazı memberIds geçersiz.', { missing })
  }
}

export async function listProjects(req, res, next) {
  try {
    const db = await readDb()
    let projects = [...db.projects]

    if (req.query.status) {
      if (!PROJECT_STATUSES.includes(req.query.status)) {
        throw createHttpError(
          400,
          `status şunlardan biri olmalı: ${PROJECT_STATUSES.join(', ')}`,
        )
      }
      projects = projects.filter((project) => project.status === req.query.status)
    }

    if (req.query.memberId) {
      projects = projects.filter((project) =>
        (project.memberIds || []).includes(req.query.memberId),
      )
    }

    res.json({ data: projects, count: projects.length })
  } catch (error) {
    next(error)
  }
}

export async function getProject(req, res, next) {
  try {
    const db = await readDb()
    const project = db.projects.find((item) => item.id === req.params.id)
    if (!project) throw createHttpError(404, 'Proje bulunamadı.')

    const tasks = db.tasks.filter((task) => task.projectId === project.id)
    const members = db.employees.filter((employee) =>
      (project.memberIds || []).includes(employee.id),
    )

    res.json({
      data: {
        ...project,
        members,
        tasks,
      },
    })
  } catch (error) {
    next(error)
  }
}

export async function createProject(req, res, next) {
  try {
    const now = new Date().toISOString()
    const memberIds = Array.isArray(req.body.memberIds) ? [...new Set(req.body.memberIds)] : []

    const project = await updateDb((db) => {
      assertMembersExist(db, memberIds)
      const created = {
        id: uuidv4(),
        name: req.body.name.trim(),
        description: (req.body.description || '').trim(),
        status: req.body.status || 'planning',
        memberIds,
        createdAt: now,
        updatedAt: now,
      }
      db.projects.push(created)
      return created
    })

    res.status(201).json({ data: project })
  } catch (error) {
    next(error)
  }
}

export async function updateProject(req, res, next) {
  try {
    const updated = await updateDb((db) => {
      const index = db.projects.findIndex((item) => item.id === req.params.id)
      if (index === -1) throw createHttpError(404, 'Proje bulunamadı.')

      const current = db.projects[index]
      const memberIds =
        req.body.memberIds !== undefined
          ? [...new Set(req.body.memberIds)]
          : current.memberIds

      assertMembersExist(db, memberIds)

      const project = {
        ...current,
        name: req.body.name !== undefined ? req.body.name.trim() : current.name,
        description:
          req.body.description !== undefined
            ? String(req.body.description).trim()
            : current.description,
        status: req.body.status !== undefined ? req.body.status : current.status,
        memberIds,
        updatedAt: new Date().toISOString(),
      }

      db.projects[index] = project
      return project
    })

    res.json({ data: updated })
  } catch (error) {
    next(error)
  }
}

export async function deleteProject(req, res, next) {
  try {
    await updateDb((db) => {
      const index = db.projects.findIndex((item) => item.id === req.params.id)
      if (index === -1) throw createHttpError(404, 'Proje bulunamadı.')

      const linkedTasks = db.tasks.filter((task) => task.projectId === req.params.id)
      if (linkedTasks.length > 0) {
        throw createHttpError(
          409,
          'Projeye bağlı görevler var. Önce görevleri silin veya başka projeye taşıyın.',
          { taskCount: linkedTasks.length },
        )
      }

      db.projects.splice(index, 1)
    })

    res.status(204).send()
  } catch (error) {
    next(error)
  }
}
