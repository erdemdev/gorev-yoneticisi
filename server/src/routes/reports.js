import { Router } from 'express'
import {
  getOverdue,
  getSummary,
  getWorkload,
} from '../controllers/reportsController.js'

const router = Router()

router.get('/summary', getSummary)
router.get('/workload', getWorkload)
router.get('/overdue', getOverdue)

export default router
