import { Router } from 'express'
import {
  assignTask,
  createTask,
  deleteTask,
  getTask,
  listTasks,
  updateTask,
  updateTaskStatus,
} from '../controllers/tasksController.js'
import {
  validateAssignTask,
  validateCreateTask,
  validateStatusUpdate,
  validateUpdateTask,
} from '../middleware/validate.js'

const router = Router()

router.get('/', listTasks)
router.get('/:id', getTask)
router.post('/', validateCreateTask, createTask)
router.put('/:id', validateUpdateTask, updateTask)
router.patch('/:id/assign', validateAssignTask, assignTask)
router.patch('/:id/status', validateStatusUpdate, updateTaskStatus)
router.delete('/:id', deleteTask)

export default router
