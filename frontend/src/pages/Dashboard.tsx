import { useState } from 'react'
import Navbar from '../components/Navbar'
import SearchBar from '../components/SearchBar'
import FilterBar from '../components/FilterBar'
import Pagination from '../components/Pagination'
import SkeletonLoader from '../components/SkeletonLoader'
import TaskForm from '../components/TaskForm'
import KanbanBoard from '../components/KanbanBoard'
import { useDebounce } from '../hooks/useDebounce'
import {
  useCompleteTask,
  useCreateTask,
  useDeleteTask,
  useTasksQuery,
  useUpdateTask
} from '../hooks/useTasks'
import type { Task, TaskPriority, TaskStatus } from '../types'

type View = 'list' | 'kanban'

const PRIORITY_COLOR: Record<TaskPriority, string> = {
  Low: 'var(--success)',
  Medium: 'var(--warning)',
  High: 'var(--danger)'
}

const STATUS_BADGE_BG: Record<TaskStatus, string> = {
  'Pending': 'var(--warning-soft)',
  'In Progress': 'var(--accent-soft)',
  'Completed': 'var(--success-soft)'
}

export default function Dashboard() {
  const [view, setView] = useState<View>('kanban')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<TaskStatus | ''>('')
  const [priority, setPriority] = useState<TaskPriority | ''>('')
  const [sortBy, setSortBy] = useState<'dueDate' | 'createdAt' | 'priority'>(
    'createdAt'
  )
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(1)
  const [formOpen, setFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const debouncedSearch = useDebounce(search, 400)

  const query = {
    search: debouncedSearch || undefined,
    status: status || undefined,
    priority: priority || undefined,
    sortBy,
    sortOrder,
    page: view === 'list' ? page : 1,
    limit: view === 'list' ? 10 : 100
  }

  const { data, isLoading, isFetching } = useTasksQuery(query)
  const createTask = useCreateTask()
  const updateTask = useUpdateTask()
  const deleteTask = useDeleteTask()
  const completeTask = useCompleteTask()

  const tasks = data?.items ?? []

  const openCreateForm = () => {
    setEditingTask(null)
    setFormOpen(true)
  }

  const openEditForm = (task: Task) => {
    setEditingTask(task)
    setFormOpen(true)
  }

  const handleFormSubmit = (values: {
    title: string
    description?: string
    priority: TaskPriority
    status: TaskStatus
    dueDate: string
  }) => {
    if (editingTask) {
      updateTask.mutate(
        { id: editingTask._id, payload: values },
        { onSuccess: () => setFormOpen(false) }
      )
    } else {
      createTask.mutate(values, { onSuccess: () => setFormOpen(false) })
    }
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this task? This cannot be undone.')) {
      deleteTask.mutate(id)
    }
  }

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    updateTask.mutate({ id: taskId, payload: { status: newStatus } })
  }

  return (
    <div style={{ minHeight: '100%' }}>
      <Navbar />
      <main
        style={{ maxWidth: 1180, margin: '0 auto', padding: '24px 20px 60px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: 16,
            marginBottom: 20
          }}>
          <div>
            <h2 style={{ fontSize: 26 }}>Your board</h2>
            <p
              style={{
                color: 'var(--text-muted)',
                marginTop: 4,
                fontSize: 14
              }}>
              {data
                ? `${data.total} task${data.total === 1 ? '' : 's'} total`
                : 'Loading your tasks…'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div
              className="card"
              style={{ display: 'flex', padding: 4 }}>
              <button
                type="button"
                className="btn"
                style={{
                  background:
                    view === 'kanban' ? 'var(--accent)' : 'transparent',
                  color:
                    view === 'kanban' ? 'var(--accent-contrast)' : 'var(--text)'
                }}
                onClick={() => setView('kanban')}>
                Board
              </button>
              <button
                type="button"
                className="btn"
                style={{
                  background: view === 'list' ? 'var(--accent)' : 'transparent',
                  color:
                    view === 'list' ? 'var(--accent-contrast)' : 'var(--text)'
                }}
                onClick={() => setView('list')}>
                List
              </button>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={openCreateForm}>
              + New task
            </button>
          </div>
        </div>

        <div
          className="card"
          style={{
            padding: 16,
            marginBottom: 20,
            display: 'flex',
            gap: 12,
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
          <SearchBar
            value={search}
            onChange={(v) => {
              setSearch(v)
              setPage(1)
            }}
          />
          <FilterBar
            status={status}
            priority={priority}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onStatusChange={(v) => {
              setStatus(v)
              setPage(1)
            }}
            onPriorityChange={(v) => {
              setPriority(v)
              setPage(1)
            }}
            onSortByChange={setSortBy}
            onSortOrderChange={setSortOrder}
          />
        </div>

        {isLoading ? (
          <SkeletonLoader count={view === 'kanban' ? 9 : 6} />
        ) : tasks.length === 0 ? (
          <div
            className="card"
            style={{ padding: 48, textAlign: 'center' }}>
            <h3 style={{ fontSize: 18, marginBottom: 8 }}>Nothing here yet</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>
              Create your first task or adjust your filters.
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={openCreateForm}>
              + New task
            </button>
          </div>
        ) : view === 'kanban' ? (
          <KanbanBoard
            tasks={tasks}
            onStatusChange={handleStatusChange}
            onEdit={openEditForm}
            onDelete={handleDelete}
          />
        ) : (
          <>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 14,
                opacity: isFetching ? 0.6 : 1
              }}>
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="card"
                  style={{
                    padding: 16,
                    borderLeft: `3px solid ${PRIORITY_COLOR[task.priority]}`
                  }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 8
                    }}>
                    <strong style={{ fontSize: 15 }}>{task.title}</strong>
                    <span
                      className="mono"
                      style={{
                        fontSize: 10.5,
                        padding: '2px 8px',
                        borderRadius: 999,
                        background: STATUS_BADGE_BG[task.status],
                        whiteSpace: 'nowrap',
                        height: 'fit-content'
                      }}>
                      {task.status}
                    </span>
                  </div>
                  {task.description && (
                    <p
                      style={{
                        fontSize: 13,
                        color: 'var(--text-muted)',
                        margin: '8px 0 12px'
                      }}>
                      {task.description}
                    </p>
                  )}
                  <div
                    className="mono"
                    style={{
                      fontSize: 11.5,
                      color: 'var(--text-muted)',
                      marginBottom: 12
                    }}>
                    Due {new Date(task.dueDate).toLocaleDateString()} ·{' '}
                    {task.priority} priority
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {task.status !== 'Completed' && (
                      <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ fontSize: 12, padding: '5px 10px' }}
                        onClick={() => completeTask.mutate(task._id)}>
                        Mark complete
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ fontSize: 12, padding: '5px 10px' }}
                      onClick={() => openEditForm(task)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      style={{ fontSize: 12, padding: '5px 10px' }}
                      onClick={() => handleDelete(task._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {data && (
              <Pagination
                page={data.page}
                totalPages={data.totalPages}
                total={data.total}
                onPageChange={setPage}
              />
            )}
          </>
        )}
      </main>

      {formOpen && (
        <TaskForm
          initial={editingTask}
          onCancel={() => setFormOpen(false)}
          onSubmit={handleFormSubmit}
          submitting={createTask.isPending || updateTask.isPending}
        />
      )}
    </div>
  )
}
