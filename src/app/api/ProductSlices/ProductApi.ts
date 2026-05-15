// src/app/api/ProductSlices/ProductApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { dynamicBaseQuery } from "../dynamicBaseQuery";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Vendor {
    id: number;
    name: string;
    company_name?: string;
}

export interface Store {
    id: number;
    uuid: string;
    store_name: string;
}

export interface ProductDraft {
    id: number;
    status: string;
    notes?: string;
    created_at: string;
}

export interface Product {
    id: number;
    uuid: string;
    name: string;
    sku: string;
    description?: string;
    price: number;
    compare_price?: number;
    cost_per_item?: number;
    stock_quantity: number;
    status: "active" | "inactive" | "draft";
    sync_status: string;
    is_featured?: boolean;
    vendor_id: number;
    store_id?: number;
    vendor?: Vendor;
    store?: Store;
    draft?: ProductDraft;
    created_at: string;
    updated_at: string;
    images?: string[];
    categories?: string[];
    tags?: string[];
}

export interface PendingProduct {
    id: number;
    vendor_id: number;
    store_id?: number;
    product_id?: number;
    status: string;
    notes?: string;
    created_at: string;
    updated_at: string;
    vendor?: Vendor;
    store?: Store;
    product?: Product;
}

export interface ProductStatistics {
    total: number;
    active: number;
    inactive: number;
    draft: number;
    pending_sync: number;
    synced: number;
    failed_sync: number;
    pending_approval: number;
    total_value: number;
    average_price: number;
    by_vendor: Array<{
        vendor_id: number;
        count: number;
        vendor: { id: number; name: string };
    }>;
    top_products: Array<{
        id: number;
        uuid: string;
        name: string;
        total_sold: number;
        total_revenue: number;
    }>;
    recent_products: Product[];
}

export interface ProductListResponse {
    success: boolean;
    data: Product[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        filters?: Record<string, unknown>;
    };
}

export interface PendingProductsResponse {
    success: boolean;
    data: PendingProduct[];
    meta: {
        total_pending: number;
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export interface ProductSingleResponse {
    success: boolean;
    data: Product;
}

export interface StatisticsResponse {
    success: boolean;
    data: ProductStatistics;
    generated_at: string;
}

// ─── API Slice ────────────────────────────────────────────────────────────────

export const productApi = createApi({
    reducerPath: "productApi",
    baseQuery: dynamicBaseQuery,
    tagTypes: ["Products", "PendingProducts", "ProductStats"],

    endpoints: (builder) => ({

        // GET /products - Get all products
        getProducts: builder.query<ProductListResponse, {
            page?: number;
            per_page?: number;
            status?: string;
            vendor_id?: number;
            search?: string;
            price_min?: number;
            price_max?: number;
        } | void>({
            query: (params) => {
                const queryParams = new URLSearchParams();
                if (params) {
                    if (params.page) queryParams.append('page', params.page.toString());
                    if (params.per_page) queryParams.append('per_page', params.per_page.toString());
                    if (params.status) queryParams.append('status', params.status);
                    if (params.vendor_id) queryParams.append('vendor_id', params.vendor_id.toString());
                    if (params.search) queryParams.append('search', params.search);
                    if (params.price_min) queryParams.append('price_min', params.price_min.toString());
                    if (params.price_max) queryParams.append('price_max', params.price_max.toString());
                }
                const url = `products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
                return { url, method: "GET" };
            },
            providesTags: ["Products"],
        }),

        // GET /products/pending - Get pending product approvals
        getPendingProducts: builder.query<PendingProductsResponse, {
            page?: number;
            per_page?: number;
        } | void>({
            query: (params) => {
                const queryParams = new URLSearchParams();
                if (params) {
                    if (params.page) queryParams.append('page', params.page.toString());
                    if (params.per_page) queryParams.append('per_page', params.per_page.toString());
                }
                const url = `products/pending${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
                return { url, method: "GET" };
            },
            providesTags: ["PendingProducts"],
        }),

        // GET /products/statistics - Get product statistics
        getProductStatistics: builder.query<StatisticsResponse, void>({
            query: () => ({
                url: "products/statistics",
                method: "GET",
            }),
            providesTags: ["ProductStats"],
        }),

        // GET /products/{id} - Get single product
        getProduct: builder.query<ProductSingleResponse, string>({
            query: (uuid) => ({
                url: `products/${uuid}`,
                method: "GET",
            }),
            providesTags: (_result, _error, uuid) => [{ type: "Products", id: uuid }],
        }),

        // POST /products/drafts/{id}/approve - Approve product
        approveProduct: builder.mutation<{ success: boolean; message: string; data: unknown }, { id: number; notes?: string }>({
            query: ({ id, notes }) => ({
                url: `products/drafts/${id}/approve`,
                method: "POST",
                body: { notes },
            }),
            invalidatesTags: ["Products", "PendingProducts", "ProductStats"],
        }),

        // POST /products/drafts/{id}/reject - Reject product
        rejectProduct: builder.mutation<{ success: boolean; message: string; data: unknown }, { id: number; reason: string }>({
            query: ({ id, reason }) => ({
                url: `products/drafts/${id}/reject`,
                method: "POST",
                body: { reason },
            }),
            invalidatesTags: ["Products", "PendingProducts", "ProductStats"],
        }),

        // POST /products/drafts/{id}/request-modification - Request modification
        requestModification: builder.mutation<{ success: boolean; message: string }, { id: number; changes: Record<string, unknown>; reason: string }>({
            query: ({ id, changes, reason }) => ({
                url: `products/drafts/${id}/request-modification`,
                method: "POST",
                body: { changes, reason },
            }),
            invalidatesTags: ["PendingProducts"],
        }),

        // DELETE /products/{id} - Delete product
        deleteProduct: builder.mutation<{ success: boolean; message: string }, string>({
            query: (uuid) => ({
                url: `products/${uuid}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Products", "ProductStats"],
        }),

        // POST /products/{id}/feature - Feature product
        featureProduct: builder.mutation<{ success: boolean; message: string }, string>({
            query: (uuid) => ({
                url: `products/${uuid}/feature`,
                method: "POST",
            }),
            invalidatesTags: ["Products"],
        }),

        // POST /products/{id}/unfeature - Unfeature product
        unfeatureProduct: builder.mutation<{ success: boolean; message: string }, string>({
            query: (uuid) => ({
                url: `products/${uuid}/unfeature`,
                method: "POST",
            }),
            invalidatesTags: ["Products"],
        }),
        // Add to your ProductApi.ts endpoints
        updateProduct: builder.mutation<{ success: boolean; message: string; data: Product }, { uuid: string; data: any }>({
            query: ({ uuid, data }) => ({
                url: `products/${uuid}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Products", "ProductStats"],
        }),
        createProduct: builder.mutation<{ success: boolean; message: string; data: Product }, any>({
            query: (productData) => ({
                url: "products",
                method: "POST",
                body: productData,
            }),
            invalidatesTags: ["Products", "ProductStats"],
        }),
    }),
});

export const {
    useGetProductsQuery,
    useGetPendingProductsQuery,
    useGetProductStatisticsQuery,
    useGetProductQuery,
    useApproveProductMutation,
    useRejectProductMutation,
    useRequestModificationMutation,
    useDeleteProductMutation,
    useFeatureProductMutation,
    useUnfeatureProductMutation,
    useCreateProductMutation,
    useUpdateProductMutation,
} = productApi;

export default productApi;