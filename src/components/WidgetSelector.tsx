import React from 'react'

interface WidgetSelectorProps {
  onAddWidget: (widgetType: string) => void
  onClose: () => void
}

const WidgetSelector: React.FC<WidgetSelectorProps> = ({ onAddWidget, onClose }) => {
  const widgetTypes = [
    {
      type: 'todoList',
      icon: '✅',
      title: '待办任务',
      description: '管理和跟踪您的任务列表',
      defaultSize: { w: 4, h: 8 }
    },
    {
      type: 'performanceChart',
      icon: '📊',
      title: '业绩图表',
      description: '可视化您的KPI指标和业绩数据',
      defaultSize: { w: 8, h: 10 }
    },
    {
      type: 'recentDocuments',
      icon: '📄',
      title: '最近文档',
      description: '快速访问最近查看和编辑的文档',
      defaultSize: { w: 4, h: 8 }
    },
    {
      type: 'teamActivity',
      icon: '👥',
      title: '团队动态',
      description: '查看团队成员的最新活动和更新',
      defaultSize: { w: 4, h: 8 }
    },
    {
      type: 'systemNotifications',
      icon: '🔔',
      title: '系统通知',
      description: '接收系统和应用的实时通知',
      defaultSize: { w: 4, h: 6 }
    },
    {
      type: 'quickAccess',
      icon: '⚡',
      title: '快速入口',
      description: '常用功能的快捷访问方式',
      defaultSize: { w: 4, h: 6 }
    }
  ]

  return (
    <div className="widget-selector-overlay" onClick={onClose}>
      <div className="widget-selector-container" onClick={(e) => e.stopPropagation()}>
        <div className="widget-selector-header">
          <h2>添加组件</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="widget-selector-content">
          <div className="widget-grid">
            {widgetTypes.map((widget) => (
              <div 
                key={widget.type}
                className="widget-card"
                onClick={() => onAddWidget(widget.type)}
              >
                <div className="widget-card-icon">{widget.icon}</div>
                <div className="widget-card-title">{widget.title}</div>
                <div className="widget-card-description">{widget.description}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="widget-selector-footer">
          <p>拖动组件可以调整位置和大小</p>
        </div>
      </div>
    </div>
  )
}

export default WidgetSelector