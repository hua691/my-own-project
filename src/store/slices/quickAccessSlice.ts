import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../index'

interface QuickAccessItem {
  id: string
  widgetId: string
  icon: string
  title: string
  description: string
  actionType: string
  actionParams?: any
}

interface QuickAccessState {
  items: QuickAccessItem[]
}

const generateMockQuickAccessItems = (): QuickAccessItem[] => {
  return [
    {
      id: 'quick-1',
      widgetId: '',
      icon: '📄',
      title: '新建文档',
      description: '创建新的Word文档',
      actionType: 'newDocument',
      actionParams: { type: 'document' }
    },
    {
      id: 'quick-2',
      widgetId: '',
      icon: '📊',
      title: '新建表格',
      description: '创建新的Excel表格',
      actionType: 'newDocument',
      actionParams: { type: 'spreadsheet' }
    },
    {
      id: 'quick-3',
      widgetId: '',
      icon: '🎬',
      title: '新建演示',
      description: '创建新的PPT演示',
      actionType: 'newDocument',
      actionParams: { type: 'presentation' }
    },
    {
      id: 'quick-4',
      widgetId: '',
      icon: '📅',
      title: '安排会议',
      description: '创建新的会议安排',
      actionType: 'scheduleMeeting',
      actionParams: { attendees: [] }
    },
    {
      id: 'quick-5',
      widgetId: '',
      icon: '📊',
      title: '数据分析',
      description: '查看业务数据分析',
      actionType: 'viewAnalytics',
      actionParams: { report: 'sales' }
    },
    {
      id: 'quick-6',
      widgetId: '',
      icon: '👥',
      title: '团队成员',
      description: '查看团队成员列表',
      actionType: 'teamMembers',
      actionParams: {} 
    },
    {
      id: 'quick-7',
      widgetId: '',
      icon: '⚙️',
      title: '设置',
      description: '打开系统设置',
      actionType: 'settings',
      actionParams: {} 
    },
    {
      id: 'quick-8',
      widgetId: '',
      icon: '❓',
      title: '帮助中心',
      description: '获取系统帮助',
      actionType: 'helpCenter',
      actionParams: {} 
    }
  ]
}

const initialState: QuickAccessState = {
  items: generateMockQuickAccessItems(),
}

const quickAccessSlice = createSlice({
  name: 'quickAccess',
  initialState,
  reducers: {
    addQuickAccessItem: (state, action: PayloadAction<Omit<QuickAccessItem, 'id'>>) => {
      const newItem: QuickAccessItem = {
        ...action.payload,
        id: `quick-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      }
      state.items.push(newItem)
    },
    removeQuickAccessItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload)
    },
    updateQuickAccessItem: (state, action: PayloadAction<{ id: string; updates: Partial<QuickAccessItem> }>) => {
      const item = state.items.find(item => item.id === action.payload.id)
      if (item) {
        Object.assign(item, action.payload.updates)
      }
    },
  },
})

export const { addQuickAccessItem, removeQuickAccessItem, updateQuickAccessItem } = quickAccessSlice.actions
export const selectQuickAccessItems = (state: RootState) => state.quickAccess.items
export default quickAccessSlice.reducer