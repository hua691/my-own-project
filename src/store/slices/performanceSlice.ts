import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from '../index'

interface PerformanceData {
  date: string
  revenue: number
  profit: number
  customers: number
}

interface PerformanceState {
  data: PerformanceData[]
  loading: boolean
  error: string | null
}

const generateMockData = (days: number = 90): PerformanceData[] => {
  const data: PerformanceData[] = []
  const today = new Date()
  let baseRevenue = 10000
  let baseProfit = 2000
  let baseCustomers = 50

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    
    const revenueVariation = (Math.random() - 0.5) * 0.4
    const profitVariation = (Math.random() - 0.5) * 0.5
    const customersVariation = (Math.random() - 0.5) * 0.3

    const revenue = Math.round(baseRevenue * (1 + revenueVariation))
    const profit = Math.round(baseProfit * (1 + profitVariation))
    const customers = Math.round(baseCustomers * (1 + customersVariation))

    data.push({
      date: date.toISOString().split('T')[0],
      revenue,
      profit,
      customers,
    })

    baseRevenue = revenue
    baseProfit = profit
    baseCustomers = customers
  }

  return data
}

export const fetchPerformanceData = createAsyncThunk(
  'performance/fetchData',
  async (days: number = 90) => {
    return new Promise<PerformanceData[]>((resolve) => {
      setTimeout(() => {
        resolve(generateMockData(days))
      }, 500)
    })
  }
)

const initialState: PerformanceState = {
  data: generateMockData(90),
  loading: false,
  error: null,
}

const performanceSlice = createSlice({
  name: 'performance',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPerformanceData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPerformanceData.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchPerformanceData.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch performance data'
      })
  },
})

export const selectPerformanceData = (state: RootState) => state.performance.data
export const selectPerformanceLoading = (state: RootState) => state.performance.loading
export const selectPerformanceError = (state: RootState) => state.performance.error
export default performanceSlice.reducer