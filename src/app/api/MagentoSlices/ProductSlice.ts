import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../baseQueryWithAuth";

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
    baseQuery: baseQueryWithAuth,
    tagTypes: ["Product"],
    endpoints: (builder) => ({
        // ✅ Yeh wala endpoint use karo (GET with query string)
        getProducts: builder.query<ProductListResponse, { filters?: ProductFilters; page?: number; pageSize?: number; website_id?: number }>({
            query: ({ filters = {}, page = 1, pageSize = 10, website_id }) => {
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
                // if (website_id !== undefined) {
                //     filterObj.website_id = { eq: website_id };
                // }
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
                body: { product },
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




// import { createApi } from "@reduxjs/toolkit/query/react";
// import { baseQueryWithAuth } from "../baseQueryWithAuth";

// // Types (thoda improve kiya – tere table fields ke hisaab se)
// export interface MagentoProduct {
//   id?: number;
//   sku: string;
//   name: string;
//   type_id?: string;
//   attribute_set_id?: number;
//   price?: number;
//   qty?: number;                     // Quantity per source / Salable Quantity
//   salable_qty?: number;
//   status?: number;                  // 1 = Enabled, 2 = Disabled
//   visibility?: number;              // 1=Not Visible, 2=Catalog, 3=Search, 4=Both
//   websites?: string[];              // Websites list
//   country_of_manufacture?: string;
//   min_advertised_price?: number;
//   created_at?: string;
//   updated_at?: string;
//   extension_attributes?: any;
//   custom_attributes?: any[];
// }

// // Filter interface (tere table ke columns ke hisaab se)
// export interface ProductFilters {
//   idFrom?: string;
//   idTo?: string;
//   sku?: string;                     // partial search
//   name?: string;                    // partial search
//   type_id?: string;                 // exact (simple, configurable, etc.)
//   attribute_set_id?: string | number;
//   priceFrom?: string;
//   priceTo?: string;
//   qtyFrom?: string;                 // Quantity per Source
//   qtyTo?: string;
//   salable_qtyFrom?: string;
//   salable_qtyTo?: string;
//   visibility?: string | number;     // 1,2,3,4
//   status?: string | number;         // 1=Enabled, 2=Disabled
//   websites?: string[];              // multi-select websites
//   country_of_manufacture?: string;
//   min_advertised_priceFrom?: string;
//   min_advertised_priceTo?: string;
//   updated_atFrom?: string;
//   updated_atTo?: string;
// }

// // Response type
// interface ProductListResponse {
//   items: MagentoProduct[];
//   total_count: number;
//   search_criteria?: any;
// }

// // Flatten helper (nested filters ke liye)
// const flattenParams = (obj: Record<string, any>, parent = ""): [string, string][] => {
//   const result: [string, string][] = [];
//   Object.entries(obj).forEach(([key, val]) => {
//     const prefix = parent ? `${parent}[${key}]` : key;
//     if (val !== null && val !== undefined) {
//       if (typeof val === "object" && !Array.isArray(val)) {
//         result.push(...flattenParams(val, prefix));
//       } else if (Array.isArray(val)) {
//         val.forEach((v, i) => result.push([`${prefix}[${i}]`, String(v)]));
//       } else {
//         result.push([prefix, String(val)]);
//       }
//     }
//   });
//   return result;
// };

// export const productApi = createApi({
//   reducerPath: "productApi",
//   baseQuery: baseQueryWithAuth,
//   tagTypes: ["Product"],
//   endpoints: (builder) => ({
//     // Yeh main endpoint hai – sab filters + storeCode + pagination
//     getProducts: builder.query<
//       ProductListResponse,
//       {
//         storeCode: string;              // Required – jaise "en", "default"
//         filters?: ProductFilters;
//         page?: number;
//         pageSize?: number;
//         sortField?: string;             // e.g. "updated_at"
//         sortDirection?: "ASC" | "DESC";
//       }
//     >({
//       query: ({ storeCode, filters = {}, page = 1, pageSize = 20, sortField, sortDirection }) => {
//         const paramsObj: Record<string, any> = {
//           "searchCriteria[pageSize]": pageSize,
//           "searchCriteria[currentPage]": page,
//         };

//         // Sorting
//         if (sortField) {
//           paramsObj["searchCriteria[sortOrders][0][field]"] = sortField;
//           paramsObj["searchCriteria[sortOrders][0][direction]"] = sortDirection || "ASC";
//         }

//         // Filters ko Magento searchCriteria format mein convert karo
//         const filterGroups: any[] = [];

//         // Range filters
//         const rangeFields = [
//           { key: "id", from: filters.idFrom, to: filters.idTo },
//           { key: "price", from: filters.priceFrom, to: filters.priceTo },
//           { key: "qty", from: filters.qtyFrom, to: filters.qtyTo },
//           { key: "salable_qty", from: filters.salable_qtyFrom, to: filters.salable_qtyTo },
//           { key: "min_advertised_price", from: filters.min_advertised_priceFrom, to: filters.min_advertised_priceTo },
//           { key: "updated_at", from: filters.updated_atFrom, to: filters.updated_atTo },
//         ];

//         rangeFields.forEach(({ key, from, to }) => {
//           if (from || to) {
//             const filter: any = { field: key };
//             if (from) filter["from"] = from;
//             if (to) filter["to"] = to;
//             filterGroups.push({ filters: [filter] });
//           }
//         });

//         // Text / partial search (LIKE %value%)
//         if (filters.sku) {
//           filterGroups.push({
//             filters: [{ field: "sku", value: `%${filters.sku}%`, condition_type: "like" }],
//           });
//         }
//         if (filters.name) {
//           filterGroups.push({
//             filters: [{ field: "name", value: `%${filters.name}%`, condition_type: "like" }],
//           });
//         }

//         // Exact match
//         if (filters.type_id) {
//           filterGroups.push({
//             filters: [{ field: "type_id", value: filters.type_id, condition_type: "eq" }],
//           });
//         }
//         if (filters.attribute_set_id) {
//           filterGroups.push({
//             filters: [{ field: "attribute_set_id", value: filters.attribute_set_id, condition_type: "eq" }],
//           });
//         }
//         if (filters.visibility) {
//           filterGroups.push({
//             filters: [{ field: "visibility", value: filters.visibility, condition_type: "eq" }],
//           });
//         }
//         if (filters.status) {
//           filterGroups.push({
//             filters: [{ field: "status", value: filters.status, condition_type: "eq" }],
//           });
//         }
//         if (filters.country_of_manufacture) {
//           filterGroups.push({
//             filters: [{ field: "country_of_manufacture", value: filters.country_of_manufacture, condition_type: "eq" }],
//           });
//         }

//         // Websites multi-select (Magento mein website_id array support karta hai)
//         if (filters.websites && filters.websites.length > 0) {
//           filterGroups.push({
//             filters: filters.websites.map((w) => ({
//               field: "website_ids",
//               value: w,
//               condition_type: "finset", // Magento multi-select filter
//             })),
//           });
//         }

//         // Final searchCriteria
//         if (filterGroups.length > 0) {
//           paramsObj["searchCriteria[filterGroups]"] = filterGroups;
//         }

//         // Flatten params (nested objects ke liye)
//         const queryEntries = flattenParams(paramsObj);
//         const queryString = new URLSearchParams(queryEntries).toString();

//         // Final URL
//         return `/${storeCode}/products?${queryString}`;
//       },
//       providesTags: ["Product"],
//     }),

//     // Single product by SKU (storeCode ke saath)
//     getProduct: builder.query<MagentoProduct, { storeCode: string; sku: string }>({
//       query: ({ storeCode, sku }) => `/${storeCode}/products/${sku}`,
//       providesTags: (result, error, { sku }) => [{ type: "Product", id: sku }],
//     }),

//     // Create product (storeCode ke saath)
//     createProduct: builder.mutation<MagentoProduct, { storeCode: string; product: Partial<MagentoProduct> }>({
//       query: ({ storeCode, product }) => ({
//         url: `/${storeCode}/products`,
//         method: "POST",
//         body: product,
//       }),
//       invalidatesTags: ["Product"],
//     }),

//     // Update product
//     updateProduct: builder.mutation<
//       MagentoProduct,
//       { storeCode: string; sku: string; product: Partial<MagentoProduct> }
//     >({
//       query: ({ storeCode, sku, product }) => ({
//         url: `/${storeCode}/products/${sku}`,
//         method: "PUT",
//         body: { product },
//       }),
//       invalidatesTags: (result, error, { sku }) => [{ type: "Product", id: sku }],
//     }),

//     // Delete product
//     deleteProduct: builder.mutation<{ success: boolean; sku: string }, { storeCode: string; sku: string }>({
//       query: ({ storeCode, sku }) => ({
//         url: `/${storeCode}/products/${sku}`,
//         method: "DELETE",
//       }),
//       invalidatesTags: (result, error, { sku }) => [{ type: "Product", id: sku }],
//     }),
//   }),
// });

// export const {
//   useGetProductsQuery,
//   useGetProductQuery,
//   useCreateProductMutation,
//   useUpdateProductMutation,
//   useDeleteProductMutation,
// } = productApi;