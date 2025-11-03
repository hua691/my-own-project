import React, { useState, useEffect } from 'react'
import { Responsive, WidthProvider } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import { useAppSelector, useAppDispatch } from './store/hooks'
import { updateLayout, addWidget, removeWidget } from './store/slices/dashboardSlice'
import TodoList from './components/TodoList'
import PerformanceChart from './components/PerformanceChart'
import RecentDocuments from './components/RecentDocuments'
import TeamActivity from './components/TeamActivity'
import SystemNotifications from './components/SystemNotifications'
import QuickAccess from './components/QuickAccess'
import WidgetSelector from './components/WidgetSelector'

const ResponsiveGridLayout = WidthProvider(Responsive)

const App: React.FC = () => {
  const dispatch = useAppDispatch()
  const { layout, widgets } = useAppSelector((state) => state.dashboard)
  const [isAddingWidget, setIsAddingWidget] = useState(false)

  const widgetComponents: Record<string, React.FC<{ widgetId: string }>> = {
    todoList: TodoList,
    performanceChart: PerformanceChart,
    recentDocuments: RecentDocuments,
    teamActivity: TeamActivity,
    systemNotifications: SystemNotifications,
    quickAccess: QuickAccess,
  }

  // 添加默认组件
  useEffect(() => {
    if (widgets.length === 0) {
      dispatch(addWidget('todoList'))
      dispatch(addWidget('performanceChart'))
      dispatch(addWidget('recentDocuments'))
      dispatch(addWidget('teamActivity'))
      dispatch(addWidget('systemNotifications'))
      dispatch(addWidget('quickAccess'))
    }
  }, [dispatch, widgets.length])

  const onLayoutChange = (newLayout: any[]) => {
    dispatch(updateLayout(newLayout))
  }

  const handleAddWidget = (widgetType: string) => {
    dispatch(addWidget(widgetType))
    setIsAddingWidget(false)
  }

  const handleRemoveWidget = (widgetId: string) => {
    dispatch(removeWidget(widgetId))
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>智能个人工作空间仪表盘</h1>
        <button 
          className="add-widget-btn"
          onClick={() => setIsAddingWidget(true)}
        >
          + 添加组件
        </button>
      </header>

      {isAddingWidget && (
        <WidgetSelector 
          onAddWidget={handleAddWidget}
          onClose={() => setIsAddingWidget(false)}
        />
      )}

      <ResponsiveGridLayout
        className="layout"
        layouts={layout}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={30}
        onLayoutChange={onLayoutChange}
        draggableHandle=".widget-drag-handle"
      >
        {widgets.map((widget) => {
          const WidgetComponent = widgetComponents[widget.type]
          if (!WidgetComponent) return null

          return (
            <div key={widget.id} data-grid={widget.grid}>                <div className="widget-container">
                <div className="widget-header">
                  <div className="widget-drag-handle">
                    <span className="widget-title">{widget.title}</span>
                  </div>
                  <div className="widget-controls">
                    <button 
                      className="widget-control-btn minimize-btn"
                      title="最小化"
                    >
                      - 
                    </button>
                    <button 
                      className="widget-control-btn remove-btn"
                      title="关闭"
                      onClick={() => handleRemoveWidget(widget.id)}
                    >
                      ×
                    </button>
                  </div>
                </div>
                <div className="widget-content">
                  <WidgetComponent widgetId={widget.id} />
                </div>
              </div>
            </div>
          )
        })}
      </ResponsiveGridLayout>
    </div>
  )
}

export default App