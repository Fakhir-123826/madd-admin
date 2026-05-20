import { createApi } from "@reduxjs/toolkit/query/react";
import { dynamicBaseQuery } from "../dynamicBaseQuery";

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: dynamicBaseQuery,
    tagTypes: ["Users", "User", "Statistics"],

    endpoints: (builder) => ({

        // ================= 1. GET ALL USERS =================
        getUsers: builder.query({
            query: (params = {}) => ({
                url: "users",
                method: "GET",
                params: params, // { page, per_page, status, user_type, search, etc. }
            }),
            providesTags: ["Users"],
        }),

        // ================= GET SINGLE USER =================
        getUser: builder.query({
            query: (id: string) => ({
                url: `users/${id}`,
                method: "GET",
            }),
            providesTags: ["Users"],
        }),

        // ================= CREATE USER =================
        createUser: builder.mutation({
            query: (data) => ({
                url: "users",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Users"],
        }),

        // ================= UPDATE USER =================
        updateUser: builder.mutation({
            query: ({ id, data }) => ({
                url: `users/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Users"],
        }),

        // ================= DELETE USER =================
        deleteUser: builder.mutation({
            query: (id: string) => ({
                url: `users/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Users"],
        }),

        // ================= SUSPEND USER =================
        // Only works if user status is 'active'
        suspendUser: builder.mutation({
            query: ({ id, reason }: { id: string; reason: string }) => ({
                url: `users/${id}/suspend`,
                method: "PUT",
                body: { reason },
            }),
            invalidatesTags: ["Users"],
        }),

        // ================= BAN USER =================
        // Only works if user status is 'active'
        banUser: builder.mutation({
            query: ({ id, reason }: { id: string; reason: string }) => ({
                url: `users/${id}/ban`,
                method: "PUT",
                body: { reason },
            }),
            invalidatesTags: ["Users"],
        }),

        // ================= ACTIVATE USER =================
        // Only works if user status is 'suspended'
        activateUser: builder.mutation({
            query: (id: string) => ({
                url: `users/${id}/activate`,
                method: "PUT",
                body: {},
            }),
            invalidatesTags: ["Users"],
        }),

        // ================= UPDATE USER VERIFICATION =================
        updateUserVerification: builder.mutation({
            query: ({ id, type, value }) => ({
                url: `users/${id}/verify`,
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
    useSuspendUserMutation,
    useBanUserMutation,
    useActivateUserMutation,
    useUpdateUserVerificationMutation,
} = userApi;

export default userApi;