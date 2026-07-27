import type { FilterQuery } from 'mongoose'
import { ITask, TaskModel } from '@infra/db/models/tasks.model.js'
import type { TaskQueryInput } from '../validation/taskSchema.js'
import {
  ITaskRepository,
  PaginatedResult
} from '../interfaces/taskRepository.js'

// Priority has a natural business order, not an alphabetical one.
const PRIORITY_RANK: Record<string, number> = { Low: 1, Medium: 2, High: 3 }

class TaskRepository implements ITaskRepository {
  async findPaginated(
    userId: string,
    query: TaskQueryInput
  ): Promise<PaginatedResult<ITask>> {
    const filter: FilterQuery<ITask> = { userId }

    if (query.search) {
      filter.title = { $regex: query.search, $options: 'i' }
    }
    if (query.status) filter.status = query.status
    if (query.priority) filter.priority = query.priority

    const skip = (query.page - 1) * query.limit

    // Priority sorting needs custom rank ordering, everything else is a native sort.
    if (query.sortBy === 'priority') {
      const pipeline = [
        { $match: filter },
        {
          $addFields: {
            priorityRank: {
              $switch: {
                branches: [
                  {
                    case: { $eq: ['$priority', 'Low'] },
                    then: PRIORITY_RANK.Low
                  },
                  {
                    case: { $eq: ['$priority', 'Medium'] },
                    then: PRIORITY_RANK.Medium
                  },
                  {
                    case: { $eq: ['$priority', 'High'] },
                    then: PRIORITY_RANK.High
                  }
                ],
                default: 0
              }
            }
          }
        },
        {
          $sort: {
            priorityRank: (query.sortOrder === 'asc' ? 1 : -1) as 1 | -1
          }
        },
        { $skip: skip },
        { $limit: query.limit }
      ]
      const [items, total] = await Promise.all([
        TaskModel.aggregate(pipeline),
        TaskModel.countDocuments(filter)
      ])
      return {
        items: items as ITask[],
        total,
        page: query.page,
        limit: query.limit,
        totalPages: Math.max(1, Math.ceil(total / query.limit))
      }
    }

    const sortField = query.sortBy
    const sortDir = query.sortOrder === 'asc' ? 1 : -1

    const [items, total] = await Promise.all([
      TaskModel.find(filter)
        .sort({ [sortField]: sortDir })
        .skip(skip)
        .limit(query.limit)
        .exec(),
      TaskModel.countDocuments(filter)
    ])

    return {
      items,
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.max(1, Math.ceil(total / query.limit))
    }
  }

  findByIdForOwner(id: string, userId: string) {
    return TaskModel.findOne({ _id: id, userId }).exec()
  }

  create(userId: string, data: Partial<ITask>) {
    return TaskModel.create({ ...data, userId })
  }

  updateById(id: string, userId: string, data: Partial<ITask>) {
    return TaskModel.findOneAndUpdate({ _id: id, userId }, data, {
      new: true,
      runValidators: true
    }).exec()
  }

  deleteById(id: string, userId: string) {
    return TaskModel.findOneAndDelete({ _id: id, userId }).exec()
  }
}

export default TaskRepository
