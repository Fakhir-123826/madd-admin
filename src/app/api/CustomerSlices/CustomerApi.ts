// src/store/slices/customer/customerApi.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseURL = import.meta.env.VITE_BASE_URL;

// Types
export interface CustomerAddress {
  id?: number;
  uuid?: string;
  magento_id?: string;
  firstname: string;
  lastname: string;
  company?: string;
  street: string;
  city: string;
  region?: string;
  postcode: string;
  country_id: string;
  telephone: string;
  fax?: string;
  is_default_billing: boolean;
  is_default_shipping: boolean;
}

export interface Customer {
  id: number;
  uuid: string;
  vendor_id: number;
  magento_id: string;
  email: string;
  firstname: string;
  lastname: string;
  full_name: string;
  is_active: boolean;
  is_subscribed: boolean;
  dob?: string;
  gender?: 'male' | 'female' | 'other';
  phone?: string;
  group_id?: string;
  created_at: string;
  updated_at: string;
  addresses?: CustomerAddress[];
}

export interface CustomerListResponse {
  success: boolean;
  data: Customer[];
  vendor: {
    uuid: string;
    name: string;
  };
  meta?: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

export interface CustomerResponse {
  success: boolean;
  data: Customer;
  message?: string;
}

export interface Vendor {
  id: number;
  uuid: string;
  name: string;
  email: string;
  store_slug: string;
  status?: string;
}

export const customerApi = createApi({
  reducerPath: 'customerApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseURL}/admin`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      headers.set('Accept', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Customers', 'Customer'],
  endpoints: (builder) => ({
    // Get all vendors for dropdown
    getVendors: builder.query<Vendor[], void>({
      query: () => '/vendors',
      transformResponse: (response: any) => {
        console.log('Vendors API response:', response);
        if (response.success && Array.isArray(response.data)) {
          return response.data;
        }
        return [];
      },
    }),

    // Get all customers with filters
    getCustomers: builder.query<any, any>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.per_page) queryParams.append('per_page', params.per_page.toString());
        if (params.search) queryParams.append('search', params.search);
        if (params.is_active !== undefined) queryParams.append('is_active', String(params.is_active));
        if (params.is_subscribed !== undefined) queryParams.append('is_subscribed', String(params.is_subscribed));
        if (params.sort_by) queryParams.append('sort_by', params.sort_by);
        if (params.sort_order) queryParams.append('sort_order', params.sort_order);
        
        return `/vendors/${params.vendor_uuid}/customers?${queryParams.toString()}`;
      },
      providesTags: (result) => 
        result?.data
          ? [
              ...result.data.map(({ uuid }: any) => ({ type: 'Customers' as const, id: uuid })),
              { type: 'Customers', id: 'LIST' },
            ]
          : [{ type: 'Customers', id: 'LIST' }],
    }),

    // Get single customer
    getCustomer: builder.query<CustomerResponse, { vendor_uuid: string; uuid: string }>({
      query: ({ vendor_uuid, uuid }) => `/vendors/${vendor_uuid}/customers/${uuid}`,
      providesTags: (result, error, { uuid }) => [{ type: 'Customer', id: uuid }],
    }),

    // Create customer
    createCustomer: builder.mutation<any, any>({
      query: ({ vendor_uuid, data }) => ({
        url: `/vendors/${vendor_uuid}/customers`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Customers', id: 'LIST' }],
    }),

    // Update customer
    updateCustomer: builder.mutation<any, any>({
      query: ({ vendor_uuid, uuid, data }) => ({
        url: `/vendors/${vendor_uuid}/customers/${uuid}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { uuid }) => [
        { type: 'Customer', id: uuid },
        { type: 'Customers', id: 'LIST' },
      ],
    }),

    // Delete customer
    deleteCustomer: builder.mutation<any, any>({
      query: ({ vendor_uuid, uuid }) => ({
        url: `/vendors/${vendor_uuid}/customers/${uuid}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { uuid }) => [
        { type: 'Customer', id: uuid },
        { type: 'Customers', id: 'LIST' },
      ],
    }),

    // Sync customers from Magento
    syncCustomers: builder.mutation<any, any>({
      query: ({ vendor_uuid }) => ({
        url: `/vendors/${vendor_uuid}/customers/sync`,
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'Customers', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetVendorsQuery,
  useGetCustomersQuery,
  useGetCustomerQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  useSyncCustomersMutation,
} = customerApi;