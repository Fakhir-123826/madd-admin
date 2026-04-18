import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseURL = import.meta.env.VITE_BASE_URL;

export const vendorApi = createApi({
    reducerPath: "vendorApi",

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

    tagTypes: ["Vendors"],

    endpoints: (builder) => ({

        // ================= GET ALL VENDORS =================
        getVendors: builder.query({
            query: () => ({
                url: "admin/vendors",
                method: "GET",
            }),
            providesTags: ["Vendors"],
        }),

    }),
});

export const {
    useGetVendorsQuery,
} = vendorApi;