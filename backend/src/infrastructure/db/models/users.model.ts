import { Schema, model, InferSchemaType, HydratedDocument } from 'mongoose'

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
  },
  { timestamps: true }
)

export type UserData = InferSchemaType<typeof userSchema>
export type User = HydratedDocument<InferSchemaType<typeof userSchema>>
export const UserModel = model('User', userSchema)
