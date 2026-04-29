// src/app/api/MlmSlices/MlmApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseURL = import.meta.env.VITE_BASE_URL;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MlmAgent {
    id: number;
    user_id: number;
    parent_id: number | null;
    level: number;
    territory_type: "country" | "region" | "city";
    territory_code: string;
    commission_rate: number;
    phone: string | null;
    status: "active" | "inactive" | "suspended";
    kyc_status: "pending" | "verified" | "rejected";
    total_commissions_earned: number;
    total_vendors_recruited: number;
    user?: {
        id: number;
        full_name: string;
        email: string;
        avatar?: string;
    };
    parent?: MlmAgent;
    children?: MlmAgent[];
    downline_count?: number;
    active_downline?: number;
    created_at: string;
    updated_at: string;
}

export interface MlmCommission {
    id: number;
    agent_id: number;
    amount: number;
    status: "pending" | "approved" | "paid" | "rejected";
    source_type: "sale" | "referral" | "bonus";
    source_id: number;
    level: number;
    description: string | null;
    agent?: MlmAgent;
    settlement?: any;
    created_at: string;
    updated_at: string;
}

export interface MlmLevel {
    level: number;
    commission_percentage: number;
    required_downline: number;
    required_volume: number;
    bonus_amount: number;
}

export interface MlmStatistics {
    total_agents: number;
    active_agents: number;
    inactive_agents: number;
    suspended_agents: number;
    kyc_pending: number;
    kyc_verified: number;
    kyc_rejected: number;
    by_level: Array<{ level: number; count: number }>;
    by_territory: Array<{ territory_type: string; territory_code: string; count: number }>;
    total_commissions: number;
    pending_commissions: number;
    paid_commissions: number;
    top_earners: MlmAgent[];
    top_recruiters: MlmAgent[];
}

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

