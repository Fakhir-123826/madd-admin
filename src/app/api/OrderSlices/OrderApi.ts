// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// const baseURL = import.meta.env.VITE_BASE_URL;

// // ─── Types ────────────────────────────────────────────────────────────────────

// export type OrderStatus =
//     | "pending"
//     | "processing"
//     | "shipped"
//     | "delivered"
//     | "completed"
//     | "cancelled"
//     | "refunded";

// export type PaymentStatus =
//     | "pending"
//     | "paid"
//     | "refunded"
//     | "chargeback";

// export type FulfillmentStatus =
//     | "pending"
//     | "processing"
//     | "shipped"
//     | "delivered"
//     | "returned";

// export type SyncStatus =
//     | "pending"
//     | "synced"
//     | "failed";

// export type OrderSource =
//     | "web"
//     | "mobile"
//     | "marketplace"
//     | "erp"
//     | "pos";

// export interface OrderAddress {
//     street: string;
//     city: string;
//     state: string;
//     postcode: string;
//     country: string;
// }

// export interface OrderVendor {
//     id: number;
//     uuid: string;
//     company_name: string;
//     company_slug: string;
//     country_code: string;
//     city: string;
//     status: string;
//     kyc_status: string;
// }

// export interface OrderCustomer {
//     id: number;
//     uuid: string;
//     email: string;
//     first_name: string;
//     last_name: string;
//     avatar_url: string;
//     status: string;
//     phone: string;
// }

// export interface Order {
//     id: number;
//     uuid: string;
//     magento_order_id: number;
//     magento_order_increment_id: string;
//     parent_order_id: number | null;
//     vendor_id: number;
//     vendor_store_id: number;
//     customer_id: number | null;
//     claimed_by_user_id: number | null;
//     customer_email: string;
//     customer_firstname: string | null;
//     customer_lastname: string | null;
//     customer_ip: string | null;
//     guest_token: string | null;
//     claimed_at: string | null;
//     status: OrderStatus;
//     payment_status: PaymentStatus;
//     fulfillment_status: FulfillmentStatus;
//     currency_code: string;
//     currency_rate: string;
//     subtotal: string;
//     tax_amount: string;
//     tax_rate: string;
//     shipping_amount: string;
//     discount_amount: string;
//     grand_total: string;
//     country_code: string | null;
//     commission_amount: string | null;
//     commission_rate: string | null;
//     vendor_payout_amount: string | null;
//     payment_method: string;
//     payment_fee: string;
//     shipping_method: string | null;
//     carrier_id: number | null;
//     tracking_number: string | null;
//     coupon_code: string | null;
//     coupon_id: number | null;
//     source: OrderSource;
//     shipping_address: OrderAddress;
//     billing_address: OrderAddress;
//     customer_note: string | null;
//     admin_note: string | null;
//     shipped_at: string | null;
//     delivered_at: string | null;
//     settled_at: string | null;
//     settlement_id: number | null;
//     synced_at: string;
//     sync_status: SyncStatus;
//     metadata: unknown | null;
//     created_at: string;
//     updated_at: string;
//     deleted_at: string | null;
//     vendor?: OrderVendor;
//     customer?: OrderCustomer | null;
// }

// export interface OrderListResponse {
//     success: boolean;
//     data: Order[];
//     summary: {
//         total_orders: number;
//         total_revenue: string;
//         total_commission: string;
//         average_order_value: string;
//         pending_orders: number;
//         processing_orders: number;
//         shipped_orders: number;
//         delivered_orders: number;
//         cancelled_orders: number;
//     };
//     meta: {
//         current_page: number;
//         last_page: number;
//         total: number;
//     };
// }

// export interface OrderSingleResponse {
//     success: boolean;
//     data: Order;
// }

// export interface OrderStatisticsResponse {
//     success: boolean;
//     data: {
//         total: number;
//         by_status: Record<string, number>;
//         by_payment_status: Record<string, number>;
//         total_revenue: string;
//         total_commission: string;
//         [key: string]: unknown;
//     };
// }

