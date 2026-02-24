import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

/* =========================
   ORDER TYPES
========================= */

export interface MagentoOrder {
  entity_id: number
  increment_id: string
  customer_firstname: string
  customer_lastname: string
  customer_email: string
  created_at: string
  grand_total: number
  status: string
}

export interface MagentoOrderResponse {
  items: MagentoOrder[]
  total_count: number
}

/* =========================
   PRODUCT TYPES
========================= */

export interface MagentoProduct {
  id: number
  sku: string
  name: string
  price: number
  status: number
  type_id: string
  created_at: string
}

export interface MagentoProductResponse {
  items: MagentoProduct[]
  total_count: number
}

/* =========================
   API
========================= */

export const magentoApi = createApi({
  reducerPath: 'magentoApi',

  baseQuery: fetchBaseQuery({
    baseUrl: 'http://127.0.0.1:8000/api/magento/',
  }),

  tagTypes: ['MagentoOrders', 'MagentoProducts'],

  endpoints: (builder) => ({
    // ✅ ORDERS
    getOrdersFromApi: builder.query<MagentoOrderResponse, void>({
      query: () => 'getOrdersFormApi',
      providesTags: ['MagentoOrders'],
    }),

    // ✅ PRODUCTS
    getProductsFromApi: builder.query<MagentoProductResponse, { page: number, pageSize: number }>({
      query: ({ page, pageSize }) => `getProductsFromApi?page=${page}&pageSize=${pageSize}`,
      providesTags: ['MagentoProducts'],
    }),
  }),
})

export const {
  useGetOrdersFromApiQuery,
  useGetProductsFromApiQuery,
} = magentoApi