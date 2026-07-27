import { TaskPriority, TaskStatus } from "../types";

interface FilterBarProps {
  status: TaskStatus | "";
  priority: TaskPriority | "";
  sortBy: "dueDate" | "createdAt" | "priority";
  sortOrder: "asc" | "desc";
  onStatusChange: (v: TaskStatus | "") => void;
  onPriorityChange: (v: TaskPriority | "") => void;
  onSortByChange: (v: "dueDate" | "createdAt" | "priority") => void;
  onSortOrderChange: (v: "asc" | "desc") => void;
}

export default function FilterBar({
  status,
  priority,
  sortBy,
  sortOrder,
  onStatusChange,
  onPriorityChange,
  onSortByChange,
  onSortOrderChange,
}: FilterBarProps) {
  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
      <select
        className="select"
        style={{ width: "auto" }}
        value={status}
        onChange={(e) => onStatusChange(e.target.value as TaskStatus | "")}
        aria-label="Filter by status"
      >
        <option value="">All statuses</option>
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>

      <select
        className="select"
        style={{ width: "auto" }}
        value={priority}
        onChange={(e) => onPriorityChange(e.target.value as TaskPriority | "")}
        aria-label="Filter by priority"
      >
        <option value="">All priorities</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <select
        className="select"
        style={{ width: "auto" }}
        value={sortBy}
        onChange={(e) =>
          onSortByChange(e.target.value as "dueDate" | "createdAt" | "priority")
        }
        aria-label="Sort by"
      >
        <option value="createdAt">Sort: Created date</option>
        <option value="dueDate">Sort: Due date</option>
        <option value="priority">Sort: Priority</option>
      </select>

      <button
        type="button"
        className="btn btn-secondary"
        onClick={() => onSortOrderChange(sortOrder === "asc" ? "desc" : "asc")}
        title="Toggle sort direction"
      >
        {sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
      </button>
    </div>
  );
}
