import { Schema, model, Document, Types } from 'mongoose'

export type TaskPriority = 'Low' | 'Medium' | 'High'
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed'

export interface ITask extends Document {
  _id: Types.ObjectId
  title: string
  description?: string
  priority: TaskPriority
  status: TaskStatus
  dueDate: Date
  order: number
  userId: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const taskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending'
    },
    dueDate: { type: Date, required: true },
    order: { type: Number, default: 0 },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    }
  },
  { timestamps: true }
)

taskSchema.index({ userId: 1, status: 1 })
taskSchema.index({ userId: 1, title: 'text' })

export const TaskModel = model<ITask>('Task', taskSchema)
