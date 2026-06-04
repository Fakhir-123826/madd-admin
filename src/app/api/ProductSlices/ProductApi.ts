// src/app/api/ProductSlices/ProductApi.ts

import { createApi } from "@reduxjs/toolkit/query/react";
import { dynamicBaseQuery } from "../dynamicBaseQuery";

// ============ BASE INTERFACES ============
export interface MediaGalleryEntry {
    media_type?: string;
    label?: string;
    position?: number;
    disabled?: boolean;
    types?: string[];
    content?: {
        base64_encoded_data: string;
        type: string;
        name: string;
    };
}

export interface CustomOption {
    title: string;
    type: 'field' | 'area' | 'drop_down' | 'radio' | 'checkbox' | 'date' | 'date_time' | 'time' | 'file';
    is_require?: boolean;
    is_required?: boolean;
    sort_order?: number;
    price?: number;
    price_type?: 'fixed' | 'percent';
    sku?: string;
    values?: CustomOptionValue[];
}

export interface CustomOptionValue {
    title: string;
    price?: number;
    price_type?: string;
    sku?: string;
    sort_order?: number;
}

export interface TierPrice {
    customer_group: string;
    quantity: number;
    price: number;
    website_id?: number;
    price_type?: 'fixed' | 'discount';
}

export interface ProductLink {
    link_type: 'related' | 'upsell' | 'crosssell';
    linked_sku: string;
    linked_type?: string;
    position?: number;
}

// ============ CONFIGURABLE PRODUCT INTERFACES ============
export interface ConfigurableAttribute {
    attribute_id: number;
    label: string;
    position?: number;
    values: ConfigurableAttributeValue[];
}

export interface ConfigurableAttributeValue {
    value_index: number;
    label?: string;
}

export interface ConfigurableOption {
    attribute_id: number;
    label: string;
    position?: number;
    is_use_default?: boolean;
    values: ConfigurableOptionValue[];
}

export interface ConfigurableOptionValue {
    value_index: number;
}

export interface ConfigurableVariant {
    sku: string;
    name?: string;
    price: number;
    quantity: number;
    weight?: number;
    status?: number;
    configurable_attributes: {
        [attribute_code: string]: number;
    };
}

// ============ GROUPED PRODUCT INTERFACES ============
export interface GroupedProductLink {
    linked_sku: string;
    position?: number;
    qty?: number;
}

// ============ BUNDLE PRODUCT INTERFACES ============
export interface BundleOption {
    title: string;
    required: boolean;
    type: 'select' | 'radio' | 'checkbox' | 'multi';
    position?: number;
    sku?: string;
    product_links: BundleProductLink[];
}

export interface BundleProductLink {
    sku: string;
    qty?: number;
    price?: number;
    price_type?: 'fixed' | 'percent';
    can_change_quantity?: boolean;
    position?: number;
    is_default?: boolean;
}

// ============ DOWNLOADABLE PRODUCT INTERFACES ============
export interface DownloadableLink {
    title: string;
    sort_order?: number;
    is_shareable?: number;
    price?: number;
    number_of_downloads?: number;
    link_type: 'url' | 'file';
    link_url?: string;
    link_file?: string;
    sample_type?: 'url' | 'file';
    sample_url?: string;
    sample_file?: string;
}

export interface DownloadableSample {
    title: string;
    sort_order?: number;
    sample_type: 'url' | 'file';
    sample_url?: string;
    sample_file?: string;
}

// ============ GIFT CARD INTERFACES ============
export interface GiftCardAmount {
    website_id: number;
    value: number;
}

// ============ MAIN CREATE PRODUCT PAYLOAD ============
export interface CreateProductPayload {
    vendor_id: string;
    vendor_store_id: string;
    sku: string;
    name: string;
    type_id: 'simple' | 'configurable' | 'grouped' | 'virtual' | 'bundle' | 'downloadable' | 'giftcard';
    attribute_set_id: number;
    price: number;
    status: number;
    visibility: number;
    weight?: number;
    tax_class_id: number;
    quantity: number;

    description?: string;
    short_description?: string;
    url_key?: string;
    meta_title?: string;
    meta_keyword?: string;
    meta_description?: string;

    special_price?: number;
    special_from_date?: string;
    special_to_date?: string;
    cost?: number;
    msrp?: number;
    msrp_display_actual_price_type?: number;

