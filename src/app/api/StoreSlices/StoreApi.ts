import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseURL = import.meta.env.VITE_BASE_URL;

export const storeListApi = createApi({
    reducerPath: "storeListApi",

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

    tagTypes: ["Stores"],

    endpoints: (builder) => ({

        // ================= GET ALL STORES =================
        getStores: builder.query({
            query: () => ({
                url: "admin/stores",
                method: "GET",
            }),
            providesTags: ["Stores"],
        }),

    }),
});

export const { useGetStoresQuery } = storeListApi;