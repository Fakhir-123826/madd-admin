import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logout } from "./authSlice";
const baseURL = import.meta.env.VITE_BASE_URL;
export const authApi = createApi({
    reducerPath: "authApi",

    baseQuery: fetchBaseQuery({
        baseUrl: baseURL,

        // 🔥 AUTO TOKEN ATTACH (VERY IMPORTANT)
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");

            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }

            return headers;
        },
    }),

    endpoints: (builder) => ({

        // ================= REGISTER =================
        register: builder.mutation({
            query: (data) => ({
                url: "auth/register",
                method: "POST",
                body: data,
            }),
        }),

        // ================= REGISTER ADMIN =================
        registerAdmin: builder.mutation({
            query: (data) => ({
                url: "admin/register",
                method: "POST",
                body: data,
            }),
        }),

        // ================= LOGIN =================
        loginAdmin: builder.mutation({
            query: (data) => ({
                url: "auth/login",
                method: "POST",
                body: data,
            }),

            async onQueryStarted(_, { queryFulfilled, dispatch }) {
                try {
                    const { data } = await queryFulfilled;

                    if (data?.data?.access_token) {
                        dispatch(setCredentials({
                            token: data.data.access_token,
                            refresh_token: data.data.refresh_token,
                            user: data.data.user,
                        }));
                    }
                } catch (err) {
                    console.error("Login failed:", err);
                }
            },
        }),

        // ================= ME (NEW) =================
        me: builder.query({
            query: () => ({
                url: "auth/me",
                method: "GET",
            }),
        }),

        // ================= LOGOUT =================
        logout: builder.mutation({
            query: () => ({
                url: "user/logout",
                method: "POST",
                body: {
                    refresh_token: localStorage.getItem("refresh_token") ?? undefined,
                },
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(logout());
                } catch {
                    // API fail ho tab bhi logout karo
                    dispatch(logout());
                }
            },
        }),
    }),
});

// ================= EXPORT HOOKS =================
export const {
    useRegisterMutation,
    useRegisterAdminMutation,
    useLoginAdminMutation,
    useMeQuery,
    useLogoutMutation,
} = authApi;