import {configureStore} from '@reduxjs/toolkit'
import signInReducer from '../slices/signInSlice'
import loadingReducer from "../slices/loadingSlice";
const store=configureStore({
    reducer:{
        signin:signInReducer,
        loading: loadingReducer,
    },
});

export default store;