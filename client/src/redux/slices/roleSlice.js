import { createSlice } from "@reduxjs/toolkit";

const roleSlice=createSlice({
    name:"role",
    initialState:{
        roleName:"",
    },
    reducers:{
        setRoleAsUser:(state)=>{
            state.roleName="user";
        },
        setRoleAsDoctor:(state)=>{
            state.roleName="doctor";
        },
    }
});

export const {setRoleAsUser,setRoleAsDoctor}=roleSlice.actions;

export default roleSlice.reducer;