export const mlmApi = createApi({
    reducerPath: "mlmApi",
    baseQuery: baseQueryWithAuthCheck,
    tagTypes: ["Agents", "Commissions", "Statistics", "Structure", "Levels"],
    keepUnusedDataFor: 300,

    endpoints: (builder) => ({

        // ─── Agents ───────────────────────────────────────────────────────────
        getAgents: builder.query<{
            success: boolean;
            data: MlmAgent[];
            meta: {
                current_page: number;
                last_page: number;
                total: number;
                per_page: number;
                from: number;
                to: number;
            };
        }, {
            page?: number;
            per_page?: number;
            level?: number;
            status?: string;
            kyc_status?: string;
            territory_type?: string;
            territory_code?: string;
            search?: string;
        } | void>({
            query: (params) => {
                const queryParams = new URLSearchParams();
                if (params) {
                    if (params.page) queryParams.append('page', params.page.toString());
                    if (params.per_page) queryParams.append('per_page', params.per_page.toString());
                    if (params.level) queryParams.append('level', params.level.toString());
                    if (params.status) queryParams.append('status', params.status);
                    if (params.kyc_status) queryParams.append('kyc_status', params.kyc_status);
                    if (params.territory_type) queryParams.append('territory_type', params.territory_type);
                    if (params.territory_code) queryParams.append('territory_code', params.territory_code);
                    if (params.search) queryParams.append('search', params.search);
                }
                const url = `admin/mlm/agents${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
                return { url, method: "GET" };
            },
            providesTags: ["Agents"],
        }),

        getAgent: builder.query<{ success: boolean; data: any }, number>({
            query: (id) => ({
                url: `admin/mlm/agents/${id}`,
                method: "GET",
            }),
            providesTags: (_result, _error, id) => [{ type: "Agents", id: id.toString() }],
        }),

        createAgent: builder.mutation<{ success: boolean; message: string; data: MlmAgent }, any>({
            query: (data) => ({
                url: "admin/mlm/agents",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Agents", "Statistics"],
        }),

        updateAgent: builder.mutation<{ success: boolean; message: string; data: MlmAgent }, { id: number; data: any }>({
            query: ({ id, data }) => ({
                url: `admin/mlm/agents/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: "Agents", id: id.toString() },
                "Agents",
                "Statistics",
            ],
        }),

        deleteAgent: builder.mutation<{ success: boolean; message: string }, number>({
            query: (id) => ({
                url: `admin/mlm/agents/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Agents", "Statistics"],
        }),

        verifyAgent: builder.mutation<{ success: boolean; message: string }, number>({
            query: (id) => ({
                url: `admin/mlm/agents/${id}/verify`,
                method: "POST",
            }),
            invalidatesTags: (_result, _error, id) => [
                { type: "Agents", id: id.toString() },
                "Agents",
                "Statistics",
            ],
        }),

        // ─── Commissions ──────────────────────────────────────────────────────
        getCommissions: builder.query<{
            success: boolean;
            data: MlmCommission[];
            summary: {
                total_pending: number;
                total_approved: number;
                total_paid: number;
                total_commissions: number;
            };
            meta: {
                current_page: number;
                last_page: number;
                total: number;
                per_page: number;
                from: number;
                to: number;
            };
        }, {
            page?: number;
            per_page?: number;
            agent_id?: number;
            status?: string;
            source_type?: string;
            date_from?: string;
            date_to?: string;
        } | void>({
            query: (params) => {
                const queryParams = new URLSearchParams();
                if (params) {
                    if (params.page) queryParams.append('page', params.page.toString());
                    if (params.per_page) queryParams.append('per_page', params.per_page.toString());
                    if (params.agent_id) queryParams.append('agent_id', params.agent_id.toString());
                    if (params.status) queryParams.append('status', params.status);
                    if (params.source_type) queryParams.append('source_type', params.source_type);
                    if (params.date_from) queryParams.append('date_from', params.date_from);
                    if (params.date_to) queryParams.append('date_to', params.date_to);
                }
                const url = `admin/mlm/commissions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
                return { url, method: "GET" };
            },
            providesTags: ["Commissions"],
        }),

        processCommissions: builder.mutation<{
            success: boolean;
            message: string;
            data: {
                commissions_created: number;
                total_amount: number;
                period_start: string;
                period_end: string;
            };
        }, { period_start: string; period_end: string }>({
            query: (data) => ({
                url: "admin/mlm/commissions/process",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Commissions", "Agents", "Statistics"],
        }),

        payCommission: builder.mutation<{ success: boolean; message: string }, number>({
            query: (id) => ({
                url: `admin/mlm/commissions/${id}/pay`,
                method: "POST",
            }),
            invalidatesTags: ["Commissions", "Agents", "Statistics"],
        }),

        approveCommission: builder.mutation<{ success: boolean; message: string }, number>({
            query: (id) => ({
                url: `admin/mlm/commissions/${id}/approve`,
                method: "POST",
            }),
            invalidatesTags: ["Commissions"],
        }),

        rejectCommission: builder.mutation<{ success: boolean; message: string }, { id: number; reason: string }>({
            query: ({ id, reason }) => ({
                url: `admin/mlm/commissions/${id}/reject`,
                method: "POST",
                body: { reason },
            }),
            invalidatesTags: ["Commissions"],
        }),

        // ─── Statistics ───────────────────────────────────────────────────────
        getMlmStatistics: builder.query<{ success: boolean; data: MlmStatistics }, void>({
            query: () => ({
                url: "admin/mlm/statistics",
                method: "GET",
            }),
            providesTags: ["Statistics"],
        }),

        // ─── Structure ────────────────────────────────────────────────────────
        getMlmStructure: builder.query<{ success: boolean; data: any[] }, void>({
            query: () => ({
                url: "admin/mlm/structure",
                method: "GET",
            }),
            providesTags: ["Structure"],
        }),

        // ─── Levels ───────────────────────────────────────────────────────────
        getMlmLevels: builder.query<{ success: boolean; data: MlmLevel[] }, void>({
            query: () => ({
                url: "admin/mlm/levels",
                method: "GET",
            }),
            providesTags: ["Levels"],
        }),

        updateMlmLevels: builder.mutation<{ success: boolean; message: string }, MlmLevel[]>({
            query: (data) => ({
                url: "admin/mlm/levels",
                method: "PUT",
                body: { levels: data },
            }),
            invalidatesTags: ["Levels"],
        }),
    }),
});

export const {
    useGetAgentsQuery,
    useGetAgentQuery,
    useCreateAgentMutation,
    useUpdateAgentMutation,
    useDeleteAgentMutation,
    useVerifyAgentMutation,
    useGetCommissionsQuery,
    useProcessCommissionsMutation,
    usePayCommissionMutation,
    useApproveCommissionMutation,
    useRejectCommissionMutation,
    useGetMlmStatisticsQuery,
    useGetMlmStructureQuery,
    useGetMlmLevelsQuery,
    useUpdateMlmLevelsMutation,
} = mlmApi;

export default mlmApi;