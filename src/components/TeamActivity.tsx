import React, { useState } from 'react'
import { useAppSelector } from '../store/hooks'
import { Activity } from '../store/slices/teamActivitySlice'

interface TeamActivityProps {
  widgetId: string
}

const TeamActivity: React.FC<TeamActivityProps> = ({ widgetId }) => {
  const activities = useAppSelector((state) => state.teamActivity.activities)
  const [filterBy, setFilterBy] = useState('all')

  const filteredActivities = activities
    .filter(activity => activity.widgetId === widgetId)
    .filter(activity => filterBy === 'all' || activity.type === filterBy)
    .sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )

  const getActivityIcon = (type: string): string => {
    switch (type) {
      case 'task': return '✅'
      case 'document': return '📄'
      case 'meeting': return '📅'
      case 'message': return '💬'
      case 'file': return '📁'
      case 'approval': return '🔄'
      default: return 'ℹ️'
    }
  }

  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffMinutes = Math.floor(diffTime / (1000 * 60))
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffMinutes < 1) return '刚刚'
    if (diffMinutes < 60) return `${diffMinutes}分钟前`
    if (diffHours < 24) return `${diffHours}小时前`
    if (diffDays < 7) return `${diffDays}天前`
    return date.toLocaleDateString('zh-CN')
  }

  const getActivityColor = (type: string): string => {
    switch (type) {
      case 'task': return '#10b981'
      case 'document': return '#3b82f6'
      case 'meeting': return '#f59e0b'
      case 'message': return '#8b5cf6'
      case 'file': return '#ec4899'
      case 'approval': return '#ef4444'
      default: return '#6b7280'
    }
  }

  return (
    <div className="team-activity-container">
      <div className="activity-controls">
        <select 
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
          className="activity-filter"
        >
          <option value="all">全部活动</option>
          <option value="task">任务更新</option>
          <option value="document">文档操作</option>
          <option value="meeting">会议安排</option>
          <option value="message">消息通知</option>
          <option value="file">文件上传</option>
        </select>
      </div>
      
      <div className="activity-list">
        {filteredActivities.length === 0 ? (
          <div className="empty-activities">
            <p>暂无团队活动</p>
          </div>
        ) : (
          filteredActivities.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div 
                className="activity-icon"
                style={{ color: getActivityColor(activity.type) }}
              >
                {getActivityIcon(activity.type)}
              </div>
              <div className="activity-content">
                <div className="activity-text">
                  <span className="activity-user">{activity.user}</span>
                  {activity.action}
                  {activity.target && (
                    <span className="activity-target">
                      {activity.targetType === 'document' ? '文档' : 
                       activity.targetType === 'task' ? '任务' : 
                       activity.targetType === 'meeting' ? '会议' : ''}
                      《{activity.target}》
                    </span>
                  )}
                </div>
                <div className="activity-time">
                  {formatTime(activity.timestamp)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default TeamActivity