// export interface UpdateStatusPayload {
//     status: OrderStatus;
//     notes?: string;
// }

// export interface ProcessRefundPayload {
//     amount: number;
//     reason: string;
//     notes?: string;
// }

// export interface CancelOrderPayload {
//     reason: string;
//     notes?: string;
// }

// export interface GetOrdersParams {
//     page?: number;
//     per_page?: number;
//     status?: string;
//     payment_status?: string;
//     fulfillment_status?: string;
//     source?: string;
//     vendor_id?: string;
//     store_id?: string;
//     search?: string;
//     date_from?: string;
//     date_to?: string;
//     amount_min?: number;
//     amount_max?: number;
// }

// // ─── API Slice ────────────────────────────────────────────────────────────────

// export const orderApi = createApi({
//     reducerPath: "orderApi",

//     baseQuery: fetchBaseQuery({
//         baseUrl: baseURL,
//         prepareHeaders: (headers) => {
//             const token = localStorage.getItem("token");

//             if (token) {
//                 headers.set("authorization", `Bearer ${token}`);
//             }

//             return headers;
//         },
//     }),

//     tagTypes: ["Orders"],

//     endpoints: (builder) => ({
//         // ─── GET /admin/orders ────────────────────────────────────────────────
//         getOrders: builder.query<
//             OrderListResponse,
//             GetOrdersParams | void
//         >({
//             query: (params) => {
//                 const queryParams = new URLSearchParams();

//                 if (params) {
//                     if (params.page) {
//                         queryParams.append(
//                             "page",
//                             params.page.toString()
//                         );
//                     }

//                     if (params.per_page) {
//                         queryParams.append(
//                             "per_page",
//                             params.per_page.toString()
//                         );
//                     }

//                     if (params.status) {
//                         queryParams.append(
//                             "status",
//                             params.status
//                         );
//                     }

//                     if (params.payment_status) {
//                         queryParams.append(
//                             "payment_status",
//                             params.payment_status
//                         );
//                     }

//                     if (params.fulfillment_status) {
//                         queryParams.append(
//                             "fulfillment_status",
//                             params.fulfillment_status
//                         );
//                     }

//                     if (params.source) {
//                         queryParams.append(
//                             "source",
//                             params.source
//                         );
//                     }

//                     if (params.vendor_id) {
//                         queryParams.append(
//                             "vendor_id",
//                             params.vendor_id
//                         );
//                     }

//                     if (params.store_id) {
//                         queryParams.append(
//                             "store_id",
//                             params.store_id
//                         );
//                     }

//                     if (params.search) {
//                         queryParams.append(
//                             "search",
//                             params.search
//                         );
//                     }

//                     if (params.date_from) {
//                         queryParams.append(
//                             "date_from",
//                             params.date_from
//                         );
//                     }

//                     if (params.date_to) {
//                         queryParams.append(
//                             "date_to",
//                             params.date_to
//                         );
//                     }

//                     if (params.amount_min !== undefined) {
//                         queryParams.append(
//                             "amount_min",
//                             params.amount_min.toString()
//                         );
//                     }

//                     if (params.amount_max !== undefined) {
//                         queryParams.append(
//                             "amount_max",
//                             params.amount_max.toString()
//                         );
//                     }
//                 }

//                 const url = `admin/orders${
//                     queryParams.toString()
//                         ? `?${queryParams.toString()}`
//                         : ""
//                 }`;

//                 return {
//                     url,
//                     method: "GET",
//                 };
//             },

//             providesTags: ["Orders"],
//         }),

//         // ─── GET /admin/orders/statistics ───────────────────────────────────
//         getOrderStatistics: builder.query<
//             OrderStatisticsResponse,
//             void
//         >({
//             query: () => ({
//                 url: "admin/orders/statistics",
//                 method: "GET",
//             }),

//             providesTags: ["Orders"],
//         }),

//         // ─── GET /admin/orders/{id} ─────────────────────────────────────────
//         getOrder: builder.query<
//             OrderSingleResponse,
//             number | string
//         >({
//             query: (id) => ({
//                 url: `admin/orders/${id}`,
//                 method: "GET",
//             }),

