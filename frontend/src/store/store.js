import { configureStore } from '@reduxjs/toolkit'
import itemsReducer from './itemsSlice.js'

export const store = configureStore({
  reducer: {
    items: itemsReducer,
  },
})
