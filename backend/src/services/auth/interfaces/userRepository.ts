import { User } from '@infra/db/models/users.model.js'

export type CreateUserInput = {
  email: string
  name: string
  password: string
  role?: string
}

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>

  create(data: CreateUserInput): Promise<User>
}
