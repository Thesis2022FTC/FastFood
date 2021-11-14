import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  cart: [],
  uid: '',
  addedItems: [],
  total: 0

}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addCart: (state, action) => {
      let addedItem = state.cart.find(item => action.payload.cartID == item.cartID)
      if (!addedItem) {
        state.cart = state.cart.concat(action.payload)
      } else {
        addedItem.Quantity = addedItem.Quantity + 1
        console.log('Cart:', JSON.stringify(addedItem))
        // return{
        //   ...state,
        //   total: state.total + addedItem.Price
        // }
      }

    },
    getUid: (state, action) => {
      state.uid = action.payload
      console.log('UID:', JSON.stringify(state.uid))
    },
    clearCart: (state, action) => {
      state.cart = []
    },
    updateCart: (state, action) => {
      console.log('UID:', JSON.stringify(state.uid))
    },
    addQuantity: (state, action) => {
      let addedItem = state.cart.find(item => action.payload.cartID == item.cartID)
      addedItem.Quantity = addedItem.Quantity + 1
    },
    subQuantity: (state, action) => {
      let addedItem = state.cart.find(item => action.payload.cartID == item.cartID)
      if (addedItem.Quantity > 0) {
        addedItem.Quantity = addedItem.Quantity - 1
      }

    },

    removeItem: (state, action) => {
      const newCart = state.cart.filter((item) => item.cartID != action.payload)
      state.cart = newCart
      console.log('Cart:', JSON.stringify(state.cart))
    },
  },
})


// Action creators are generated for each case reducer function
export const { getCart, clearCart, addCart, getUid, updateCart, removeItem, addQuantity, subQuantity } = cartSlice.actions

export default cartSlice.reducer