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
        }),
        
        loginAdmin: builder.mutation({
            query: (data) => ({
                url: "admin/login", // make sure this exists in Laravel
                method: "POST",
                body: data,
            }),
        }),
    }),


});

export const { useRegisterAdminMutation, useLoginAdminMutation } = authApi;
