export type TaskPriority = "Low" | "Medium" | "High";
export type TaskStatus = "Pending" | "In Progress" | "Completed";

export interface Task {
  _id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  order: number;
  owner: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface PaginatedTasks {
  items: Task[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TaskQuery {
  search?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  sortBy: "dueDate" | "createdAt" | "priority";
  sortOrder: "asc" | "desc";
  page: number;
  limit: number;
}

export interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data: T;
}
