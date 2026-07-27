import logger from '@shared/lib/logger.js'
import { TaskModel } from '../models/tasks.model.js'
import { UserModel } from '../models/users.model.js'

const PRIORITIES = ['Low', 'Medium', 'High'] as const
const STATUSES = ['Pending', 'In Progress', 'Completed'] as const

const TITLES = [
  'Set up project repository',
  'Design database schema',
  'Implement authentication',
  'Build task dashboard UI',
  'Write API documentation',
  'Configure CI pipeline',
  'Add search and filters',
  'Implement pagination',
  'Write unit tests',
  'Deploy to staging',
  'Fix responsive layout bugs',
  'Review pull requests'
]

const daysFromNow = (days: number) => {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d
}

/** Seeds demo tasks for the demo user only if that user has no tasks yet. */
export const seedTasks = async (): Promise<void> => {
  const demoUser = await UserModel.findOne({ email: 'demo@taskmanager.com' })

  logger.info(
    `Task seeder: Found demo user: ${JSON.stringify(demoUser, null, 2)}`
  )
  if (!demoUser) {
    logger.warn('Task seeder skipped: demo user not found')
    return
  }

  const existing = await TaskModel.countDocuments({ userId: demoUser._id })
  if (existing > 0) {
    logger.info('Task seeder skipped: demo user already has tasks')
    return
  }

  const tasks = TITLES.map((title, index) => ({
    title,
    description: `Auto-generated seed task: ${title}`,
    priority: PRIORITIES[index % PRIORITIES.length],
    status: STATUSES[index % STATUSES.length],
    dueDate: daysFromNow(index + 1),
    order: index,
    userId: demoUser._id
  }))

  await TaskModel.insertMany(tasks)
  logger.info(`Seeded ${tasks.length} tasks for demo user`)
}
