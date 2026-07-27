import express from 'express'
import dependencies from '../Dependencies/dependencies.js'
// import authorize from '@shared/middlewares/authorize.js'
import authenticate from '@shared/middlewares/authenticate.js'
import { validateBody } from '@shared/middlewares/validate.js'
import requestLogger from '@shared/middlewares/requestLogger.js'
import { loginSchema, registrationSchema } from '../validation/authSchema.js'

const router = express.Router()
const { controller } = dependencies
const authController = controller.authController

router.post(
  '/register',
  requestLogger,
  validateBody(registrationSchema),
  (req, res, next) => authController.register(req, res, next)
)

router.post(
  '/login',
  requestLogger,
  validateBody(loginSchema),
  (req, res, next) => authController.login(req, res, next)
)

router.get('/logout', requestLogger, authenticate, (req, res, next) =>
  authController.logout(req, res, next)
)

export default router
