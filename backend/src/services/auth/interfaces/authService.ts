import { User } from '@infra/db/models/users.model.js'
import { RegisterDto } from '../dto/register.dto.js'

type SafeUser = Omit<User, 'password'>

export interface IAuthService {
  login(
    email: string,
    password: string
  ): Promise<{ user: SafeUser; token: string }>

  register(data: RegisterDto): Promise<{ user: SafeUser; token: string }>
}
