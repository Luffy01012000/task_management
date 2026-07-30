import { axiosClient } from './axiosClient'
import type { ApiEnvelope, AuthResponse } from '../types'

export interface RegisterPayload {
  name: string
  email: string
  password: string
}

export interface LoginPayload {
  email: string
  password: string
}

export const registerRequest = async (
  payload: RegisterPayload
): Promise<AuthResponse> => {
  const { data } = await axiosClient.post<ApiEnvelope<AuthResponse>>(
    '/auth/register',
    payload
  )
  return data.data
}

export const loginRequest = async (
  payload: LoginPayload
): Promise<AuthResponse> => {
  const { data } = await axiosClient.post<ApiEnvelope<AuthResponse>>(
    '/auth/login',
    payload
  )
  return data.data
}
