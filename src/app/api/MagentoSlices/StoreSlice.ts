import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../baseQueryWithAuth";


// StoreSlice.ts - response type update karo
export interface MagentoStore {
    id: number;
    code: string;
    website_id: number;
    locale: string;
    base_currency_code: string;
    default_display_currency_code: string;
    timezone: string;
    weight_unit: string;
    base_url: string;
    base_link_url: string;
    base_static_url: string;
    base_media_url: string;
    secure_base_url: string;
    secure_base_link_url: string;
    secure_base_static_url: string;
    secure_base_media_url: string;
}

export interface StoreResponse {
    success: boolean;
    message: string;
    data: MagentoStore[];  // ✅ items nahi, data hai
}


export const storeApi = createApi({
    reducerPath: "storeApi",
    baseQuery: baseQueryWithAuth,
    tagTypes: ["Stores"],
    endpoints: (builder) => ({

        // ✅ Get all stores (paginated)
        getAllStores: builder.query<any, { page?: number; pageSize?: number } | void>({
            query: (params) => {
                const { page = 1, pageSize = 10 } = params || {};
                return `stores?page=${page}&pageSize=${pageSize}`;
            },
            providesTags: ["Stores"],
        }),

        // ✅ Get store by ID
        getStoreById: builder.query<any, number>({
            query: (id) => `stores/${id}`,
            providesTags: ["Stores"],
        }),

        // ✅ Get all websites
        getAllWebsites: builder.query<any, void>({
            query: () => `stores/websites`,
            providesTags: ["Stores"],
        }),

        // ✅ Get all store views
        getAllStoreViews: builder.query<any, void>({
            query: () => `stores/views`,
            providesTags: ["Stores"],
        }),

        // ✅ Get stores by website ID
        getStoresByWebsiteId: builder.query<any, number>({
            query: (websiteId) => `stores/website/${websiteId}`,
            providesTags: ["Stores"],
        }),

        // ✅ Get store views by store ID
        getStoreViewsByStoreId: builder.query<any, number>({
            query: (storeId) => `stores/${storeId}/views`,
            providesTags: ["Stores"],
        }),
    }),
});

export const {
    useGetAllStoresQuery,
    useGetStoreByIdQuery,
    useGetAllWebsitesQuery,
    useGetAllStoreViewsQuery,
    useGetStoresByWebsiteIdQuery,
    useGetStoreViewsByStoreIdQuery,
} = storeApi;