//             providesTags: (_result, _error, id) => [
//                 { type: "Orders", id },
//             ],
//         }),

//         // ─── PUT /admin/orders/{id}/status ─────────────────────────────────
//         updateOrderStatus: builder.mutation<
//             OrderSingleResponse,
//             {
//                 id: number | string;
//                 data: UpdateStatusPayload;
//             }
//         >({
//             query: ({ id, data }) => ({
//                 url: `admin/orders/${id}/status`,
//                 method: "PUT",
//                 body: data,
//             }),

//             invalidatesTags: (_result, _error, { id }) => [
//                 "Orders",
//                 { type: "Orders", id },
//             ],
//         }),

//         // ─── POST /admin/orders/{id}/refund ────────────────────────────────
//         processRefund: builder.mutation<
//             OrderSingleResponse,
//             {
//                 id: number | string;
//                 data: ProcessRefundPayload;
//             }
//         >({
//             query: ({ id, data }) => ({
//                 url: `admin/orders/${id}/refund`,
//                 method: "POST",
//                 body: data,
//             }),

//             invalidatesTags: (_result, _error, { id }) => [
//                 "Orders",
//                 { type: "Orders", id },
//             ],
//         }),

//         // ─── POST /admin/orders/{id}/cancel ────────────────────────────────
//         cancelOrder: builder.mutation<
//             OrderSingleResponse,
//             {
//                 id: number | string;
//                 data: CancelOrderPayload;
//             }
//         >({
//             query: ({ id, data }) => ({
//                 url: `admin/orders/${id}/cancel`,
//                 method: "POST",
//                 body: data,
//             }),

//             invalidatesTags: (_result, _error, { id }) => [
//                 "Orders",
//                 { type: "Orders", id },
//             ],
//         }),

//         // ─── GET /admin/orders/by-store/{storeId} ──────────────────────────
//         getStoreOrders: builder.query<
//             OrderListResponse,
//             {
//                 storeId: string;
//                 page?: number;
//                 per_page?: number;
//                 status?: string;
//             }
//         >({
//             query: ({ storeId, page, per_page, status }) => {
//                 const queryParams = new URLSearchParams();

//                 if (page) {
//                     queryParams.append(
//                         "page",
//                         page.toString()
//                     );
//                 }

//                 if (per_page) {
//                     queryParams.append(
//                         "per_page",
//                         per_page.toString()
//                     );
//                 }

//                 if (status) {
//                     queryParams.append(
//                         "status",
//                         status
//                     );
//                 }

//                 const url = `admin/orders/by-store/${storeId}${
//                     queryParams.toString()
//                         ? `?${queryParams.toString()}`
//                         : ""
//                 }`;

//                 return {
//                     url,
//                     method: "GET",
//                 };
//             },

//             providesTags: ["Orders"],
//         }),

//         // ─── GET /admin/orders/by-vendor/{vendorId} ────────────────────────
//         getVendorOrders: builder.query<
//             OrderListResponse,
//             {
//                 vendorId: string;
//                 page?: number;
//                 per_page?: number;
//                 status?: string;
//             }
//         >({
//             query: ({ vendorId, page, per_page, status }) => {
//                 const queryParams = new URLSearchParams();

//                 if (page) {
//                     queryParams.append(
//                         "page",
//                         page.toString()
//                     );
//                 }

//                 if (per_page) {
//                     queryParams.append(
//                         "per_page",
//                         per_page.toString()
//                     );
//                 }

//                 if (status) {
//                     queryParams.append(
//                         "status",
//                         status
//                     );
//                 }

//                 const url = `admin/orders/by-vendor/${vendorId}${
//                     queryParams.toString()
//                         ? `?${queryParams.toString()}`
//                         : ""
//                 }`;

//                 return {
//                     url,
//                     method: "GET",
//                 };
//             },

//             providesTags: ["Orders"],
//         }),
//     }),
// });

