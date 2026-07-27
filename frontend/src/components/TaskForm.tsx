import { FormEvent, useState } from "react";
import { Task } from "../types";
import { flattenZodErrors, taskSchema } from "../utils/validation";

interface TaskFormProps {
  initial?: Task | null;
  onCancel: () => void;
  onSubmit: (values: {
    title: string;
    description?: string;
    priority: Task["priority"];
    status: Task["status"];
    dueDate: string;
  }) => void;
  submitting?: boolean;
}

const toDateInputValue = (iso?: string) => (iso ? iso.slice(0, 10) : "");

export default function TaskForm({
  initial,
  onCancel,
  onSubmit,
  submitting,
}: TaskFormProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [priority, setPriority] = useState<Task["priority"]>(
    initial?.priority ?? "Medium",
  );
  const [status, setStatus] = useState<Task["status"]>(
    initial?.status ?? "Pending",
  );
  const [dueDate, setDueDate] = useState(toDateInputValue(initial?.dueDate));
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const result = taskSchema.safeParse({
      title,
      description,
      priority,
      status,
      dueDate,
    });
    if (!result.success) {
      setErrors(flattenZodErrors(result.error));
      return;
    }
    setErrors({});
    onSubmit(result.data);
  };

  return (
    <div
      style={overlayStyle}
      role="dialog"
      aria-modal="true"
      aria-label={initial ? "Edit task" : "Create task"}
    >
      <div className="card" style={modalStyle}>
        <h2 style={{ fontSize: 22, marginBottom: 20 }}>
          {initial ? "Edit task" : "New task"}
        </h2>
        <form onSubmit={handleSubmit} noValidate>
          <div style={{ marginBottom: 14 }}>
            <label className="mono" style={labelStyle} htmlFor="title">
              Title
            </label>
            <input
              id="title"
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
            {errors.title && <div className="field-error">{errors.title}</div>}
          </div>

          <div style={{ marginBottom: 14 }}>
            <label className="mono" style={labelStyle} htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              className="textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
            <div style={{ flex: 1 }}>
              <label className="mono" style={labelStyle} htmlFor="priority">
                Priority
              </label>
              <select
                id="priority"
                className="select"
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value as Task["priority"])
                }
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label className="mono" style={labelStyle} htmlFor="status">
                Status
              </label>
              <select
                id="status"
                className="select"
                value={status}
                onChange={(e) => setStatus(e.target.value as Task["status"])}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: 22 }}>
            <label className="mono" style={labelStyle} htmlFor="dueDate">
              Due date
            </label>
            <input
              id="dueDate"
              className="input"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
            {errors.dueDate && (
              <div className="field-error">{errors.dueDate}</div>
            )}
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting
                ? "Saving…"
                : initial
                  ? "Save changes"
                  : "Create task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed" as const,
  inset: 0,
  background: "rgba(15, 17, 21, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 20,
  zIndex: 100,
};

const modalStyle = { width: "100%", maxWidth: 460, padding: "28px 26px" };
const labelStyle = {
  display: "block",
  fontSize: 12,
  marginBottom: 6,
  color: "var(--text-muted)",
  textTransform: "uppercase" as const,
  letterSpacing: "0.04em",
};
