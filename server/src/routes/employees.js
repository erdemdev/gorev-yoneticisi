import { Router } from 'express'
import {
  createEmployee,
  deleteEmployee,
  getEmployee,
  listEmployees,
  updateEmployee,
} from '../controllers/employeesController.js'
import {
  validateCreateEmployee,
  validateUpdateEmployee,
} from '../middleware/validate.js'

const router = Router()

router.get('/', listEmployees)
router.get('/:id', getEmployee)
router.post('/', validateCreateEmployee, createEmployee)
router.put('/:id', validateUpdateEmployee, updateEmployee)
router.delete('/:id', deleteEmployee)

export default router
