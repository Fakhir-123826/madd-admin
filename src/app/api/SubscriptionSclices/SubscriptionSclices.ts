import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Subscription } from '../../../model/susbcription/ISubscription'

export const subscriptionApi = createApi({
  reducerPath: 'subscriptionApi',

  baseQuery: fetchBaseQuery({
    baseUrl: 'http://127.0.0.1:8000/api/',
  }),

  tagTypes: ['Subscription'],

  endpoints: (builder) => ({
    // ✅ GET all subscriptions
    getSubscriptions: builder.query<Subscription[], void>({
      query: () => 'subscriptions',
      providesTags: ['Subscription'],
    }),

    // GET single subscription
    getSubscription: builder.query<Subscription, number>({
      query: (id) => `subscriptions/${id}`,
      providesTags: ['Subscription'],
    }),

    // CREATE subscription
    createSubscription: builder.mutation<Subscription, Partial<Subscription>>({
      query: (data) => ({
        url: 'subscriptions',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Subscription'],
    }),

    // UPDATE subscription
    updateSubscription: builder.mutation<
      Subscription,
      { id: number; data: Partial<Subscription> }
    >({
      query: ({ id, data }) => ({
        url: `subscriptions/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Subscription'],
    }),

    // DELETE subscription
    deleteSubscription: builder.mutation<void, number>({
      query: (id) => ({
        url: `subscriptions/${id}`,
        method: 'DELETE',
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
} = subscriptionApi
