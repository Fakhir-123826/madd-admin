import { createApi } from "@reduxjs/toolkit/query/react";
import { dynamicBaseQuery } from "../dynamicBaseQuery";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Plan {
    id: number;
    subscription_name: string;
    billing_type: "monthly" | "yearly" | "one-time";
    price: number;
    feature: string[];
    status: number; // 1 = active, 0 = inactive
    created_at: string;
    updated_at: string;
    description: string | null;
    setup_fee: number;
    transaction_fee_percentage: number;
    transaction_fee_fixed: number;
    commission_rate: number;
    max_products: number;
    max_stores: number;
    max_users: number;
    bandwidth_limit_mb: number;
    storage_limit_mb: number;
    trial_period_days: number;
    is_default: boolean;
    sort_order: number;
}

export interface CreatePlanPayload {
    subscription_name: string;
    billing_type: "monthly" | "yearly" | "one-time";
    price: number;
    feature?: string[];
    status?: boolean;
    description?: string;
    setup_fee?: number;
    transaction_fee_percentage?: number;
    commission_rate?: number;
    max_products?: number;
    max_stores?: number;
    max_users?: number;
    trial_period_days?: number;
}

export interface UpdatePlanPayload {
    subscription_name?: string;
    billing_type?: "monthly" | "yearly" | "one-time";
    price?: number;
    feature?: string[];
    status?: boolean;
    description?: string;
    setup_fee?: number;
    transaction_fee_percentage?: number;
    commission_rate?: number;
    max_products?: number;
    max_stores?: number;
    max_users?: number;
    trial_period_days?: number;
}

export interface PlanStats {
    total_plans: number;
    active_plans: number;
    inactive_plans: number;
    default_plan: Plan | null;
    vendor_subscriptions: number;
    most_popular_plan: Plan | null;
}

export const planApi = createApi({
    reducerPath: "planApi",
    baseQuery: dynamicBaseQuery,
    tagTypes: ["Plans", "PlanStats"],
    keepUnusedDataFor: 300,

    endpoints: (builder) => ({

        // GET /plans - Get all plans
        getPlans: builder.query<Plan[], void>({
            query: () => ({
                url: "plans",
                method: "GET",
            }),
            providesTags: ["Plans"],
        }),

        // GET /plans/stats - Get plan statistics
        getPlanStats: builder.query<PlanStats, void>({
            query: () => ({
                url: "plans/stats",
                method: "GET",
            }),
            providesTags: ["PlanStats"],
        }),

        // GET /plans/{id} - Get single plan
        getPlan: builder.query<Plan, string>({
            query: (id) => ({
                url: `plans/${id}`,
                method: "GET",
            }),
            providesTags: (_result, _error, id) => [{ type: "Plans", id }],
        }),

        // POST /plans - Create plan
        createPlan: builder.mutation<Plan, CreatePlanPayload>({
            query: (data) => ({
                url: "plans",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Plans", "PlanStats"],
        }),

        // PUT /plans/{id} - Update plan
        updatePlan: builder.mutation<Plan, { id: number; data: UpdatePlanPayload }>({
            query: ({ id, data }) => ({
                url: `plans/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: "Plans", id: id.toString() },
                "Plans",
                "PlanStats",
            ],
        }),

        // DELETE /plans/{id} - Delete plan
        deletePlan: builder.mutation<{ success: boolean; message: string }, number>({
            query: (id) => ({
                url: `plans/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Plans", "PlanStats"],
        }),

        // POST /plans/{id}/set-default - Set default plan
        setDefaultPlan: builder.mutation<{ success: boolean; message: string }, number>({
            query: (id) => ({
                url: `plans/${id}/set-default`,
                method: "POST",
            }),
            invalidatesTags: ["Plans", "PlanStats"],
        }),

        // POST /plans/{id}/toggle-active - Toggle plan status
        togglePlanActive: builder.mutation<{ success: boolean; message: string; data: { is_active: boolean } }, number>({
            query: (id) => ({
                url: `plans/${id}/toggle-active`,
                method: "POST",
            }),
            invalidatesTags: ["Plans", "PlanStats"],
        }),

        // POST /plans/sort-order - Update sort order
        updateSortOrder: builder.mutation<{ success: boolean; message: string }, { orders: { id: number; sort_order: number }[] }>({
            query: (data) => ({
                url: "plans/sort-order",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Plans"],
        }),
    }),
});

export const {
    useGetPlansQuery,
    useGetPlanStatsQuery,
    useGetPlanQuery,
    useCreatePlanMutation,
    useUpdatePlanMutation,
    useDeletePlanMutation,
    useSetDefaultPlanMutation,
    useTogglePlanActiveMutation,
    useUpdateSortOrderMutation,
} = planApi;

export default planApi;