import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const subscriptionApi = createApi({
  reducerPath: 'subscriptionApi',

  baseQuery: fetchBaseQuery({
    baseUrl: 'http://127.0.0.1:8000/api/',
  }),

  tagTypes: ['Subscription'],

  endpoints: (builder) => ({
    // GET all subscriptions
    getSubscriptions: builder.query<any, void>({
      query: () => 'subscriptions',
      providesTags: ['Subscription'],
    }),

    // GET single subscription
    getSubscription: builder.query<any, number>({
      query: (id) => `subscriptions/${id}`,
      providesTags: ['Subscription'],
    }),

    // CREATE subscription
    createSubscription: builder.mutation<any, any>({
      query: (data) => ({
        url: 'subscriptions',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Subscription'],
    }),

    // UPDATE subscription
    updateSubscription: builder.mutation<any, { id: number; data: any }>({
      query: ({ id, data }) => ({
        url: `subscriptions/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Subscription'],
    }),

    // DELETE subscription
    deleteSubscription: builder.mutation<any, number>({
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
