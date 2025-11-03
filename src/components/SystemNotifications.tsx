import React, { useState } from 'react'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import { markNotificationAsRead, clearNotifications } from '../store/slices/notificationsSlice'
import { Notification } from '../store/slices/notificationsSlice'

interface SystemNotificationsProps {
  widgetId: string
}

const SystemNotifications: React.FC<SystemNotificationsProps> = ({ widgetId }) => {
  const dispatch = useAppDispatch()
  const notifications = useAppSelector((state) => state.notifications.notifications)
  const [showAll, setShowAll] = useState(false)

  const widgetNotifications = notifications.filter(n => n.widgetId === widgetId)
  const unreadCount = widgetNotifications.filter(n => !n.read).length

  const displayedNotifications = showAll 
    ? widgetNotifications 
    : widgetNotifications.slice(0, 5)

  const getNotificationIcon = (type: string): string => {
    switch (type) {
      case 'info': return 'ℹ️'
      case 'success': return '✅'
      case 'warning': return '⚠️'
      case 'error': return '❌'
      case 'alert': return '🔔'
      case 'update': return '🔄'
      default: return '📢'
    }
  }

  const getNotificationColor = (type: string): string => {
    switch (type) {
      case 'info': return '#3b82f6'
      case 'success': return '#10b981'
      case 'warning': return '#f59e0b'
      case 'error': return '#ef4444'
      case 'alert': return '#8b5cf6'
      case 'update': return '#ec4899'
      default: return '#6b7280'
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

  return (
    <div className="system-notifications-container">
      <div className="notifications-header">
        <div className="notifications-title">
          系统通知
          {unreadCount > 0 && (
            <span className="unread-badge">{unreadCount}</span>
          )}
        </div>
        <div className="notifications-actions">
          {unreadCount > 0 && (
            <button 
              className="mark-read-btn"
              onClick={() => widgetNotifications.forEach(n => dispatch(markNotificationAsRead(n.id)))} 
            >
              全部已读
            </button>
          )}
          {widgetNotifications.length > 0 && (
            <button 
              className="clear-btn"
              onClick={() => dispatch(clearNotifications(widgetId))}
            >
              清除
            </button>
          )}
        </div>
      </div>
      
      <div className="notifications-list">
        {widgetNotifications.length === 0 ? (
          <div className="empty-notifications">
            <p>暂无通知</p>
          </div>
        ) : (
          displayedNotifications.map((notification) => (
            <div 
              key={notification.id}
              className={`notification-item ${notification.read ? 'read' : 'unread'}`}
              onClick={() => dispatch(markNotificationAsRead(notification.id))}
            >
              <div 
                className="notification-icon"
                style={{ color: getNotificationColor(notification.type) }}
              >
                {getNotificationIcon(notification.type)}
              </div>
              <div className="notification-content">
                <div className="notification-message">{notification.message}</div>
                <div className="notification-time">{formatTime(notification.timestamp)}</div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {widgetNotifications.length > 5 && (
        <div className="show-more-btn-container">
          <button 
            className="show-more-btn"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? '收起' : `显示全部 (${widgetNotifications.length})`}
          </button>
        </div>
      )}
    </div>
  )
}

export default SystemNotifications