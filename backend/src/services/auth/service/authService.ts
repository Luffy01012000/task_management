import config from '@shared/config/index.js'
import AppError from '@shared/errors/AppError.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import logger from '@shared/lib/logger.js'
import { IUserRepository } from '../interfaces/userRepository.js'
import { User } from '@infra/db/models/users.model.js'
import { RegisterDto } from '../dto/register.dto.js'
import { UnauthorizedError } from '@shared/errors/UnauthorizedError.js'
import { JwtService } from '@shared/lib/jwt/jwt.service.js'
import { SafeUser } from '../interfaces/authService.js'

/**
 * AuthService handles user authentication and authorization related operations such as onboarding super admin, user registration, login, and fetching user profile.
 * It interacts with the UserRepository to perform these operations and generates JWT tokens for authenticated users.
 */
export class AuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService
  ) {
    if (!userRepository) {
      throw new Error('UserRepository is Required')
    }
    this.userRepository = userRepository
    this.jwtService = jwtService
  }

  /**
   * Generates a JWT token for the given user.
   * @param {Object} user - The user object for which the token is generated.
   * @returns {string} - The generated JWT token.
   */
  generateToken(user: User) {
    const payload = {
      userId: user._id,
      email: user.email,
      role: user.role
    }

    return this.jwtService.signAccessToken(payload)
  }

  formatUserForResponse(user: User): SafeUser {
    const { password: _password, ...safeUser } = user.toObject()
    return safeUser as SafeUser
  }

  /**
   * Compares the user-entered password with the hashed password.
   * @param {string} userEnteredPassword - The password entered by the user.
   * @param {string} hashedPassword - The hashed password stored in the database.
   * @returns {Promise<boolean>} - Returns true if the passwords match, otherwise false.
   */
  async comparePassword(userEnteredPassword: string, hashedPassword: string) {
    return await bcrypt.compare(userEnteredPassword, hashedPassword)
  }

  /**
   * Registers a new user.
   * @param {Object} userData - The data of the user to be registered.
   * @returns {Promise<Object>} - Returns an object containing the user and token.
   */
  async register(dto: RegisterDto) {
    try {
      const existingEmail = await this.userRepository.findByEmail(dto.email)
      if (existingEmail) {
        throw new AppError('Email already exists', 409)
      }

      const passwordHash = await bcrypt.hash(dto.password, 12)
      const user = await this.userRepository.create({
        email: dto.email,
        name: dto.name,
        password: passwordHash
      })

      logger.info('User registered successfully', {
        meta: {
          email: user.email
        }
      })

      return {
        username: user.name
      }
    } catch (error) {
      logger.error('Error in Register service', error)
      throw error
    }
  }

  /**
   * Logs in a user.
   * @param {string} name - The username of the user.
   * @param {string} password - The password of the user.
   * @returns {Promise<Object>} - Returns an object containing the user and token.
   */
  async login(
    email: string,
    password: string
  ): Promise<{ user: SafeUser; token: string }> {
    const user = await this.userRepository.findByEmail(email)
    logger.info('email:', {
      meta: { email, user }
    })
    if (!user) {
      throw new UnauthorizedError('Invalid credentials')
    }

    const isPasswordValid = await this.comparePassword(password, user.password)
    logger.info('isPasswordValid:', {
      meta: { isPasswordValid, password }
    })
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401)
    }
    const token = this.generateToken(user)

    logger.info('User logged in successfully', {
      meta: { username: user.name, email: user.email }
    })

    return {
      user: this.formatUserForResponse(user),
      token
    }
  }
}
