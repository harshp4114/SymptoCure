import {configureStore} from '@reduxjs/toolkit'
import signInReducer from '../slices/signInSlice'
import loadingReducer from "../slices/loadingSlice";
import roleReducer from "../slices/roleSlice"
const store=configureStore({
    reducer:{
        signin:signInReducer,
        loading: loadingReducer,
        role:roleReducer,
    },
});

export default store;