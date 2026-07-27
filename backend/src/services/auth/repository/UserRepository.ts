import BaseRepository from './BaseRepository.js'
import { User, UserModel } from '@infra/db/models/users.model.js'
import logger from '@shared/lib/logger.js'
import { RegistrationInput } from '../validation/authSchema.js'

export default class MongooseUserRepository extends BaseRepository<
  User,
  RegistrationInput,
  string
> {
  async create(data: RegistrationInput): Promise<User> {
    try {
      const user = await UserModel.create(data)

      logger.info('User created', {
        meta: {
          email: user.email
        }
      })

      return user
    } catch (error) {
      logger.error('Error creating user', error)
      throw error
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    return await UserModel.findOne({ email, deletedAt: null })
      .select('+password')
      .exec()
  }
}
