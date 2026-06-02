import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        accessToken: localStorage.getItem("token") || localStorage.getItem("access_token") || null,
        refreshToken: localStorage.getItem("refresh_token") || null,
        user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null,
        isAuthenticated: !!(localStorage.getItem("token") || localStorage.getItem("access_token")),
        expiresAt: localStorage.getItem("token_expires_at") ? Number(localStorage.getItem("token_expires_at")) : null,
    },
    reducers: {
        setCredentials: (state, action: PayloadAction<{
            access_token: string;
            refresh_token: string;
            expires_in: number;
            user: any;
        }>) => {
            const { access_token, refresh_token, expires_in, user } = action.payload;
            const expiresAt = Date.now() + expires_in * 1000;
            state.accessToken = access_token;
            state.refreshToken = refresh_token;
            state.user = user;
            state.isAuthenticated = true;
            state.expiresAt = expiresAt;

            // Save with BOTH key names during transition
            localStorage.setItem("access_token", access_token);
            localStorage.setItem("token", access_token);
            localStorage.setItem("refresh_token", refresh_token);
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("token_expires_at", String(expiresAt));
        },
        updateAccessToken: (state, action: PayloadAction<{ access_token: string; expires_in: number }>) => {
            const expiresAt = Date.now() + action.payload.expires_in * 1000;
            state.accessToken = action.payload.access_token;
            state.isAuthenticated = true;
            state.expiresAt = expiresAt;
            localStorage.setItem("access_token", action.payload.access_token);
            localStorage.setItem("token", action.payload.access_token);
            localStorage.setItem("token_expires_at", String(expiresAt));
        },
        logout: (state) => {
            state.accessToken = null;
            state.refreshToken = null;
            state.user = null;
            state.isAuthenticated = false;
            state.expiresAt = null;

            localStorage.removeItem("access_token");
            localStorage.removeItem("token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("user");
            localStorage.removeItem("token_expires_at");
        },
    },
});

export const { setCredentials, updateAccessToken, logout } = authSlice.actions;
export const selectIsAuthenticated = (state: any) => state.auth.isAuthenticated;
export const selectCurrentUser = (state: any) => state.auth.user;
export const selectAccessToken = (state: any) => state.auth.accessToken;
export const selectExpiresAt = (state: any) => state.auth.expiresAt;
export default authSlice.reducer;