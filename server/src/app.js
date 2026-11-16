import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import apiRouter from './routes/index.js'

export function createApp() {
  const app = express()

  app.use(cors())
  app.use(express.json({ limit: '1mb' }))
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))

  app.get('/', (_req, res) => {
    res.json({
      name: 'Görev Yöneticisi API',
      version: '1.0.0',
      docs: 'README.md',
      endpoints: {
        health: 'GET /api/health',
        employees: '/api/employees',
        projects: '/api/projects',
        tasks: '/api/tasks',
        reports: '/api/reports/summary | /workload | /overdue',
      },
    })
  })

  app.use('/api', apiRouter)
  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
