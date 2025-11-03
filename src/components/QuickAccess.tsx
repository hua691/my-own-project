import React from 'react'
import { useAppSelector } from '../store/hooks'

interface QuickAccessItem {
  id: string
  widgetId: string
  icon: string
  title: string
  description: string
  actionType: string
  actionParams?: any
}

interface QuickAccessProps {
  widgetId: string
}

const QuickAccess: React.FC<QuickAccessProps> = ({ widgetId }) => {
  const quickAccessItems = useAppSelector((state) => state.quickAccess.items)

  const filteredItems = quickAccessItems.filter(item => item.widgetId === widgetId)

  const handleItemClick = (item: QuickAccessItem) => {
    switch (item.actionType) {
      case 'newDocument':
        console.log('创建新文档', item.actionParams)
        break
      case 'scheduleMeeting':
        console.log('安排会议', item.actionParams)
        break
      case 'viewAnalytics':
        console.log('查看数据分析', item.actionParams)
        break
      case 'teamMembers':
        console.log('查看团队成员', item.actionParams)
        break
      case 'settings':
        console.log('打开设置', item.actionParams)
        break
      case 'helpCenter':
        console.log('打开帮助中心', item.actionParams)
        break
      default:
        console.log('执行操作', item.actionType)
    }
  }

  return (
    <div className="quick-access-container">
      <div className="quick-access-grid">
        {filteredItems.map(item => (
          <div 
            key={item.id} 
            className="quick-access-card"
            onClick={() => handleItemClick(item)}
          >
            <div className="quick-access-icon">{item.icon}</div>
            <div className="quick-access-title">{item.title}</div>
            <div className="quick-access-description">{item.description}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default QuickAccess