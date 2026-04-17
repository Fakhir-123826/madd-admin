import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        token: localStorage.getItem("token") || null,
        refreshToken: localStorage.getItem("refresh_token") || null,
        user: localStorage.getItem("user")
            ? JSON.parse(localStorage.getItem("user")!)
            : null,
        isAuthenticated: !!localStorage.getItem("token"),
    },
    reducers: {
        setCredentials: (state, action) => {
            const { token, refresh_token, user } = action.payload;
            state.token = token;
            state.refreshToken = refresh_token;
            state.user = user;
            state.isAuthenticated = true;

            // ✅ localStorage saved 
            localStorage.setItem("token", token);
            localStorage.setItem("refresh_token", refresh_token);
            localStorage.setItem("user", JSON.stringify(user));
        },
        logout: (state) => {
            state.token = null;
            state.refreshToken = null;
            state.user = null;
            state.isAuthenticated = false;

            // ✅ localStorage clear karo
            localStorage.removeItem("token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("user");
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;