import logger from '@shared/lib/logger.js'
import { UserModel } from '../models/users.model.js'
import bcrypt from 'bcryptjs'

const adminPassword = await bcrypt.hash('Admin@1234', 12)
const demoPassword = await bcrypt.hash('Demo@1234', 12)

const SEED_USERS = [
  {
    name: 'Admin User',
    email: 'admin@taskmanager.com',
    password: adminPassword,
    role: 'admin' as const
  },
  {
    name: 'Demo User',
    email: 'demo@taskmanager.com',
    password: demoPassword,
    role: 'user' as const
  }
]

/** Seeds demo users only if the users collection is empty (idempotent). */
export const seedUsers = async (): Promise<void> => {
  const count = await UserModel.countDocuments()
  logger.info(`User seeder: ${count} users found in the database`)
  if (count > 0) {
    logger.info('User seeder skipped: users already exist')
    return
  }

  await UserModel.create(SEED_USERS)
  logger.info(`Seeded ${SEED_USERS.length} users`)
}

export { SEED_USERS }
