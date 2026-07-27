import { seedUsers } from './user.seeder.js'
import { seedTasks } from './task.seeder.js'
import logger from '@shared/lib/logger.js'
import { connectToDatabase, disConnectDatabase } from '../mongo.js'

export const runSeeders = async (): Promise<void> => {
  logger.info('Running seeders...')
  await seedUsers()
  await seedTasks()
  logger.info('Seeding complete')
}

// Allows `npm run seed` to run this file directly (connects its own DB).
;(async () => {
  await connectToDatabase()
  await runSeeders()
  await disConnectDatabase()
  process.exit(0)
})().catch((err: unknown) => {
  logger.error('Seeding failed', err)
  process.exit(1)
})
