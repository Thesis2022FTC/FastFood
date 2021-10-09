import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    users:{
        email: '',
        displayName:'',
        image:'',
        phoneNumber:''
    },
    isLogin:false
 
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    getUser: (state,action) => {
      state.users=action.payload
    },
    clearUsers: (state,action) => {
      state.users=action.payload
      state.isLogin=false
    },
    isUserLogin:(state,action)=>{
      state.isLogin=action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const {getUser,clearUsers,isUserLogin} = userSlice.actions

export default userSlice.reducer