import {
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import type { Subscription } from "../../../model/susbcription/ISubscription";

const baseURL = import.meta.env.VITE_BASE_URL;

const rawBaseQuery = fetchBaseQuery({
  baseUrl: baseURL,

  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    headers.set("Accept", "application/json");

    return headers;
  },
});

const baseQueryWithAuthCheck: typeof rawBaseQuery = async (
  args,
  api,
  extraOptions
) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  // If token expired / unauthorized
  if (result.error && result.error.status === 401) {
    localStorage.removeItem("token");

    // redirect to login page
    window.location.href = "/login";
  }

  return result;
};

export const subscriptionApi = createApi({
  reducerPath: "subscriptionApi",

  baseQuery: baseQueryWithAuthCheck,

  tagTypes: ["Subscription"],

  endpoints: (builder) => ({
    getSubscriptions: builder.query<Subscription[], void>({
      query: () => ({
        url: "admin/plans",
        method: "GET",
      }),
      providesTags: ["Subscription"],
    }),

    getSubscription: builder.query<Subscription, number>({
      query: (id) => ({
        url: `admin/plans/${id}`,
        method: "GET",
      }),
      providesTags: ["Subscription"],
    }),

    createSubscription: builder.mutation<
      Subscription,
      Partial<Subscription>
    >({
      query: (data) => ({
        url: "admin/plans",
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
        url: `admin/plans/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Subscription"],
    }),

    deleteSubscription: builder.mutation<void, number>({
      query: (id) => ({
        url: `admin/plans/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Subscription"],
    }),

    setDefaultPlan: builder.mutation<void, number>({
      query: (id) => ({
        url: `admin/plans/${id}/set-default`,
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