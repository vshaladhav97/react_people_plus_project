import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  showLoader: 0,
}

const commonSlice = createSlice({
  name: 'commonSlice',
  initialState,
  reducers: {
    setLoader: (state, action) => {
      const showLoader = action.payload
    },
  },
})

export const { setLoader } = commonSlice.actions

export default commonSlice.reducer
