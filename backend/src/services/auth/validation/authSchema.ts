import { z } from 'zod'

const name = z.string().trim().min(1, 'Name is required')
const email = z.email('Email must be valid').toLowerCase()
const password = z.string().min(6, 'Password must be at least 6 characters')

export const registrationSchema = z.object({
  name,
  email,
  password
})

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Password is required')
})

export type RegistrationInput = z.infer<typeof registrationSchema>
export type LoginInput = z.infer<typeof loginSchema>
