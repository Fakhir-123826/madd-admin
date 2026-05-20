// src/app/api/ProductSlices/ProductApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { dynamicBaseQuery } from "../dynamicBaseQuery";

// ─── Types for Basic Product ────────────────────────────────────────────────────

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

// ─── Types for Magento Product ─────────────────────────────────────────────────

export interface TierPrice {
    customer_group_id: number;
    qty: number;
    price: number;
    price_type?: "fixed" | "percent";
}

export interface ProductLink {
    link_type: "related" | "upsell" | "crosssell";
    linked_product_sku: string;
    linked_product_type?: string;
    position?: number;
}

export interface CustomOptionValue {
    title: string;
    sort_order: number;
    price: number;
    price_type: "fixed" | "percent";
    sku?: string;
}

export interface CustomOption {
    title: string;
    type: "field" | "area" | "file" | "drop_down" | "radio" | "checkbox" | "multi" | "date" | "date_time" | "time";
    is_require: boolean;
    sort_order: number;
    price: number;
    price_type: "fixed" | "percent";
    sku?: string;
    max_characters?: number;
    file_extension?: string;
    image_size_x?: number;
    image_size_y?: number;
    values?: CustomOptionValue[];
}

export interface MediaContent {
    base64_encoded_data: string;
    type: string;
    name: string;
}

export interface VideoContent {
    video_provider: "youtube" | "vimeo";
    video_url: string;
    video_title?: string;
    video_description?: string;
}

export interface MediaGalleryEntry {
    media_type: "image" | "external-video";
    label?: string;
    position?: number;
    disabled?: boolean;
    types?: string[];
    content?: MediaContent;
    video_content?: VideoContent;
}

export interface InventorySourceItem {
    source_code: string;
    quantity: number;
    status?: number;
}

export interface ConfigurableOptionValue {
    value_index: number;
}

export interface ConfigurableOption {
    attribute_id: number;
    label: string;
    position?: number;
    is_use_default?: boolean;
    values: ConfigurableOptionValue[];
}

export interface DownloadableLink {
    title: string;
    sort_order: number;
    is_shareable: number;
    price: number;
    number_of_downloads: number;
    link_type: "file" | "url";
    link_file?: string;
    link_url?: string;
    sample_type: "file" | "url";
    sample_file?: string;
    sample_url?: string;
}

export interface DownloadableSample {
    title: string;
    sort_order: number;
    sample_type: "file" | "url";
    sample_file?: string;
    sample_url?: string;
}

export interface BundleProductLink {
    sku: string;
    qty: number;
    position: number;
    is_default: boolean;
    price: number;
    price_type: number;
    can_change_quantity: number;
}

export interface BundleOption {
    title: string;
    required: boolean;
    type: "select" | "multi" | "radio" | "checkbox";
    position: number;
    sku: string;
    product_links: BundleProductLink[];
}

export interface GiftCardAmount {
    website_id: number;
    value: number;
}

export interface CreateProductPayload {
    // Vendor & Store Info
    vendor_id: number;
    vendor_store_id: number;

    // Core Product Data
    sku: string;
    name: string;
    type_id: "simple" | "configurable" | "bundle" | "grouped" | "virtual" | "downloadable";
    attribute_set_id: number;
    price: number;
    status: number;
    visibility: number;
    weight?: number;
    tax_class_id?: number;
    quantity: number;

    // Content
    description?: string;
    short_description?: string;

    // SEO
    url_key?: string;
    meta_title?: string;
    meta_keyword?: string;
    meta_description?: string;

    // Advanced Pricing
    special_price?: number;
    special_from_date?: string;
    special_to_date?: string;
    cost?: number;
    msrp?: number;
    msrp_display_actual_price_type?: number;

    // Stock Management
    manage_stock?: boolean;
    backorders?: number;
    notify_stock_qty?: number;
    min_sale_qty?: number;
    max_sale_qty?: number;
    qty_increments?: number;
    enable_qty_increments?: boolean;

    // Design
    custom_design?: string;
    page_layout?: string;
    custom_layout_update?: string;

    // Gift Options
    gift_message_available?: boolean;

    // Product Badges & Dates
    news_from_date?: string;
    news_to_date?: string;
    country_of_manufacture?: string;

    // Categories
    category_ids?: number[];

    // Media
    media_gallery?: MediaGalleryEntry[];

    // Product Links
    product_links?: ProductLink[];

    // Custom Options
    custom_options?: CustomOption[];

    // Tier Prices
    tier_prices?: TierPrice[];

