import { User, UserData } from '@infra/db/models/users.model.js'
import { RegisterDto } from '../dto/register.dto.js'

export type SafeUser = Omit<ReturnType<User['toObject']>, 'password'>

export interface IAuthService {
  login(
    email: string,
    password: string
  ): Promise<{ user: SafeUser; token: string }>

  register(data: RegisterDto): Promise<{ username: string }>
}
