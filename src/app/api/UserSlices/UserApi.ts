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

    tagTypes: ["Users", "User", "Statistics"],

    endpoints: (builder) => ({

        // ================= 1. GET ALL USERS =================
        getUsers: builder.query({
            query: (params = {}) => ({
                url: "admin/users",
                method: "GET",
                params: params, // { page, per_page, status, user_type, search, etc. }
            }),
            providesTags: ["Users"],
        }),

        // ================= 2. GET SINGLE USER =================
        getUserById: builder.query({
            query: (id) => ({
                url: `admin/users/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "User", id }],
        }),

        // ================= 3. CREATE NEW USER (STORE) =================
        createUser: builder.mutation({
            query: (userData) => ({
                url: "admin/users",
                method: "POST",
                body: userData,
            }),
            invalidatesTags: ["Users", "Statistics"],
        }),

        // ================= 4. UPDATE USER =================
        updateUser: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `admin/users/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                "Users",
                { type: "User", id },
                "Statistics",
            ],
        }),

        // ================= 5. DELETE USER =================
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `admin/users/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Users", "Statistics"],
        }),

        // ================= 6. ASSIGN ROLE TO USER =================
        assignRole: builder.mutation({
            query: ({ id, role }) => ({
                url: `admin/users/${id}/role`,
                method: "PUT",
                body: { role },
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "User", id },
                "Users",
            ],
        }),

        // ================= 7. REMOVE ROLE FROM USER =================
        removeRole: builder.mutation({
            query: ({ id, role }) => ({
                url: `admin/users/${id}/role`,
                method: "DELETE",
                body: { role },
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "User", id },
                "Users",
            ],
        }),

        // ================= 8. GRANT PERMISSION TO USER =================
        grantPermission: builder.mutation({
            query: ({ id, permission }) => ({
                url: `admin/users/${id}/permissions`,
                method: "POST",
                body: { permission },
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "User", id }],
        }),

        // ================= 9. REVOKE PERMISSION FROM USER =================
        revokePermission: builder.mutation({
            query: ({ id, permission }) => ({
                url: `admin/users/${id}/permissions`,
                method: "DELETE",
                body: { permission },
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "User", id }],
        }),

        // ================= 10. SUSPEND USER =================
        suspendUser: builder.mutation({
            query: ({ id, reason }) => ({
                url: `admin/users/${id}/suspend`,
                method: "PUT",
                body: { reason },
            }),
            invalidatesTags: (result, error, { id }) => [
                "Users",
                { type: "User", id },
                "Statistics",
            ],
        }),

        // ================= 11. ACTIVATE USER =================
        activateUser: builder.mutation({
            query: (id) => ({
                url: `admin/users/${id}/activate`,
                method: "PUT",
            }),
            invalidatesTags: (result, error, id) => [
                "Users",
                { type: "User", id },
                "Statistics",
            ],
        }),

        // ================= 12. BAN USER =================
        banUser: builder.mutation({
            query: ({ id, reason }) => ({
                url: `admin/users/${id}/ban`,
                method: "POST",
                body: { reason },
            }),
            invalidatesTags: (result, error, { id }) => [
                "Users",
                { type: "User", id },
                "Statistics",
            ],
        }),

        // ================= 13. IMPERSONATE USER =================
        impersonateUser: builder.mutation({
            query: (id) => ({
                url: `admin/users/${id}/impersonate`,
                method: "POST",
            }),
        }),

        // ================= 14. STOP IMPERSONATING =================
        stopImpersonating: builder.mutation({
            query: () => ({
                url: "admin/users/impersonate/stop",
                method: "POST",
            }),
        }),

        // ================= 15. GET USER STATISTICS =================
        getUserStatistics: builder.query({
            query: () => ({
                url: "admin/users/statistics",
                method: "GET",
            }),
            providesTags: ["Statistics"],
        }),

        // ================= 16. EXPORT USERS TO CSV =================
        exportUsers: builder.query({
            query: (params = {}) => ({
                url: "admin/users/export",
                method: "GET",
                params: params, // { user_type, status }
            }),
            // Returns base64 encoded CSV
        }),
    }),
});

// ================= EXPORT ALL HOOKS =================
export const {
    // Queries
    useGetUsersQuery,
    useGetUserByIdQuery,
    useGetUserStatisticsQuery,
    useExportUsersQuery,
    useLazyExportUsersQuery, // Lazy version for export

    // Mutations
    useCreateUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useAssignRoleMutation,
    useRemoveRoleMutation,
    useGrantPermissionMutation,
    useRevokePermissionMutation,
    useSuspendUserMutation,
    useActivateUserMutation,
    useBanUserMutation,
    useImpersonateUserMutation,
    useStopImpersonatingMutation,
} = userApi;