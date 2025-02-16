import { createSlice } from "@reduxjs/toolkit";

// Retrieve role from localStorage (if available)
const storedRole = localStorage.getItem("role") || "";

const roleSlice = createSlice({
  name: "role",
  initialState: {
    roleName: storedRole, // Use stored role if available
  },
  reducers: {
    setRoleAsUser: (state) => {
      state.roleName = "patient";
      localStorage.setItem("role", "patient"); // Save to localStorage
    },
    setRoleAsDoctor: (state) => {
      state.roleName = "doctor";
      localStorage.setItem("role", "doctor"); // Save to localStorage
    },
  },
});

export const { setRoleAsUser, setRoleAsDoctor } = roleSlice.actions;

export default roleSlice.reducer;
