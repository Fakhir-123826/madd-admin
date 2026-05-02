// src/app/api/CouponSlices/CouponApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseURL = import.meta.env.VITE_BASE_URL;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Vendor {
    id: number;
    uuid: string;
    company_name: string;
    company_slug?: string;
}

export interface Coupon {
    id: number;
    code: string;
    description: string | null;
    type: "platform" | "vendor";
    discount_type: "percentage" | "fixed_amount" | "free_shipping" | "buy_x_get_y";
    discount_value: number;
    min_order_amount: number | null;
    max_uses: number | null;
    used_count: number;
    per_customer_limit: number | null;
    spent_amount: number;
    budget_limit: number | null;
    applicable_to: "all" | "products" | "vendors" | "stores";
    applicable_ids: number[] | null;
    exclude_sale_items: boolean;
    allowed_emails: string[] | null;
    allowed_roles: string[] | null;
    usage_limit_per_transaction: number;
    starts_at: string | null;
    expires_at: string | null;
    is_active: boolean;
    vendor_id: number | null;
    vendor?: Vendor;
    magento_rule_id?: string | null;
    magento_coupon_id?: string | null;
    sync_status?: "pending" | "synced" | "failed";
    created_at: string;
    updated_at: string;
}

export interface CreateCouponPayload {
    code: string;
    description?: string;
    type: "platform" | "vendor";
    discount_type: "percentage" | "fixed_amount" | "free_shipping" | "buy_x_get_y";
    discount_value: number;
    min_order_amount?: number;
    max_uses?: number;
    per_customer_limit?: number;
    usage_limit_per_transaction?: number;
    exclude_sale_items?: boolean;
    allowed_emails?: string[];
    allowed_roles?: string[];
    budget_limit?: number;
    applicable_to?: "all" | "products" | "vendors" | "stores";
    applicable_ids?: number[];
    vendor_id?: number;
    starts_at?: string;
    expires_at?: string;
    is_active?: boolean;
}

export interface UpdateCouponPayload {
    code?: string;
    description?: string;
    discount_type?: "percentage" | "fixed_amount" | "free_shipping" | "buy_x_get_y";
    discount_value?: number;
    min_order_amount?: number;
    max_uses?: number;
    per_customer_limit?: number;
    usage_limit_per_transaction?: number;
    exclude_sale_items?: boolean;
    allowed_emails?: string[];
    allowed_roles?: string[];
    budget_limit?: number;
    applicable_to?: "all" | "products" | "vendors" | "stores";
    applicable_ids?: number[];
    starts_at?: string;
    expires_at?: string;
    is_active?: boolean;
}

export interface CouponUsageStats {
    total_uses: number;
    total_discount: number;
    remaining_budget: number | null;
    remaining_uses: number | null;
    average_discount: number;
}

export interface CouponStatistics {
    total: number;
    active: number;
    inactive: number;
    platform_coupons: number;
    vendor_coupons: number;
    by_discount_type: Array<{
        discount_type: string;
        count: number;
    }>;
    total_uses: number;
    total_discount_given: number;
    top_coupons: Array<{
        code: string;
        used_count: number;
        spent_amount: number;
    }>;
    expiring_soon: number;
}

export interface CouponListResponse {
    success: boolean;
    data: Coupon[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from?: number;
        to?: number;
    };
}

export interface CouponSingleResponse {
    success: boolean;
    data: {
        coupon: Coupon;
        usage_statistics: CouponUsageStats;
        recent_orders: any[];
    };
}

