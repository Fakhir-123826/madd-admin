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

// Helper function to get base route from localStorage
const getUserBasePath = () => {
    try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const role = user?.roles?.[0] || user?.user_type;

        if (["super_admin", "admin"].includes(role)) return "admin";
        if (["vendor", "customer"].includes(role)) return role;

        return "admin";
    } catch {
        return "admin";
    }
};

// Custom dynamic base query that handles role-based routing
const dynamicBaseQuery = async (args: any, api: any, extraOptions: any) => {
    const basePath = getUserBasePath();
    
    // Handle both string URL and object args
    let url: string;
    let method: string = 'GET';
    let body: any = undefined;
    let params: any = undefined;
    
    if (typeof args === 'string') {
        url = args;
    } else {
        url = args.url;
        method = args.method || 'GET';
        body = args.body;
        params = args.params;
    }
    
    // Remove any existing base path prefix if present
    const cleanEndpoint = url.replace(/^(admin|vendor|customer)\//, '');
    
    // Construct the full URL with dynamic base path
    let finalUrl = `${baseURL}/${basePath}/${cleanEndpoint}`;
    
    // Add query parameters if they exist
    if (params) {
        const queryString = new URLSearchParams(params).toString();
        finalUrl += `?${queryString}`;
    }
    
    // Prepare headers
    const headers = new Headers();
    const token = localStorage.getItem("token");
    if (token) {
        headers.set("authorization", `Bearer ${token}`);
    }
    headers.set("Content-Type", "application/json");
    
    // Prepare fetch options
    const fetchOptions: RequestInit = {
        method,
        headers,
        ...extraOptions,
    };
    
    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        fetchOptions.body = JSON.stringify(body);
    }
    
    // Make the request
    try {
        const response = await fetch(finalUrl, fetchOptions);
        let data;
        
        // Try to parse JSON, but handle non-JSON responses
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            data = await response.text();
        }
        
        // Handle unauthorized
        if (response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
            return { error: { status: 401, data: { message: "Unauthorized" } } };
        }
        
        // Handle other error status codes
        if (!response.ok) {
            return { 
                error: { 
                    status: response.status, 
                    data: data,
                    message: data?.message || `Request failed with status ${response.status}`
                } 
            };
        }
        
        return { data };
    } catch (error) {
        console.error("API Request Error:", error);
        return { error: { status: 'FETCH_ERROR', error: String(error) } };
    }
};

// ─── API Slice ────────────────────────────────────────────────────────────────

