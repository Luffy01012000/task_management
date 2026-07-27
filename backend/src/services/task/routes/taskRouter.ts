import { Router } from 'express'
import dependencies from '../Dependencies/dependencies.js'
// import authorize from '@shared/middlewares/authorize.js'
import authenticate from '@shared/middlewares/authenticate.js'
import {
  validateBody,
  validateParams,
  validateQuery
} from '@shared/middlewares/validate.js'
import requestLogger from '@shared/middlewares/requestLogger.js'
import {
  createTaskSchema,
  objectIdParamSchema,
  taskQuerySchema,
  updateTaskSchema
} from '../validation/taskSchema.js'

const router = Router()
const { controller } = dependencies
const taskController = controller.taskController

router.get(
  '/',
  requestLogger,
  authenticate,
  validateQuery(taskQuerySchema),
  (req, res, next) => taskController.listTasks(req, res, next)
)

router.post(
  '/',
  requestLogger,
  authenticate,
  validateBody(createTaskSchema),
  (req, res, next) => taskController.createTask(req, res, next)
)

router.get(
  '/:id',
  requestLogger,
  authenticate,
  validateParams(objectIdParamSchema),
  (req, res, next) => taskController.getTask(req, res, next)
)

router.put(
  '/:id',
  requestLogger,
  authenticate,
  validateParams(objectIdParamSchema),
  (req, res, next) => taskController.updateTask(req, res, next)
)

router.delete(
  '/:id',
  requestLogger,
  authenticate,
  validateParams(objectIdParamSchema),
  (req, res, next) => taskController.deleteTask(req, res, next)
)

router.patch(
  '/:id/complete',
  requestLogger,
  authenticate,
  validateParams(objectIdParamSchema),
  (req, res, next) => taskController.taskCompleted(req, res, next)
)
export default router
