import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    users:[],
    isLogin:'false',
    isUserType:'Customer'
 
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    getUser: (state,action) => {
      state.users=action.payload
      console.log('Users:',JSON.stringify(state.users))
    },
    clearUsers: (state,action) => {
      // state.users=action.payload
      state.isLogin=false
    },
    isUserLogin:(state,action)=>{
      state.isLogin=action.payload
    },
    isUser:(state,action)=>{
      state.isUserType=action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const {getUser,clearUsers,isUserLogin,isUser} = userSlice.actions

export default userSlice.reducer