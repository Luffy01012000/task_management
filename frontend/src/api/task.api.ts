import { axiosClient } from './axiosClient'
import type { ApiEnvelope, PaginatedTasks, Task, TaskQuery } from '../types'

export interface TaskPayload {
  title: string
  description?: string
  priority: Task['priority']
  status: Task['status']
  dueDate: string
}

export const fetchTasks = async (
  query: Partial<TaskQuery>
): Promise<PaginatedTasks> => {
  const { data } = await axiosClient.get<ApiEnvelope<PaginatedTasks>>(
    '/tasks',
    { params: query }
  )
  return data.data
}

export const createTaskRequest = async (
  payload: TaskPayload
): Promise<Task> => {
  const { data } = await axiosClient.post<ApiEnvelope<Task>>('/tasks', payload)
  return data.data
}

export const updateTaskRequest = async (
  id: string,
  payload: Partial<TaskPayload>
): Promise<Task> => {
  const { data } = await axiosClient.put<ApiEnvelope<Task>>(
    `/tasks/${id}`,
    payload
  )
  return data.data
}

export const deleteTaskRequest = async (id: string): Promise<void> => {
  await axiosClient.delete(`/tasks/${id}`)
}

export const completeTaskRequest = async (id: string): Promise<Task> => {
  const { data } = await axiosClient.patch<ApiEnvelope<Task>>(
    `/tasks/${id}/complete`
  )
  return data.data
}
