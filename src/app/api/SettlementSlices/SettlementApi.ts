// SettlementApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseURL = import.meta.env.VITE_BASE_URL;

// ─── Types ────────────────────────────────────────────────────────────────────

export type SettlementStatus = "pending" | "approved" | "paid" | "disputed";
export type PaymentMethod = "bank_transfer" | "paypal" | "stripe" | "manual";

export interface SettlementVendor {
    id: number;
    uuid: string;
    company_name: string;
    company_slug: string;
    country_code: string;
    city: string;
    status: string;
    kyc_status: string;
    user?: {
        id: number;
        email: string;
        first_name: string;
        last_name: string;
    };
}

export interface Settlement {
    id: number;
    settlement_number: string;
    vendor_id: number;
    period_start: string;
    period_end: string;
    gross_sales: number;
    total_refunds: number;
    total_commissions: number;
    gateway_fees: number;
    net_payout: number;
    status: SettlementStatus;
    notes: string | null;
    approved_by: number | null;
    approved_at: string | null;
    paid_at: string | null;
    disputed_at?: string | null;
    created_at: string;
    updated_at: string;
    currency_code?: string;
    payment_method?: string;
    payment_reference?: string;
    total_shipping_fees?: number;
    total_tax_collected?: number;
    vendor?: SettlementVendor;
    approvedBy?: {
        id: number;
        full_name: string;
    };
}

export interface SettlementListParams {
    page?: number;
    per_page?: number;
    status?: SettlementStatus | "";
    search?: string;
    vendor_id?: number;
    date_from?: string;
    date_to?: string;
}

export interface SettlementListResponse {
    success: boolean;
    data: {
        current_page: number;
        data: Settlement[];
        first_page_url: string;
        from: number | null;
        last_page: number;
        last_page_url: string;
        links: any[];
        next_page_url: string | null;
        path: string;
        per_page: number;
        prev_page_url: string | null;
        to: number | null;
        total: number;
    };
    summary: {
        total_pending: number;
        total_approved: number;
        total_paid: number;
        total_disputed: number;
        pending_count: number;
        approved_count: number;
        paid_count: number;
    };
    meta: {
        current_page: number;
        last_page: number;
        total: number;
    };
}

export interface SettlementSingleResponse {
    success: boolean;
    data: {
        settlement: Settlement;
        transaction_summary?: {
            sales: number;
            refunds: number;
            commissions: number;
            adjustments: number;
            fees: number;
        };
        orders_count?: number;
        total_orders_value?: number;
    };
}

export interface GenerateSettlementPayload {
    vendor_id?: string;
    period_start: string;
    period_end: string;
}

export interface GenerateSettlementResponse {
    success: boolean;
    message: string;
    data: {
        generated: {
            vendor: string;
            settlement_id: number;
            amount: number;
        }[];
        generated_count: number;
        errors: string[];
    };
}

export interface UpdateSettlementStatusPayload {
    status: SettlementStatus;
    notes?: string;
}

export interface MarkAsPaidPayload {
    payment_reference: string;
    payment_method: PaymentMethod;
    notes?: string;
}

export interface DisputeSettlementPayload {
    reason: string;
}

export interface StatementUrlResponse {
    success: boolean;
    data: {
        download_url: string;
        filename?: string;
        settlement_id: number;
        settlement_number: string;
    };
}

// ─── API Slice ────────────────────────────────────────────────────────────────

export const settlementApi = createApi({
    reducerPath: "settlementApi",
    
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
    
    tagTypes: ["Settlements", "Settlement"],
    
    endpoints: (builder) => ({
        
        // GET /admin/settlements
        getSettlements: builder.query<SettlementListResponse, SettlementListParams>({
            query: (params = {}) => ({
                url: "admin/settlements",
                method: "GET",
                params,
            }),
            providesTags: ["Settlements"],
        }),
        
        // GET /admin/settlements/{id}
        getSettlement: builder.query<SettlementSingleResponse, number | string>({
            query: (id) => ({
                url: `admin/settlements/${id}`,
                method: "GET",
            }),
            providesTags: (_result, _error, id) => [{ type: "Settlement", id }],
        }),
        
        // GET /admin/settlements/{id}/statement-url
        getStatementUrl: builder.query<StatementUrlResponse, number | string>({
            query: (id) => ({
                url: `admin/settlements/${id}/statement-url`,
                method: "GET",
            }),
        }),
        
        // POST /admin/settlements/generate
        generateSettlement: builder.mutation<GenerateSettlementResponse, GenerateSettlementPayload>({
            query: (data) => ({
                url: "admin/settlements/generate",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Settlements"],
        }),
        
        // POST /admin/settlements/{id}/approve
        approveSettlement: builder.mutation<SettlementSingleResponse, { id: number | string }>({
            query: ({ id }) => ({
                url: `admin/settlements/${id}/approve`,
                method: "POST",
            }),
            invalidatesTags: (_result, _error, { id }) => [
                "Settlements",
                { type: "Settlement", id }
            ],
        }),
        
        // POST /admin/settlements/{id}/mark-as-paid (or /pay)
        markAsPaid: builder.mutation<SettlementSingleResponse, { 
            id: number | string; 
            data: MarkAsPaidPayload;
        }>({
            query: ({ id, data }) => ({
                url: `admin/settlements/${id}/mark-as-paid`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                "Settlements",
                { type: "Settlement", id }
            ],
        }),
        
        // PUT /admin/settlements/{id}/status
        updateSettlementStatus: builder.mutation<SettlementSingleResponse, { 
            id: number | string; 
            status: SettlementStatus;
            notes?: string;
        }>({
            query: ({ id, status, notes }) => ({
                url: `admin/settlements/${id}/status`,
                method: "PUT",
                body: { status, notes },
            }),
            invalidatesTags: (_result, _error, { id }) => [
                "Settlements",
                { type: "Settlement", id }
            ],
        }),
        
        // POST /admin/settlements/{id}/dispute
        disputeSettlement: builder.mutation<SettlementSingleResponse, { 
            id: number | string; 
            data: DisputeSettlementPayload;
        }>({
            query: ({ id, data }) => ({
                url: `admin/settlements/${id}/dispute`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                "Settlements",
                { type: "Settlement", id }
            ],
        }),
        
    }),
});

// ─── Export Hooks ─────────────────────────────────────────────────────────────
export const {
    useGetSettlementsQuery,
    useGetSettlementQuery,
    useGetStatementUrlQuery,
    useLazyGetStatementUrlQuery,      // ✅ For lazy fetching
    useGenerateSettlementMutation,
    useApproveSettlementMutation,
    useMarkAsPaidMutation,             // ✅ For marking as paid
    useUpdateSettlementStatusMutation,
    useDisputeSettlementMutation,
} = settlementApi;