import React, { useState } from 'react'
import { useAppSelector } from '../store/hooks'
import { Document } from '../store/slices/documentsSlice'

interface RecentDocumentsProps {
  widgetId: string
}

const RecentDocuments: React.FC<RecentDocumentsProps> = ({ widgetId }) => {
  const documents = useAppSelector((state) => state.documents.documents)
  const [sortBy, setSortBy] = useState('date')
  const [filterType, setFilterType] = useState('all')

  const filteredDocuments = documents
    .filter(doc => doc.widgetId === widgetId)
    .filter(doc => filterType === 'all' || doc.type === filterType)
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.accessedAt).getTime() - new Date(a.accessedAt).getTime()
      } else if (sortBy === 'name') {
        return a.name.localeCompare(b.name)
      } else if (sortBy === 'size') {
        return b.size - a.size
      }
      return 0
    })

  const formatFileSize = (size: number): string => {
    if (size < 1024) return `${size} B`
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
    if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`
    return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return '今天'
    if (diffDays === 1) return '昨天'
    if (diffDays < 7) return `${diffDays}天前`
    return date.toLocaleDateString('zh-CN')
  }

  const getFileIcon = (type: string): string => {
    switch (type) {
      case 'document': return '📄'
      case 'spreadsheet': return '📊'
      case 'presentation': return '🎬'
      case 'image': return '🖼️'
      case 'pdf': return '📑'
      case 'code': return '💻'
      default: return '📁'
    }
  }

  return (
    <div className="recent-documents-container">
      <div className="document-controls">
        <div className="control-group">
          <label>排序: </label>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="date">按时间</option>
            <option value="name">按名称</option>
            <option value="size">按大小</option>
          </select>
        </div>
        <div className="control-group">
          <label>类型: </label>
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="all">全部</option>
            <option value="document">文档</option>
            <option value="spreadsheet">表格</option>
            <option value="presentation">演示</option>
            <option value="pdf">PDF</option>
            <option value="image">图片</option>
          </select>
        </div>
      </div>
      
      <div className="documents-list">
        {filteredDocuments.length === 0 ? (
          <div className="empty-documents">
            <p>暂无最近访问的文档</p>
          </div>
        ) : (
          filteredDocuments.map((doc) => (
            <div key={doc.id} className="document-item">
              <div className="document-icon">
                {getFileIcon(doc.type)}
              </div>
              <div className="document-info">
                <div className="document-name">{doc.name}</div>
                <div className="document-meta">
                  <span className="document-date">{formatDate(doc.accessedAt)}</span>
                  <span className="document-size">{formatFileSize(doc.size)}</span>
                </div>
              </div>
              <div className="document-actions">
                <button className="document-open-btn" title="打开">
                  打开
                </button>
                <button className="document-download-btn" title="下载">
                  下载
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default RecentDocuments