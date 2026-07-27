import config from '@shared/config/index.js'
import logger from '@shared/lib/logger.js'
import mongoose from 'mongoose'

const MONGODB_URI = config.mongo_uri || 'mongodb://localhost:27017/task-manager'

export async function connectToDatabase() {
  try {
    await mongoose.connect(MONGODB_URI)
    logger.info('Connected to MongoDB successfully')
  } catch (error) {
    logger.error('Failed to connect to MongoDB:', error)
    process.exit(1)
  }
}

export async function disConnectDatabase() {
  try {
    await mongoose.disconnect()
    logger.info('Disconnected from MongoDB successfully')
  } catch (error) {
    logger.error('Failed to disConnect to MongoDB:', error)
    process.exit(1)
  }
}
