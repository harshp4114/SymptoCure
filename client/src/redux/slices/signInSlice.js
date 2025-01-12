import { createSlice } from "@reduxjs/toolkit";

const signinSlice=createSlice({
    name:"signin",
    initialState:{
        isSignedIn:false
    },
    reducers:{
        toggle:(state)=>{
            state.isSignedIn=!state.isSignedIn;
        }
    }
});

export const {toggle}=signinSlice.actions;

export default signinSlice.reducer;
