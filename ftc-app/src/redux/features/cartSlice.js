import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  cart: [],
  uid: ''

}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addCart: (state, action) => {
      state.cart = state.cart.concat(action.payload)
      console.log('Cart:', JSON.stringify(state.cart))
    },
    getUid: (state, action) => {
      state.uid = action.payload
      console.log('UID:', JSON.stringify(state.uid))
    },
    clearCart: (state, action) => {
      state.cart = []
    }
  },
})

// Action creators are generated for each case reducer function
export const { getCart, clearCart,addCart ,getUid} = cartSlice.actions

export default cartSlice.reducer