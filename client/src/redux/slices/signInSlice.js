import { createSlice } from "@reduxjs/toolkit";

const signinSlice=createSlice({
    name:"signin",
    initialState:{
        isSignedIn:false
    },
    reducers:{
        userLoggedin:(state)=>{
            state.isSignedIn=true;
        },
        userLoggedout:(state)=>{
            state.isSignedIn=false;
        },
    }
});

export const {userLoggedin,userLoggedout}=signinSlice.actions;

export default signinSlice.reducer;
