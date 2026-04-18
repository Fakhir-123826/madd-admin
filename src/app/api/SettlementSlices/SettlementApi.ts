import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseURL = import.meta.env.VITE_BASE_URL;

// ─── Types ────────────────────────────────────────────────────────────────────

export type SettlementStatus = "pending" | "approved" | "paid" | "disputed";

export type PaymentMethod = "bank_transfer" | "paypal" | "stripe" | "manual";

export interface SettlementVendor {
    id: number;
    company_name: string;
    company_slug: string;
    user?: { id: number; name: string; email: string };
}

export interface Settlement {
    id: number;
    settlement_number: string;
    vendor_id: number;
    vendor?: SettlementVendor;
    // Controller uses net_payout (NOT net_amount)
    gross_sales: number;
    total_refunds: number;
    total_commissions: number;
    total_shipping_fees: number;
    total_tax_collected: number;
    gateway_fees: number;
    adjustment_amount: number;
    net_payout: number;               // ← correct field from controller
    currency_code: string;
    status: SettlementStatus;
    payment_method?: PaymentMethod | null;
    payment_reference?: string | null;
    statement_pdf_path?: string | null;
    notes?: string | null;
    period_start: string;
    period_end: string;
    approved_at?: string | null;
    paid_at?: string | null;
    disputed_at?: string | null;
    approved_by?: number | null;
    approvedBy?: { id: number; full_name: string } | null;
    created_at: string;
    updated_at: string;
}

export interface TransactionSummary {
    sales: number;
    refunds: number;
    commissions: number;
    adjustments: number;
    fees: number;
}

export interface SettlementDetailResponse {
    success: boolean;
    data: {
        settlement: Settlement;
        transaction_summary: TransactionSummary;
        orders_count: number;
        total_orders_value: number;
    };
}

export interface SettlementSummary {
    total_pending: number;
    total_approved: number;
    total_paid: number;
    total_disputed: number;
    pending_count: number;
    approved_count: number;
    paid_count: number;
}

export interface SettlementListResponse {
    success: boolean;
    data: {
        current_page: number;
        data: Settlement[];
        last_page: number;
        per_page: number;
        total: number;
        next_page_url: string | null;
        prev_page_url: string | null;
    };
    summary: SettlementSummary;
    meta: {
        current_page: number;
        last_page: number;
        total: number;
    };
}

export interface SettlementListParams {
    page?: number;
    per_page?: number;
    status?: SettlementStatus | "";
    vendor_id?: number;
    period_start?: string;
    period_end?: string;
    search?: string;
}

// Generate: vendor_id is a UUID per controller validation rule
export interface GenerateSettlementPayload {
    period_start: string;                // required|date
    period_end: string;                  // required|date|after:period_start
    vendor_id?: string;                  // nullable|exists:vendors,uuid  ← UUID not int
}

export interface GenerateSettlementResponse {
    success: boolean;
    message: string;
    data: {
        generated: { vendor: string; settlement_id: number; amount: number }[];
        generated_count: number;
        errors: string[];
        period_start: string;
        period_end: string;
    };
}

// Approve: optional notes
export interface ApprovePayload {
    notes?: string;
}

// MarkAsPaid: payment_reference + payment_method are REQUIRED by controller
export interface MarkAsPaidPayload {
    payment_reference: string;          // required|string
    payment_method: PaymentMethod;      // required|in:bank_transfer,paypal,stripe,manual
    notes?: string;
}

// Dispute: controller validates 'reason' not 'notes'
export interface DisputePayload {
    reason: string;                     // required|string  ← NOT "notes"
}

export interface DownloadStatementResponse {
    success: boolean;
    data: {
        download_url: string;           // S3 presigned URL
        filename: string;
    };
}

// ─── API Slice ────────────────────────────────────────────────────────────────

export const settlementApi = createApi({
    reducerPath: "settlementApi",

    baseQuery: fetchBaseQuery({
        baseUrl: baseURL,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) headers.set("authorization", `Bearer ${token}`);
            return headers;
        },
    }),

    tagTypes: ["Settlements"],

    endpoints: (builder) => ({

        // GET /admin/settlements
        // Supports: status, vendor_id, period_start, period_end, search, page, per_page
        getSettlements: builder.query<SettlementListResponse, SettlementListParams>({
            query: (params = {}) => ({
                url: "admin/settlements",
                method: "GET",
                params,
            }),
            providesTags: ["Settlements"],
        }),

        // GET /admin/settlements/pending  (501 placeholder currently)
        getPendingSettlements: builder.query<SettlementListResponse, void>({
            query: () => ({
                url: "admin/settlements/pending",
                method: "GET",
            }),
            providesTags: ["Settlements"],
        }),

        // GET /admin/settlements/{id}
        // Returns: { settlement, transaction_summary, orders_count, total_orders_value }
        getSettlement: builder.query<SettlementDetailResponse, number | string>({
            query: (id) => ({
                url: `admin/settlements/${id}`,
                method: "GET",
            }),
            providesTags: (_result, _error, id) => [{ type: "Settlements", id }],
        }),

        // POST /admin/settlements/generate
        // vendor_id is UUID, period_start & period_end required
        generateSettlement: builder.mutation<GenerateSettlementResponse, GenerateSettlementPayload>({
            query: (data) => ({
                url: "admin/settlements/generate",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Settlements"],
        }),

        // POST /admin/settlements/{id}/approve
        // Body: { notes?: string }  — only pending settlements can be approved
        approveSettlement: builder.mutation<{ success: boolean; message: string; data: Settlement }, { id: number | string; data?: ApprovePayload }>({
            query: ({ id, data }) => ({
                url: `admin/settlements/${id}/approve`,
                method: "POST",
                body: data ?? {},
            }),
            invalidatesTags: ["Settlements"],
        }),

        // POST /admin/settlements/{id}/pay
        // Body: { payment_reference: string, payment_method: PaymentMethod, notes?: string }
        // Only approved settlements can be paid
        markAsPaid: builder.mutation<{ success: boolean; message: string; data: Settlement }, { id: number | string; data: MarkAsPaidPayload }>({
            query: ({ id, data }) => ({
                url: `admin/settlements/${id}/pay`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Settlements"],
        }),

        // POST /admin/settlements/{id}/dispute
        // Body: { reason: string }  ← controller uses 'reason' not 'notes'
        disputeSettlement: builder.mutation<{ success: boolean; message: string; data: Settlement }, { id: number | string; data: DisputePayload }>({
            query: ({ id, data }) => ({
                url: `admin/settlements/${id}/dispute`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Settlements"],
        }),

        // GET /admin/settlements/{id}/statement
        // Returns JSON { download_url, filename } — NOT a blob
        getStatementUrl: builder.query<DownloadStatementResponse, number | string>({
            query: (id) => ({
                url: `admin/settlements/${id}/statement`,
                method: "GET",
            }),
        }),

    }),
});

export const {
    useGetSettlementsQuery,
    useGetPendingSettlementsQuery,
    useGetSettlementQuery,
    useGenerateSettlementMutation,
    useApproveSettlementMutation,
    useMarkAsPaidMutation,
    useDisputeSettlementMutation,
    useLazyGetStatementUrlQuery,
} = settlementApi;