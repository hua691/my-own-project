import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../index'

interface Todo {
  id: string
  text: string
  priority: 'high' | 'medium' | 'low'
  completed: boolean
  createdAt: string
  updatedAt: string
  widgetId: string
}

interface TodoState {
  todos: Todo[]
}

const initialState: TodoState = {
  todos: [],
}

const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<{ text: string; priority: 'high' | 'medium' | 'low'; widgetId: string }>) => {
      const newTodo: Todo = {
        id: `todo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: action.payload.text,
        priority: action.payload.priority,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        widgetId: action.payload.widgetId,
      }
      state.todos.push(newTodo)
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find(t => t.id === action.payload)
      if (todo) {
        todo.completed = !todo.completed
        todo.updatedAt = new Date().toISOString()
      }
    },
    updateTodo: (state, action: PayloadAction<{ id: string; text?: string; priority?: 'high' | 'medium' | 'low'; completed?: boolean }>) => {
      const todo = state.todos.find(t => t.id === action.payload.id)
      if (todo) {
        if (action.payload.text !== undefined) todo.text = action.payload.text
        if (action.payload.priority !== undefined) todo.priority = action.payload.priority
        if (action.payload.completed !== undefined) todo.completed = action.payload.completed
        todo.updatedAt = new Date().toISOString()
      }
    },
    deleteTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload)
    },
  },
})

export const { addTodo, toggleTodo, updateTodo, deleteTodo } = todoSlice.actions
export const selectTodos = (state: RootState) => state.todo.todos
export default todoSlice.reducer