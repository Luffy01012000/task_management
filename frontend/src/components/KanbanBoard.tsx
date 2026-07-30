import { useState } from 'react'
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import type { Task, TaskStatus } from '../types'

const COLUMNS: { key: TaskStatus; label: string }[] = [
  { key: 'Pending', label: 'Pending' },
  { key: 'In Progress', label: 'In Progress' },
  { key: 'Completed', label: 'Completed' }
]

const PRIORITY_COLOR: Record<Task['priority'], string> = {
  Low: 'var(--success)',
  Medium: 'var(--warning)',
  High: 'var(--danger)'
}

interface KanbanBoardProps {
  tasks: Task[]
  onStatusChange: (taskId: string, status: TaskStatus) => void
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
}

function KanbanCard({
  task,
  onEdit,
  onDelete
}: {
  task: Task
  onEdit: (t: Task) => void
  onDelete: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: task._id })

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0.4 : 1
  }

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        borderLeft: `3px solid ${PRIORITY_COLOR[task.priority]}`
      }}
      className="card kanban-card"
      {...listeners}
      {...attributes}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
        <strong style={{ fontSize: 14, lineHeight: 1.3 }}>{task.title}</strong>
      </div>
      {task.description && (
        <p
          style={{
            fontSize: 12.5,
            color: 'var(--text-muted)',
            margin: '6px 0 10px'
          }}>
          {task.description.length > 90
            ? `${task.description.slice(0, 90)}…`
            : task.description}
        </p>
      )}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 8
        }}>
        <span
          className="mono"
          style={{ fontSize: 11, color: 'var(--text-muted)' }}>
          Due {new Date(task.dueDate).toLocaleDateString()}
        </span>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ padding: '3px 8px', fontSize: 11 }}
            onClick={(e) => {
              e.stopPropagation()
              onEdit(task)
            }}>
            Edit
          </button>
          <button
            type="button"
            className="btn btn-danger"
            style={{ padding: '3px 8px', fontSize: 11 }}
            onClick={(e) => {
              e.stopPropagation()
              onDelete(task._id)
            }}>
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

function KanbanColumn({
  status,
  label,
  tasks,
  onEdit,
  onDelete
}: {
  status: TaskStatus
  label: string
  tasks: Task[]
  onEdit: (t: Task) => void
  onDelete: (id: string) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <div
      ref={setNodeRef}
      className="card"
      style={{
        flex: 1,
        minWidth: 260,
        padding: 14,
        background: isOver ? 'var(--accent-soft)' : 'var(--surface)',
        transition: 'background-color 0.15s ease'
      }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12
        }}>
        <h3
          style={{
            fontSize: 14,
            textTransform: 'uppercase',
            letterSpacing: '0.04em'
          }}>
          {label}
        </h3>
        <span
          className="mono"
          style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          {tasks.length}
        </span>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          minHeight: 60
        }}>
        {tasks.map((task) => (
          <KanbanCard
            key={task._id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
        {tasks.length === 0 && (
          <p
            style={{
              fontSize: 12.5,
              color: 'var(--text-muted)',
              textAlign: 'center',
              padding: '20px 0'
            }}>
            Drop a task here
          </p>
        )}
      </div>
    </div>
  )
}

export default function KanbanBoard({
  tasks,
  onStatusChange,
  onEdit,
  onDelete
}: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  )

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t._id === event.active.id)
    setActiveTask(task ?? null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null)
    const { active, over } = event
    if (!over) return
    const newStatus = over.id as TaskStatus
    const task = tasks.find((t) => t._id === active.id)
    if (task && task.status !== newStatus) {
      onStatusChange(task._id, newStatus)
    }
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}>
      <div
        style={{
          display: 'flex',
          gap: 16,
          alignItems: 'flex-start',
          overflowX: 'auto',
          paddingBottom: 8
        }}>
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.key}
            status={col.key}
            label={col.label}
            tasks={tasks.filter((t) => t.status === col.key)}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask ? (
          <div
            className="card"
            style={{
              padding: 14,
              borderLeft: `3px solid ${PRIORITY_COLOR[activeTask.priority]}`
            }}>
            <strong style={{ fontSize: 14 }}>{activeTask.title}</strong>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
