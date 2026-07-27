// shared/lib/jwt/jwt.types.ts

export interface AccessTokenPayload {
  userId: ObjectId
  email: string
  role: string
}

export interface RefreshTokenPayload {
  userId: ObjectId
}
