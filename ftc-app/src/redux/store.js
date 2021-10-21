import { configureStore } from '@reduxjs/toolkit'
import userSlice from './features/userSlice'
import fastfoodSlice from './features/fastfood'
export const store = configureStore({
  reducer: {
      user:userSlice,
      fastfood:fastfoodSlice,
  },
})