// export const {
//     useGetOrdersQuery,
//     useGetOrderStatisticsQuery,
//     useGetOrderQuery,
//     useUpdateOrderStatusMutation,
//     useProcessRefundMutation,
//     useCancelOrderMutation,
//     useGetStoreOrdersQuery,
//     useGetVendorOrdersQuery,
// } = orderApi;


import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseURL = import.meta.env.VITE_BASE_URL;

// ─── Types ────────────────────────────────────────────────────────────────────

export type OrderStatus =
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "completed"
    | "cancelled"
    | "refunded";

export type PaymentStatus =
    | "pending"
    | "paid"
    | "refunded"
    | "chargeback";

export type FulfillmentStatus =
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "returned";

export type SyncStatus =
    | "pending"
    | "synced"
    | "failed";

export type OrderSource =
    | "web"
    | "mobile"
    | "marketplace"
    | "erp"
    | "pos";

export interface OrderAddress {
    street: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
}

export interface OrderVendor {
    id: number;
    uuid: string;
    company_name: string;
    company_slug: string;
    country_code: string;
    city: string;
    status: string;
    kyc_status: string;
}

export interface OrderCustomer {
    id: number;
    uuid: string;
    email: string;
    first_name: string;
    last_name: string;
    avatar_url: string;
    status: string;
    phone: string;
}

export interface Order {
    id: number;
    uuid: string;
    magento_order_id: number;
    magento_order_increment_id: string;
    parent_order_id: number | null;
    vendor_id: number;
    vendor_store_id: number;
    customer_id: number | null;
    claimed_by_user_id: number | null;
    customer_email: string;
    customer_firstname: string | null;
    customer_lastname: string | null;
    customer_ip: string | null;
    guest_token: string | null;
    claimed_at: string | null;
    status: OrderStatus;
    payment_status: PaymentStatus;
    fulfillment_status: FulfillmentStatus;
    currency_code: string;
    currency_rate: string;
    subtotal: string;
    tax_amount: string;
    tax_rate: string;
    shipping_amount: string;
    discount_amount: string;
    grand_total: string;
    country_code: string | null;
    commission_amount: string | null;
    commission_rate: string | null;
    vendor_payout_amount: string | null;
    payment_method: string;
    payment_fee: string;
    shipping_method: string | null;
    carrier_id: number | null;
    tracking_number: string | null;
    coupon_code: string | null;
    coupon_id: number | null;
    source: OrderSource;
    shipping_address: OrderAddress;
    billing_address: OrderAddress;
    customer_note: string | null;
    admin_note: string | null;
    shipped_at: string | null;
    delivered_at: string | null;
    settled_at: string | null;
    settlement_id: number | null;
    synced_at: string;
    sync_status: SyncStatus;
    metadata: unknown | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    vendor?: OrderVendor;
    customer?: OrderCustomer | null;
}

export interface OrderListResponse {
    success: boolean;
    data: Order[];
    summary: {
        total_orders: number;
        total_revenue: string;
        total_commission: string;
        average_order_value: string;
        pending_orders: number;
        processing_orders: number;
        shipped_orders: number;
        delivered_orders: number;
        cancelled_orders: number;
    };
    meta: {
        current_page: number;
        last_page: number;
        total: number;
    };
}

export interface OrderSingleResponse {
    success: boolean;
    data: Order;
}

export interface OrderStatisticsResponse {
    success: boolean;
    data: {
        total: number;
        by_status: Record<string, number>;
        by_payment_status: Record<string, number>;
        total_revenue: string;
        total_commission: string;
        [key: string]: unknown;
    };
}

export interface UpdateStatusPayload {
    status: OrderStatus;
    notes?: string;
    vendor_uuid?: string;
    store_uuid?: string;
}

export interface ProcessRefundPayload {
    amount: number;
    reason: string;
    notes?: string;
    vendor_uuid?: string;
    store_uuid?: string;
}

export interface CancelOrderPayload {
    reason: string;
    notes?: string;
    vendor_uuid?: string;
    store_uuid?: string;
}

