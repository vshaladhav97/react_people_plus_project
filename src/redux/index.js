import { configureStore } from '@reduxjs/toolkit'
import commonReducer from './common'

const store = configureStore({
  reducer: {
    common: commonReducer,
  },
})

export default store
