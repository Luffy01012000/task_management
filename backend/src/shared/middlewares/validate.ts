import { NextFunction, Request, Response } from 'express'
import { AnyZodObject } from 'zod'

type ValidationTarget = 'body' | 'query' | 'params'

/**
 * Validates a request segment (body/query/params) against a Zod schema.
 * On success, replaces the segment with the parsed (and coerced/defaulted) data.
 */
export const validate =
  (schema: AnyZodObject, target: ValidationTarget = 'body') =>
  (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.parse(req[target])
    ;(req as unknown as Record<ValidationTarget, unknown>)[target] = parsed
    next()
  }

export const validateBody = <T>(schema: z.ZodType<T>) =>
  validate(schema, 'body')

export const validateParams = <T>(schema: z.ZodType<T>) =>
  validate(schema, 'params')

export const validateQuery = <T>(schema: z.ZodType<T>) =>
  validate(schema, 'params')
