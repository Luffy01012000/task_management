// shared/lib/jwt/jwt.types.ts

export interface AccessTokenPayload {
  userId: any
  email: string
  role: string
}

export interface RefreshTokenPayload {
  userId: any
}
