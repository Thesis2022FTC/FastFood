import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  fastfood: [],
  uid: '',
 sliders:''
}

export const fastfoodSlice = createSlice({
  name: 'fastfood',
  initialState,
  reducers: {
    getStore: (state, action) => {
      state.fastfood = state.fastfood.concat(action.payload)
      console.log('Store:', JSON.stringify(state.fastfood))
    },
    getSliders: (state, action) => {
      state.sliders = state.sliders.concat(action.payload)
     
    },
    getUid: (state, action) => {
      state.uid = action.payload
      console.log('UID:', JSON.stringify(state.uid))
    },
    clearStore: (state, action) => {
      state.fastfood = []
    }
  },
})

// Action creators are generated for each case reducer function
export const { getStore, clearStore,getUid,getSliders} = fastfoodSlice.actions

export default fastfoodSlice.reducer