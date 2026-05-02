import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../baseQueryWithAuth";

// Types (improved to match table fields)
export interface MagentoProduct {
  id?: number;
  sku: string;
  name: string;
  type_id?: string;
  attribute_set_id?: number;
  price?: number;
  qty?: number;                     // Quantity per source / Salable Quantity
  salable_qty?: number;
  status?: number;                  // 1 = Enabled, 2 = Disabled
  visibility?: number;              // 1=Not Visible, 2=Catalog, 3=Search, 4=Both
  websites?: string[];              // Websites list
  country_of_manufacture?: string;
  min_advertised_price?: number;
  created_at?: string;
  updated_at?: string;
  extension_attributes?: any;
  custom_attributes?: any[];
  magento_sku?: string;
  formatted_price?: string;
  quantity?: number;
  is_in_stock?: boolean;
  min_qty?: number;
  max_sale_qty?: number;
  manage_stock?: boolean;
}

// Filter interface (matching table columns)
export interface ProductFilters {
  idFrom?: string;
  idTo?: string;
  sku?: string;                     // partial search
  name?: string;                    // partial search
  type_id?: string;                 // exact (simple, configurable, etc.)
  attribute_set_id?: string | number;
  priceFrom?: string;
  priceTo?: string;
  qtyFrom?: string;                 // Quantity per Source
  qtyTo?: string;
  salable_qtyFrom?: string;
  salable_qtyTo?: string;
  visibility?: string | number;     // 1,2,3,4
  status?: string | number;         // 1=Enabled, 2=Disabled
  websites?: string[];              // multi-select websites
  country_of_manufacture?: string;
  min_advertised_priceFrom?: string;
  min_advertised_priceTo?: string;
  updated_atFrom?: string;
  updated_atTo?: string;
}

// Response type
interface ProductListResponse {
  items: MagentoProduct[];
  total_count: number;
  search_criteria?: any;
  data?: MagentoProduct[]; // For backward compatibility
}