    manage_stock?: boolean;
    backorders?: number;
    notify_stock_qty?: number;
    min_sale_qty?: number;
    max_sale_qty?: number;
    qty_increments?: number;
    enable_qty_increments?: boolean;

    custom_design?: string;
    page_layout?: string;
    custom_layout_update?: string;
    gift_message_available?: boolean;
    news_from_date?: string;
    news_to_date?: string;
    country_of_manufacture?: string;
    category_ids?: number[];
    media_gallery?: MediaGalleryEntry[];
    product_links?: ProductLink[];
    custom_options?: CustomOption[];
    tier_prices?: TierPrice[];
    inventory?: {
        source_code: string;
        quantity: number;
        status: number;
    };
    website_ids?: number[];
    dynamic_attributes?: Record<string, any>;

    configurable_attributes?: ConfigurableAttribute[];
    configurable_options?: ConfigurableOption[];
    configurable_variants?: ConfigurableVariant[];

    grouped_links?: GroupedProductLink[];

    bundle_options?: BundleOption[];
    bundle_shipping_type?: 'together' | 'separately';
    bundle_price_type?: 'dynamic' | 'fixed';
    bundle_sku_type?: 'dynamic' | 'fixed';

    downloadable_links?: DownloadableLink[];
    downloadable_samples?: DownloadableSample[];
    links_purchased_separately?: boolean;
    links_title?: string;
    samples_title?: string;

    giftcard_amounts?: GiftCardAmount[];
    giftcard_type?: 'virtual' | 'physical' | 'combined';
    giftcard_amount_type?: 'fixed' | 'dynamic';
    giftcard_open_amount_min?: number;
    giftcard_open_amount_max?: number;
    allow_message?: boolean;
    gift_message_max_length?: number;
}

