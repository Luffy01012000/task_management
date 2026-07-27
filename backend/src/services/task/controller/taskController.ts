import type { Request, Response, NextFunction } from 'express'
import ResponseFormatter from '@shared/utils/responseFormatter.js'
import { ITaskService } from '../interfaces/taskService.js'

export class TaskController {
  constructor(private readonly taskService: ITaskService) {
    if (!taskService) {
      throw new Error('taskService is Required')
    }

    this.taskService = taskService
  }

  async listTasks(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = res.locals.user.userId
      const result = await this.taskService.list(userId, req.query as never)

      res
        .status(200)
        .json(
          ResponseFormatter.success(result, 'Task fetched successfully', 201)
        )
    } catch (error) {
      next(error)
    }
  }

  async getTask(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = res.locals.user.userId
      const task = await this.taskService.getOne(
        userId,
        req.params.id! as string
      )
      res.status(200).json({ success: true, data: task })

      res
        .status(200)
        .json(ResponseFormatter.success(task, 'Fetch Task successfully', 200))
    } catch (error) {
      next(error)
    }
  }

  async createTask(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = res.locals.user.userId
      const result = await this.taskService.create(userId, req.body)

      res
        .status(201)
        .json(
          ResponseFormatter.success(result, 'Task created successfully', 200)
        )
    } catch (error) {
      next(error)
    }
  }

  async updateTask(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = res.locals.user.userId
      const task = await this.taskService.update(
        userId,
        req.params.id! as string,
        req.body
      )
      res.status(200).json(ResponseFormatter.success(task, 'Task updated', 200))
    } catch (error) {
      next(error)
    }
  }

  async deleteTask(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = res.locals.user.userId
      await this.taskService.remove(userId, req.params.id! as string)

      res
        .status(200)
        .json(ResponseFormatter.success(null, 'Task deleted successful', 200))
    } catch (error) {
      next(error)
    }
  }

  async taskCompleted(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = res.locals.user.userId
      const task = await this.taskService.complete(
        userId,
        req.params.id! as string
      )

      res
        .status(200)
        .json(ResponseFormatter.success(task, 'Task marked as completed', 200))
    } catch (error) {
      next(error)
    }
  }
}
