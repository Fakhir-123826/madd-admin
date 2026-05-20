import { createApi } from "@reduxjs/toolkit/query/react";
import { dynamicBaseQuery } from "../dynamicBaseQuery";
import type { Subscription } from "../../../model/susbcription/ISubscription";

export const subscriptionApi = createApi({
  reducerPath: "subscriptionApi",

  baseQuery: dynamicBaseQuery,

  tagTypes: ["Subscription"],

  endpoints: (builder) => ({
    getSubscriptions: builder.query<Subscription[], void>({
      query: () => ({
        url: "plans",
        method: "GET",
      }),
      providesTags: ["Subscription"],
    }),

    getSubscription: builder.query<Subscription, number>({
      query: (id) => ({
        url: `plans/${id}`,
        method: "GET",
      }),
      providesTags: ["Subscription"],
    }),

    createSubscription: builder.mutation<
      Subscription,
      Partial<Subscription>
    >({
      query: (data) => ({
        url: "plans",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Subscription"],
    }),

    updateSubscription: builder.mutation<
      Subscription,
      { id: number; data: Partial<Subscription> }
    >({
      query: ({ id, data }) => ({
        url: `plans/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Subscription"],
    }),

    deleteSubscription: builder.mutation<void, number>({
      query: (id) => ({
        url: `plans/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Subscription"],
    }),

    setDefaultPlan: builder.mutation<void, number>({
      query: (id) => ({
        url: `plans/${id}/set-default`,
        method: "POST",
      }),
      invalidatesTags: ["Subscription"],
    }),
  }),
});

export const {
  useGetSubscriptionsQuery,
  useGetSubscriptionQuery,
  useCreateSubscriptionMutation,
  useUpdateSubscriptionMutation,
  useDeleteSubscriptionMutation,
  useSetDefaultPlanMutation,
} = subscriptionApi;