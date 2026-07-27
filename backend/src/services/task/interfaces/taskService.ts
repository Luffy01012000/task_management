import type { ITask } from '@infra/db/models/tasks.model.js'
import {
  CreateTaskInput,
  TaskQueryInput,
  UpdateTaskInput
} from '../validation/taskSchema.js'
import { PaginatedResult } from './taskRepository.js'

export interface ITaskService {
  list(userId: string, query: TaskQueryInput): Promise<PaginatedResult<ITask[]>>

  getOne(userId: string, taskId: string): Promise<ITask>

  create(userId: string, input: CreateTaskInput): Promise<ITask>

  update(userId: string, id: string, input: UpdateTaskInput): Promise<ITask>

  remove(userId: string, id: string): Promise<void>
  complete(owner: string, id: string): Promise<ITask>
}
