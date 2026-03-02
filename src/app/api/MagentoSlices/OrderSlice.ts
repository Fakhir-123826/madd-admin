import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface MagentoOrder {
  entity_id: number;
  increment_id: string;
  customer_firstname: string;
  customer_lastname: string;
  customer_email: string;
  status: string;
  grand_total: number;
  created_at: string;
}

export interface MagentoOrderResponse {
  items: MagentoOrder[];
  total_count: number;
}

export interface MagentoOrder {
  entity_id: number;
  increment_id: string;
  status: string;
  state: string;
  created_at: string;
  order_currency_code: string;

  customer_firstname: string;
  customer_lastname: string;
  customer_email: string;
  customer_dob: string;

  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  grand_total: number;

  items: OrderItem[];

  billing_address: BillingAddress;

  payment: Payment;

  extension_attributes?: {
    shipping_assignments?: ShippingAssignment[];
  };
}

/* ================= SUB TYPES ================= */

export interface OrderItem {
  item_id: number;
  name: string;
  sku: string;
  price: number;
  qty_ordered: number;
  tax_amount: number;
  row_total_incl_tax: number;
}

export interface BillingAddress {
  firstname: string;
  lastname: string;
  street: string[];
  city: string;
  region: string;
  country_id: string;
  telephone: string;
}

export interface Payment {
  method: string;
  amount_paid: number;
}

export interface ShippingAssignment {
  shipping: {
    method: string;
    address: {
      firstname: string;
      lastname: string;
      street: string[];
      city: string;
      region: string;
    };
  };
}


export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:8000/api/", // change if needed
  }),
  tagTypes: ["Orders"],
  endpoints: (builder) => ({

    // ✅ GET ALL ORDERS
    getOrders: builder.query<MagentoOrderResponse, void>({
      query: () => "orders",
      providesTags: ["Orders"],
    }),

    // ✅ GET SINGLE ORDER BY ID
    getOrderById: builder.query<MagentoOrder, number>({
      query: (id) => `orders/${id}`,
      providesTags: ["Orders"],
    }),

    // ✅ UPDATE ORDER
    updateOrder: builder.mutation<
      MagentoOrder,
      { id: number; data: Partial<MagentoOrder> }
    >({
      query: ({ id, data }) => ({
        url: `orders/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Orders"],
    }),

  }),
});


export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderMutation,
} = orderApi;