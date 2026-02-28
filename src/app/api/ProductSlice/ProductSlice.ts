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
    extension_attributes?: any;
    custom_attributes?: any[];
}

export const productApi = createApi({
    reducerPath: "productApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://127.0.0.1:8000/api/magento/", // replace with your Laravel API base URL
    }),
    tagTypes: ["Product"],
    endpoints: (builder) => ({
        // Get all products
        getProducts: builder.query<{ items: MagentoProduct[] }, void>({
            query: () => "products",
            providesTags: ["Product"],
        }),

        // Get a single product by SKU
        getProduct: builder.query<MagentoProduct, string>({
            query: (sku) => `products/${sku}`,
            providesTags: (result, error, sku) => [{ type: "Product", id: sku }],
        }),

        // Create a new product
        createProduct: builder.mutation<MagentoProduct, Partial<MagentoProduct>>({
            query: (product) => ({
                url: "products",
                method: "POST",
                body: product,
            }),
            invalidatesTags: ["Product"],
        }),

        // Update a product by SKU
        updateProduct: builder.mutation<
            MagentoProduct,
            { sku: string; product: Partial<MagentoProduct> }
        >({
            query: ({ sku, product }) => ({
                url: `products/${sku}`,
                method: "PUT",
                body: { product }, // <--- wrap it
            }),
            invalidatesTags: (result, error, { sku }) => [{ type: "Product", id: sku }],
        }),

        // Delete a product by SKU
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