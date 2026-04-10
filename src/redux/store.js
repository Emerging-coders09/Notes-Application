import { configureStore } from "@reduxjs/toolkit";
import authSlice from '../redux/reducers/authReducer'
import noteSlice from '../redux/reducers/notesReducer'

export const store = configureStore({
    reducer : {
        auth : authSlice,
        note : noteSlice
    }
})