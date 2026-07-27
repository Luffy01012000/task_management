import type { ITask } from '@infra/db/models/tasks.model.js'
import { TaskQueryInput } from '../validation/taskSchema.js'

export interface PaginatedResult<T> {
  items: ITask[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ITaskRepository {
  findPaginated(
    userId: string,
    query: TaskQueryInput
  ): Promise<PaginatedResult<ITask[]>>
  findByIdForOwner(id: string, userId: string): Promise<ITask | null>
  create(owner: string, data: Partial<ITask>): Promise<ITask>
  updateById(
    id: string,
    userId: string,
    data: Partial<ITask>
  ): Promise<ITask | null>
  deleteById(id: string, userId: string): Promise<ITask | null>
}
