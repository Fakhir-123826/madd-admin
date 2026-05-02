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

// Helper function to get base route from localStorage
const getUserBasePath = () => {
    try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const role = user?.roles?.[0] || user?.user_type;

        if (["super_admin", "admin"].includes(role)) return "admin";
        if (["vendor", "customer"].includes(role)) return role;

        return "admin";
    } catch {
        return "admin";
    }
};

// Custom dynamic base query that handles role-based routing
const dynamicBaseQuery = async (args: any, api: any, extraOptions: any) => {
    const basePath = getUserBasePath();
    
    // Handle both string URL and object args
    let url: string;
    let method: string = 'GET';
    let body: any = undefined;
    let params: any = undefined;
    
    if (typeof args === 'string') {
        url = args;
    } else {
        url = args.url;
        method = args.method || 'GET';
        body = args.body;
        params = args.params;
    }
    
    // Remove any existing base path prefix if present
    const cleanEndpoint = url.replace(/^(admin|vendor|customer)\//, '');
    
    // Construct the full URL with dynamic base path
    let finalUrl = `${baseURL}/${basePath}/${cleanEndpoint}`;
    
    // Add query parameters if they exist
    if (params) {
        const queryString = new URLSearchParams(params).toString();
        finalUrl += `?${queryString}`;
    }
    
    // Prepare headers
    const headers = new Headers();
    const token = localStorage.getItem("token");
    if (token) {
        headers.set("authorization", `Bearer ${token}`);
    }
    headers.set("Content-Type", "application/json");
    
    // Prepare fetch options
    const fetchOptions: RequestInit = {
        method,
        headers,
        ...extraOptions,
    };
    
    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        fetchOptions.body = JSON.stringify(body);
    }
    
    // Make the request
    try {
        const response = await fetch(finalUrl, fetchOptions);
        let data;
        
        // Try to parse JSON, but handle non-JSON responses
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            data = await response.text();
        }
        
        // Handle unauthorized
        if (response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
            return { error: { status: 401, data: { message: "Unauthorized" } } };
        }
        
        // Handle other error status codes
        if (!response.ok) {
            return { 
                error: { 
                    status: response.status, 
                    data: data,
                    message: data?.message || `Request failed with status ${response.status}`
                } 
            };
        }
        
        return { data };
    } catch (error) {
        console.error("API Request Error:", error);
        return { error: { status: 'FETCH_ERROR', error: String(error) } };
    }
};

// ─── API Slice ────────────────────────────────────────────────────────────────

export const dashboardApi = createApi({
    reducerPath: "dashboardApi",
    baseQuery: dynamicBaseQuery,
    tagTypes: ["Dashboard"],

    endpoints: (builder) => ({

        // GET /{basePath}/dashboard — statistics + recent_orders + recent_vendors
        getDashboard: builder.query<DashboardResponse, void>({
            query: () => ({
                url: "dashboard",
                method: "GET",
            }),
            providesTags: ["Dashboard"],
        }),

        // GET /{basePath}/statistics?period=30_days
        // Returns chart data: daily_sales, daily_orders, new_users, new_vendors, top_products, top_vendors
        getDashboardStatistics: builder.query<DashboardChartResponse, ChartPeriod>({
            query: (period = "30_days") => ({
                url: "statistics",
                method: "GET",
                params: { period },
            }),
            providesTags: ["Dashboard"],
        }),

        // Optional: GET /{basePath}/dashboard/recent-orders - Get recent orders with pagination
        getRecentOrders: builder.query<{ success: boolean; data: DashboardOrder[] }, { limit?: number; page?: number }>({
            query: ({ limit = 10, page = 1 }) => ({
                url: "dashboard/recent-orders",
                method: "GET",
                params: { limit, page },
            }),
            providesTags: ["Dashboard"],
        }),

        // Optional: GET /{basePath}/dashboard/recent-vendors - Get recent vendors with pagination
        getRecentVendors: builder.query<{ success: boolean; data: DashboardVendor[] }, { limit?: number; page?: number }>({
            query: ({ limit = 10, page = 1 }) => ({
                url: "dashboard/recent-vendors",
                method: "GET",
                params: { limit, page },
            }),
            providesTags: ["Dashboard"],
        }),

        // Optional: GET /{basePath}/dashboard/sales-overview - Get sales overview for a specific period
        getSalesOverview: builder.query<{ success: boolean; data: { total_sales: string; total_orders: number; average_order_value: string; growth_percentage: number } }, ChartPeriod>({
            query: (period = "30_days") => ({
                url: "dashboard/sales-overview",
                method: "GET",
                params: { period },
            }),
            providesTags: ["Dashboard"],
        }),

        // Optional: GET /{basePath}/dashboard/vendor-performance - Get vendor performance metrics
        getVendorPerformance: builder.query<{ success: boolean; data: { top_vendors: TopVendorStat[]; total_vendors: number; active_vendors: number } }, { limit?: number; period?: ChartPeriod }>({
            query: ({ limit = 10, period = "30_days" }) => ({
                url: "dashboard/vendor-performance",
                method: "GET",
                params: { limit, period },
            }),
            providesTags: ["Dashboard"],
        }),
    }),
});

// Export all hooks
export const {
    useGetDashboardQuery,
    useGetDashboardStatisticsQuery,
    useGetRecentOrdersQuery,
    useGetRecentVendorsQuery,
    useGetSalesOverviewQuery,
    useGetVendorPerformanceQuery,
} = dashboardApi;

export default dashboardApi;