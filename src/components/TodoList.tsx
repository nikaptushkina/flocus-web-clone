import { useState } from 'react'
import { Plus, X, Star, Check } from 'lucide-react'
import type { Todo } from '../types'

interface TodoListProps {
  todos: Todo[]
  onAdd: (text: string, priority: boolean) => void
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onTogglePriority: (id: string) => void
}

export function TodoList({ todos, onAdd, onToggle, onDelete, onTogglePriority }: TodoListProps) {
  const [input, setInput] = useState('')
  const [addingPriority, setAddingPriority] = useState(false)

  const handleAdd = () => {
    if (!input.trim()) return
    onAdd(input.trim(), addingPriority)
    setInput('')
    setAddingPriority(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd()
  }

  const priorityTask = todos.find(t => t.priority && !t.completed)
  const remaining = todos.filter(t => !t.completed)
  const completed = todos.filter(t => t.completed)

  return (
    <div className="glass-panel-dark rounded-2xl p-4 w-72 max-h-96 flex flex-col animate-slide-up">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white/90 font-semibold text-sm tracking-wide">Focus To-dos</h3>
        <span className="text-white/40 text-xs">{remaining.length} left</span>
      </div>

      {/* Priority task highlight */}
      {priorityTask && (
        <div className="mb-3 p-2.5 rounded-xl bg-yellow-400/10 border border-yellow-400/20">
          <div className="flex items-center gap-2">
            <Star size={12} className="text-yellow-400 fill-yellow-400 flex-shrink-0" />
            <span className="text-white/90 text-sm font-medium truncate">{priorityTask.text}</span>
          </div>
        </div>
      )}

      {/* Todo list */}
      <div className="flex-1 overflow-y-auto scrollbar-hide space-y-1.5">
        {remaining.filter(t => !t.priority).map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
            onTogglePriority={onTogglePriority}
          />
        ))}

        {completed.length > 0 && (
          <>
            <div className="border-t border-white/10 pt-2 mt-2">
              <p className="text-white/30 text-xs mb-1.5">Completed ({completed.length})</p>
            </div>
            {completed.slice(0, 3).map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={onToggle}
                onDelete={onDelete}
                onTogglePriority={onTogglePriority}
              />
            ))}
          </>
        )}

        {todos.length === 0 && (
          <p className="text-white/30 text-sm text-center py-4">No tasks yet. Add one below!</p>
        )}
      </div>

      {/* Add input */}
      <div className="mt-3 pt-3 border-t border-white/10">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAddingPriority(!addingPriority)}
            className={`transition-colors flex-shrink-0 ${addingPriority ? 'text-yellow-400' : 'text-white/30 hover:text-white/60'}`}
            title="Mark as priority"
          >
            <Star size={14} className={addingPriority ? 'fill-yellow-400' : ''} />
          </button>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a task..."
            className="flex-1 bg-transparent text-white/80 text-sm placeholder:text-white/30 outline-none"
          />
          <button
            onClick={handleAdd}
            disabled={!input.trim()}
            className="text-white/40 hover:text-white/80 disabled:opacity-30 transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onTogglePriority: (id: string) => void
}

function TodoItem({ todo, onToggle, onDelete, onTogglePriority }: TodoItemProps) {
  return (
    <div className="group flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-white/5 transition-colors">
      <button
        onClick={() => onToggle(todo.id)}
        className={`w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center transition-all ${
          todo.completed
            ? 'bg-white/60 border-white/60'
            : 'border-white/30 hover:border-white/60'
        }`}
      >
        {todo.completed && <Check size={10} className="text-gray-800" />}
      </button>
      <span
        className={`flex-1 text-sm truncate transition-all ${
          todo.completed ? 'text-white/30 line-through' : 'text-white/80'
        }`}
      >
        {todo.text}
      </span>
      <div className="hidden group-hover:flex items-center gap-1">
        <button
          onClick={() => onTogglePriority(todo.id)}
          className={`transition-colors ${todo.priority ? 'text-yellow-400' : 'text-white/30 hover:text-yellow-400'}`}
        >
          <Star size={11} className={todo.priority ? 'fill-yellow-400' : ''} />
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className="text-white/30 hover:text-red-400 transition-colors"
        >
          <X size={11} />
        </button>
      </div>
    </div>
  )
}
