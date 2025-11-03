import React, { useState } from 'react'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import { updateTodo, addTodo, toggleTodo } from '../store/slices/todoSlice'

interface TodoListProps {
  widgetId: string
}

const TodoList: React.FC<TodoListProps> = ({ widgetId }) => {
  const dispatch = useAppDispatch()
  const todos = useAppSelector((state) => state.todo.todos)
  const [newTodo, setNewTodo] = useState('')
  const [priority, setPriority] = useState('medium')

  const filteredTodos = todos
    .filter(todo => todo.widgetId === widgetId)
    .sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    })

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTodo.trim()) {
      dispatch(addTodo({ 
        text: newTodo.trim(), 
        priority,
        widgetId
      }))
      setNewTodo('')
      setPriority('medium')
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444'
      case 'medium': return '#f59e0b'
      case 'low': return '#10b981'
      default: return '#6b7280'
    }
  }

  return (
    <div className="todo-list-container">
      <form onSubmit={handleAddTodo} className="todo-add-form">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="添加新任务..."
          className="todo-input"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="todo-priority-select"
        >
          <option value="high">高优先级</option>
          <option value="medium">中优先级</option>
          <option value="low">低优先级</option>
        </select>
        <button type="submit" className="todo-add-btn">+</button>
      </form>

      <div className="todo-items">
        {filteredTodos.length === 0 ? (
          <div className="empty-todos">
            <p>暂无任务</p>
            <p>点击上方添加新任务</p>
          </div>
        ) : (
          filteredTodos.map((todo) => (
            <div
              key={todo.id}
              className={`todo-item ${todo.completed ? 'completed' : ''}`}
            >
              <div className="todo-checkbox">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => dispatch(toggleTodo(todo.id))}
                />
              </div>
              <div className="todo-content">
                <span className="todo-text">{todo.text}</span>
                <span 
                  className="todo-priority"
                  style={{ backgroundColor: getPriorityColor(todo.priority) }}
                >
                  {todo.priority === 'high' ? '高' : 
                   todo.priority === 'medium' ? '中' : '低'}
                </span>
              </div>
              <div className="todo-actions">
                <button
                  className="todo-delete-btn"
                  onClick={() => dispatch(updateTodo({ id: todo.id, completed: !todo.completed }))}
                >
                  {todo.completed ? '恢复' : '完成'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default TodoList