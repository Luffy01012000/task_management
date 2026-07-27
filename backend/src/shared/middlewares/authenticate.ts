import type { NextFunction, Request, Response } from 'express'
// import jwt from 'jsonwebtoken'
// import config from '../config/index.js'
import ResponseFormatter from '../utils/responseFormatter.js'
import { jwtService } from '@shared/lib/jwt/index.js'
import logger from '@shared/lib/logger.js'

export type AuthenticatedUser = {
  userId: number
  email: string
  roleId?: string
}

export default function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token =
    req.cookies?.authToken ??
    req.header('authorization')?.replace(/^Bearer\s+/i, '')

  if (!token) {
    return res
      .status(401)
      .json(ResponseFormatter.error('Authentication required', 401))
  }

  try {
    res.locals.user = jwtService.verifyAccessToken(token)
    next()
  } catch (err) {
    logger.error('error token==>>', {
      meta: { error: err }
    })
    return res
      .status(401)
      .json(ResponseFormatter.error('Invalid or expired token', 401))
  }
}