export interface GetOrdersParams {
    page?: number;
    per_page?: number;
    status?: string;
    payment_status?: string;
    fulfillment_status?: string;
    source?: string;
    vendor_uuid?: string;  // Changed from vendor_id
    store_uuid?: string;   // Changed from store_id
    search?: string;
    date_from?: string;
    date_to?: string;
    amount_min?: number;
    amount_max?: number;
}

export interface SyncOrdersPayload {
    vendor_uuid: string;
    store_uuid: string;
    page_size?: number;
    max_pages?: number;
    status?: string;
    from_date?: string;
    to_date?: string;
}

export interface SyncOrdersResponse {
    success: boolean;
    message: string;
    data: {
        success: boolean;
        synced_count: number;
        updated_count: number;
        skipped_count: number;
        errors: Array<{
            order_id: string | number;
            increment_id: string;
            error: string;
        }>;
        vendor_id: string;
        synced_at: string;
    };
}

export interface OrderOperationPayload {
    vendor_uuid: string;
    store_uuid: string;
    [key: string]: unknown;
}

export interface OrderOperationResponse {
    success: boolean;
    message: string;
    data?: unknown;
}

export interface CreateManualOrderPayload {
    vendor_uuid: string;
    store_uuid: string;
    customer: {
        id: number;
        email: string;
        group: "General" | "Retailer" | "Wholesale";
    };
    items: Array<{
        product_uuid: string;
        sku: string;
        qty: number;
        price?: number;
    }>;
    coupon_code?: string;
    billing_address: Record<string, unknown>;
    shipping_address: Record<string, unknown>;
    payment_method: string;
    shipping_method: {
        carrier_code: string;
        method_code: string;
        label: string;
    };
    shipping_amount?: number;
    history?: {
        comment?: string;
        append_comment: boolean;
        email_confirmation: boolean;
    };
    totals?: Record<string, number>;
}

// ─── API Slice ────────────────────────────────────────────────────────────────

