import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../index'

export interface Notification {
  id: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error' | 'alert' | 'update'
  read: boolean
  timestamp: string
  widgetId: string
}

interface NotificationsState {
  notifications: Notification[]
}

const generateMockNotifications = (count: number = 8): Notification[] => {
  const types: Notification['type'][] = ['info', 'success', 'warning', 'error', 'alert', 'update']
  const messages = [
    '系统已更新到最新版本',
    '您的任务已完成',
    '有新的团队消息等待查看',
    '服务器维护计划：明天上午9点至11点',
    '您的文件已成功上传',
    '新的审批请求需要处理',
    '项目截止日期即将到来',
    '欢迎使用智能工作空间仪表盘'
  ]

  return Array.from({ length: count }, (_, i) => ({
    id: `notification-${Date.now()}-${i}`,
    message: messages[i % messages.length],
    type: types[Math.floor(Math.random() * types.length)],
    read: Math.random() > 0.5,
    timestamp: new Date(Date.now() - Math.floor(Math.random() * 3 * 24 * 60 * 60 * 1000)).toISOString(),
    widgetId: ''
  })).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

const initialState: NotificationsState = {
  notifications: generateMockNotifications(8),
}

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'read' | 'timestamp'>>) => {
      const newNotification: Notification = {
        ...action.payload,
        id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        read: false,
        timestamp: new Date().toISOString(),
      }
      state.notifications.unshift(newNotification)
    },
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload)
      if (notification) {
        notification.read = true
      }
    },
    markAllNotificationsAsRead: (state, action: PayloadAction<string>) => {
      state.notifications.forEach(notification => {
        if (notification.widgetId === action.payload) {
          notification.read = true
        }
      })
    },
    clearNotifications: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(notification => notification.widgetId !== action.payload)
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(notification => notification.id !== action.payload)
    },
  },
})

export const { addNotification, markNotificationAsRead, markAllNotificationsAsRead, clearNotifications, removeNotification } = notificationsSlice.actions
export const selectNotifications = (state: RootState) => state.notifications.notifications
export default notificationsSlice.reducer