export const storeListApi = createApi({
    reducerPath: "storeListApi",
    baseQuery: dynamicBaseQuery,
    tagTypes: ["Stores", "StoreStats", "VendorsForStores"],

    endpoints: (builder) => ({

        // GET /{basePath}/stores - Get all stores with filters
        getStores: builder.query<StoreListResponse, {
            page?: number;
            per_page?: number;
            vendor_id?: number;
            status?: string;
            country_code?: string;
            search?: string;
        } | void>({
            query: (params) => {
                const queryParams: Record<string, string> = {};
                if (params) {
                    if (params.page) queryParams.page = params.page.toString();
                    if (params.per_page) queryParams.per_page = params.per_page.toString();
                    if (params.vendor_id) queryParams.vendor_id = params.vendor_id.toString();
                    if (params.status) queryParams.status = params.status;
                    if (params.country_code) queryParams.country_code = params.country_code;
                    if (params.search) queryParams.search = params.search;
                }
                return {
                    url: "stores",
                    method: "GET",
                    params: Object.keys(queryParams).length ? queryParams : undefined,
                };
            },
            providesTags: ["Stores"],
        }),

        // GET /{basePath}/stores/{uuid} - Get single store
        getStore: builder.query<StoreSingleResponse, string>({
            query: (uuid) => ({
                url: `stores/${uuid}`,
                method: "GET",
            }),
            providesTags: (_result, _error, uuid) => [{ type: "Stores", id: uuid }],
        }),

        // POST /{basePath}/stores - Create store
        createStore: builder.mutation<StoreSingleResponse, CreateStorePayload>({
            query: (data) => ({
                url: "stores",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Stores"],
        }),

        // PUT /{basePath}/stores/{id} - Update store (uses ID, not UUID for update per controller)
        updateStore: builder.mutation<StoreSingleResponse, { id: number; data: UpdateStorePayload }>({
            query: ({ id, data }) => ({
                url: `stores/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                "Stores",
                { type: "Stores", id: id.toString() },
            ],
        }),

        // DELETE /{basePath}/stores/{uuid} - Soft delete store
        deleteStore: builder.mutation<{ success: boolean; message: string }, string>({
            query: (uuid) => ({
                url: `stores/${uuid}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Stores"],
        }),

        // DELETE /{basePath}/stores/{uuid}/force - Force delete store (permanent)
        forceDeleteStore: builder.mutation<{ success: boolean; message: string }, string>({
            query: (uuid) => ({
                url: `stores/${uuid}/force`,
                method: "DELETE",
            }),
            invalidatesTags: ["Stores"],
        }),

        // POST /{basePath}/stores/{uuid}/restore - Restore soft-deleted store
        restoreStore: builder.mutation<{ success: boolean; message: string; data: Store }, string>({
            query: (uuid) => ({
                url: `stores/${uuid}/restore`,
                method: "POST",
            }),
            invalidatesTags: ["Stores"],
        }),

        // POST /{basePath}/stores/{uuid}/activate - Activate store
        activateStore: builder.mutation<{ success: boolean; message: string; data: Store }, string>({
            query: (uuid) => ({
                url: `stores/${uuid}/activate`,
                method: "POST",
            }),
            invalidatesTags: (_result, _error, uuid) => [
                "Stores",
                { type: "Stores", id: uuid },
            ],
        }),

        // POST /{basePath}/stores/{uuid}/deactivate - Deactivate store
        deactivateStore: builder.mutation<{ success: boolean; message: string; data: Store }, string>({
            query: (uuid) => ({
                url: `stores/${uuid}/deactivate`,
                method: "POST",
            }),
            invalidatesTags: (_result, _error, uuid) => [
                "Stores",
                { type: "Stores", id: uuid },
            ],
        }),

        // POST /{basePath}/stores/{uuid}/domain - Add domain to store
        addStoreDomain: builder.mutation<{ success: boolean; message: string; data: Domain }, { uuid: string; data: AddDomainPayload }>({
            query: ({ uuid, data }) => ({
                url: `stores/${uuid}/domain`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: (_result, _error, { uuid }) => [{ type: "Stores", id: uuid }],
        }),

        // GET /{basePath}/stores/{uuid}/stats - Get store statistics
        getStoreStats: builder.query<StoreStatsResponse, string>({
            query: (uuid) => ({
                url: `stores/${uuid}/stats`,
                method: "GET",
            }),
            providesTags: (_result, _error, uuid) => [{ type: "StoreStats", id: uuid }],
        }),

        // GET /{basePath}/stores/by-vendor/{vendorUuid} - Get stores by vendor UUID
        getStoresByVendor: builder.query<StoresByVendorResponse, string>({
            query: (vendorUuid) => ({
                url: `stores/by-vendor/${vendorUuid}`,
                method: "GET",
            }),
            providesTags: ["Stores"],
        }),

        // POST /{basePath}/stores/bulk-status - Bulk update store status
        bulkStatusUpdate: builder.mutation<{ success: boolean; message: string; data: { updated_count: number; status: string } }, BulkStatusUpdatePayload>({
            query: (data) => ({
                url: "stores/bulk-status",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Stores"],
        }),

        // GET /{basePath}/vendors - Get vendors for store dropdown
        getVendorsForStore: builder.query<VendorsResponse, void>({
            query: () => ({
                url: "vendors",
                method: "GET",
            }),
            providesTags: ["VendorsForStores"],
        }),
    }),
});

// Export all hooks
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