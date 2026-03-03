import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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
  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:8000/api/",
  }),
  tagTypes: ["Orders"],
  endpoints: (builder) => ({

    // ✅ GET ORDERS WITH FILTERS
    getOrders: builder.query<
      MagentoOrderResponse,
      { filters?: OrderFilters; page?: number; pageSize?: number } | void
    >({
      query: (params) => {
        const { filters = {}, page = 1, pageSize = 10 } = params || {};

        const paramsObj: Record<string, any> = { page, pageSize };
        const filterObj: Record<string, any> = {};

        // Range filters
        if (filters.purchaseDateFrom || filters.purchaseDateTo) {
          filterObj.purchase_date = {};
          if (filters.purchaseDateFrom) filterObj.purchase_date.from = filters.purchaseDateFrom;
          if (filters.purchaseDateTo) filterObj.purchase_date.to = filters.purchaseDateTo;
        }
        if (filters.grandTotalBaseFrom || filters.grandTotalBaseTo) {
          filterObj.base_grand_total = {};
          if (filters.grandTotalBaseFrom) filterObj.base_grand_total.from = filters.grandTotalBaseFrom;
          if (filters.grandTotalBaseTo) filterObj.base_grand_total.to = filters.grandTotalBaseTo;
        }
        if (filters.grandTotalPurchasedFrom || filters.grandTotalPurchasedTo) {
          filterObj.grand_total = {};
          if (filters.grandTotalPurchasedFrom) filterObj.grand_total.from = filters.grandTotalPurchasedFrom;
          if (filters.grandTotalPurchasedTo) filterObj.grand_total.to = filters.grandTotalPurchasedTo;
        }

        // Exact filters
       if (filters.id) filterObj.increment_id = filters.id;
        if (filters.status) filterObj.status = filters.status;
        if (filters.billToName) filterObj.billing_name = filters.billToName;
        if (filters.shipToName) filterObj.shipping_name = filters.shipToName;
        if (filters.purchasePoint && filters.purchasePoint !== "All Store Views") {
          filterObj.store_view = filters.purchasePoint;
        }
        if (filters.braintreeTransactionSource) filterObj.braintree_transaction_source = filters.braintreeTransactionSource;
        if (filters.disputeState) filterObj.dispute_state = filters.disputeState;

        if (Object.keys(filterObj).length > 0) {
          paramsObj.filters = filterObj;
        }

        const queryString = new URLSearchParams(flattenParams(paramsObj)).toString();
        return `orders?${queryString}`;
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