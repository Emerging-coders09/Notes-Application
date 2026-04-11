import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// export const loginUser = createAsyncThunk(
//     'user/login',
//     async (user , thunkAPI)=>{
//         try {
//             const res = await window.api.login(user)
//             if(!res.success){
//                 return thunkAPI.rejectWithValue(res.error)
//             }
//             return res?.data
//         } catch (error) {
//              return thunkAPI.rejectWithValue(error.message)
//         }
//     }
// )

// export const RegisterUser = createAsyncThunk(
//     'user/register',
//     async (user , thunkAPI)=>{
//         try {
//             const res = await window.api.register(user)

//             if(!res.success){
//                 return thunkAPI.rejectWithValue(res.error)
//             }
//             return res
//         } catch (error) {
//             return thunkAPI.rejectWithValue(error.message)
//         }
//     }
// )


const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    user : null,
    error : null,
    newUser : null
  },
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.error = null
    },
    logout: (state, action) => {
      state.isAuthenticated = false;
      state.user = null
      state.newUser = null
    },
    LoginUser : (state , action)=>{
        state.user = action.payload
    },
    RegisterUser :  ( state , action)=>{
        state.newUser = action.payload
    }
  },
//   extraReducers : (builder) => {
//     builder
//         .addCase(loginUser.pending , (state ,action)=>{
//             state.error = null
//             state.isAuthenticated = false
//             state.user = null
//         })
//         .addCase(loginUser.fulfilled , (state ,action)=>{
//             state.user = action.payload
//             state.isAuthenticated = true
//             state.error = null
//         })
//         .addCase(loginUser.rejected , (state , action)=>{
//             state.user = null
//             state.isAuthenticated = false
//             state.error = action.payload
//         })
//         .addCase(RegisterUser.pending , (state , action)=>{
//             state.error = null
//             state.user = null
//             state.success = false
//         })
//         .addCase(RegisterUser.fulfilled , (state , action)=>{
//             state.user = action.payload
//             state.error = null
//             state.success = action.payload
//         })
//         .addCase(RegisterUser.rejected , (state , action)=>{
//             state.user = null 
//             state.error = action.payload
//             state.success = false
//         })
//   }
});

export const { logout , login , LoginUser , RegisterUser } = authSlice.actions
export default authSlice.reducer