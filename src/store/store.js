import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import { message } from 'antd'
import { messageReducer } from './message'

export const store = configureStore({
  reducer: {
    user : userReducer,
    message : messageReducer,
  },
})