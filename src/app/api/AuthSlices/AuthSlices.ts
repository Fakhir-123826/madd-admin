import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials } from "./authSlice";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://127.0.0.1:8000/api/",
    }),
    endpoints: (builder) => ({
        registerAdmin: builder.mutation({
            query: (data) => ({
                url: "admin/register",
                method: "POST",
                body: data,
            }),
        }),

        loginAdmin: builder.mutation({
            query: (data) => ({
                url: "admin/login",
                method: "POST",
                body: data,
            }),
            // ✅ dispatch se Redux store mein save karo
            async onQueryStarted(_, { queryFulfilled, dispatch }) {
                try {
                    const { data } = await queryFulfilled;
                    if (data?.token) {
                        dispatch(setCredentials({
                            token: data.token,
                            admin: data.admin,
                        }));
                    }
                } catch (err) {
                    console.error("Login failed:", err);
                }
            },
        }),
    }),
});

export const { useRegisterAdminMutation, useLoginAdminMutation } = authApi;