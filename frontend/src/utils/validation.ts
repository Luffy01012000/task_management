import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, "At least 8 characters")
  .regex(/[A-Z]/, "At least one uppercase letter")
  .regex(/[a-z]/, "At least one lowercase letter")
  .regex(/[0-9]/, "At least one number")
  .regex(/[^A-Za-z0-9]/, "At least one special character");

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Invalid email address"),
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

export const taskSchema = z.object({
  title: z.string().trim().min(1, "Title cannot be empty"),
  description: z.string().trim().optional(),
  priority: z.enum(["Low", "Medium", "High"]),
  status: z.enum(["Pending", "In Progress", "Completed"]),
  dueDate: z
    .string()
    .min(1, "Due date is required")
    .refine(
      (v) => new Date(v) >= startOfToday(),
      "Due date cannot be in the past",
    ),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
export type TaskFormValues = z.infer<typeof taskSchema>;

/** Flattens the first Zod error per field into a simple map for form display. */
export function flattenZodErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0]?.toString() ?? "form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