// Flatten helper (for nested filters)
const flattenParams = (obj: Record<string, any>, parent = ""): [string, string][] => {
  const result: [string, string][] = [];
  Object.entries(obj).forEach(([key, val]) => {
    const prefix = parent ? `${parent}[${key}]` : key;
    if (val !== null && val !== undefined) {
      if (typeof val === "object" && !Array.isArray(val)) {
        result.push(...flattenParams(val, prefix));
      } else if (Array.isArray(val)) {
        val.forEach((v, i) => result.push([`${prefix}[${i}]`, String(v)]));
      } else {
        result.push([prefix, String(val)]);
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
    // Main endpoint with filters + storeCode + pagination
    getProducts: builder.query<
      ProductListResponse,
      {
        storeCode?: string;              // Optional store code
        filters?: ProductFilters;
        page?: number;
        pageSize?: number;
        sortField?: string;             // e.g. "updated_at"
        sortDirection?: "ASC" | "DESC";
      }
    >({
      query: ({ storeCode = "all", filters = {}, page = 1, pageSize = 20, sortField, sortDirection }) => {
        const paramsObj: Record<string, any> = {
          "searchCriteria[pageSize]": pageSize,
          "searchCriteria[currentPage]": page,
        };

        // Sorting
        if (sortField) {
          paramsObj["searchCriteria[sortOrders][0][field]"] = sortField;
          paramsObj["searchCriteria[sortOrders][0][direction]"] = sortDirection || "ASC";
        }

        // Filters to Magento searchCriteria format
        const filterGroups: any[] = [];

        // Range filters
        const rangeFields = [
          { key: "id", from: filters.idFrom, to: filters.idTo },
          { key: "price", from: filters.priceFrom, to: filters.priceTo },
          { key: "qty", from: filters.qtyFrom, to: filters.qtyTo },
          { key: "salable_qty", from: filters.salable_qtyFrom, to: filters.salable_qtyTo },
          { key: "min_advertised_price", from: filters.min_advertised_priceFrom, to: filters.min_advertised_priceTo },
          { key: "updated_at", from: filters.updated_atFrom, to: filters.updated_atTo },
        ];

        rangeFields.forEach(({ key, from, to }) => {
          if (from || to) {
            const filter: any = { field: key };
            if (from) filter["from"] = from;
            if (to) filter["to"] = to;
            filterGroups.push({ filters: [filter] });
          }
        });

        // Text / partial search (LIKE %value%)
        if (filters.sku) {
          filterGroups.push({
            filters: [{ field: "sku", value: `%${filters.sku}%`, condition_type: "like" }],
          });
        }
        if (filters.name) {
          filterGroups.push({
            filters: [{ field: "name", value: `%${filters.name}%`, condition_type: "like" }],
          });
        }

        // Exact match
        if (filters.type_id) {
          filterGroups.push({
            filters: [{ field: "type_id", value: filters.type_id, condition_type: "eq" }],
          });
        }
        if (filters.attribute_set_id) {
          filterGroups.push({
            filters: [{ field: "attribute_set_id", value: filters.attribute_set_id, condition_type: "eq" }],
          });
        }
        if (filters.visibility) {
          filterGroups.push({
            filters: [{ field: "visibility", value: filters.visibility, condition_type: "eq" }],
          });
        }
        if (filters.status) {
          filterGroups.push({
            filters: [{ field: "status", value: filters.status, condition_type: "eq" }],
          });
        }
        if (filters.country_of_manufacture) {
          filterGroups.push({
            filters: [{ field: "country_of_manufacture", value: filters.country_of_manufacture, condition_type: "eq" }],
          });
        }

        // Websites multi-select (Magento multi-select filter)
        if (filters.websites && filters.websites.length > 0) {
          filterGroups.push({
            filters: filters.websites.map((w) => ({
              field: "website_ids",
              value: w,
              condition_type: "finset",
            })),
          });
        }

        // Final searchCriteria
        if (filterGroups.length > 0) {
          paramsObj["searchCriteria[filterGroups]"] = filterGroups;
        }

        // Flatten params (for nested objects)
        const queryEntries = flattenParams(paramsObj);
        const queryString = new URLSearchParams(queryEntries).toString();

        // Final URL
        return `${storeCode === "all" ? "admin" : storeCode}/products?${queryString}`;
      },
      providesTags: ["Product"],
      transformResponse: (response: any) => {
        // Handle both response formats
        if (response.data) {
          return {
            items: response.data.items || response.data,
            total_count: response.data.total_count || response.data.length || 0,
            ...response
          };
        }
        return response;
      }
    }),

    // Single product by SKU
    getProduct: builder.query<MagentoProduct, { storeCode?: string; sku: string }>({
      query: ({ storeCode = "all", sku }) => `${storeCode === "all" ? "admin" : storeCode}/products/${sku}`,
      providesTags: (result, error, { sku }) => [{ type: "Product", id: sku }],
    }),

    // Create product
    createProduct: builder.mutation<MagentoProduct, { storeCode?: string; product: Partial<MagentoProduct> }>({
      query: ({ storeCode = "all", product }) => ({
        url: `${storeCode === "all" ? "admin" : storeCode}/products`,
        method: "POST",
        body: product,
      }),
      invalidatesTags: ["Product"],
    }),

    // Update product
    updateProduct: builder.mutation<
      MagentoProduct,
      { storeCode?: string; sku: string; product: Partial<MagentoProduct> }
    >({
      query: ({ storeCode = "all", sku, product }) => ({
        url: `${storeCode === "all" ? "admin" : storeCode}/products/${sku}`,
        method: "PUT",
        body: { product },
      }),
      invalidatesTags: (result, error, { sku }) => [{ type: "Product", id: sku }],
    }),

    // Delete product
    deleteProduct: builder.mutation<{ success: boolean; sku: string }, { storeCode?: string; sku: string }>({
      query: ({ storeCode = "all", sku }) => ({
        url: `${storeCode === "all" ? "admin" : storeCode}/products/${sku}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { sku }) => [{ type: "Product", id: sku }],
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