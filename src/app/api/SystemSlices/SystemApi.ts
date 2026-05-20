// src/app/api/SystemSlices/SystemApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { dynamicBaseQuery } from "../dynamicBaseQuery";

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

// ─── API ───────────────────────────────────────────────────────────────────────

export const systemApi = createApi({
    reducerPath: "systemApi",
    baseQuery: dynamicBaseQuery,
    tagTypes: ["Logs", "Cache", "Queues", "Maintenance"],
    keepUnusedDataFor: 30,

    endpoints: (builder) => ({

        // GET system/logs - list of log files
        getLogs: builder.query<{ success: boolean; data: LogEntry[] }, void>({
            query: () => ({ url: "system/logs", method: "GET" }),
            providesTags: ["Logs"],
        }),

        // GET system/logs/{date} - content of a specific log file
        getLogByDate: builder.query<{ success: boolean; data: LogDetail }, string>({
            query: (date) => ({ url: `system/logs/${date}`, method: "GET" }),
            providesTags: (_result, _error, date) => [{ type: "Logs", id: date }],
        }),

        // DELETE system/logs - clear all logs
        clearLogs: builder.mutation<{ success: boolean; message: string }, void>({
            query: () => ({ url: "system/logs", method: "DELETE" }),
            invalidatesTags: ["Logs"],
        }),

        // GET system/cache - get cache info
        getCacheInfo: builder.query<{ success: boolean; data: CacheInfo }, void>({
            query: () => ({ url: "system/cache", method: "GET" }),
            providesTags: ["Cache"],
        }),

        // POST system/cache/clear - clear cache
        clearCache: builder.mutation<{ success: boolean; message: string }, void>({
            query: () => ({ url: "system/cache/clear", method: "POST" }),
            invalidatesTags: ["Cache"],
        }),

        // GET system/queues - get queue info
        getQueues: builder.query<{ success: boolean; data: QueuesData }, void>({
            query: () => ({ url: "system/queues", method: "GET" }),
            providesTags: ["Queues"],
        }),

        // POST system/queues/retry/{id} - retry a failed job
        retryJob: builder.mutation<{ success: boolean; message: string }, string | number>({
            query: (id) => ({ url: `system/queues/retry/${id}`, method: "POST" }),
            invalidatesTags: ["Queues"],
        }),

        // DELETE system/queues/failed - clear all failed jobs
        clearFailedJobs: builder.mutation<{ success: boolean; message: string }, void>({
            query: () => ({ url: "system/queues/failed", method: "DELETE" }),
            invalidatesTags: ["Queues"],
        }),

        // GET system/maintenance - get maintenance status
        getMaintenanceStatus: builder.query<{ success: boolean; data: MaintenanceStatus }, void>({
            query: () => ({ url: "system/maintenance", method: "GET" }),
            providesTags: ["Maintenance"],
        }),

        // POST system/maintenance - toggle maintenance mode
        toggleMaintenance: builder.mutation<{ success: boolean; message: string; data: MaintenanceStatus }, {
            enabled: boolean;
            message?: string;
            secret?: string;
        }>({
            query: (body) => ({ url: "system/maintenance", method: "POST", body }),
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
