import { v4 as uuidv4 } from 'uuid'
import { readDb, updateDb } from '../services/store.js'
import { createHttpError } from '../middleware/errorHandler.js'

export async function listEmployees(_req, res, next) {
  try {
    const db = await readDb()
    res.json({ data: db.employees, count: db.employees.length })
  } catch (error) {
    next(error)
  }
}

export async function getEmployee(req, res, next) {
  try {
    const db = await readDb()
    const employee = db.employees.find((item) => item.id === req.params.id)
    if (!employee) throw createHttpError(404, 'Çalışan bulunamadı.')
    res.json({ data: employee })
  } catch (error) {
    next(error)
  }
}

export async function createEmployee(req, res, next) {
  try {
    const now = new Date().toISOString()
    const employee = {
      id: uuidv4(),
      name: req.body.name.trim(),
      email: req.body.email.trim().toLowerCase(),
      role: req.body.role.trim(),
      department: req.body.department.trim(),
      createdAt: now,
      updatedAt: now,
    }

    await updateDb((db) => {
      const emailTaken = db.employees.some((item) => item.email === employee.email)
      if (emailTaken) {
        throw createHttpError(409, 'Bu email adresi zaten kayıtlı.')
      }
      db.employees.push(employee)
      return employee
    })

    res.status(201).json({ data: employee })
  } catch (error) {
    next(error)
  }
}

export async function updateEmployee(req, res, next) {
  try {
    const updated = await updateDb((db) => {
      const index = db.employees.findIndex((item) => item.id === req.params.id)
      if (index === -1) throw createHttpError(404, 'Çalışan bulunamadı.')

      const current = db.employees[index]
      const nextEmail =
        req.body.email !== undefined
          ? String(req.body.email).trim().toLowerCase()
          : current.email

      if (
        nextEmail !== current.email &&
        db.employees.some((item) => item.email === nextEmail)
      ) {
        throw createHttpError(409, 'Bu email adresi zaten kayıtlı.')
      }

      const employee = {
        ...current,
        name: req.body.name !== undefined ? req.body.name.trim() : current.name,
        email: nextEmail,
        role: req.body.role !== undefined ? req.body.role.trim() : current.role,
        department:
          req.body.department !== undefined
            ? req.body.department.trim()
            : current.department,
        updatedAt: new Date().toISOString(),
      }

      db.employees[index] = employee
      return employee
    })

    res.json({ data: updated })
  } catch (error) {
    next(error)
  }
}

export async function deleteEmployee(req, res, next) {
  try {
    await updateDb((db) => {
      const index = db.employees.findIndex((item) => item.id === req.params.id)
      if (index === -1) throw createHttpError(404, 'Çalışan bulunamadı.')

      const assignedTasks = db.tasks.filter((task) => task.assigneeId === req.params.id)
      if (assignedTasks.length > 0) {
        throw createHttpError(
          409,
          'Çalışana atanmış görevler var. Önce görevleri yeniden atayın veya silin.',
          { taskCount: assignedTasks.length },
        )
      }

      db.projects = db.projects.map((project) => ({
        ...project,
        memberIds: (project.memberIds || []).filter((id) => id !== req.params.id),
      }))

      db.employees.splice(index, 1)
    })

    res.status(204).send()
  } catch (error) {
    next(error)
  }
}
