import { Router } from 'express'
import employeesRouter from './employees.js'
import projectsRouter from './projects.js'
import tasksRouter from './tasks.js'
import reportsRouter from './reports.js'

const router = Router()

router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'gorev-yoneticisi-api',
    timestamp: new Date().toISOString(),
  })
})

router.use('/employees', employeesRouter)
router.use('/projects', projectsRouter)
router.use('/tasks', tasksRouter)
router.use('/reports', reportsRouter)

export default router