    // MSI Inventory
    inventory?: InventorySourceItem;

    // Configurable Product
    configurable_options?: ConfigurableOption[];
    configurable_product_links?: string[];

    // Downloadable Product
    downloadable_links?: DownloadableLink[];
    downloadable_samples?: DownloadableSample[];

    // Bundle Product
    bundle_options?: BundleOption[];

    // Gift Card
    giftcard_amounts?: GiftCardAmount[];
    giftcard_type?: "virtual" | "physical" | "combined";
    giftcard_amount_type?: "fixed" | "range";
    giftcard_open_amount_max?: number;
    giftcard_open_amount_min?: number;

    // Dynamic Custom Attributes
    dynamic_attributes?: Record<string, any>;

    // Website IDs
    website_ids?: number[];
}

export interface UpdateProductPayload {
    name?: string;
    price?: number;
    quantity?: number;
    status?: number;
    visibility?: number;
    weight?: number;
    tax_class_id?: number;
    description?: string;
    short_description?: string;
    url_key?: string;
    meta_title?: string;
    meta_description?: string;
    special_price?: number;
    special_from_date?: string;
    special_to_date?: string;
    cost?: number;
    manage_stock?: boolean;
    category_ids?: number[];
    dynamic_attributes?: Record<string, any>;
}

