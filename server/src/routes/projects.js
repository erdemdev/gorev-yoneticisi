import { Router } from 'express'
import {
  createProject,
  deleteProject,
  getProject,
  listProjects,
  updateProject,
} from '../controllers/projectsController.js'
import {
  validateCreateProject,
  validateUpdateProject,
} from '../middleware/validate.js'

const router = Router()

router.get('/', listProjects)
router.get('/:id', getProject)
router.post('/', validateCreateProject, createProject)
router.put('/:id', validateUpdateProject, updateProject)
router.delete('/:id', deleteProject)

export default router
