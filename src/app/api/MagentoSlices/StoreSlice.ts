import { createApi } from "@reduxjs/toolkit/query/react";
import { dynamicBaseQuery } from "../dynamicBaseQuery";

// ─── Types ────────────────────────────────────────────────────────────────────

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

export interface LocalStore {
    id: number;
    uuid: string;
    store_name: string;
    store_slug: string;
    country_code: string;
    language_code: string;
    currency_code: string;
    timezone: string;
    status: "active" | "inactive" | "suspended" | "maintenance";
    is_demo: boolean;
    subdomain: string;
    has_custom_domain: boolean;
    domain: Domain | null;
    vendor_id: number;
    vendor?: {
        id: number;
        uuid: string;
        company_name: string;
        name?: string;
    };
    created_at: string;
    updated_at: string;
    activated_at?: string;
    logo_url?: string;
    banner_url?: string;
    favicon_url?: string;
    contact_email?: string;
    contact_phone?: string;
    description?: string;
    primary_color?: string;
    secondary_color?: string;
    seo_meta_title?: string;
    seo_meta_description?: string;
    address?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
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

export interface StoreResponse {
    success: boolean;
    message: string;
    data: LocalStore[];
}

export interface SingleStoreResponse {
    success: boolean;
    message: string;
    data: LocalStore;
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
        stores: LocalStore[];
        total_stores: number;
        active_stores: number;
        max_stores_allowed: number;
    };
    message?: string;
}

export interface SyncStoresResponse {
    success: boolean;
    message: string;
    data: {
        created: number;
        updated: number;
        skipped: number;
        total_synced: number;
        synced_store_uuids: string[];
        errors?: string[];
    };
}

export interface PaginatedStoresResponse {
    success: boolean;
    data: {
        current_page: number;
        data: LocalStore[];
        first_page_url: string;
        from: number;
        last_page: number;
        last_page_url: string;
        links: Array<{ url: string | null; label: string; active: boolean }>;
        next_page_url: string | null;
        path: string;
        per_page: number;
        prev_page_url: string | null;
        to: number;
        total: number;
    };
    message: string;
}

// ─── API Slice ────────────────────────────────────────────────────────────────

export const storeApi = createApi({
    reducerPath: "storeApi",
    baseQuery: dynamicBaseQuery,
    tagTypes: ["Stores", "MagentoStores", "Websites", "StoreViews"],
    endpoints: (builder) => ({

        // ==================== LOCAL STORE ENDPOINTS ====================

        /**
         * GET /stores - Get all local stores
         */
        getAllLocalStores: builder.query<StoreResponse, void>({
            query: () => `stores`,
            providesTags: ["Stores"],
        }),

        /**
         * GET /stores/local/paginated - Get paginated local stores
         */
        getPaginatedLocalStores: builder.query<PaginatedStoresResponse, { page?: number; per_page?: number }>({
            query: (params) => {
                const queryParams = new URLSearchParams();
                if (params?.page) queryParams.append('page', params.page.toString());
                if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
                const url = `stores/local/paginated${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
                return { url, method: "GET" };
            },
            providesTags: ["Stores"],
        }),

        /**
         * GET /stores/local/filter - Filter local stores
         */
        filterLocalStores: builder.query<StoreResponse, {
            vendor_id?: number;
            status?: string;
            country_code?: string;
            search?: string;
        }>({
            query: (params) => {
                const queryParams = new URLSearchParams();
                if (params?.vendor_id) queryParams.append('vendor_id', params.vendor_id.toString());
                if (params?.status) queryParams.append('status', params.status);
                if (params?.country_code) queryParams.append('country_code', params.country_code);
                if (params?.search) queryParams.append('search', params.search);
                const url = `stores/local/filter${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
                return { url, method: "GET" };
            },
            providesTags: ["Stores"],
        }),

        /**
         * GET /stores/by-vendor/{vendorUuid} - Get local stores by vendor UUID
         * ✅ This is the endpoint you need for the vendor dropdown
         */
        getStoresByVendor: builder.query<StoresByVendorResponse, string>({
            query: (vendorUuid) => `stores/by-vendor/${vendorUuid}`,
            providesTags: (_result, _error, vendorUuid) => [{ type: "Stores", id: `vendor-${vendorUuid}` }],
        }),

        /**
         * GET /stores/{uuid} - Get single local store by UUID
         */
        getLocalStoreByUuid: builder.query<SingleStoreResponse, string>({
            query: (uuid) => `stores/${uuid}`,
            providesTags: (_result, _error, uuid) => [{ type: "Stores", id: uuid }],
        }),

        /**
         * POST /stores/sync-from-magento - Sync stores from Magento
         */
        syncStoresFromMagento: builder.mutation<SyncStoresResponse, { vendor_id: number }>({
            query: (data) => ({
                url: `stores/sync-from-magento`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Stores"],
        }),

        // ==================== MAGENTO STORE ENDPOINTS ====================

        /**
         * GET /stores - Get all Magento stores (original endpoint)
         */
        getAllStores: builder.query<StoreResponse, { page?: number; pageSize?: number } | void>({
            query: (params) => {
                const { page = 1, pageSize = 10 } = params || {};
                return `stores?page=${page}&pageSize=${pageSize}`;
            },
            providesTags: ["MagentoStores"],
        }),

        /**
         * GET /stores/{id} - Get Magento store by ID
         */
        getStoreById: builder.query<any, number>({
            query: (id) => `stores/${id}`,
            providesTags: (_result, _error, id) => [{ type: "MagentoStores", id }],
        }),

        /**
         * GET /stores/websites - Get all websites
         */
        getAllWebsites: builder.query<any, void>({
            query: () => `stores/websites`,
            providesTags: ["Websites"],
        }),

        /**
         * GET /stores/views - Get all store views
         */
        getAllStoreViews: builder.query<any, void>({
            query: () => `stores/views`,
            providesTags: ["StoreViews"],
        }),

        /**
         * GET /stores/website/{websiteId} - Get stores by website ID
         */
        getStoresByWebsiteId: builder.query<any, number>({
            query: (websiteId) => `stores/website/${websiteId}`,
            providesTags: (_result, _error, websiteId) => [{ type: "MagentoStores", id: `website-${websiteId}` }],
        }),

        /**
         * GET /stores/{storeId}/views - Get store views by store ID
         */
        getStoreViewsByStoreId: builder.query<any, number>({
            query: (storeId) => `stores/${storeId}/views`,
            providesTags: (_result, _error, storeId) => [{ type: "StoreViews", id: storeId }],
        }),
    }),
});

// ─── Export all hooks ─────────────────────────────────────────────────────────

export const {
    // Local store hooks
    useGetAllLocalStoresQuery,
    useGetPaginatedLocalStoresQuery,
    useFilterLocalStoresQuery,
    useGetStoresByVendorQuery,        // ✅ This is now available
    useGetLocalStoreByUuidQuery,
    useSyncStoresFromMagentoMutation,

    // Magento store hooks
    useGetAllStoresQuery,
    useGetStoreByIdQuery,
    useGetAllWebsitesQuery,
    useGetAllStoreViewsQuery,
    useGetStoresByWebsiteIdQuery,
    useGetStoreViewsByStoreIdQuery,
} = storeApi;

export default storeApi;