export interface CouponStatisticsResponse {
    success: boolean;
    data: CouponStatistics;
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
const baseQueryWithAuthCheck: typeof rawBaseQuery = async (args, api, extraOptions) => {
    const result = await rawBaseQuery(args, api, extraOptions);

    // If token expired / unauthorized
    if (result.error && result.error.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
    }

    return result;
};

// ─── API Slice ────────────────────────────────────────────────────────────────

export const couponApi = createApi({
    reducerPath: "couponApi",
    baseQuery: baseQueryWithAuthCheck,
    tagTypes: ["Coupons", "CouponStats", "CouponDetail"],
    keepUnusedDataFor: 60, // Keep unused data for 60 seconds

    endpoints: (builder) => ({

        // GET /admin/coupons - Get all coupons with filters
        getCoupons: builder.query<CouponListResponse, {
            page?: number;
            per_page?: number;
            type?: string;
            discount_type?: string;
            is_active?: boolean;
            vendor_id?: number;
            search?: string;
            valid?: boolean;
        } | void>({
            query: (params) => {
                const queryParams = new URLSearchParams();
                if (params) {
                    if (params.page) queryParams.append('page', params.page.toString());
                    if (params.per_page) queryParams.append('per_page', params.per_page.toString());
                    if (params.type) queryParams.append('type', params.type);
                    if (params.discount_type) queryParams.append('discount_type', params.discount_type);
                    if (params.is_active !== undefined) queryParams.append('is_active', params.is_active.toString());
                    if (params.vendor_id) queryParams.append('vendor_id', params.vendor_id.toString());
                    if (params.search) queryParams.append('search', params.search);
                    if (params.valid !== undefined) queryParams.append('valid', params.valid.toString());
                }
                const url = `admin/coupons${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
                return { url, method: "GET" };
            },
            providesTags: (result) =>
                result
                    ? [
                        ...(result.data?.data ?? []).map(({ id }) => ({ type: "Coupon" as const, id })),
                        { type: "Coupon", id: "LIST" },
                    ]
                    : [{ type: "Coupon", id: "LIST" }],
        }),

        // GET /admin/coupons/statistics - Get coupon statistics
        getCouponStatistics: builder.query<CouponStatisticsResponse, void>({
            query: () => ({
                url: "admin/coupons/statistics",
                method: "GET",
            }),
            providesTags: ["CouponStats"],
        }),

        // GET /admin/coupons/{id} - Get single coupon
        getCoupon: builder.query<CouponSingleResponse, number>({
            query: (id) => ({
                url: `admin/coupons/${id}`,
                method: "GET",
            }),
            providesTags: (_result, _error, id) => [{ type: "CouponDetail", id }],
        }),

        // POST /admin/coupons - Create new coupon
        createCoupon: builder.mutation<{ success: boolean; message: string; data: Coupon }, CreateCouponPayload>({
            query: (data) => ({
                url: "admin/coupons",
                method: "POST",
                body: data,
            }),
            invalidatesTags: [{ type: "Coupons", id: "LIST" }, "CouponStats"],
        }),

        // PUT /admin/coupons/{id} - Update coupon
        updateCoupon: builder.mutation<{ success: boolean; message: string; data: Coupon }, { id: number; data: UpdateCouponPayload }>({
            query: ({ id, data }) => ({
                url: `admin/coupons/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: "Coupons", id: "LIST" },
                { type: "CouponDetail", id },
                "CouponStats",
            ],
        }),

        // DELETE /admin/coupons/{id} - Delete coupon
        deleteCoupon: builder.mutation<{ success: boolean; message: string }, number>({
            query: (id) => ({
                url: `admin/coupons/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [{ type: "Coupons", id: "LIST" }, "CouponStats"],
        }),

        // POST /admin/coupons/{id}/duplicate - Duplicate coupon
        duplicateCoupon: builder.mutation<{ success: boolean; message: string; data: Coupon }, number>({
            query: (id) => ({
                url: `admin/coupons/${id}/duplicate`,
                method: "POST",
            }),
            invalidatesTags: [{ type: "Coupons", id: "LIST" }, "CouponStats"],
        }),

        // POST /admin/coupons/{id}/toggle-status - Toggle coupon status
        toggleCouponStatus: builder.mutation<{ success: boolean; message: string; data: { is_active: boolean } }, number>({
            query: (id) => ({
                url: `admin/coupons/${id}/toggle-status`,
                method: "POST",
            }),
            invalidatesTags: (_result, _error, id) => [
                { type: "Coupons", id: "LIST" },
                { type: "CouponDetail", id },
                "CouponStats",
            ],
        }),

        // POST /admin/coupons/{id}/sync - Sync coupon to Magento
        syncCouponToMagento: builder.mutation<{ success: boolean; message: string }, number>({
            query: (id) => ({
                url: `admin/coupons/${id}/sync`,
                method: "POST",
            }),
            invalidatesTags: (_result, _error, id) => [
                { type: "Coupons", id: "LIST" },
                { type: "CouponDetail", id },
            ],
        }),

        // GET /admin/coupons/export - Export coupons to CSV
        exportCoupons: builder.query<{ success: boolean; data: { filename: string; content: string; mime_type: string } }, {
            type?: string;
            is_active?: boolean;
            date_from?: string;
            date_to?: string;
        } | void>({
            query: (params) => {
                const queryParams = new URLSearchParams();
                if (params) {
                    if (params.type) queryParams.append('type', params.type);
                    if (params.is_active !== undefined) queryParams.append('is_active', params.is_active.toString());
                    if (params.date_from) queryParams.append('date_from', params.date_from);
                    if (params.date_to) queryParams.append('date_to', params.date_to);
                }
                const url = `admin/coupons/export${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
                return { url, method: "GET" };
            },
            keepUnusedDataFor: 0, // Don't cache export data
        }),
    }),
});

// ─── Export Hooks ─────────────────────────────────────────────────────────────

export const {
    useGetCouponsQuery,
    useGetCouponStatisticsQuery,
    useGetCouponQuery,
    useCreateCouponMutation,
    useUpdateCouponMutation,
    useDeleteCouponMutation,
    useDuplicateCouponMutation,
    useToggleCouponStatusMutation,
    useSyncCouponToMagentoMutation,
    useExportCouponsQuery,
    useLazyExportCouponsQuery,
} = couponApi;

export default couponApi;