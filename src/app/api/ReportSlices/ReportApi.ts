// src/app/api/ReportSlices/ReportApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseURL = import.meta.env.VITE_BASE_URL;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PlatformReport {
    total_revenue: number;
    total_orders: number;
    total_customers: number;
    total_vendors: number;
    average_order_value: number;
    conversion_rate: number;
    revenue_by_day: Array<{
        date: string;
        revenue: number;
        orders: number;
    }>;
    top_vendors: Array<{
        vendor_id: number;
        vendor_name: string;
        revenue: number;
        orders: number;
    }>;
    top_products: Array<{
        product_id: number;
        product_name: string;
        quantity_sold: number;
        revenue: number;
    }>;
}

export interface FinancialReport {
    period: {
        date_from: string;
        date_to: string;
    };
    revenue: {
        total: number;
        by_payment_method: Array<{
            payment_method: string;
            total: number;
            count: number;
        }>;
        by_currency: Array<{
            currency_code: string;
            total: number;
        }>;
    };
    commission: {
        total: number;
        by_vendor: Array<{
            vendor_id: number;
            vendor: { company_name: string };
            total: number;
        }>;
    };
    settlements: {
        total_paid: number;
        total_pending: number;
        total_approved: number;
        by_vendor: Array<{
            vendor_id: number;
            vendor: { company_name: string };
            total: number;
            count: number;
        }>;
    };
    gateway_fees: {
        total: number;
        by_gateway: Array<{
            payment_method: string;
            total: number;
        }>;
    };
    refunds: {
        total: number;
        count: number;
        by_reason: Array<{
            reason: string;
            count: number;
            total: number;
        }>;
    };
    net_profit: number;
}

export interface VendorPerformance {
    vendor: {
        id: number;
        company_name: string;
        email: string;
    };
    revenue: number;
    order_count: number;
    average_order_value: number;
    commission: number;
    products_sold: number;
    refund_amount: number;
    settlement_paid: number;
}

export interface ProductPerformance {
    id: number;
    name: string;
    sku: string;
    vendor_id: number;
    vendor_name: string;
    quantity_sold: number;
    revenue: number;
    average_price: number;
    order_count: number;
    tax_collected: number;
}

export interface CustomerReport {
    new_customers: number;
    top_customers: Array<{
        customer_id: number;
        customer_name: string;
        customer_email: string;
        customer_since: string;
        order_count: number;
        total_spent: number;
        average_order_value: number;
    }>;
    retention: {
        repeat_customers: number;
        total_customers: number;
        repeat_rate: number;
    };
    lifetime_value: number;
}

export interface SalesReport {
    daily_sales: Array<{
        date: string;
        sales: number;
        orders: number;
        average_order: number;
    }>;
    weekly_sales: Array<{
        week: number;
        sales: number;
        orders: number;
    }>;
    monthly_sales: Array<{
        month: string;
        sales: number;
        orders: number;
    }>;
    by_category: Array<{
        category: string;
        sales: number;
        percentage: number;
    }>;
}

// Raw base query
const rawBaseQuery = fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers) => {
        const token = localStorage.getItem("token");
        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }
        headers.set("Content-Type", "application/json");
        return headers;
    },
});

const baseQueryWithAuthCheck: typeof rawBaseQuery = async (args, api, extraOptions) => {
    const result = await rawBaseQuery(args, api, extraOptions);
    if (result.error && result.error.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
    }
    return result;
};

