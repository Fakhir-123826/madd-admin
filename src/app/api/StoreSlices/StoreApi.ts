import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseURL = import.meta.env.VITE_BASE_URL;

// ─── Types based on actual backend response ───────────────────────────────────

export interface Country {
    code: string;
    name: string;
}

export interface Language {
    code: string;
    name: string;
}

export interface Currency {
    code: string;
    symbol: string;
}

export interface Domain {
    id?: number;
    uuid?: string;
    domain: string;
    is_primary?: boolean;
    dns_verified: boolean;
    ssl_status: string;
    type?: string;
    verified_at?: string | null;
    is_active?: boolean;
}

export interface VendorInfo {
    id: string;
    name: string;
    slug: string;
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
export interface Store {
    id: number;
    uuid: string;
    store_name: string;
    store_slug: string;
    country: Country;
    language: Language;
    currency: Currency;
    status: string;
    status_label: string;
    is_demo: boolean;
    subdomain: string;
    has_custom_domain: boolean;
    domain: Domain | null;
    vendor: VendorInfo | null;
    created_at: string;
    updated_at: string;
    activated_at?: string;
    // Additional fields that might come from the API
    vendor_id?: number;
    country_code?: string;
    language_code?: string;
    currency_code?: string;
    timezone?: string;
    theme_id?: number;
    logo_url?: string;
    favicon_url?: string;
    banner_url?: string;
    primary_color?: string;
    secondary_color?: string;
    contact_email?: string;
    contact_phone?: string;
    seo_meta_title?: string;
    seo_meta_description?: string;
    address?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
}

export interface StoreStatsResponse {
    success: boolean;
    data: {
        store_info: {
            id: number;
            uuid: string;
            name: string;
            slug: string;
            status: string;
        };
        products: {
            total: number;
            active: number;
            out_of_stock: number;
        };
        orders: {
            total: number;
            pending: number;
            processing: number;
            completed: number;
            cancelled: number;
        };
        revenue: {
            total: number;
            average_order_value: number;
            last_30_days: number;
        };
        ratings: {
            average: number;
            total_reviews: number;
            by_rating: Array<{ rating: number; count: number }>;
        };
    };
}

export interface StoreListMeta {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
    total_records: number;
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

export interface CreateStorePayload {
    vendor_id: number;
    store_name: string;
    store_slug: string;
    country_code: string;
    language_code?: string;
    currency_code?: string;
    timezone?: string;
    subdomain?: string;
    status?: "active" | "inactive" | "suspended" | "maintenance";
    primary_color?: string;
    secondary_color?: string;
    contact_email?: string;
    contact_phone?: string;
    description?: string;
    logo_url?: string;
    banner_url?: string;
    favicon_url?: string;
    theme_id?: number;
    domain?: string;
    address?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
    seo_meta_title?: string;
    seo_meta_description?: string;
    payment_methods?: Record<string, unknown>;
    shipping_methods?: Record<string, unknown>;
    tax_settings?: Record<string, unknown>;
    social_links?: Record<string, unknown>;
    google_analytics_id?: string;
    facebook_pixel_id?: string;
    custom_css?: string;
    custom_js?: string;
    is_demo?: boolean;
}

export interface UpdateStorePayload {
    store_name?: string;
    store_slug?: string;
    status?: "active" | "inactive" | "suspended" | "maintenance";
    country_code?: string;
    language_code?: string;
    currency_code?: string;
    subdomain?: string;
    primary_color?: string;
    secondary_color?: string;
    contact_email?: string;
    contact_phone?: string;
    description?: string;
    logo_url?: string;
    banner_url?: string;
    seo_meta_title?: string;
    seo_meta_description?: string;
    address?: Record<string, unknown>;
    [key: string]: unknown;
}

export interface AddDomainPayload {
    domain: string;
    verified?: boolean;
    type?: "madd_subdomain" | "vendor_custom" | "marketplace";
    set_as_primary?: boolean;
}

export interface BulkStatusUpdatePayload {
    store_ids: number[];
    status: "active" | "inactive" | "suspended" | "maintenance";
}

export interface StoresByVendorResponse {
    success: boolean;
    data: {
        vendor: {
            id: number;
            uuid: string;
            company_name: string;
            email: string | null;
            status: string;
        };
        stores: Store[];
        total_stores: number;
        active_stores: number;
        max_stores_allowed: number;
    };
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
    tagTypes: ["Stores", "StoreStats", "VendorsForStores"],

