import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseURL = import.meta.env.VITE_BASE_URL;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DashboardStatistics {
    users: {
        total: number;
        new_today: number;
        active: number;
        pending_verification: number;
    };
    vendors: {
        total: number;
        pending: number;
        active: number;
        suspended: number;
        kyc_pending: number;
    };
    orders: {
        total: number;
        today: number;
        pending: number;
        processing: number;
        shipped: number;
        delivered: number;
        cancelled: number;
    };
    financial: {
        total_revenue: string;
        total_commission: string;
        pending_settlements: number;
        total_paid: number;
    };
}

export interface DashboardVendor {
    id: number;
    uuid: string;
    user_id: number;
    company_name: string;
    company_slug: string;
    country_code: string;
    city: string;
    status: string;
    kyc_status: string;
    total_sales: string;
    total_earned: string;
    rating_average: string;
    total_reviews: number;
    created_at: string;
    user?: {
        id: number;
        email: string;
        first_name: string;
        last_name: string;
        avatar_url: string;
        status: string;
        phone: string;
    };
}

export interface DashboardOrder {
    id: number;
    uuid: string;
    magento_order_increment_id: string;
    customer_firstname: string;
    customer_lastname: string;
    customer_email: string;
    status: string;
    payment_status: string;
    fulfillment_status: string;
    currency_code: string;
    grand_total: string;
    subtotal: string;
    commission_amount: string;
    vendor_payout_amount: string;
    payment_method: string;
    shipping_method: string;
    source: string;
    created_at: string;
    vendor?: DashboardVendor;
    customer?: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
        avatar_url: string;
        status: string;
    } | null;
}

export interface DashboardResponse {
    success: boolean;
    data: {
        statistics: DashboardStatistics;
        recent_orders: DashboardOrder[];
        recent_vendors: DashboardVendor[];
    };
}

// Statistics chart data types
export type ChartPeriod = "7_days" | "30_days" | "90_days" | "year";

export interface DailyDataPoint {
    date: string;
    total?: number;
    count?: number;
}

export interface TopProduct {
    product_name: string;
    total_quantity: number;
}

export interface TopVendorStat {
    vendor_id: number;
    total_revenue: string;
    vendor?: DashboardVendor;
}

export interface DashboardChartResponse {
    success: boolean;
    data: {
        daily_sales: DailyDataPoint[];
        daily_orders: DailyDataPoint[];
        new_users: DailyDataPoint[];
        new_vendors: DailyDataPoint[];
        top_products: TopProduct[];
        top_vendors: TopVendorStat[];
    };
}

// ─── API Slice ────────────────────────────────────────────────────────────────

export const dashboardApi = createApi({
    reducerPath: "dashboardApi",

    baseQuery: fetchBaseQuery({
        baseUrl: baseURL,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) headers.set("authorization", `Bearer ${token}`);
            return headers;
        },
    }),

    tagTypes: ["Dashboard"],

    endpoints: (builder) => ({

        // GET /admin/dashboard  — statistics + recent_orders + recent_vendors
        getDashboard: builder.query<DashboardResponse, void>({
            query: () => ({
                url: "admin/dashboard",
                method: "GET",
            }),
            providesTags: ["Dashboard"],
        }),

        // GET /admin/dashboard/statistics?period=30_days
        // Returns chart data: daily_sales, daily_orders, new_users, new_vendors, top_products, top_vendors
        getDashboardStatistics: builder.query<DashboardChartResponse, ChartPeriod>({
            query: (period = "30_days") => ({
                url: "admin/statistics",
                method: "GET",
                params: { period },
            }),
            providesTags: ["Dashboard"],
        }),

    }),
});

export const {
    useGetDashboardQuery,
    useGetDashboardStatisticsQuery,
} = dashboardApi;