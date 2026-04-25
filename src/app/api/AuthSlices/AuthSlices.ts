// AuthSlices.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { FetchBaseQueryError, BaseQueryFn, FetchArgs } from "@reduxjs/toolkit/query/react";


import type { RootState } from "../../store"; // adjust path to your store
import { setCredentials, updateAccessToken, logout } from "./authSlice";

const baseURL = import.meta.env.VITE_BASE_URL;

// ─── 1. Raw base query (no auth logic) ───────────────────────────────────────

const rawBaseQuery = fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as any).auth.accessToken
            || localStorage.getItem("access_token")
            || localStorage.getItem("token");
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

// ─── 2. Mutex flag to prevent multiple simultaneous refresh calls ─────────────

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

// ─── 3. Base query WITH automatic token refresh on 401 ───────────────────────

/**
 * Intercepts every request. If a 401 is returned:
 *   1. Attempt to refresh using the stored refresh_token.
 *   2. If refresh succeeds → update state → retry the original request once.
 *   3. If refresh fails   → dispatch logout → return the error.
 */
const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    // First attempt
    let result = await rawBaseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        const state = api.getState() as RootState;
        const refreshToken = state.auth.refreshToken;

        // Nothing to refresh with → logout immediately
        if (!refreshToken) {
            api.dispatch(logout());
            return result;
        }

        // Only one refresh call at a time (mutex)
        if (!isRefreshing) {
            isRefreshing = true;

            refreshPromise = (async (): Promise<boolean> => {
                try {
                    const refreshResult = await rawBaseQuery(
                        {
                            url: "auth/refresh",      // ← adjust to your refresh endpoint
                            method: "POST",
                            body: { refresh_token: refreshToken },
                        },
                        api,
                        extraOptions
                    );

                    if (refreshResult.data) {
                        // API returns same shape as login: { data: { access_token, expires_in, ... } }
                        const refreshData = (refreshResult.data as any)?.data;

                        if (refreshData?.access_token) {
                            api.dispatch(
                                updateAccessToken({
                                    access_token: refreshData.access_token,
                                    expires_in: refreshData.expires_in ?? 86400,
                                })
                            );
                            return true;
                        }
                    }

                    // Refresh endpoint returned an error
                    api.dispatch(logout());
                    return false;
                } catch {
                    api.dispatch(logout());
                    return false;
                } finally {
                    isRefreshing = false;
                    refreshPromise = null;
                }
            })();
        }

        // Wait for the in-flight refresh to finish
        const refreshed = await refreshPromise!;

        if (refreshed) {
            // Retry the original request with the new token now in state
            result = await rawBaseQuery(args, api, extraOptions);
        }
    }

    return result;
};

// ─── 4. API slice ─────────────────────────────────────────────────────────────

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: baseQueryWithReauth,

    tagTypes: ["Me"],

    endpoints: (builder) => ({

        // ── Register (user) ──────────────────────────────────────────────────
        register: builder.mutation({
            query: (data) => ({
                url: "auth/register",
                method: "POST",
                body: data,
            }),
        }),

        // ── Register Admin ───────────────────────────────────────────────────
        registerAdmin: builder.mutation({
            query: (data) => ({
                url: "admin/register",
                method: "POST",
                body: data,
            }),
        }),

        // ── Login ────────────────────────────────────────────────────────────
        loginAdmin: builder.mutation<
            {
                success: boolean;
                message: string;
                data: {
                    user: import("./authSlice").AuthUser;
                    access_token: string;
                    refresh_token: string;
                    magento_token: string | null;
                    token_type: string;
                    expires_in: number;
                    permissions: string[];
                };
            },
            { email: string; password: string }
        >({
            query: (data) => ({
                url: "auth/login",
                method: "POST",
                body: data,
            }),

            // Store credentials in Redux + localStorage immediately after login
            async onQueryStarted(_, { queryFulfilled, dispatch }) {
                try {
                    const { data } = await queryFulfilled;

                    if (data?.data?.access_token) {
                        dispatch(
                            setCredentials({
                                access_token: data.data.access_token,
                                refresh_token: data.data.refresh_token,
                                expires_in: data.data.expires_in,
                                user: data.data.user,
                            })
                        );
                    }
                } catch (err) {
                    // Login failed — no credentials to store
                    console.error("Login mutation failed:", err);
                }
            },

            // Invalidate cached "me" data so it re-fetches after login
            invalidatesTags: ["Me"],
        }),

        // ── Me (current user) ────────────────────────────────────────────────
        me: builder.query<{ data: { user: import("./authSlice").AuthUser } }, void>({
            query: () => ({
                url: "auth/me",
                method: "GET",
            }),
            providesTags: ["Me"],
        }),

        // ── Logout ───────────────────────────────────────────────────────────
        logoutUser: builder.mutation<void, void>({
            query: () => {
                // Read refresh_token from storage so it's available even if
                // the Redux state was already cleared by a previous action
                const refreshToken = localStorage.getItem("refresh_token");
                return {
                    url: "auth/logout",               // ← adjust to your logout endpoint
                    method: "POST",
                    body: refreshToken ? { refresh_token: refreshToken } : {},
                };
            },

            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                } catch {
                    // Even if the server call fails, clear local state
                } finally {
                    dispatch(logout());
                }
            },

            invalidatesTags: ["Me"],
        }),

        // ── Refresh token (optional — exposed if you want manual refresh) ────
        refreshToken: builder.mutation<
            { data: { access_token: string; expires_in: number } },
            { refresh_token: string }
        >({
            query: (body) => ({
                url: "auth/refresh",
                method: "POST",
                body,
            }),

            async onQueryStarted(_, { queryFulfilled, dispatch }) {
                try {
                    const { data } = await queryFulfilled;
                    if (data?.data?.access_token) {
                        dispatch(
                            updateAccessToken({
                                access_token: data.data.access_token,
                                expires_in: data.data.expires_in ?? 86400,
                            })
                        );
                    }
                } catch {
                    dispatch(logout());
                }
            },
        }),
    }),
});

// ─── Exported hooks ───────────────────────────────────────────────────────────

export const {
    useRegisterMutation,
    useRegisterAdminMutation,
    useLoginAdminMutation,
    useMeQuery,
    useLogoutUserMutation,
    useRefreshTokenMutation,
} = authApi;