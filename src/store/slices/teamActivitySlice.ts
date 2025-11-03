import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../index'

export interface Activity {
  id: string
  user: string
  action: string
  type: 'task' | 'document' | 'meeting' | 'message' | 'file' | 'approval'
  target?: string
  targetType?: 'document' | 'task' | 'meeting'
  timestamp: string
  widgetId: string
}

interface TeamActivityState {
  activities: Activity[]
}

const generateMockActivities = (count: number = 15): Activity[] => {
  const users = ['张三', '李四', '王五', '赵六', '钱七', '孙八']
  const actions = [
    '完成了',
    '更新了',
    '创建了',
    '评论了',
    '分享了',
    '安排了',
    '上传了',
    '需要审批'
  ]
  const types: Activity['type'][] = ['task', 'document', 'meeting', 'message', 'file', 'approval']
  const targets = [
    { name: '项目计划文档', type: 'document' },
    { name: '季度销售数据', type: 'spreadsheet' },
    { name: '产品演示', type: 'presentation' },
    { name: '技术方案', type: 'pdf' },
    { name: '用户需求分析', type: 'document' },
    { name: '市场调研报告', type: 'pdf' },
    { name: '代码实现', type: 'code' },
    { name: '财务预算', type: 'spreadsheet' },
    { name: '会议纪要', type: 'document' },
    { name: '产品原型设计', type: 'image' }
  ]

  return Array.from({ length: count }, (_, i) => {
    const randomTarget = targets[Math.floor(Math.random() * targets.length)]
    const randomType = types[Math.floor(Math.random() * types.length)]
    const randomAction = actions[Math.floor(Math.random() * actions.length)]
    const randomUser = users[Math.floor(Math.random() * users.length)]

    return {
      id: `activity-${Date.now()}-${i}`,
      user: randomUser,
      action: randomAction,
      type: randomType,
      target: Math.random() > 0.3 ? randomTarget.name : undefined,
      targetType: Math.random() > 0.3 ? (randomTarget.type as 'document' | 'task' | 'meeting') : undefined,
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
      widgetId: ''
    }
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

const initialState: TeamActivityState = {
  activities: generateMockActivities(15),
}

const teamActivitySlice = createSlice({
  name: 'teamActivity',
  initialState,
  reducers: {
    addActivity: (state, action: PayloadAction<Omit<Activity, 'id' | 'timestamp'>>) => {
      const newActivity: Activity = {
        ...action.payload,
        id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
      }
      state.activities.unshift(newActivity)
    },
    removeActivity: (state, action: PayloadAction<string>) => {
      state.activities = state.activities.filter(activity => activity.id !== action.payload)
    },
    clearOldActivities: (state, action: PayloadAction<number>) => {
      const cutoffDate = new Date(Date.now() - action.payload * 24 * 60 * 60 * 1000)
      state.activities = state.activities.filter(activity => new Date(activity.timestamp) > cutoffDate)
    },
  },
})

export const { addActivity, removeActivity, clearOldActivities } = teamActivitySlice.actions
export const selectTeamActivities = (state: RootState) => state.teamActivity.activities
export default teamActivitySlice.reducer