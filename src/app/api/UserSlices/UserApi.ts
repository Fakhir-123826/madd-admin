// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// const baseURL = import.meta.env.VITE_BASE_URL;

// // Raw base query with headers configuration
// const rawBaseQuery = fetchBaseQuery({
//     baseUrl: baseURL,
//     prepareHeaders: (headers) => {
//         const token = localStorage.getItem("token");
//         if (token) {
//             headers.set("authorization", `Bearer ${token}`);
//         }
//         headers.set("Content-Type", "application/json");
//         return headers;
//     },
// });

// // Base query with authentication check
// const baseQueryWithAuthCheck: typeof rawBaseQuery = async (
//     args,
//     api,
//     extraOptions
// ) => {
//     const result = await rawBaseQuery(args, api, extraOptions);

//     // If token expired / unauthorized
//     if (result.error && result.error.status === 401) {
//         localStorage.removeItem("token");
//         // redirect to login page
//         window.location.href = "/login";
//     }

//     return result;
// };

// export const userApi = createApi({
//     reducerPath: "userApi",
//     baseQuery: baseQueryWithAuthCheck,
//     tagTypes: ["Users", "User", "Statistics"],

//     endpoints: (builder) => ({

//         // ================= 1. GET ALL USERS =================
//         getUsers: builder.query({
//             query: (params = {}) => ({
//                 url: "admin/users",
//                 method: "GET",
//                 params: params, // { page, per_page, status, user_type, search, etc. }
//             }),
//             providesTags: ["Users"],
//         }),

//         // ================= GET SINGLE USER =================
//         getUser: builder.query({
//             query: (id: string) => ({
//                 url: `admin/users/${id}`,
//                 method: "GET",
//             }),
//             providesTags: ["Users"],
//         }),

//         // ================= CREATE USER (STORE) =================
//         createUser: builder.mutation({
//             query: (data) => ({
//                 url: "admin/users",  // This will hit Route::post('/', [AdminUserController::class, 'store'])
//                 method: "POST",
//                 body: data,
//             }),
//             invalidatesTags: ["Users"],
//         }),

//         // ================= UPDATE USER =================
//         updateUser: builder.mutation({
//             query: ({ id, data }) => ({
//                 url: `admin/users/${id}`,
//                 method: "PUT",
//                 body: data,
//             }),
//             invalidatesTags: ["Users"],
//         }),

//         // ================= DELETE USER =================
//         deleteUser: builder.mutation({
//             query: (id: string) => ({
//                 url: `admin/users/${id}`,
//                 method: "DELETE",
//             }),
//             invalidatesTags: ["Users"],
//         }),

//         // ================= UPDATE USER STATUS =================
//         updateUserStatus: builder.mutation({
//             query: ({ id, status }) => ({
//                 url: `admin/users/${id}/status`,
//                 method: "PATCH",
//                 body: { status },
//             }),
//             invalidatesTags: ["Users"],
//         }),

//         // ================= UPDATE USER VERIFICATION =================
//         updateUserVerification: builder.mutation({
//             query: ({ id, type, value }) => ({
//                 url: `admin/users/${id}/verify`,
//                 method: "PATCH",
//                 body: { type, value }, // type: 'email', 'phone', 'kyc'
//             }),
//             invalidatesTags: ["Users"],
//         }),
//     }),
// });

// // Export all hooks
// export const {
//     useGetUsersQuery,
//     useGetUserQuery,
//     useCreateUserMutation,
//     useUpdateUserMutation,
//     useDeleteUserMutation,
//     useUpdateUserStatusMutation,
//     useUpdateUserVerificationMutation,
// } = userApi;

// export default userApi;


import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseURL = import.meta.env.VITE_BASE_URL;

// Raw base query with headers configuration
const rawBaseQuery = fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers) => {
        const token = localStorage.getItem("token");
        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }
        headers.set("Content-Type", "application/json");
        return headers;
    },
});

// Base query with authentication check
const baseQueryWithAuthCheck: typeof rawBaseQuery = async (
    args,
    api,
    extraOptions
) => {
    const result = await rawBaseQuery(args, api, extraOptions);

    // If token expired / unauthorized
    if (result.error && result.error.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
    }

    return result;
};

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: baseQueryWithAuthCheck,
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

        // ================= SUSPEND USER =================
        // Only works if user status is 'active'
        suspendUser: builder.mutation({
            query: ({ id, reason }: { id: string; reason: string }) => ({
                url: `admin/users/${id}/suspend`,
                method: "PUT",
                body: { reason },
            }),
            invalidatesTags: ["Users"],
        }),

        // ================= BAN USER =================
        // Only works if user status is 'active'
        banUser: builder.mutation({
            query: ({ id, reason }: { id: string; reason: string }) => ({
                url: `admin/users/${id}/ban`,
                method: "PUT",
                body: { reason },
            }),
            invalidatesTags: ["Users"],
        }),

        // ================= ACTIVATE USER =================
        // Only works if user status is 'suspended'
        activateUser: builder.mutation({
            query: (id: string) => ({
                url: `admin/users/${id}/activate`,
                method: "PUT",
                body: {},
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
    useSuspendUserMutation,
    useBanUserMutation,
    useActivateUserMutation,
    useUpdateUserVerificationMutation,
} = userApi;

export default userApi;