export const reportApi = createApi({
    reducerPath: "reportApi",
    baseQuery: baseQueryWithAuthCheck,
    tagTypes: ["Reports"],
    keepUnusedDataFor: 60, // Reports cached for 60 seconds

    endpoints: (builder) => ({

        // GET /admin/reports/platform
        getPlatformReport: builder.query<{ success: boolean; data: PlatformReport; meta: any }, {
            period?: "day" | "week" | "month" | "quarter" | "year";
            date_from?: string;
            date_to?: string;
        }>({
            query: (params) => {
                const queryParams = new URLSearchParams();
                if (params.period) queryParams.append('period', params.period);
                if (params.date_from) queryParams.append('date_from', params.date_from);
                if (params.date_to) queryParams.append('date_to', params.date_to);
                const url = `admin/reports/platform${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
                return { url, method: "GET" };
            },
            providesTags: ["Reports"],
        }),

        // GET /admin/reports/financial
        getFinancialReport: builder.query<{ success: boolean; data: FinancialReport }, {
            period?: "day" | "week" | "month" | "quarter" | "year";
            date_from?: string;
            date_to?: string;
        }>({
            query: (params) => {
                const queryParams = new URLSearchParams();
                if (params.period) queryParams.append('period', params.period);
                if (params.date_from) queryParams.append('date_from', params.date_from);
                if (params.date_to) queryParams.append('date_to', params.date_to);
                const url = `admin/reports/financial${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
                return { url, method: "GET" };
            },
            providesTags: ["Reports"],
        }),

        // GET /admin/reports/sales
        getSalesReport: builder.query<{ success: boolean; data: SalesReport }, {
            period?: "day" | "week" | "month" | "quarter" | "year";
            date_from?: string;
            date_to?: string;
        }>({
            query: (params) => {
                const queryParams = new URLSearchParams();
                if (params.period) queryParams.append('period', params.period);
                if (params.date_from) queryParams.append('date_from', params.date_from);
                if (params.date_to) queryParams.append('date_to', params.date_to);
                const url = `admin/reports/sales${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
                return { url, method: "GET" };
            },
            providesTags: ["Reports"],
        }),

        // GET /admin/reports/vendor-performance
        getVendorPerformanceReport: builder.query<{ success: boolean; data: VendorPerformance[]; meta: any }, {
            period?: "day" | "week" | "month" | "quarter" | "year";
            date_from?: string;
            date_to?: string;
            vendor_id?: number;
        }>({
            query: (params) => {
                const queryParams = new URLSearchParams();
                if (params.period) queryParams.append('period', params.period);
                if (params.date_from) queryParams.append('date_from', params.date_from);
                if (params.date_to) queryParams.append('date_to', params.date_to);
                if (params.vendor_id) queryParams.append('vendor_id', params.vendor_id.toString());
                const url = `admin/reports/vendor-performance${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
                return { url, method: "GET" };
            },
            providesTags: ["Reports"],
        }),

        // GET /admin/reports/product-performance
        getProductPerformanceReport: builder.query<{ success: boolean; data: ProductPerformance[]; summary: any; meta: any }, {
            period?: "day" | "week" | "month" | "quarter" | "year";
            date_from?: string;
            date_to?: string;
            vendor_id?: number;
            limit?: number;
        }>({
            query: (params) => {
                const queryParams = new URLSearchParams();
                if (params.period) queryParams.append('period', params.period);
                if (params.date_from) queryParams.append('date_from', params.date_from);
                if (params.date_to) queryParams.append('date_to', params.date_to);
                if (params.vendor_id) queryParams.append('vendor_id', params.vendor_id.toString());
                if (params.limit) queryParams.append('limit', params.limit.toString());
                const url = `admin/reports/product-performance${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
                return { url, method: "GET" };
            },
            providesTags: ["Reports"],
        }),

        // POST /admin/reports/export - Export report
        exportReport: builder.mutation<{ success: boolean; data: { filename: string; content: string; mime_type: string } }, {
            report_type: "platform" | "financial" | "vendor_performance" | "product_performance" | "customer_report";
            format?: "csv" | "excel";
            date_from: string;
            date_to: string;
        }>({
            query: (data) => ({
                url: "admin/reports/export",
                method: "POST",
                body: data,
            }),
        }),
        // Add to ReportApi.ts endpoints
        getSalesReport: builder.query<{ success: boolean; data: SalesReport }, {
            period?: "day" | "week" | "month" | "quarter" | "year";
            date_from?: string;
            date_to?: string;
        }>({
            query: (params) => {
                const queryParams = new URLSearchParams();
                if (params.period) queryParams.append('period', params.period);
                if (params.date_from) queryParams.append('date_from', params.date_from);
                if (params.date_to) queryParams.append('date_to', params.date_to);
                const url = `admin/reports/sales${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
                return { url, method: "GET" };
            },
            providesTags: ["Reports"],
        }),
    }),
});

export const {
    useGetPlatformReportQuery,
    useGetFinancialReportQuery,
    useGetSalesReportQuery,
    useGetVendorPerformanceReportQuery,
    useGetProductPerformanceReportQuery,
    useExportReportMutation,
} = reportApi;

export default reportApi;