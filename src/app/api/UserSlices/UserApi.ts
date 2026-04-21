import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseURL = import.meta.env.VITE_BASE_URL;

export const userApi = createApi({
    reducerPath: "userApi",

    baseQuery: fetchBaseQuery({
        baseUrl: baseURL,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),

    tagTypes: ["Users"],

    endpoints: (builder) => ({

        // ================= GET ALL USERS =================
        getUsers: builder.query({
            query: () => ({
                url: "admin/users",
                method: "GET",
            }),
            providesTags: ["Users"],
        }),

        // ================= GET SINGLE USER =================
        getUser: builder.query({
            query: (id: string) => ({
                url: `admin/users/${id}`,
                method: "GET",
            }),
            providesTags: ["Users"],
        }),

        // ================= CREATE USER =================
        createUser: builder.mutation({
            query: (data) => ({
                url: "admin/users",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Users"],
        }),

        // ================= UPDATE USER =================
        updateUser: builder.mutation({
            query: ({ id, data }) => ({
                url: `admin/users/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Users"],
        }),

        // ================= DELETE USER =================
        deleteUser: builder.mutation({
            query: (id: string) => ({
                url: `admin/users/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Users"],
        }),

        // ================= UPDATE USER STATUS =================
        updateUserStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `admin/users/${id}/status`,
                method: "PATCH",
                body: { status },
            }),
            invalidatesTags: ["Users"],
        }),

        // ================= UPDATE USER VERIFICATION =================
        updateUserVerification: builder.mutation({
            query: ({ id, type, value }) => ({
                url: `admin/users/${id}/verify`,
                method: "PATCH",
                body: { type, value }, // type: 'email', 'phone', 'kyc'
            }),
            invalidatesTags: ["Users"],
        }),
    }),
});

// Export all hooks
export const { 
    useGetUsersQuery, 
    useGetUserQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useUpdateUserStatusMutation,
    useUpdateUserVerificationMutation,
} = userApi;