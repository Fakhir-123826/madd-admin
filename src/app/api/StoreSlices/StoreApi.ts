// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// const baseURL = import.meta.env.VITE_BASE_URL;

// export const storeListApi = createApi({
//     reducerPath: "storeListApi",

//     baseQuery: fetchBaseQuery({
//         baseUrl: baseURL,
//         prepareHeaders: (headers) => {
//             const token = localStorage.getItem("token");
//             if (token) {
//                 headers.set("authorization", `Bearer ${token}`);
//             }
//             return headers;
//         },
//     }),

//     tagTypes: ["Stores"],

//     endpoints: (builder) => ({

//         // ================= GET ALL STORES =================
//         getStores: builder.query({
//             query: () => ({
//                 url: "admin/stores",
//                 method: "GET",
//             }),
//             providesTags: ["Stores"],
//         }),

//     }),
// });

// export const { useGetStoresQuery } = storeListApi;



import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseURL = import.meta.env.VITE_BASE_URL;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Store {
    id: number;
    uuid: string;
    name: string;
    status: "active" | "inactive";
    vendor?: Record<string, unknown>;
    domain?: Record<string, unknown>;
    theme?: Record<string, unknown>;
    products?: Record<string, unknown>[];
}

export interface StoreStats {
    products: number;
    orders: number;
    revenue: number;
    rating: number;
}

export interface StoreListMeta {
    total: number;
    active: number;
    inactive: number;
}

export interface StoreListResponse {
    success: boolean;
    data: Store[];
    meta: StoreListMeta;
}

export interface StoreSingleResponse {
    success: boolean;
    data: Store;
}

export interface StoreUpdatePayload {
    name?: string;
    status?: "active" | "inactive";
    [key: string]: unknown;
}

export interface AddDomainPayload {
    domain: string;
}

// ─── API Slice ────────────────────────────────────────────────────────────────

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

    tagTypes: ["Stores", "StoreStats"],

    endpoints: (builder) => ({

        // GET /admin/stores
        getStores: builder.query<StoreListResponse, void>({
            query: () => ({
                url: "admin/stores",
                method: "GET",
            }),
            providesTags: ["Stores"],
        }),

        // GET /admin/stores/{uuid}
        getStore: builder.query<StoreSingleResponse, string>({
            query: (uuid) => ({
                url: `admin/stores/${uuid}`,
                method: "GET",
            }),
            providesTags: (_result, _error, uuid) => [{ type: "Stores", id: uuid }],
        }),

        // PUT /admin/stores/{id}
        updateStore: builder.mutation<StoreSingleResponse, { id: number | string; data: StoreUpdatePayload }>({
            query: ({ id, data }) => ({
                url: `admin/stores/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                "Stores",
                { type: "Stores", id },
            ],
        }),

        // DELETE /admin/stores/{id}
        deleteStore: builder.mutation<{ success: boolean; message: string }, number | string>({
            query: (id) => ({
                url: `admin/stores/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Stores"],
        }),

        // POST /admin/stores/{id}/activate
        activateStore: builder.mutation<{ success: boolean; message: string }, number | string>({
            query: (id) => ({
                url: `admin/stores/${id}/activate`,
                method: "POST",
            }),
            invalidatesTags: (_result, _error, id) => [
                "Stores",
                { type: "Stores", id },
            ],
        }),

        // POST /admin/stores/{id}/deactivate
        deactivateStore: builder.mutation<{ success: boolean; message: string }, number | string>({
            query: (id) => ({
                url: `admin/stores/${id}/deactivate`,
                method: "POST",
            }),
            invalidatesTags: (_result, _error, id) => [
                "Stores",
                { type: "Stores", id },
            ],
        }),

        // POST /admin/stores/{id}/domain
        addStoreDomain: builder.mutation<{ success: boolean; data: Record<string, unknown> }, { id: number | string; data: AddDomainPayload }>({
            query: ({ id, data }) => ({
                url: `admin/stores/${id}/domain`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [{ type: "Stores", id }],
        }),

        // GET /admin/stores/{id}/stats
        getStoreStats: builder.query<StoreStats, number | string>({
            query: (id) => ({
                url: `admin/stores/${id}/stats`,
                method: "GET",
            }),
            providesTags: (_result, _error, id) => [{ type: "StoreStats", id }],
        }),

    }),
});

export const {
    useGetStoresQuery,
    useGetStoreQuery,
    useUpdateStoreMutation,
    useDeleteStoreMutation,
    useActivateStoreMutation,
    useDeactivateStoreMutation,
    useAddStoreDomainMutation,
    useGetStoreStatsQuery,
} = storeListApi;