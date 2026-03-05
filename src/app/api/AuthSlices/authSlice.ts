import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        token: localStorage.getItem("admin_token") || null,
        admin: localStorage.getItem("admin")
            ? JSON.parse(localStorage.getItem("admin")!)
            : null,
        isAuthenticated: !!localStorage.getItem("admin_token"),
    },
    reducers: {
        setCredentials: (state, action) => {
            state.token = action.payload.token;
            state.admin = action.payload.admin;
            state.isAuthenticated = true;
            // ✅ ye missing tha!
            localStorage.setItem("admin_token", action.payload.token);
            localStorage.setItem("admin", JSON.stringify(action.payload.admin));
        },
        logout: (state) => {
            state.token = null;
            state.admin = null;
            state.isAuthenticated = false;
            localStorage.removeItem("admin_token");
            localStorage.removeItem("admin");
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;