import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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
            // ✅ Register mein kuch save nahi hoga
        }),
        
        loginAdmin: builder.mutation({
            query: (data) => ({
                url: "admin/login",
                method: "POST",
                body: data,
            }),
            // ✅ Sirf Login mein token save hoga
            async onQueryStarted(_, { queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    if (data?.token) {
                        localStorage.setItem("admin_token", data.token);
                        localStorage.setItem("admin", JSON.stringify(data.admin));
                    }
                } catch (err) {
                    console.error("Login failed:", err);
                }
            },
        }),
    }),
});

export const { useRegisterAdminMutation, useLoginAdminMutation } = authApi;