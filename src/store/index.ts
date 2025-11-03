import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import dashboardReducer from './slices/dashboardSlice'
import todoReducer from './slices/todoSlice'
import performanceReducer from './slices/performanceSlice'
import documentsReducer from './slices/documentsSlice'
import teamActivityReducer from './slices/teamActivitySlice'
import notificationsReducer from './slices/notificationsSlice'
import quickAccessReducer from './slices/quickAccessSlice'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['dashboard', 'todo', 'quickAccess'],
}

const persistedDashboardReducer = persistReducer(persistConfig, dashboardReducer)

const store = configureStore({
  reducer: {
    dashboard: persistedDashboardReducer,
    todo: todoReducer,
    performance: performanceReducer,
    documents: documentsReducer,
    teamActivity: teamActivityReducer,
    notifications: notificationsReducer,
    quickAccess: quickAccessReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const persistor = persistStore(store)
export default store