export const orderApi = createApi({
    reducerPath: "orderApi",

    baseQuery: fetchBaseQuery({
        baseUrl: baseURL,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");

            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }

            return headers;
        },
    }),

    tagTypes: ["Orders"],

    endpoints: (builder) => ({
        // ─── GET /admin/orders ────────────────────────────────────────────────
        getOrders: builder.query<
            OrderListResponse,
            GetOrdersParams | void
        >({
            query: (params) => {
                const queryParams = new URLSearchParams();

                if (params) {
                    if (params.page) {
                        queryParams.append(
                            "page",
                            params.page.toString()
                        );
                    }

                    if (params.per_page) {
                        queryParams.append(
                            "per_page",
                            params.per_page.toString()
                        );
                    }

                    if (params.status) {
                        queryParams.append(
                            "status",
                            params.status
                        );
                    }

                    if (params.payment_status) {
                        queryParams.append(
                            "payment_status",
                            params.payment_status
                        );
                    }

                    if (params.fulfillment_status) {
                        queryParams.append(
                            "fulfillment_status",
                            params.fulfillment_status
                        );
                    }

                    if (params.source) {
                        queryParams.append(
                            "source",
                            params.source
                        );
                    }

                    // FIXED: Use vendor_uuid instead of vendor_id
                    if (params.vendor_uuid) {
                        queryParams.append(
                            "vendor_uuid",
                            params.vendor_uuid
                        );
                    }

                    // FIXED: Use store_uuid instead of store_id
                    if (params.store_uuid) {
                        queryParams.append(
                            "store_uuid",
                            params.store_uuid
                        );
                    }

                    if (params.search) {
                        queryParams.append(
                            "search",
                            params.search
                        );
                    }

                    if (params.date_from) {
                        queryParams.append(
                            "date_from",
                            params.date_from
                        );
                    }

                    if (params.date_to) {
                        queryParams.append(
                            "date_to",
                            params.date_to
                        );
                    }

                    if (params.amount_min !== undefined) {
                        queryParams.append(
                            "amount_min",
                            params.amount_min.toString()
                        );
                    }

                    if (params.amount_max !== undefined) {
                        queryParams.append(
                            "amount_max",
                            params.amount_max.toString()
                        );
                    }
                }

                const url = `admin/orders${
                    queryParams.toString()
                        ? `?${queryParams.toString()}`
                        : ""
                }`;

                console.log("📦 Order API URL:", url); // Debug log

                return {
                    url,
                    method: "GET",
                };
            },

            providesTags: ["Orders"],
        }),

        // ─── GET /admin/orders/statistics ───────────────────────────────────
        getOrderStatistics: builder.query<
            OrderStatisticsResponse,
            { vendor_uuid?: string; store_uuid?: string; period?: string }
        >({
            query: (params) => {
                const queryParams = new URLSearchParams();

                if (params?.period) {
                    queryParams.append("period", params.period);
                }

                if (params?.vendor_uuid) {
                    queryParams.append("vendor_uuid", params.vendor_uuid);
                }

                if (params?.store_uuid) {
                    queryParams.append("store_uuid", params.store_uuid);
                }

                const url = `admin/orders/statistics${
                    queryParams.toString()
                        ? `?${queryParams.toString()}`
                        : ""
                }`;

                console.log("📊 Statistics API URL:", url); // Debug log

                return {
                    url,
                    method: "GET",
                };
            },

            providesTags: ["Orders"],
        }),

        // ─── GET /admin/orders/{id} ─────────────────────────────────────────
        getOrder: builder.query<
            OrderSingleResponse,
            number | string
        >({
            query: (id) => ({
                url: `admin/orders/${id}`,
                method: "GET",
            }),

            providesTags: (_result, _error, id) => [
                { type: "Orders", id },
            ],
        }),

        // ─── PUT /admin/orders/{id}/status ─────────────────────────────────
        updateOrderStatus: builder.mutation<
            OrderSingleResponse,
            {
                id: number | string;
                data: UpdateStatusPayload;
            }
        >({
            query: ({ id, data }) => ({
                url: `admin/orders/${id}/status`,
                method: "PUT",
                body: data,
            }),

            invalidatesTags: (_result, _error, { id }) => [
                "Orders",
                { type: "Orders", id },
            ],
        }),

        // ─── POST /admin/orders/{id}/refund ────────────────────────────────
        processRefund: builder.mutation<
            OrderSingleResponse,
            {
                id: number | string;
                data: ProcessRefundPayload;
            }
        >({
            query: ({ id, data }) => ({
                url: `admin/orders/${id}/refund`,
                method: "POST",
                body: data,
            }),

            invalidatesTags: (_result, _error, { id }) => [
                "Orders",
                { type: "Orders", id },
            ],
        }),

        // ─── POST /admin/orders/{id}/cancel ────────────────────────────────
        cancelOrder: builder.mutation<
            OrderSingleResponse,
            {
                id: number | string;
                data: CancelOrderPayload;
            }
        >({
            query: ({ id, data }) => ({
                url: `admin/orders/${id}/cancel`,
                method: "POST",
                body: data,
            }),

            invalidatesTags: (_result, _error, { id }) => [
                "Orders",
                { type: "Orders", id },
            ],
        }),

        // ─── GET /admin/orders/by-store/{storeId} ──────────────────────────
        getStoreOrders: builder.query<
            OrderListResponse,
            {
                storeId: string;
                page?: number;
                per_page?: number;
                status?: string;
            }
        >({
            query: ({ storeId, page, per_page, status }) => {
                const queryParams = new URLSearchParams();

                if (page) {
                    queryParams.append(
                        "page",
                        page.toString()
                    );
                }

                if (per_page) {
                    queryParams.append(
                        "per_page",
                        per_page.toString()
                    );
                }

                if (status) {
                    queryParams.append(
                        "status",
                        status
                    );
                }

                const url = `admin/orders/by-store/${storeId}${
                    queryParams.toString()
                        ? `?${queryParams.toString()}`
                        : ""
                }`;

                return {
                    url,
                    method: "GET",
                };
            },

            providesTags: ["Orders"],
        }),

        // ─── GET /admin/orders/by-vendor/{vendorId} ────────────────────────
        getVendorOrders: builder.query<
            OrderListResponse,
            {
                vendorId: string;
                page?: number;
                per_page?: number;
                status?: string;
            }
        >({
            query: ({ vendorId, page, per_page, status }) => {
                const queryParams = new URLSearchParams();

                if (page) {
                    queryParams.append(
                        "page",
                        page.toString()
                    );
                }

                if (per_page) {
                    queryParams.append(
                        "per_page",
                        per_page.toString()
                    );
                }

                if (status) {
                    queryParams.append(
                        "status",
                        status
                    );
                }

                const url = `admin/orders/by-vendor/${vendorId}${
                    queryParams.toString()
                        ? `?${queryParams.toString()}`
                        : ""
                }`;

                return {
                    url,
                    method: "GET",
                };
            },

            providesTags: ["Orders"],
        }),

        // ─── POST /admin/orders/sync ────────────────────────────────────────
        syncOrders: builder.mutation<SyncOrdersResponse, SyncOrdersPayload>({
            query: (data) => ({
                url: "admin/orders/sync",
                method: "POST",
                body: data,
            }),

            invalidatesTags: ["Orders"],
        }),

        createManualOrder: builder.mutation<OrderOperationResponse, CreateManualOrderPayload>({
            query: (data) => ({
                url: "admin/orders",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Orders"],
        }),

        createOrderInvoice: builder.mutation<OrderOperationResponse, { id: number | string; data: OrderOperationPayload }>({
            query: ({ id, data }) => ({
                url: `admin/orders/${id}/invoice`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Orders"],
        }),

        createOrderShipment: builder.mutation<OrderOperationResponse, { id: number | string; data: OrderOperationPayload }>({
            query: ({ id, data }) => ({
                url: `admin/orders/${id}/shipment`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Orders"],
        }),

        addOrderTracking: builder.mutation<OrderOperationResponse, { id: number | string; data: OrderOperationPayload }>({
            query: ({ id, data }) => ({
                url: `admin/orders/${id}/tracking`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Orders"],
        }),

        addOrderComment: builder.mutation<OrderOperationResponse, { id: number | string; data: OrderOperationPayload }>({
            query: ({ id, data }) => ({
                url: `admin/orders/${id}/comments`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Orders"],
        }),

        holdOrder: builder.mutation<OrderOperationResponse, { id: number | string; data: OrderOperationPayload }>({
            query: ({ id, data }) => ({
                url: `admin/orders/${id}/hold`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Orders"],
        }),

        unholdOrder: builder.mutation<OrderOperationResponse, { id: number | string; data: OrderOperationPayload }>({
            query: ({ id, data }) => ({
                url: `admin/orders/${id}/unhold`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Orders"],
        }),

        reorderOrder: builder.mutation<OrderOperationResponse, { id: number | string; data: OrderOperationPayload }>({
            query: ({ id, data }) => ({
                url: `admin/orders/${id}/reorder`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Orders"],
        }),

        deleteLocalOrder: builder.mutation<OrderOperationResponse, { id: number | string; data: OrderOperationPayload }>({
            query: ({ id, data }) => ({
                url: `admin/orders/${id}/local`,
                method: "DELETE",
                body: data,
            }),
            invalidatesTags: ["Orders"],
        }),
    }),
});

export const {
    useGetOrdersQuery,
    useGetOrderStatisticsQuery,
    useGetOrderQuery,
    useUpdateOrderStatusMutation,
    useProcessRefundMutation,
    useCancelOrderMutation,
    useGetStoreOrdersQuery,
    useGetVendorOrdersQuery,
    useSyncOrdersMutation,
    useCreateManualOrderMutation,
    useCreateOrderInvoiceMutation,
    useCreateOrderShipmentMutation,
    useAddOrderTrackingMutation,
    useAddOrderCommentMutation,
    useHoldOrderMutation,
    useUnholdOrderMutation,
    useReorderOrderMutation,
    useDeleteLocalOrderMutation,
} = orderApi;
