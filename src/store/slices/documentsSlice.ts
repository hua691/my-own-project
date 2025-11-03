import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../index'

export interface Document {
  id: string
  name: string
  type: 'document' | 'spreadsheet' | 'presentation' | 'pdf' | 'image' | 'code'
  size: number
  accessedAt: string
  widgetId: string
}

interface DocumentsState {
  documents: Document[]
}

const generateMockDocuments = (count: number = 10): Document[] => {
  const types: Document['type'][] = ['document', 'spreadsheet', 'presentation', 'pdf', 'image', 'code']
  const names = [
    '项目计划文档.docx',
    '季度销售数据.xlsx',
    '产品演示.pptx',
    '技术方案.pdf',
    '产品原型设计.png',
    '用户需求分析.docx',
    '市场调研报告.pdf',
    '代码实现.ts',
    '财务预算.xlsx',
    '会议纪要.docx'
  ]

  return Array.from({ length: count }, (_, i) => ({
    id: `doc-${Date.now()}-${i}`,
    name: names[i % names.length],
    type: types[Math.floor(Math.random() * types.length)],
    size: Math.floor(Math.random() * 1024 * 1024) + 1024,
    accessedAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
    widgetId: ''
  }))
}

const initialState: DocumentsState = {
  documents: generateMockDocuments(10),
}

const documentsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    addDocument: (state, action: PayloadAction<Omit<Document, 'id' | 'accessedAt'>>) => {
      const newDocument: Document = {
        ...action.payload,
        id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        accessedAt: new Date().toISOString(),
      }
      state.documents.unshift(newDocument)
    },
    updateDocumentAccess: (state, action: PayloadAction<string>) => {
      const document = state.documents.find(doc => doc.id === action.payload)
      if (document) {
        document.accessedAt = new Date().toISOString()
        state.documents = [
          document,
          ...state.documents.filter(doc => doc.id !== action.payload)
        ]
      }
    },
    removeDocument: (state, action: PayloadAction<string>) => {
      state.documents = state.documents.filter(doc => doc.id !== action.payload)
    },
  },
})

export const { addDocument, updateDocumentAccess, removeDocument } = documentsSlice.actions
export const selectDocuments = (state: RootState) => state.documents.documents
export default documentsSlice.reducer