export interface VendorProduct {
    id: number;
    uuid: string;
    vendor_id: number;
    vendor_store_id: number | null;
    magento_product_id: number | null;
    magento_sku: string | null;
    sku: string;
    name: string;
    type_id: string;
    attribute_set_id: number;
    price: number;
    quantity: number;
    status: boolean;
    sync_status: "pending" | "synced" | "failed" | "updating";
    last_synced_at: string | null;
    sync_errors: Record<string, any> | null;
    metadata: Record<string, any> | null;
    full_product_data: Record<string, any> | null;
    product_data: Record<string, any> | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface VendorProductListResponse {
    success: boolean;
    data: {
        current_page: number;
        data: VendorProduct[];
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

export interface VendorProductSingleResponse {
    success: boolean;
    data: VendorProduct;
    message: string;
}

export interface CreateProductResponse {
    success: boolean;
    data: VendorProduct;
    magento_response: {
        success: boolean;
        message: string;
        product?: any;
        sku?: string;
    };
    message: string;
}

// ─── API Slice ────────────────────────────────────────────────────────────────

export const productApi = createApi({
    reducerPath: "productApi",
    baseQuery: dynamicBaseQuery,
    tagTypes: ["Products", "PendingProducts", "ProductStats"],

    endpoints: (builder) => ({

        // ==================== BASIC PRODUCT ENDPOINTS ====================

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

        // PUT /products/{id} - Update product
        updateProduct: builder.mutation<{ success: boolean; message: string; data: Product }, { uuid: string; data: any }>({
            query: ({ uuid, data }) => ({
                url: `products/${uuid}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Products", "ProductStats"],
        }),

        // POST /products - Create product
        createProduct: builder.mutation<{ success: boolean; message: string; data: Product }, any>({
            query: (productData) => ({
                url: "products",
                method: "POST",
                body: productData,
            }),
            invalidatesTags: ["Products", "ProductStats"],
        }),

        // ==================== VENDOR PRODUCT ENDPOINTS (Based on api.php routes) ====================

        // GET /by-vendor/{vendor_uuid}/products - Get vendor products (from local DB)
        getVendorProducts: builder.query<VendorProductListResponse, {
            vendor_uuid: string;
            store_uuid?: string;
            page?: number;
            per_page?: number;
            search?: string;
            type_id?: string;
            sync_status?: string;
            status?: boolean;
            min_price?: number;
            max_price?: number;
            sort_by?: string;
            sort_order?: "asc" | "desc";
        }>({
            query: ({ vendor_uuid, store_uuid, ...params }) => {
                const queryParams = new URLSearchParams();
                if (params.page) queryParams.append('page', params.page.toString());
                if (params.per_page) queryParams.append('per_page', params.per_page.toString());
                if (params.search) queryParams.append('search', params.search);
                if (params.type_id) queryParams.append('type_id', params.type_id);
                if (params.sync_status) queryParams.append('sync_status', params.sync_status);
                if (params.status !== undefined) queryParams.append('status', params.status.toString());
                if (params.min_price) queryParams.append('min_price', params.min_price.toString());
                if (params.max_price) queryParams.append('max_price', params.max_price.toString());
                if (params.sort_by) queryParams.append('sort_by', params.sort_by);
                if (params.sort_order) queryParams.append('sort_order', params.sort_order);
                if (store_uuid) queryParams.append('store_uuid', store_uuid);

                // Route: GET /by-vendor/{vendor_uuid}/products
                const url = `by-vendor/${vendor_uuid}/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

                return { url, method: "GET" };
            },
            providesTags: (result) =>
                result && result.data?.data
                    ? [
                        ...result.data.data.map(({ uuid }) => ({ type: "Products" as const, id: uuid })),
                        { type: "Products", id: "LIST" },
                    ]
                    : [{ type: "Products", id: "LIST" }],
        }),

        // GET /by-vendor/{vendor_uuid}/products/{product_uuid} - Get single vendor product
        getVendorProduct: builder.query<VendorProductSingleResponse, { vendor_uuid: string; product_uuid: string }>({
            query: ({ vendor_uuid, product_uuid }) => ({
                // Route: GET /by-vendor/{vendor_uuid}/products/{product_uuid}
                url: `by-vendor/${vendor_uuid}/products/${product_uuid}`,
                method: "GET",
            }),
            providesTags: (_result, _error, { product_uuid }) => [{ type: "Products", id: product_uuid }],
        }),

        // POST /by-vendor/{vendor_uuid}/products - Create vendor product (to Magento API + local DB)
        createVendorProduct: builder.mutation<CreateProductResponse, { vendor_uuid: string; data: CreateProductPayload }>({
            query: ({ vendor_uuid, data }) => ({
                // Route: POST /by-vendor/{vendor_uuid}/products
                url: `by-vendor/${vendor_uuid}/products`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: [{ type: "Products", id: "LIST" }],
        }),

        // PUT /by-vendor/{vendor_uuid}/products/{product_uuid} - Update vendor product
        updateVendorProduct: builder.mutation<VendorProductSingleResponse, { vendor_uuid: string; product_uuid: string; data: UpdateProductPayload }>({
            query: ({ vendor_uuid, product_uuid, data }) => ({
                // Route: PUT /by-vendor/{vendor_uuid}/products/{product_uuid}
                url: `by-vendor/${vendor_uuid}/products/${product_uuid}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (_result, _error, { product_uuid }) => [{ type: "Products", id: product_uuid }, { type: "Products", id: "LIST" }],
        }),

        // DELETE /by-vendor/{vendor_uuid}/products/{product_uuid} - Delete vendor product
        deleteVendorProduct: builder.mutation<{ success: boolean; message: string }, { vendor_uuid: string; product_uuid: string }>({
            query: ({ vendor_uuid, product_uuid }) => ({
                // Route: DELETE /by-vendor/{vendor_uuid}/products/{product_uuid}
                url: `by-vendor/${vendor_uuid}/products/${product_uuid}`,
                method: "DELETE",
            }),
            invalidatesTags: [{ type: "Products", id: "LIST" }],
        }),

        // POST /by-vendor/{vendor_uuid}/products/sync/{product_uuid} - Force sync vendor product
        forceSyncProduct: builder.mutation<{ success: boolean; message: string }, { vendor_uuid: string; product_uuid: string }>({
            query: ({ vendor_uuid, product_uuid }) => ({
                // Route: POST /by-vendor/{vendor_uuid}/products/sync/{product_uuid}
                url: `by-vendor/${vendor_uuid}/products/sync/${product_uuid}`,
                method: "POST",
            }),
            invalidatesTags: (_result, _error, { product_uuid }) => [{ type: "Products", id: product_uuid }],
        }),

        // GET /by-vendor/{vendor_uuid}/products/sync/all - Fetch all products from Magento
        syncAllVendorProducts: builder.mutation<{ success: boolean; message: string }, { vendor_uuid: string }>({
            query: ({ vendor_uuid }) => ({
                url: `by-vendor/${vendor_uuid}/products/sync/all`,
                method: "POST", // or "GET" depending on your backend implementation
            }),
            invalidatesTags: [{ type: "Products", id: "LIST" }],
        }),
    }),
});

// ─── Exports for all hooks ────────────────────────────────────────────────────

export const {
    // Basic product hooks
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

    // Vendor product hooks (Magento)
    useGetVendorProductsQuery,
    useGetVendorProductQuery,
    useCreateVendorProductMutation,
    useUpdateVendorProductMutation,
    useDeleteVendorProductMutation,
    useForceSyncProductMutation,
    useSyncAllVendorProductsMutation,  // New: fetch all products from Magento

} = productApi;

export default productApi;