import {
  PROJECT_STATUSES,
  TASK_PRIORITIES,
  TASK_STATUSES,
} from '../constants.js'
import { createHttpError } from './errorHandler.js'

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0
}

function isOptionalString(value) {
  return value === undefined || value === null || typeof value === 'string'
}

function isEmail(value) {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function isIsoDateOnly(value) {
  if (typeof value !== 'string') return false
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T00:00:00.000Z`)
  return !Number.isNaN(date.getTime())
}

function collectBodyErrors(rules, body) {
  const details = []
  for (const rule of rules) {
    const result = rule(body)
    if (result) details.push(result)
  }
  return details
}

function requireBody(req) {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    throw createHttpError(400, 'İstek gövdesi JSON nesne olmalıdır.')
  }
}

export function validateCreateEmployee(req, _res, next) {
  try {
    requireBody(req)
    const details = collectBodyErrors(
      [
        (b) => (!isNonEmptyString(b.name) ? { field: 'name', message: 'name zorunludur.' } : null),
        (b) => (!isEmail(b.email) ? { field: 'email', message: 'Geçerli bir email gerekli.' } : null),
        (b) => (!isNonEmptyString(b.role) ? { field: 'role', message: 'role zorunludur.' } : null),
        (b) =>
          !isNonEmptyString(b.department)
            ? { field: 'department', message: 'department zorunludur.' }
            : null,
      ],
      req.body,
    )
    if (details.length) throw createHttpError(400, 'Doğrulama hatası.', details)
    next()
  } catch (error) {
    next(error)
  }
}

export function validateUpdateEmployee(req, _res, next) {
  try {
    requireBody(req)
    const { name, email, role, department } = req.body
    const details = []
    if (name !== undefined && !isNonEmptyString(name)) {
      details.push({ field: 'name', message: 'name boş olamaz.' })
    }
    if (email !== undefined && !isEmail(email)) {
      details.push({ field: 'email', message: 'Geçerli bir email gerekli.' })
    }
    if (role !== undefined && !isNonEmptyString(role)) {
      details.push({ field: 'role', message: 'role boş olamaz.' })
    }
    if (department !== undefined && !isNonEmptyString(department)) {
      details.push({ field: 'department', message: 'department boş olamaz.' })
    }
    if (details.length) throw createHttpError(400, 'Doğrulama hatası.', details)
    next()
  } catch (error) {
    next(error)
  }
}

export function validateCreateProject(req, _res, next) {
  try {
    requireBody(req)
    const details = collectBodyErrors(
      [
        (b) => (!isNonEmptyString(b.name) ? { field: 'name', message: 'name zorunludur.' } : null),
        (b) =>
          !isOptionalString(b.description)
            ? { field: 'description', message: 'description metin olmalıdır.' }
            : null,
        (b) =>
          b.status !== undefined && !PROJECT_STATUSES.includes(b.status)
            ? {
                field: 'status',
                message: `status şunlardan biri olmalı: ${PROJECT_STATUSES.join(', ')}`,
              }
            : null,
        (b) =>
          b.memberIds !== undefined && !Array.isArray(b.memberIds)
            ? { field: 'memberIds', message: 'memberIds bir dizi olmalıdır.' }
            : null,
      ],
      req.body,
    )
    if (details.length) throw createHttpError(400, 'Doğrulama hatası.', details)
    next()
  } catch (error) {
    next(error)
  }
}

export function validateUpdateProject(req, _res, next) {
  try {
    requireBody(req)
    const { name, description, status, memberIds } = req.body
    const details = []
    if (name !== undefined && !isNonEmptyString(name)) {
      details.push({ field: 'name', message: 'name boş olamaz.' })
    }
    if (description !== undefined && !isOptionalString(description)) {
      details.push({ field: 'description', message: 'description metin olmalıdır.' })
    }
    if (status !== undefined && !PROJECT_STATUSES.includes(status)) {
      details.push({
        field: 'status',
        message: `status şunlardan biri olmalı: ${PROJECT_STATUSES.join(', ')}`,
      })
    }
    if (memberIds !== undefined && !Array.isArray(memberIds)) {
      details.push({ field: 'memberIds', message: 'memberIds bir dizi olmalıdır.' })
    }
    if (details.length) throw createHttpError(400, 'Doğrulama hatası.', details)
    next()
  } catch (error) {
    next(error)
  }
}

export function validateCreateTask(req, _res, next) {
  try {
    requireBody(req)
    const details = collectBodyErrors(
      [
        (b) => (!isNonEmptyString(b.title) ? { field: 'title', message: 'title zorunludur.' } : null),
        (b) =>
          !isOptionalString(b.description)
            ? { field: 'description', message: 'description metin olmalıdır.' }
            : null,
        (b) =>
          b.status !== undefined && !TASK_STATUSES.includes(b.status)
            ? {
                field: 'status',
                message: `status şunlardan biri olmalı: ${TASK_STATUSES.join(', ')}`,
              }
            : null,
        (b) =>
          b.priority !== undefined && !TASK_PRIORITIES.includes(b.priority)
            ? {
                field: 'priority',
                message: `priority şunlardan biri olmalı: ${TASK_PRIORITIES.join(', ')}`,
              }
            : null,
        (b) =>
          b.projectId !== undefined && b.projectId !== null && !isNonEmptyString(b.projectId)
            ? { field: 'projectId', message: 'projectId metin olmalıdır.' }
            : null,
        (b) =>
          b.assigneeId !== undefined && b.assigneeId !== null && !isNonEmptyString(b.assigneeId)
            ? { field: 'assigneeId', message: 'assigneeId metin olmalıdır.' }
            : null,
        (b) =>
          b.dueDate !== undefined && b.dueDate !== null && !isIsoDateOnly(b.dueDate)
            ? { field: 'dueDate', message: 'dueDate YYYY-MM-DD formatında olmalıdır.' }
            : null,
      ],
      req.body,
    )
    if (details.length) throw createHttpError(400, 'Doğrulama hatası.', details)
    next()
  } catch (error) {
    next(error)
  }
}

export function validateUpdateTask(req, _res, next) {
  try {
    requireBody(req)
    const { title, description, status, priority, projectId, assigneeId, dueDate } = req.body
    const details = []
    if (title !== undefined && !isNonEmptyString(title)) {
      details.push({ field: 'title', message: 'title boş olamaz.' })
    }
    if (description !== undefined && !isOptionalString(description)) {
      details.push({ field: 'description', message: 'description metin olmalıdır.' })
    }
    if (status !== undefined && !TASK_STATUSES.includes(status)) {
      details.push({
        field: 'status',
        message: `status şunlardan biri olmalı: ${TASK_STATUSES.join(', ')}`,
      })
    }
    if (priority !== undefined && !TASK_PRIORITIES.includes(priority)) {
      details.push({
        field: 'priority',
        message: `priority şunlardan biri olmalı: ${TASK_PRIORITIES.join(', ')}`,
      })
    }
    if (projectId !== undefined && projectId !== null && !isNonEmptyString(projectId)) {
      details.push({ field: 'projectId', message: 'projectId metin olmalıdır.' })
    }
    if (assigneeId !== undefined && assigneeId !== null && !isNonEmptyString(assigneeId)) {
      details.push({ field: 'assigneeId', message: 'assigneeId metin olmalıdır.' })
    }
    if (dueDate !== undefined && dueDate !== null && !isIsoDateOnly(dueDate)) {
      details.push({ field: 'dueDate', message: 'dueDate YYYY-MM-DD formatında olmalıdır.' })
    }
    if (details.length) throw createHttpError(400, 'Doğrulama hatası.', details)
    next()
  } catch (error) {
    next(error)
  }
}

export function validateAssignTask(req, _res, next) {
  try {
    requireBody(req)
    const { assigneeId } = req.body
    if (assigneeId !== null && !isNonEmptyString(assigneeId)) {
      throw createHttpError(400, 'Doğrulama hatası.', [
        { field: 'assigneeId', message: 'assigneeId metin veya null olmalıdır.' },
      ])
    }
    next()
  } catch (error) {
    next(error)
  }
}

export function validateStatusUpdate(req, _res, next) {
  try {
    requireBody(req)
    if (!TASK_STATUSES.includes(req.body.status)) {
      throw createHttpError(400, 'Doğrulama hatası.', [
        {
          field: 'status',
          message: `status şunlardan biri olmalı: ${TASK_STATUSES.join(', ')}`,
        },
      ])
    }
    next()
  } catch (error) {
    next(error)
  }
}
