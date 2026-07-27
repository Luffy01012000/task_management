import { z } from 'zod'

const startOfToday = () => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

const dueDateSchema = z.coerce.date().refine((d) => d >= startOfToday(), {
  message: 'Due date cannot be in the past'
})

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, 'Title cannot be empty').max(200),
  description: z.string().trim().max(2000).optional().default(''),
  priority: z.enum(['Low', 'Medium', 'High']).default('Medium'),
  status: z.enum(['Pending', 'In Progress', 'Completed']).default('Pending'),
  dueDate: dueDateSchema
})

export const updateTaskSchema = z.object({
  title: z.string().trim().min(1, 'Title cannot be empty').max(200).optional(),
  description: z.string().trim().max(2000).optional(),
  priority: z.enum(['Low', 'Medium', 'High']).optional(),
  status: z.enum(['Pending', 'In Progress', 'Completed']).optional(),
  dueDate: z.coerce.date().optional(),
  order: z.number().optional()
})

export const taskQuerySchema = z.object({
  search: z.string().trim().optional(),
  status: z.enum(['Pending', 'In Progress', 'Completed']).optional(),
  priority: z.enum(['Low', 'Medium', 'High']).optional(),
  sortBy: z.enum(['dueDate', 'createdAt', 'priority']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10)
})

export const objectIdParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid task id')
})

export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>
export type TaskQueryInput = z.infer<typeof taskQuerySchema>
