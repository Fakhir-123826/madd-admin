import { createApi } from "@reduxjs/toolkit/query/react";
import { dynamicBaseQuery } from "../dynamicBaseQuery";

// ─── Types ────────────────────────────────────────────────────────────────────

export type OrderStatus =
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "completed"
    | "cancelled"
    | "refunded"
    | "on_hold";

export type PaymentStatus =
    | "pending"
    | "paid"
    | "refunded"
    | "chargeback"
    | "failed";

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
    region?: string;
    postcode: string;
    country_id: string;
    firstname?: string;
    lastname?: string;
    telephone?: string;
    company?: string;
    vat_id?: string;
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

export interface OrderItem {
    id: number;
    order_id: number;
    magento_item_id: number | null;
    vendor_product_id: number | null;
    magento_product_id: number | null;
    magento_sku: string | null;
    product_sku: string;
    product_name: string;
    qty_ordered: number;
    price: string;
    tax_amount: string;
    discount_amount: string;
    row_total: string;
    vendor_product?: {
        uuid: string;
        name: string;
    };
}

export interface OrderStatusHistory {
    id: number;
    status: string;
    notes: string | null;
    created_at: string;
    changed_by: number | null;
    metadata: Record<string, unknown> | null;
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
    shipping_address: OrderAddress | null;
    billing_address: OrderAddress | null;
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
    items?: OrderItem[];
    statusHistory?: OrderStatusHistory[];
}

export interface OrderListResponse {
    success: boolean;
    data: Order[];
    summary: {
        total_orders: number;
        total_revenue: string;
        average_order_value: string;
        pending_orders: number;
        processing_orders: number;
        shipped_orders: number;
        delivered_orders: number;
        cancelled_orders: number;
        period_orders: number;
        period_revenue: string;
        period_start: string;
        period_end: string;
    };
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
}

export interface OrderSingleResponse {
    success: boolean;
    data: Order;
}

export interface GetOrdersParams {
    page?: number;
    per_page?: number;
    status?: string;
    payment_status?: string;
    search?: string;
    vendor_uuid?: string;
    store_uuid?: string;
    date_from?: string;
    date_to?: string;
    amount_min?: number;
    amount_max?: number;
}

export interface SyncOrdersPayload {
    vendor_uuid: string;
    store_uuid?: string;
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

export interface CancelOrderPayload {
    comment?: string;
    notify_customer?: boolean;
}

export interface HoldOrderPayload {
    comment?: string;
    notify_customer?: boolean;
}

export interface UnholdOrderPayload {
    comment?: string;
    notify_customer?: boolean;
}

export interface AddCommentPayload {
    comment: string;
    notify_customer?: boolean;
    visible_on_front?: boolean;
}

export interface CommentResponse {
    success: boolean;
    message: string;
    data: {
        comment: string;
        created_at: string;
        is_customer_notified: boolean;
        is_visible_on_front: boolean;
    };
}

export interface GetCommentsResponse {
    success: boolean;
    data: Array<{
        id: number;
        status: string;
        comment: string;
        created_at: string;
        changed_by: number | null;
        metadata: Record<string, unknown> | null;
    }>;
}

export interface SendEmailResponse {
    success: boolean;
    message: string;
    data: {
        email_sent_at: string;
    };
}

export interface GetOrderStatusResponse {
    success: boolean;
    data: {
        success: boolean;
        status: string;
        local_status: string;
        is_synced: boolean;
    };
}

export interface GetOrderItemsResponse {
    success: boolean;
    data: Array<{
        id: number;
        sku: string;
        name: string;
        qty_ordered: number;
        price: string;
        tax_amount: string;
        discount_amount: string;
        row_total: string;
        product: {
            uuid: string;
            name: string;
        } | null;
    }>;
}

export interface UpdateAddressPayload {
    firstname: string;
    lastname: string;
    street: string;
    city: string;
    country_id: string;
    region: string;
    postcode: string;
    telephone?: string;
    company?: string;
    vat_id?: string;
}

export interface UpdateAddressResponse {
    success: boolean;
    message: string;
    data: OrderAddress;
}

export interface SyncSingleOrderPayload {
    vendor_uuid: string;
    store_uuid?: string;
    magento_order_id?: number;
}

export interface SyncSingleOrderResponse {
    success: boolean;
    message: string;
    data: {
        success: boolean;
        action: string;
        order?: Order;
    };
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
    }>;
    coupon_code?: string;
    billing_address: {
        firstname: string;
        lastname: string;
        street: string;
        city: string;
        country_id: string;
        region: string;
        postcode: string;
        telephone?: string;
    };
    shipping_address: {
        firstname: string;
        lastname: string;
        street: string;
        city: string;
        country_id: string;
        region: string;
        postcode: string;
        telephone?: string;
    };
    payment_method: string;
    shipping_method: {
        carrier_code: string;
        method_code: string;
    };
    shipping_amount?: number;
    history?: {
        comment?: string;
        append_comment: boolean;
        email_confirmation: boolean;
    };
}

