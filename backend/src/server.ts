import DotenvFlow from 'dotenv-flow'
DotenvFlow.config()

import { createServer } from './app.js'
import logger from '@shared/lib/logger.js'
import config from '@shared/config/index.js'
import { connectToDatabase } from '@infra/db/mongo.js'
import { disConnectDatabase } from '@infra/db/mongo.js'

const port = process.env.PORT || 3001
const server = createServer()

connectToDatabase()
  .then(() => {
    server.listen(port, () => {
      logger.info(`Api running on ${port}`, {
        meta: {
          env: config.node_env,
          Port: port
        }
      })
    })
  })
  .catch((err) => {
    logger.error('Error in db connection', {
      meta: err
    })
  })

process.on('unhandledRejection', (reason) => {
  disConnectDatabase()
  logger.error('Unhandled Rejection:', reason)
})

process.on('uncaughtException', (error) => {
  disConnectDatabase()
  logger.error('Uncaught Exception:', error)
  process.exit(1)
})