    endpoints: (builder) => ({

        // GET /admin/stores - Get all stores with filters
        getStores: builder.query<StoreListResponse, {
            page?: number;
            per_page?: number;
            vendor_id?: number;
            status?: string;
            country_code?: string;
            search?: string;
        } | void>({
            query: (params) => {
                const queryParams = new URLSearchParams();
                if (params) {
                    if (params.page) queryParams.append('page', params.page.toString());
                    if (params.per_page) queryParams.append('per_page', params.per_page.toString());
                    if (params.vendor_id) queryParams.append('vendor_id', params.vendor_id.toString());
                    if (params.status) queryParams.append('status', params.status);
                    if (params.country_code) queryParams.append('country_code', params.country_code);
                    if (params.search) queryParams.append('search', params.search);
                }
                const url = `admin/stores${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
                return {
                    url,
                    method: "GET",
                };
            },
            providesTags: ["Stores"],
        }),

        // GET /admin/stores/{uuid} - Get single store
        getStore: builder.query<StoreSingleResponse, string>({
            query: (uuid) => ({
                url: `admin/stores/${uuid}`,
                method: "GET",
            }),
            providesTags: (_result, _error, uuid) => [{ type: "Stores", id: uuid }],
        }),

        // POST /admin/stores - Create store
        createStore: builder.mutation<StoreSingleResponse, CreateStorePayload>({
            query: (data) => ({
                url: "admin/stores",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Stores"],
        }),

        // PUT /admin/stores/{id} - Update store (uses ID, not UUID for update per controller)
        updateStore: builder.mutation<StoreSingleResponse, { id: number; data: UpdateStorePayload }>({
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

        // DELETE /admin/stores/{id} - Soft delete store
        deleteStore: builder.mutation<{ success: boolean; message: string }, string>({
            query: (uuid) => ({
                url: `admin/stores/${uuid}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Stores"],
        }),

        // DELETE /admin/stores/{id}/force - Force delete store (permanent)
        forceDeleteStore: builder.mutation<{ success: boolean; message: string }, string>({
            query: (uuid) => ({
                url: `admin/stores/${uuid}/force`,
                method: "DELETE",
            }),
            invalidatesTags: ["Stores"],
        }),

        // POST /admin/stores/{id}/restore - Restore soft-deleted store
        restoreStore: builder.mutation<{ success: boolean; message: string; data: Store }, string>({
            query: (uuid) => ({
                url: `admin/stores/${uuid}/restore`,
                method: "POST",
            }),
            invalidatesTags: ["Stores"],
        }),

        // POST /admin/stores/{id}/activate - Activate store
        activateStore: builder.mutation<{ success: boolean; message: string; data: Store }, string>({
            query: (uuid) => ({
                url: `admin/stores/${uuid}/activate`,
                method: "POST",
            }),
            invalidatesTags: (_result, _error, uuid) => [
                "Stores",
                { type: "Stores", id: uuid },
            ],
        }),

        // POST /admin/stores/{id}/deactivate - Deactivate store
        deactivateStore: builder.mutation<{ success: boolean; message: string; data: Store }, string>({
            query: (uuid) => ({
                url: `admin/stores/${uuid}/deactivate`,
                method: "POST",
            }),
            invalidatesTags: (_result, _error, uuid) => [
                "Stores",
                { type: "Stores", id: uuid },
            ],
        }),

        // POST /admin/stores/{id}/domain - Add domain to store
        addStoreDomain: builder.mutation<{ success: boolean; message: string; data: Domain }, { uuid: string; data: AddDomainPayload }>({
            query: ({ uuid, data }) => ({
                url: `admin/stores/${uuid}/domain`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: (_result, _error, { uuid }) => [{ type: "Stores", id: uuid }],
        }),

        // GET /admin/stores/{id}/stats - Get store statistics
        getStoreStats: builder.query<StoreStatsResponse, string>({
            query: (uuid) => ({
                url: `admin/stores/${uuid}/stats`,
                method: "GET",
            }),
            providesTags: (_result, _error, uuid) => [{ type: "StoreStats", id: uuid }],
        }),

        // GET /admin/stores/by-vendor/{vendorId} - Get stores by vendor UUID
        getStoresByVendor: builder.query<StoresByVendorResponse, string>({
            query: (vendorUuid) => ({
                url: `admin/stores/by-vendor/${vendorUuid}`,
                method: "GET",
            }),
            providesTags: ["Stores"],
        }),

        // POST /admin/stores/bulk-status - Bulk update store status
        bulkStatusUpdate: builder.mutation<{ success: boolean; message: string; data: { updated_count: number; status: string } }, BulkStatusUpdatePayload>({
            query: (data) => ({
                url: "admin/stores/bulk-status",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Stores"],
        }),
        // Add to endpoints in storeApi.ts
        getVendorsForStore: builder.query<VendorsResponse, void>({
            query: () => ({
                url: "admin/vendors",
                method: "GET",
            }),
            providesTags: ["VendorsForStores"],
        }),
    }),
});

export const {
    useGetStoresQuery,
    useGetStoreQuery,
    useCreateStoreMutation,
    useUpdateStoreMutation,
    useDeleteStoreMutation,
    useForceDeleteStoreMutation,
    useRestoreStoreMutation,
    useActivateStoreMutation,
    useDeactivateStoreMutation,
    useAddStoreDomainMutation,
    useGetVendorsForStoreQuery, 
    useGetStoreStatsQuery,
    useGetStoresByVendorQuery,
    useBulkStatusUpdateMutation,
} = storeListApi;

export default storeListApi;