// Response Types
export interface ProductListResponse {
    success: boolean;
    data: {
        current_page: number;
        data: Product[];
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

export interface Product {
    id: number;
    uuid: string;
    name: string;
    sku: string;
    price: number;
    status: number;
    created_at: string;
    updated_at: string;
    product_data?: CreateProductPayload;
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
    full_product_data: any;
    sync_status: 'pending' | 'synced' | 'failed' | 'updating';
    last_synced_at: string | null;
    sync_errors: any;
    metadata: any;
    created_at: string;
    updated_at: string;
    product_data?: CreateProductPayload;
}

export interface VendorProductSingleResponse {
    success: boolean;
    data: VendorProduct;
    message: string;
}

export interface PendingProductsResponse {
    success: boolean;
    data: {
        current_page: number;
        data: Array<{
            id: number;
            name: string;
            sku: string;
            status: string;
            created_at: string;
            vendor: {
                id: number;
                company_name: string;
            };
        }>;
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

export interface StatisticsResponse {
    success: boolean;
    data: {
        total_products: number;
        active_products: number;
        pending_approval: number;
        total_value: number;
        by_type: Record<string, number>;
        by_status: Record<string, number>;
    };
    message: string;
}

export interface ProductSingleResponse {
    success: boolean;
    data: Product;
    message: string;
}

export interface CreateProductResponse {
    success: boolean;
    data: VendorProduct;
    magento_response?: any;
    message: string;
}

export interface UpdateProductPayload {
    name?: string;
    price?: number;
    status?: number;
    quantity?: number;
    description?: string;
    short_description?: string;
    [key: string]: any;
}

// ============ ATTRIBUTE TYPES ============
export interface MagentoAttribute {
    attribute_id: number;
    attribute_code: string;
    default_frontend_label: string;
    frontend_labels: Array<{ store_id: number; label: string }>;
    is_required: boolean;
    is_user_defined: boolean;
    is_visible: boolean;
    is_visible_on_front: boolean;
    options?: MagentoAttributeOption[];
    has_options?: boolean;
}

export interface MagentoAttributeOption {
    value_index: number;
    value: string;
    swatch_data?: {
        value: string;
    };
}

// ─── API Slice ────────────────────────────────────────────────────────────────

export const productApi = createApi({
    reducerPath: "productApi",
    baseQuery: dynamicBaseQuery,
    tagTypes: ["Products", "PendingProducts", "ProductStats", "VendorProducts"],

    endpoints: (builder) => ({

        // ============ ATTRIBUTE ENDPOINTS ============

        /**
         * GET /by-vendor/{vendor_uuid}/products/configurable-attributes/all
         * Get all configurable attributes from Magento
         */
        getAllConfigurableAttributes: builder.query<MagentoAttribute[], { vendor_uuid: string }>({
            query: ({ vendor_uuid }) => ({
                url: `by-vendor/${vendor_uuid}/products/configurable-attributes/all`,
                params: {
                    'searchCriteria[currentPage]': 1,
                    'searchCriteria[pageSize]': 100,
                },
                method: "GET",
            }),
        }),

        /**
         * GET /by-vendor/{vendor_uuid}/products/configurable-attributes/{attributeId}/options
         * Get options for a specific attribute
         */
        getAttributeOptions: builder.query<MagentoAttributeOption[], { vendor_uuid: string; attributeId: number }>({
            query: ({ vendor_uuid, attributeId }) => ({
                url: `by-vendor/${vendor_uuid}/products/configurable-attributes/${attributeId}/options`,
                method: "GET",
            }),
        }),

        /**
         * GET /by-vendor/{vendor_uuid}/products/attributes
         * Get all product attributes
         */
        getAllAttributes: builder.query<MagentoAttribute[], { vendor_uuid: string }>({
            query: ({ vendor_uuid }) => ({
                url: `by-vendor/${vendor_uuid}/products/attributes`,
                method: "GET",
            }),
        }),

        /**
         * GET /by-vendor/{vendor_uuid}/products/attributes/{attributeId}
         * Get specific attribute details
         */
        getAttribute: builder.query<MagentoAttribute, { vendor_uuid: string; attributeId: number }>({
            query: ({ vendor_uuid, attributeId }) => ({
                url: `by-vendor/${vendor_uuid}/products/attributes/${attributeId}`,
                method: "GET",
            }),
        }),

        // ==================== BASIC PRODUCT ENDPOINTS ====================

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

        getProductStatistics: builder.query<StatisticsResponse, void>({
            query: () => ({
                url: "products/statistics",
                method: "GET",
            }),
            providesTags: ["ProductStats"],
        }),

        getProduct: builder.query<ProductSingleResponse, string>({
            query: (uuid) => ({
                url: `products/${uuid}`,
                method: "GET",
            }),
            providesTags: (_result, _error, uuid) => [{ type: "Products", id: uuid }],
        }),

        approveProduct: builder.mutation<{ success: boolean; message: string; data: unknown }, { id: number; notes?: string }>({
            query: ({ id, notes }) => ({
                url: `products/drafts/${id}/approve`,
                method: "POST",
                body: { notes },
            }),
            invalidatesTags: ["Products", "PendingProducts", "ProductStats"],
        }),

        rejectProduct: builder.mutation<{ success: boolean; message: string; data: unknown }, { id: number; reason: string }>({
            query: ({ id, reason }) => ({
                url: `products/drafts/${id}/reject`,
                method: "POST",
                body: { reason },
            }),
            invalidatesTags: ["Products", "PendingProducts", "ProductStats"],
        }),

        requestModification: builder.mutation<{ success: boolean; message: string }, { id: number; changes: Record<string, unknown>; reason: string }>({
            query: ({ id, changes, reason }) => ({
                url: `products/drafts/${id}/request-modification`,
                method: "POST",
                body: { changes, reason },
            }),
            invalidatesTags: ["PendingProducts"],
        }),

        deleteProduct: builder.mutation<{ success: boolean; message: string }, string>({
            query: (uuid) => ({
                url: `products/${uuid}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Products", "ProductStats"],
        }),

        featureProduct: builder.mutation<{ success: boolean; message: string }, string>({
            query: (uuid) => ({
                url: `products/${uuid}/feature`,
                method: "POST",
            }),
            invalidatesTags: ["Products"],
        }),

        unfeatureProduct: builder.mutation<{ success: boolean; message: string }, string>({
            query: (uuid) => ({
                url: `products/${uuid}/unfeature`,
                method: "POST",
            }),
            invalidatesTags: ["Products"],
        }),

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

        // ==================== VENDOR PRODUCT ENDPOINTS ====================

        getVendorProducts: builder.query<VendorProductListResponse, {
            vendor_uuid: string;
            store_uuid?: string;
            page?: number;
            per_page?: number;
            search?: string;
            type_id?: string;
            sync_status?: string;
            status?: boolean | string;
            min_price?: number;
            max_price?: number;
            sort_by?: string;
            sort_order?: "asc" | "desc";
             limited?: boolean;
            
        }>({
            query: (args) => {
                const { vendor_uuid, ...params } = args;

                if (!vendor_uuid) {
                    throw new Error('vendor_uuid is required');
                }

                const queryParams = new URLSearchParams();

                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== '') {
                        queryParams.append(key, value.toString());
                    }
                });

                const url = `by-vendor/${vendor_uuid}/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

                return { url, method: "GET" };
            },
            providesTags: (result, error, { vendor_uuid }) =>
                result?.data?.data
                    ? [
                        ...result.data.data.map(({ uuid }) => ({ type: "VendorProducts" as const, id: uuid })),
                        { type: "VendorProducts", id: `LIST-${vendor_uuid}` },
                    ]
                    : [{ type: "VendorProducts", id: `LIST-${vendor_uuid}` }],
        }),

        getVendorProduct: builder.query<VendorProductSingleResponse, { vendor_uuid: string; product_uuid: string }>({
            query: ({ vendor_uuid, product_uuid }) => ({
                url: `by-vendor/${vendor_uuid}/products/${product_uuid}`,
                method: "GET",
            }),
            providesTags: (_result, _error, { vendor_uuid, product_uuid }) =>
                [{ type: "VendorProducts", id: product_uuid }],
        }),

        createVendorProduct: builder.mutation<CreateProductResponse, { vendor_uuid: string; data: CreateProductPayload }>({
            query: ({ vendor_uuid, data }) => ({
                url: `by-vendor/${vendor_uuid}/products`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: (result, error, { vendor_uuid }) => [
                { type: "VendorProducts", id: `LIST-${vendor_uuid}` }
            ],
        }),

        updateVendorProduct: builder.mutation<VendorProductSingleResponse, {
            vendor_uuid: string;
            product_uuid: string;
            data: UpdateProductPayload
        }>({
            query: ({ vendor_uuid, product_uuid, data }) => ({
                url: `by-vendor/${vendor_uuid}/products/${product_uuid}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { vendor_uuid, product_uuid }) => [
                { type: "VendorProducts", id: product_uuid },
                { type: "VendorProducts", id: `LIST-${vendor_uuid}` }
            ],
        }),

        deleteVendorProduct: builder.mutation<{ success: boolean; message: string }, {
            vendor_uuid: string;
            product_uuid: string
        }>({
            query: ({ vendor_uuid, product_uuid }) => ({
                url: `by-vendor/${vendor_uuid}/products/${product_uuid}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, { vendor_uuid }) => [
                { type: "VendorProducts", id: `LIST-${vendor_uuid}` }
            ],
        }),

        syncAllVendorProducts: builder.mutation<{ success: boolean; message: string }, {
            vendor_uuid: string;
            store_uuid?: string
        }>({
            query: ({ vendor_uuid, store_uuid }) => {
                const url = store_uuid
                    ? `by-vendor/${vendor_uuid}/products/sync/all?store_uuid=${store_uuid}`
                    : `by-vendor/${vendor_uuid}/products/sync/all`;
                console.log('🔄 Syncing all products from Magento:', url);
                return {
                    url,
                    method: "GET",
                };
            },
            invalidatesTags: (result, error, { vendor_uuid }) => [
                { type: "VendorProducts", id: `LIST-${vendor_uuid}` }
            ],
        }),

        forceSyncProduct: builder.mutation<{ success: boolean; message: string }, {
            vendor_uuid: string;
            product_uuid: string
        }>({
            query: ({ vendor_uuid, product_uuid }) => ({
                url: `by-vendor/${vendor_uuid}/products/sync/${product_uuid}`,
                method: "POST",
            }),
            invalidatesTags: (result, error, { vendor_uuid, product_uuid }) => [
                { type: "VendorProducts", id: product_uuid },
                { type: "VendorProducts", id: `LIST-${vendor_uuid}` }
            ],
        }),
    }),
});

// ─── Exports for all hooks ────────────────────────────────────────────────────

export const {
    // Attribute hooks
    useGetAllConfigurableAttributesQuery,
    useGetAttributeOptionsQuery,
    useGetAllAttributesQuery,
    useGetAttributeQuery,

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
    useSyncAllVendorProductsMutation,

} = productApi;

export default productApi;