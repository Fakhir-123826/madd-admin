import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../baseQueryWithAuth";

// ============ INTERFACES ============
export interface StockItem {
    item_id: number;
    product_id: number;
    stock_id: number;
    qty: number;
    is_in_stock: boolean;
    is_qty_decimal: boolean;
    show_default_notification_message: boolean;
    use_config_min_qty: boolean;
    min_qty: number;
    use_config_min_sale_qty: number;
    min_sale_qty: number;
    use_config_max_sale_qty: boolean;
    max_sale_qty: number;
    use_config_backorders: boolean;
    backorders: number;
    use_config_notify_stock_qty: boolean;
    notify_stock_qty: number;
    use_config_qty_increments: boolean;
    qty_increments: number;
    use_config_enable_qty_inc: boolean;
    enable_qty_increments: boolean;
    use_config_manage_stock: boolean;
    manage_stock: boolean;
    low_stock_date: string | null;
    is_decimal_divided: boolean;
    stock_status_changed_auto: number;
}

// ✅ Wrapper response
export interface StockResponse {
    success: boolean;
    status: number;
    message: string;
    data: StockItem;
}

export interface UpdateStockPayload {
    qty: number;
    is_in_stock: boolean;
}

// ============ API SLICE ============
export const inventoryApi = createApi({
    reducerPath: "inventoryApi",
    baseQuery: baseQueryWithAuth,
    tagTypes: ["Inventory"],
    endpoints: (builder) => ({

        // ✅ GET /inventory/{sku}
        getStock: builder.query<StockResponse, string>({
            query: (sku) => `inventory/${sku}`,
            providesTags: (result, error, sku) => [{ type: "Inventory", id: sku }],
        }),

        // ✅ PUT /inventory/{sku}/{itemId}
        updateStock: builder.mutation<StockResponse, { sku: string; itemId: number; payload: UpdateStockPayload }>({
            query: ({ sku, itemId, payload }) => ({
                url: `inventory/${sku}/${itemId}`,
                method: "PUT",
                body: payload,
            }),
            invalidatesTags: (result, error, { sku }) => [{ type: "Inventory", id: sku }],
        }),

    }),
});

export const {
    useGetStockQuery,
    useUpdateStockMutation,
} = inventoryApi;