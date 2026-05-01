// src/app/api/SystemSlices/SystemApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseURL = import.meta.env.VITE_BASE_URL;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LogEntry {
    date: string;
    size?: string;
    path?: string;
}

export interface LogDetail {
    date: string;
    content: string;
}

export interface CacheInfo {
    driver: string;
    size?: string | number;
    keys?: number;
    status?: string;
}

export interface QueueJob {
    id: string | number;
    connection: string;
    queue: string;
    payload?: any;
    failed_at?: string;
    exception?: string;
    attempts?: number;
    status?: string;
}

export interface QueuesData {
    pending?: number;
    failed?: number;
    processed?: number;
    jobs?: QueueJob[];
    failed_jobs?: QueueJob[];
}

export interface MaintenanceStatus {
    enabled: boolean;
    message?: string;
    allowed_ips?: string[];
    secret?: string;
}

// ─── Base Query ────────────────────────────────────────────────────────────────

const rawBaseQuery = fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers) => {
        const token = localStorage.getItem("token") || localStorage.getItem("access_token");
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
        localStorage.removeItem("access_token");
        window.location.href = "/login";
    }
    return result;
};

// ─── API ───────────────────────────────────────────────────────────────────────

export const systemApi = createApi({
    reducerPath: "systemApi",
    baseQuery: baseQueryWithAuthCheck,
    tagTypes: ["Logs", "Cache", "Queues", "Maintenance"],
    keepUnusedDataFor: 30,

    endpoints: (builder) => ({

        // GET admin/system/logs - list of log files
        getLogs: builder.query<{ success: boolean; data: LogEntry[] }, void>({
            query: () => ({ url: "admin/system/logs", method: "GET" }),
            providesTags: ["Logs"],
        }),

        // GET admin/system/logs/{date} - content of a specific log file
        getLogByDate: builder.query<{ success: boolean; data: LogDetail }, string>({
            query: (date) => ({ url: `admin/system/logs/${date}`, method: "GET" }),
            providesTags: (_result, _error, date) => [{ type: "Logs", id: date }],
        }),

        // DELETE admin/system/logs - clear all logs
        clearLogs: builder.mutation<{ success: boolean; message: string }, void>({
            query: () => ({ url: "admin/system/logs", method: "DELETE" }),
            invalidatesTags: ["Logs"],
        }),

        // GET admin/system/cache - get cache info
        getCacheInfo: builder.query<{ success: boolean; data: CacheInfo }, void>({
            query: () => ({ url: "admin/system/cache", method: "GET" }),
            providesTags: ["Cache"],
        }),

        // POST admin/system/cache/clear - clear cache
        clearCache: builder.mutation<{ success: boolean; message: string }, void>({
            query: () => ({ url: "admin/system/cache/clear", method: "POST" }),
            invalidatesTags: ["Cache"],
        }),

        // GET admin/system/queues - get queue info
        getQueues: builder.query<{ success: boolean; data: QueuesData }, void>({
            query: () => ({ url: "admin/system/queues", method: "GET" }),
            providesTags: ["Queues"],
        }),

        // POST admin/system/queues/retry/{id} - retry a failed job
        retryJob: builder.mutation<{ success: boolean; message: string }, string | number>({
            query: (id) => ({ url: `admin/system/queues/retry/${id}`, method: "POST" }),
            invalidatesTags: ["Queues"],
        }),

        // DELETE admin/system/queues/failed - clear all failed jobs
        clearFailedJobs: builder.mutation<{ success: boolean; message: string }, void>({
            query: () => ({ url: "admin/system/queues/failed", method: "DELETE" }),
            invalidatesTags: ["Queues"],
        }),

        // GET admin/system/maintenance - get maintenance status
        getMaintenanceStatus: builder.query<{ success: boolean; data: MaintenanceStatus }, void>({
            query: () => ({ url: "admin/system/maintenance", method: "GET" }),
            providesTags: ["Maintenance"],
        }),

        // POST admin/system/maintenance - toggle maintenance mode
        toggleMaintenance: builder.mutation<{ success: boolean; message: string; data: MaintenanceStatus }, {
            enabled: boolean;
            message?: string;
            secret?: string;
        }>({
            query: (body) => ({ url: "admin/system/maintenance", method: "POST", body }),
            invalidatesTags: ["Maintenance"],
        }),
    }),
});

export const {
    useGetLogsQuery,
    useGetLogByDateQuery,
    useClearLogsMutation,
    useGetCacheInfoQuery,
    useClearCacheMutation,
    useGetQueuesQuery,
    useRetryJobMutation,
    useClearFailedJobsMutation,
    useGetMaintenanceStatusQuery,
    useToggleMaintenanceMutation,
} = systemApi;

export default systemApi;
