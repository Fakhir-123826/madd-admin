import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseURL = import.meta.env.VITE_BASE_URL;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Store {
    id: number;
    uuid: string;
    name: string;
    slug: string;
    description?: string;
    logo?: string;
    banner?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    country_code?: string;
    currency?: string;
    timezone?: string;
    status: "active" | "inactive" | "pending";
    meta_title?: string;
    meta_description?: string;
    facebook_url?: string;
    instagram_url?: string;
    twitter_url?: string;
    whatsapp_number?: string;
    vendor_id?: number;
    vendor?: {
        id: number;
        company_name: string;
    };
    domain?: {
        id: number;
        domain: string;
        type: string;
    };
    theme?: Record<string, unknown>;
    products?: Record<string, unknown>[];
    created_at?: string;
    updated_at?: string;
}

export interface CreateStorePayload {
    vendor_id: number;
    name: string;
    slug: string;
    description?: string;
    logo?: string;
    banner?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    country_code?: string;
    currency?: string;
    timezone?: string;
    status?: "active" | "inactive" | "pending";
    meta_title?: string;
    meta_description?: string;
    facebook_url?: string;
    instagram_url?: string;
    twitter_url?: string;
    whatsapp_number?: string;
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
    description?: string;
    logo?: string;
    banner?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    country_code?: string;
    currency?: string;
    timezone?: string;
    status?: "active" | "inactive" | "pending";
    meta_title?: string;
    meta_description?: string;
    facebook_url?: string;
    instagram_url?: string;
    twitter_url?: string;
    whatsapp_number?: string;
    [key: string]: unknown;
}

export interface AddDomainPayload {
    domain: string;
}

export interface Vendor {
    id: number;
    company_name: string;
    status: string;
}

export interface VendorsResponse {
    success: boolean;
    data: Vendor[];
}

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

// ─── API Slice ────────────────────────────────────────────────────────────────

export const storeListApi = createApi({
    reducerPath: "storeListApi",
    baseQuery: baseQueryWithAuthCheck,
    tagTypes: ["Stores", "StoreStats", "Vendors"],

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

        // POST /admin/stores (CREATE)
        createStore: builder.mutation<StoreSingleResponse, CreateStorePayload>({
            query: (data) => ({
                url: "admin/stores",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Stores"],
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
                { type: "Stores", id: id.toString() },
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
                { type: "Stores", id: id.toString() },
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
                { type: "Stores", id: id.toString() },
            ],
        }),

        // POST /admin/stores/{id}/domain
        addStoreDomain: builder.mutation<{ success: boolean; data: Record<string, unknown> }, { id: number | string; data: AddDomainPayload }>({
            query: ({ id, data }) => ({
                url: `admin/stores/${id}/domain`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [{ type: "Stores", id: id.toString() }],
        }),

        // GET /admin/stores/{id}/stats
        getStoreStats: builder.query<StoreStats, number | string>({
            query: (id) => ({
                url: `admin/stores/${id}/stats`,
                method: "GET",
            }),
            providesTags: (_result, _error, id) => [{ type: "StoreStats", id: id.toString() }],
        }),

        // GET /admin/stores/vendors (Helper for dropdown)
        getVendorsForStore: builder.query<VendorsResponse, void>({
            query: () => ({
                url: "admin/stores/vendors",
                method: "GET",
            }),
            providesTags: ["Vendors"],
        }),

    }),
});

export const {
    useGetStoresQuery,
    useGetStoreQuery,
    useCreateStoreMutation,
    useUpdateStoreMutation,
    useDeleteStoreMutation,
    useActivateStoreMutation,
    useDeactivateStoreMutation,
    useAddStoreDomainMutation,
    useGetStoreStatsQuery,
    useGetVendorsForStoreQuery,
} = storeListApi;

export default storeListApi;