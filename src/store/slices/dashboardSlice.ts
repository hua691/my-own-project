import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../index'

interface WidgetGrid {
  w: number
  h: number
  x: number
  y: number
  i: string
}

interface Widget {
  id: string
  type: string
  title: string
  grid: WidgetGrid
  widgetId: string
  config?: any
}

interface DashboardState {
  layout: Record<string, WidgetGrid[]>
  widgets: Widget[]
}

const initialState: DashboardState = {
  layout: {
    lg: [],
    md: [],
    sm: [],
    xs: [],
    xxs: [],
  },
  widgets: [],
}

const widgetTitles: Record<string, string> = {
  todoList: '待办任务',
  performanceChart: '业绩图表',
  recentDocuments: '最近文档',
  teamActivity: '团队动态',
  systemNotifications: '系统通知',
  quickAccess: '快速入口',
}

const getNextAvailablePosition = (widgets: Widget[], type: string): { x: number, y: number, w: number, h: number } => {
  const defaultSizes: Record<string, { w: number, h: number }> = {
    todoList: { w: 4, h: 8 },
    performanceChart: { w: 8, h: 10 },
    recentDocuments: { w: 4, h: 8 },
    teamActivity: { w: 4, h: 8 },
    systemNotifications: { w: 4, h: 6 },
    quickAccess: { w: 4, h: 6 },
  }

  const size = defaultSizes[type] || { w: 4, h: 6 }
  const columnWidth = 12
  
  let x = 0
  let y = 0
  
  if (widgets.length > 0) {
    const sortedWidgets = [...widgets].sort((a, b) => a.grid.y - b.grid.y || a.grid.x - b.grid.x)
    const lastWidget = sortedWidgets[sortedWidgets.length - 1]
    x = lastWidget.grid.x + lastWidget.grid.w
    y = lastWidget.grid.y
    
    if (x + size.w > columnWidth) {
      x = 0
      y = lastWidget.grid.y + lastWidget.grid.h
    }
  }
  
  return { x, y, ...size }
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    updateLayout: (state, action: PayloadAction<{ breakpoint: string; layout: WidgetGrid[] }>) => {
      state.layout[action.payload.breakpoint] = action.payload.layout
    },
    addWidget: (state, action: PayloadAction<string>) => {
      const widgetType = action.payload
      const widgetId = `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const position = getNextAvailablePosition(state.widgets, widgetType)
      
      const newWidget: Widget = {
        id: widgetId,
        type: widgetType,
        title: widgetTitles[widgetType] || '未命名组件',
        grid: {
          ...position,
          i: widgetId,
        },
        widgetId,
      }
      
      state.widgets.push(newWidget)
      
      state.layout.lg.push(newWidget.grid)
    },
    removeWidget: (state, action: PayloadAction<string>) => {
      state.widgets = state.widgets.filter(widget => widget.id !== action.payload)
      
      Object.keys(state.layout).forEach(breakpoint => {
        state.layout[breakpoint as keyof typeof state.layout] = 
          state.layout[breakpoint as keyof typeof state.layout].filter(item => item.i !== action.payload)
      })
    },
    updateWidgetConfig: (state, action: PayloadAction<{ widgetId: string; config: any }>) => {
      const widget = state.widgets.find(w => w.widgetId === action.payload.widgetId)
      if (widget) {
        widget.config = { ...widget.config, ...action.payload.config }
      }
    },
  },
})

export const { updateLayout, addWidget, removeWidget, updateWidgetConfig } = dashboardSlice.actions
export const selectLayout = (state: RootState) => state.dashboard.layout
export const selectWidgets = (state: RootState) => state.dashboard.widgets
export default dashboardSlice.reducer