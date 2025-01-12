import {configureStore} from '@reduxjs/toolkit'
import signInReducer from '../slices/signInSlice'

const store=configureStore({
    reducer:{
        signin:signInReducer
    },
});

export default store;