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

    }),
});

export const { useGetUsersQuery } = userApi;