export interface CreateManualOrderResponse {
    success: boolean;
    message: string;
    data: {
        success: boolean;
        cart_id: number;
        magento_order_id: string;
        magento_order_increment_id: string;
        order: Order;
        sync: {
            action: string;
            order: Order;
        };
    };
}

// ─── API Slice ────────────────────────────────────────────────────────────────

export const orderApi = createApi({
    reducerPath: "orderApi",
    baseQuery: dynamicBaseQuery,
    tagTypes: ["Orders", "OrderComments"],

    endpoints: (builder) => ({
        // ─── GET /api/admin/orders ──────────────────────────────────────────
        getOrders: builder.query<OrderListResponse, GetOrdersParams>({
            query: (params) => {
                const queryParams = new URLSearchParams();

                if (params.vendor_uuid) {
                    queryParams.append("vendor_uuid", params.vendor_uuid);
                }
                if (params.store_uuid) {
                    queryParams.append("store_uuid", params.store_uuid);
                }
                if (params.page) {
                    queryParams.append("page", params.page.toString());
                }
                if (params.per_page) {
                    queryParams.append("per_page", params.per_page.toString());
                }
                if (params.status) {
                    queryParams.append("status", params.status);
                }
                if (params.payment_status) {
                    queryParams.append("payment_status", params.payment_status);
                }
                if (params.search) {
                    queryParams.append("search", params.search);
                }
                if (params.date_from) {
                    queryParams.append("date_from", params.date_from);
                }
                if (params.date_to) {
                    queryParams.append("date_to", params.date_to);
                }
                if (params.amount_min !== undefined) {
                    queryParams.append("amount_min", params.amount_min.toString());
                }
                if (params.amount_max !== undefined) {
                    queryParams.append("amount_max", params.amount_max.toString());
                }

                return {
                    url: `admin/orders?${queryParams.toString()}`,
                    method: "GET",
                };
            },
            providesTags: ["Orders"],
        }),

        // ─── GET /api/admin/orders/{orderId} ────────────────────────────────
        getOrder: builder.query<OrderSingleResponse, { orderId: string; vendor_uuid: string; store_uuid?: string }>({
            query: ({ orderId, vendor_uuid, store_uuid }) => {
                const queryParams = new URLSearchParams();
                queryParams.append("vendor_uuid", vendor_uuid);
                if (store_uuid) queryParams.append("store_uuid", store_uuid);
                
                return {
                    url: `admin/orders/${orderId}?${queryParams.toString()}`,
                    method: "GET",
                };
            },
            providesTags: (_result, _error, { orderId }) => [{ type: "Orders", id: orderId }],
        }),

        // ─── POST /api/admin/orders/sync-orders ─────────────────────────────
        syncOrders: builder.mutation<SyncOrdersResponse, SyncOrdersPayload>({
            query: (data) => ({
                url: "admin/orders/sync-orders",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Orders"],
        }),

        // ─── POST /api/admin/orders/create-order ────────────────────────────
        createManualOrder: builder.mutation<CreateManualOrderResponse, CreateManualOrderPayload>({
            query: (data) => ({
                url: "admin/orders/create-order",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Orders"],
        }),

        // ─── POST /api/admin/orders/{orderId}/cancel ────────────────────────
        cancelOrder: builder.mutation<{ success: boolean; message: string; data: { order: Order } }, 
            { orderId: string; vendor_uuid: string; store_uuid?: string; payload: CancelOrderPayload }>({
            query: ({ orderId, vendor_uuid, store_uuid, payload }) => {
                const queryParams = new URLSearchParams();
                queryParams.append("vendor_uuid", vendor_uuid);
                if (store_uuid) queryParams.append("store_uuid", store_uuid);
                
                return {
                    url: `admin/orders/${orderId}/cancel?${queryParams.toString()}`,
                    method: "POST",
                    body: payload,
                };
            },
            invalidatesTags: (_result, _error, { orderId }) => ["Orders", { type: "Orders", id: orderId }],
        }),

        // ─── POST /api/admin/orders/{orderId}/hold ──────────────────────────
        holdOrder: builder.mutation<{ success: boolean; message: string; data: { order: Order } }, 
            { orderId: string; vendor_uuid: string; store_uuid?: string; payload: HoldOrderPayload }>({
            query: ({ orderId, vendor_uuid, store_uuid, payload }) => {
                const queryParams = new URLSearchParams();
                queryParams.append("vendor_uuid", vendor_uuid);
                if (store_uuid) queryParams.append("store_uuid", store_uuid);
                
                return {
                    url: `admin/orders/${orderId}/hold?${queryParams.toString()}`,
                    method: "POST",
                    body: payload,
                };
            },
            invalidatesTags: (_result, _error, { orderId }) => ["Orders", { type: "Orders", id: orderId }],
        }),

        // ─── POST /api/admin/orders/{orderId}/unhold ────────────────────────
        unholdOrder: builder.mutation<{ success: boolean; message: string; data: { order: Order } }, 
            { orderId: string; vendor_uuid: string; store_uuid?: string; payload: UnholdOrderPayload }>({
            query: ({ orderId, vendor_uuid, store_uuid, payload }) => {
                const queryParams = new URLSearchParams();
                queryParams.append("vendor_uuid", vendor_uuid);
                if (store_uuid) queryParams.append("store_uuid", store_uuid);
                
                return {
                    url: `admin/orders/${orderId}/unhold?${queryParams.toString()}`,
                    method: "POST",
                    body: payload,
                };
            },
            invalidatesTags: (_result, _error, { orderId }) => ["Orders", { type: "Orders", id: orderId }],
        }),

        // ─── POST /api/admin/orders/{orderId}/comments ──────────────────────
        addOrderComment: builder.mutation<CommentResponse, 
            { orderId: string; vendor_uuid: string; store_uuid?: string; payload: AddCommentPayload }>({
            query: ({ orderId, vendor_uuid, store_uuid, payload }) => {
                const queryParams = new URLSearchParams();
                queryParams.append("vendor_uuid", vendor_uuid);
                if (store_uuid) queryParams.append("store_uuid", store_uuid);
                
                return {
                    url: `admin/orders/${orderId}/comments?${queryParams.toString()}`,
                    method: "POST",
                    body: payload,
                };
            },
            invalidatesTags: (_result, _error, { orderId }) => ["Orders", "OrderComments", { type: "Orders", id: orderId }],
        }),

        // ─── GET /api/admin/orders/{orderId}/comments ───────────────────────
        getOrderComments: builder.query<GetCommentsResponse, 
            { orderId: string; vendor_uuid: string; store_uuid?: string }>({
            query: ({ orderId, vendor_uuid, store_uuid }) => {
                const queryParams = new URLSearchParams();
                queryParams.append("vendor_uuid", vendor_uuid);
                if (store_uuid) queryParams.append("store_uuid", store_uuid);
                
                return {
                    url: `admin/orders/${orderId}/comments?${queryParams.toString()}`,
                    method: "GET",
                };
            },
            providesTags: (_result, _error, { orderId }) => [{ type: "OrderComments", id: orderId }],
        }),

        // ─── POST /api/admin/orders/{orderId}/send-email ────────────────────
        sendOrderEmail: builder.mutation<SendEmailResponse, 
            { orderId: string; vendor_uuid: string; store_uuid?: string }>({
            query: ({ orderId, vendor_uuid, store_uuid }) => {
                const queryParams = new URLSearchParams();
                queryParams.append("vendor_uuid", vendor_uuid);
                if (store_uuid) queryParams.append("store_uuid", store_uuid);
                
                return {
                    url: `admin/orders/${orderId}/send-email?${queryParams.toString()}`,
                    method: "POST",
                };
            },
            invalidatesTags: (_result, _error, { orderId }) => [{ type: "Orders", id: orderId }],
        }),

        // ─── GET /api/admin/orders/{orderId}/status ─────────────────────────
        getOrderStatus: builder.query<GetOrderStatusResponse, 
            { orderId: string; vendor_uuid: string; store_uuid?: string }>({
            query: ({ orderId, vendor_uuid, store_uuid }) => {
                const queryParams = new URLSearchParams();
                queryParams.append("vendor_uuid", vendor_uuid);
                if (store_uuid) queryParams.append("store_uuid", store_uuid);
                
                return {
                    url: `admin/orders/${orderId}/status?${queryParams.toString()}`,
                    method: "GET",
                };
            },
            providesTags: (_result, _error, { orderId }) => [{ type: "Orders", id: orderId }],
        }),

        // ─── GET /api/admin/orders/{orderId}/items ──────────────────────────
        getOrderItems: builder.query<GetOrderItemsResponse, 
            { orderId: string; vendor_uuid: string; store_uuid?: string }>({
            query: ({ orderId, vendor_uuid, store_uuid }) => {
                const queryParams = new URLSearchParams();
                queryParams.append("vendor_uuid", vendor_uuid);
                if (store_uuid) queryParams.append("store_uuid", store_uuid);
                
                return {
                    url: `admin/orders/${orderId}/items?${queryParams.toString()}`,
                    method: "GET",
                };
            },
            providesTags: (_result, _error, { orderId }) => [{ type: "Orders", id: orderId }],
        }),

        // ─── PUT /api/admin/orders/{orderId}/address/billing ────────────────
        updateBillingAddress: builder.mutation<UpdateAddressResponse, 
            { orderId: string; vendor_uuid: string; store_uuid?: string; payload: UpdateAddressPayload }>({
            query: ({ orderId, vendor_uuid, store_uuid, payload }) => {
                const queryParams = new URLSearchParams();
                queryParams.append("vendor_uuid", vendor_uuid);
                if (store_uuid) queryParams.append("store_uuid", store_uuid);
                
                return {
                    url: `admin/orders/${orderId}/address/billing?${queryParams.toString()}`,
                    method: "PUT",
                    body: payload,
                };
            },
            invalidatesTags: (_result, _error, { orderId }) => ["Orders", { type: "Orders", id: orderId }],
        }),

        // ─── PUT /api/admin/orders/{orderId}/address/shipping ───────────────
        updateShippingAddress: builder.mutation<UpdateAddressResponse, 
            { orderId: string; vendor_uuid: string; store_uuid?: string; payload: UpdateAddressPayload }>({
            query: ({ orderId, vendor_uuid, store_uuid, payload }) => {
                const queryParams = new URLSearchParams();
                queryParams.append("vendor_uuid", vendor_uuid);
                if (store_uuid) queryParams.append("store_uuid", store_uuid);
                
                return {
                    url: `admin/orders/${orderId}/address/shipping?${queryParams.toString()}`,
                    method: "PUT",
                    body: payload,
                };
            },
            invalidatesTags: (_result, _error, { orderId }) => ["Orders", { type: "Orders", id: orderId }],
        }),

        // ─── POST /api/admin/orders/{orderId}/sync ──────────────────────────
        syncSingleOrder: builder.mutation<SyncSingleOrderResponse, 
            { orderId: string; vendor_uuid: string; store_uuid?: string; magento_order_id?: number }>({
            query: ({ orderId, vendor_uuid, store_uuid, magento_order_id }) => {
                const queryParams = new URLSearchParams();
                queryParams.append("vendor_uuid", vendor_uuid);
                if (store_uuid) queryParams.append("store_uuid", store_uuid);
                if (magento_order_id) queryParams.append("magento_order_id", magento_order_id.toString());
                
                return {
                    url: `admin/orders/${orderId}/sync?${queryParams.toString()}`,
                    method: "POST",
                };
            },
            invalidatesTags: (_result, _error, { orderId }) => ["Orders", { type: "Orders", id: orderId }],
        }),
    }),
});

export const {
    useGetOrdersQuery,
    useGetOrderQuery,
    useSyncOrdersMutation,
    useCreateManualOrderMutation,
    useCancelOrderMutation,
    useHoldOrderMutation,
    useUnholdOrderMutation,
    useAddOrderCommentMutation,
    useGetOrderCommentsQuery,
    useSendOrderEmailMutation,
    useGetOrderStatusQuery,
    useGetOrderItemsQuery,
    useUpdateBillingAddressMutation,
    useUpdateShippingAddressMutation,
    useSyncSingleOrderMutation,
} = orderApi;

export default orderApi;