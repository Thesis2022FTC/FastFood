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
    },
    clearStore: (state,action) => {
     state.fastfood=[]
    }
  },
})

// Action creators are generated for each case reducer function
export const {getStore,clearStore} = fastfoodSlice.actions

export default fastfoodSlice.reducer