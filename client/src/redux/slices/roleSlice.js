import { createSlice } from "@reduxjs/toolkit";

// Retrieve role from localStorage (if available)
// const storedRole = localStorage.getItem("role") || "";

const roleSlice = createSlice({
  name: "role",
  initialState: {
    roleName: "", // Use stored role if available
  },
  reducers: {
    setRoleAsUser: (state) => {
      state.roleName = "patient";
    },
    setRoleAsDoctor: (state) => {
      state.roleName = "doctor";
    },
  },
});

export const { setRoleAsUser, setRoleAsDoctor } = roleSlice.actions;

export default roleSlice.reducer;
