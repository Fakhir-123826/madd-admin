import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Subscription } from '../../../model/susbcription/ISubscription'

const baseURL = import.meta.env.VITE_BASE_URL

export const subscriptionApi = createApi({
  reducerPath: 'subscriptionApi',

  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token')
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),

  tagTypes: ['Subscription'],

  endpoints: (builder) => ({
    // ================= GET ALL PLANS =================
    getSubscriptions: builder.query<Subscription[], void>({
      query: () => ({
        url: 'admin/plans',
        method: 'GET',
      }),
      providesTags: ['Subscription'],
    }),

    // ================= GET SINGLE PLAN =================
    getSubscription: builder.query<Subscription, number>({
      query: (id) => ({
        url: `admin/plans/${id}`,
        method: 'GET',
      }),
      providesTags: ['Subscription'],
    }),

    // ================= CREATE PLAN =================
    createSubscription: builder.mutation<
      Subscription,
      Partial<Subscription>
    >({
      query: (data) => ({
        url: 'admin/plans',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Subscription'],
    }),

    // ================= UPDATE PLAN =================
    updateSubscription: builder.mutation<
      Subscription,
      { id: number; data: Partial<Subscription> }
    >({
      query: ({ id, data }) => ({
        url: `admin/plans/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Subscription'],
    }),

    // ================= DELETE PLAN =================
    deleteSubscription: builder.mutation<void, number>({
      query: (id) => ({
        url: `admin/plans/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Subscription'],
    }),

    // ================= SET DEFAULT PLAN =================
    setDefaultPlan: builder.mutation<void, number>({
      query: (id) => ({
        url: `admin/plans/${id}/set-default`,
        method: 'POST',
      }),
      invalidatesTags: ['Subscription'],
    }),
  }),
})

export const {
  useGetSubscriptionsQuery,
  useGetSubscriptionQuery,
  useCreateSubscriptionMutation,
  useUpdateSubscriptionMutation,
  useDeleteSubscriptionMutation,
  useSetDefaultPlanMutation,
} = subscriptionApi