import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    fastfood:[],
   
 
}

export const fastfoodSlice = createSlice({
  name: 'fastfood',
  initialState,
  reducers: {
    getStore: (state,action) => {
      state.fastfood=state.fastfood.concat(action.payload)
      console.log('Store:',JSON.stringify(state.fastfood))
    }
  },
})

// Action creators are generated for each case reducer function
export const {getStore} = fastfoodSlice.actions

export default fastfoodSlice.reducer