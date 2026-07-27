import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  completeTaskRequest,
  createTaskRequest,
  deleteTaskRequest,
  fetchTasks,
  TaskPayload,
  updateTaskRequest,
} from "../api/task.api";
import { TaskQuery } from "../types";

const TASKS_KEY = "tasks";

export function useTasksQuery(query: Partial<TaskQuery>) {
  return useQuery({
    queryKey: [TASKS_KEY, query],
    queryFn: () => fetchTasks(query),
    placeholderData: (previous) => previous,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: TaskPayload) => createTaskRequest(payload),
    onSuccess: () => {
      toast.success("Task created");
      queryClient.invalidateQueries({ queryKey: [TASKS_KEY] });
    },
    onError: (err: unknown) => toast.error(extractErrorMessage(err)),
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<TaskPayload>;
    }) => updateTaskRequest(id, payload),
    onSuccess: () => {
      toast.success("Task updated");
      queryClient.invalidateQueries({ queryKey: [TASKS_KEY] });
    },
    onError: (err: unknown) => toast.error(extractErrorMessage(err)),
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTaskRequest(id),
    onSuccess: () => {
      toast.success("Task deleted");
      queryClient.invalidateQueries({ queryKey: [TASKS_KEY] });
    },
    onError: (err: unknown) => toast.error(extractErrorMessage(err)),
  });
}

export function useCompleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => completeTaskRequest(id),
    onSuccess: () => {
      toast.success("Task marked as completed");
      queryClient.invalidateQueries({ queryKey: [TASKS_KEY] });
    },
    onError: (err: unknown) => toast.error(extractErrorMessage(err)),
  });
}

export function extractErrorMessage(err: unknown): string {
  const e = err as { response?: { data?: { message?: string } } };
  return e?.response?.data?.message || "Something went wrong";
}
