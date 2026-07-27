import AppError from '@shared/errors/AppError.js'
import logger from '@shared/lib/logger.js'
import {
  ITaskRepository,
  PaginatedResult
} from '../interfaces/taskRepository.js'
import { TaskModel } from '@infra/db/models/tasks.model.js'
import { UnauthorizedError } from '@shared/errors/UnauthorizedError.js'
import { NotFoundError } from '@shared/errors/NotFoundError.js'
import { ITask } from '@infra/db/models/tasks.model.js'
import {
  CreateTaskInput,
  TaskQueryInput,
  UpdateTaskInput
} from '../validation/taskSchema.js'

export class TaskService {
  constructor(private readonly taskRepository: ITaskRepository) {
    if (!taskRepository) {
      throw new Error('TaskRepository is Required')
    }
    this.taskRepository = taskRepository
  }

  async list(
    userId: string,
    query: TaskQueryInput
  ): Promise<PaginatedResult<ITask>> {
    return await this.taskRepository.findPaginated(userId, query)
  }

  async getOne(userId: string, taskId: string): Promise<ITask> {
    const task = await this.taskRepository.findByIdForOwner(userId, taskId)

    if (!task) {
      throw new NotFoundError('Task not found')
    }

    return task
  }

  async create(userId: string, input: CreateTaskInput): Promise<ITask> {
    return await this.taskRepository.create(userId, input)
  }

  async update(
    userId: string,
    id: string,
    input: UpdateTaskInput
  ): Promise<ITask> {
    const task = await this.taskRepository.updateById(id, userId, input)
    if (!task) throw new NotFoundError('Task not found')
    return task
  }

  async remove(userId: string, id: string): Promise<ITask> {
    await this.taskRepository.deleteById(id, userId)
    if (!task) throw new NotFoundError('Task not found')
    return
  }

  async complete(userId: string, id: string): Promise<ITask> {
    return await this.taskRepository.deleteById(id, userId)
  }
}
