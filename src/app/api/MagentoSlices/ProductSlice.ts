import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface MagentoProduct {
    id?: number;
    sku: string;
    name: string;
    type_id?: string;
    attribute_set_id?: number;
    price?: number;
    status?: number;
    visibility?: number;
    created_at?: string;
    updated_at?: string;
    extension_attributes?: any;
    custom_attributes?: any[];
    product_links?: any[];
    options?: any[];
    media_gallery_entries?: any[];
    tier_prices?: any[];
}

interface ProductListResponse {
    items: MagentoProduct[];
    total_count: number;
}

export interface ProductFilters {
    idFrom?: string;
    idTo?: string;
    priceFrom?: string;
    priceTo?: string;
    lastUpdatedFrom?: string;
    lastUpdatedTo?: string;
    quantityFrom?: string;
    quantityTo?: string;
    name?: string;
    sku?: string;
    type?: string;
    attributeSet?: string;
    visibility?: string;
    status?: string;
    countryOfManufacture?: string;
    storeView?: string;
    minAdvertisedPrice?: string;
}

// ✅ Safe & Clean Helper (recursive flatten for nested filters[])
const flattenParams = (obj: Record<string, any>, parentPrefix = ""): [string, string][] => {
    const result: [string, string][] = [];

    Object.entries(obj).forEach(([key, value]) => {
        const prefix = parentPrefix ? `${parentPrefix}[${key}]` : key;

        if (value !== null && value !== undefined) {
            if (typeof value === "object" && !Array.isArray(value)) {
                // Nested object (jaise filters[price][from])
                result.push(...flattenParams(value, prefix));
            } else {
                // Simple value (jaise filters[sku])
                result.push([prefix, String(value)]);
            }
        }
    });

    return result;
};

export const productApi = createApi({
    reducerPath: "productApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://127.0.0.1:8000/api/",
    }),
    tagTypes: ["Product"],
    endpoints: (builder) => ({
        // ✅ Yeh wala endpoint use karo (GET with query string)
        getProducts: builder.query<ProductListResponse, { filters?: ProductFilters; page?: number; pageSize?: number }>({
            query: ({ filters = {}, page = 1, pageSize = 10 }) => {
                const paramsObj: Record<string, any> = {
                    page,
                    pageSize,
                };

                const filterObj: Record<string, any> = {};

                // === Range Filters ===
                if (filters.idFrom || filters.idTo) {
                    filterObj.id = {};
                    if (filters.idFrom) filterObj.id.from = filters.idFrom;
                    if (filters.idTo) filterObj.id.to = filters.idTo;
                }
                if (filters.priceFrom || filters.priceTo) {
                    filterObj.price = {};
                    if (filters.priceFrom) filterObj.price.from = filters.priceFrom;
                    if (filters.priceTo) filterObj.price.to = filters.priceTo;
                }
                if (filters.lastUpdatedFrom || filters.lastUpdatedTo) {
                    filterObj.updated_at = {};
                    if (filters.lastUpdatedFrom) filterObj.updated_at.from = filters.lastUpdatedFrom;
                    if (filters.lastUpdatedTo) filterObj.updated_at.to = filters.lastUpdatedTo;
                }
                if (filters.quantityFrom || filters.quantityTo) {
                    filterObj.quantity = {};
                    if (filters.quantityFrom) filterObj.quantity.from = filters.quantityFrom;
                    if (filters.quantityTo) filterObj.quantity.to = filters.quantityTo;
                }

                // === Text / Partial Search ===
                if (filters.sku) filterObj.sku = `%${filters.sku}%`;
                if (filters.name) filterObj.name = `%${filters.name}%`;

                // === Exact Fields ===
                if (filters.type) filterObj.type_id = filters.type;
                if (filters.attributeSet) filterObj.attribute_set_id = filters.attributeSet;
                if (filters.visibility) filterObj.visibility = filters.visibility;
                if (filters.status) filterObj.status = filters.status;
                if (filters.countryOfManufacture) filterObj.country_of_manufacture = filters.countryOfManufacture;
                if (filters.storeView && filters.storeView !== "All Store Views") filterObj.store_view = filters.storeView;
                if (filters.minAdvertisedPrice) filterObj.min_advertised_price = filters.minAdvertisedPrice;

                if (Object.keys(filterObj).length > 0) {
                    paramsObj.filters = filterObj;
                }

                // Safe flattening
                const queryEntries = flattenParams(paramsObj);
                const queryString = new URLSearchParams(queryEntries).toString();

                return `products?${queryString}`;
            },
            providesTags: ["Product"],
        }),

        // Get single product by SKU
        getProduct: builder.query<MagentoProduct, string>({
            query: (sku) => `products/${sku}`,
            providesTags: (result, error, sku) => [{ type: "Product", id: sku }],
        }),

        // Create
        createProduct: builder.mutation<MagentoProduct, Partial<MagentoProduct>>({
            query: (product) => ({
                url: "products",
                method: "POST",
                body: product,
            }),
            invalidatesTags: ["Product"],
        }),

        // Update
        updateProduct: builder.mutation<
            MagentoProduct,
            { sku: string; product: Partial<MagentoProduct> }
        >({
            query: ({ sku, product }) => ({
                url: `products/${sku}`,
                method: "PUT",
                body: {product},
            }),
            invalidatesTags: (result, error, { sku }) => [{ type: "Product", id: sku }],
        }),

        // Update

        // Delete
        deleteProduct: builder.mutation<{ success: boolean; sku: string }, string>({
            query: (sku) => ({
                url: `products/${sku}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, sku) => [{ type: "Product", id: sku }],
        }),
    }),
});

export const {
    useGetProductsQuery,
    useGetProductQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
} = productApi;