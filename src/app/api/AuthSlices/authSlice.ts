import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        accessToken: localStorage.getItem("token") || localStorage.getItem("access_token") || null,
        refreshToken: localStorage.getItem("refresh_token") || null,
        user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null,
        isAuthenticated: !!(localStorage.getItem("token") || localStorage.getItem("access_token")),
    },
    reducers: {
        setCredentials: (state, action: PayloadAction<{
            access_token: string;
            refresh_token: string;
            expires_in: number;
            user: any;
        }>) => {
            const { access_token, refresh_token, user } = action.payload;
            state.accessToken = access_token;
            state.refreshToken = refresh_token;
            state.user = user;
            state.isAuthenticated = true;

            // Save with BOTH key names during transition
            localStorage.setItem("access_token", access_token);
            localStorage.setItem("token", access_token);
            localStorage.setItem("refresh_token", refresh_token);
            localStorage.setItem("user", JSON.stringify(user));
        },
        updateAccessToken: (state, action: PayloadAction<{ access_token: string; expires_in: number }>) => {
            state.accessToken = action.payload.access_token;
            state.isAuthenticated = true;
            localStorage.setItem("access_token", action.payload.access_token);
            localStorage.setItem("token", action.payload.access_token);
        },
        logout: (state) => {
            state.accessToken = null;
            state.refreshToken = null;
            state.user = null;
            state.isAuthenticated = false;

            localStorage.removeItem("access_token");
            localStorage.removeItem("token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("user");
        },
    },
});

export const { setCredentials, updateAccessToken, logout } = authSlice.actions;
export const selectIsAuthenticated = (state: any) => state.auth.isAuthenticated;
export const selectCurrentUser = (state: any) => state.auth.user;
export const selectAccessToken = (state: any) => state.auth.accessToken;
export const selectExpiresAt = (state: any) => state.auth.expiresAt;
export default authSlice.reducer;