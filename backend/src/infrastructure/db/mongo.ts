import config from '@shared/config/index.js'
import mongoose from 'mongoose'

const MONGODB_URI = config.mongo_uri || 'mongodb://localhost:27017/task-manager'

export async function connectToDatabase() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB successfully')
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error)
    process.exit(1)
  }
}

export async function disConnectDatabase() {
  try {
    await mongoose.disconnect()
    console.log('Disconnected to MongoDB successfully')
  } catch (error) {
    console.error('Failed to disConnect to MongoDB:', error)
    process.exit(1)
  }
}
