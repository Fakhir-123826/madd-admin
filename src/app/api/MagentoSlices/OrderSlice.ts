import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../baseQueryWithAuth";

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

export interface MagentoOrderResponse {
  items: MagentoOrder[];
  total_count: number;
}

export interface OrderFilters {
  purchaseDateFrom?: string;
  purchaseDateTo?: string;
  grandTotalBaseFrom?: string;
  grandTotalBaseTo?: string;
  grandTotalPurchasedFrom?: string;
  grandTotalPurchasedTo?: string;
  purchasePoint?: string;
  id?: string;
  billToName?: string;
  shipToName?: string;
  status?: string;
  braintreeTransactionSource?: string;
  disputeState?: string;
}

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

// ✅ ProductSlice wala same flattenParams
const flattenParams = (obj: Record<string, any>, parentPrefix = ""): [string, string][] => {
  const result: [string, string][] = [];
  Object.entries(obj).forEach(([key, value]) => {
    const prefix = parentPrefix ? `${parentPrefix}[${key}]` : key;
    if (value !== null && value !== undefined) {
      if (typeof value === "object" && !Array.isArray(value)) {
        result.push(...flattenParams(value, prefix));
      } else {
        result.push([prefix, String(value)]);
      }
    }
  });
  return result;
};

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Orders"],
  endpoints: (builder) => ({

    // ✅ GET ORDERS WITH FILTERS
    getOrders: builder.query<
      MagentoOrderResponse,
      { filters?: OrderFilters; page?: number; pageSize?: number } | void
    >({
      query: (params) => {
        const { filters = {}, page = 1, pageSize = 10 } = params || {};

        // ✅ Simple aur clean query string banao
        const queryParams = new URLSearchParams();

        queryParams.set("page", String(page));
        queryParams.set("pageSize", String(pageSize));

        // ✅ Exact filters
        if (filters.id) queryParams.set("filters[increment_id]", filters.id);
        if (filters.status) queryParams.set("filters[status]", filters.status);
        if (filters.billToName) queryParams.set("filters[billing_name]", filters.billToName);
        if (filters.shipToName) queryParams.set("filters[shipping_name]", filters.shipToName);

        // ✅ Range filters
        if (filters.purchaseDateFrom) queryParams.set("filters[purchase_date][from]", filters.purchaseDateFrom);
        if (filters.purchaseDateTo) queryParams.set("filters[purchase_date][to]", filters.purchaseDateTo);

        if (filters.grandTotalBaseFrom) queryParams.set("filters[base_grand_total][from]", filters.grandTotalBaseFrom);
        if (filters.grandTotalBaseTo) queryParams.set("filters[base_grand_total][to]", filters.grandTotalBaseTo);

        if (filters.grandTotalPurchasedFrom) queryParams.set("filters[grand_total][from]", filters.grandTotalPurchasedFrom);
        if (filters.grandTotalPurchasedTo) queryParams.set("filters[grand_total][to]", filters.grandTotalPurchasedTo);

        if (filters.purchasePoint && filters.purchasePoint !== "All Store Views") {
          queryParams.set("filters[store_view]", filters.purchasePoint);
        }

        console.log("🔍 API URL:", `orders?${queryParams.toString()}`); // ✅ debug ke liye

        return `orders?${queryParams.toString()}`;
      },
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