import React, { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, ComposedChart } from 'recharts'
import { useAppSelector } from '../store/hooks'

interface PerformanceChartProps {
  widgetId: string
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ widgetId }) => {
  const performanceData = useAppSelector((state) => state.performance.data)
  const [timeRange, setTimeRange] = useState('7d')
  const [chartType, setChartType] = useState('line')

  const filteredData = performanceData.slice(-parseInt(timeRange))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} className="tooltip-item">
              <span style={{ color: entry.color }}>{entry.name}: </span>
              <strong>{entry.value}</strong>
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const renderChart = () => {
    const commonProps = {
      data: filteredData,
      margin: { top: 20, right: 30, left: 0, bottom: 0 },
    }

    if (chartType === 'line') {
      return (
        <LineChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} name=" revenue" />
          <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} name=" profit" />
          <Line type="monotone" dataKey="customers" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} name="customers" />
        </LineChart>
      )
    } else if (chartType === 'bar') {
      return (
        <BarChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="revenue" fill="#3b82f6" name=" revenue" radius={[4, 4, 0, 0]} />
          <Bar dataKey="profit" fill="#10b981" name=" profit" radius={[4, 4, 0, 0]} />
        </BarChart>
      )
    } else {
      return (
        <ComposedChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" stroke="#6b7280" />
          <YAxis yAxisId="left" stroke="#6b7280" />
          <YAxis yAxisId="right" orientation="right" stroke="#8b5cf6" />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="revenue" fill="#3b82f6" name=" revenue" yAxisId="left" radius={[4, 4, 0, 0]} />
          <Line type="monotone" dataKey="customers" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} name="customers" yAxisId="right" />
        </ComposedChart>
      )
    }
  }

  return (
    <div className="performance-chart-container">
      <div className="chart-controls">
        <div className="control-group">
          <label>时间范围: </label>
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="time-range-select"
          >
            <option value="7d">最近7天</option>
            <option value="14d">最近14天</option>
            <option value="30d">最近30天</option>
            <option value="90d">最近90天</option>
          </select>
        </div>
        <div className="control-group">
          <label>图表类型: </label>
          <div className="chart-type-buttons">
            <button 
              className={`chart-type-btn ${chartType === 'line' ? 'active' : ''}`}
              onClick={() => setChartType('line')}
            >
              折线图
            </button>
            <button 
              className={`chart-type-btn ${chartType === 'bar' ? 'active' : ''}`}
              onClick={() => setChartType('bar')}
            >
              柱状图
            </button>
            <button 
              className={`chart-type-btn ${chartType === 'composed' ? 'active' : ''}`}
              onClick={() => setChartType('composed')}
            >
              组合图
            </button>
          </div>
        </div>
      </div>
      
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          {renderChart()}
        </ResponsiveContainer>
      </div>
      
      <div className="kpi-summary">
        <div className="kpi-item">
          <div className="kpi-label">总收入</div>
          <div className="kpi-value">
            ¥{filteredData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
          </div>
          <div className="kpi-change positive">+12.5%</div>
        </div>
        <div className="kpi-item">
          <div className="kpi-label">总利润</div>
          <div className="kpi-value">
            ¥{filteredData.reduce((sum, item) => sum + item.profit, 0).toLocaleString()}
          </div>
          <div className="kpi-change positive">+8.3%</div>
        </div>
        <div className="kpi-item">
          <div className="kpi-label">新客户</div>
          <div className="kpi-value">
            {filteredData.reduce((sum, item) => sum + item.customers, 0)}
          </div>
          <div className="kpi-change negative">-2.1%</div>
        </div>
      </div>
    </div>
  )
}

export default PerformanceChart