import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// ✅ Customer type
export interface MagentoCustomer {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  group_id?: number;
  is_active?: boolean;
  [key: string]: any; // extra fields
}

// ✅ RTK Query API slice
export const magentoCustomerApi = createApi({
  reducerPath: "magentoCustomerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:8000/api/",
  }),
  tagTypes: ["Customers"],
  endpoints: (builder) => ({
    // Get all customers
    getCustomers: builder.query<MagentoCustomer[], void>({
      query: () => "magento/customers",
      providesTags: ["Customers"],
    }),

    // Get customer by ID
    getCustomerById: builder.query<MagentoCustomer, number>({
      query: (id) => `magento/customers/${id}`,
      providesTags: (result, error, id) => [{ type: "Customers", id }],
    }),

    // Create customer
    createCustomer: builder.mutation<MagentoCustomer, Partial<MagentoCustomer>>({
      query: (body) => ({
        url: "magento/customers",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Customers"],
    }),

    // Update customer
    updateCustomer: builder.mutation<
      MagentoCustomer,
      { id: number; data: Partial<MagentoCustomer> }
    >({
      query: ({ id, data }) => ({
        url: `magento/customers/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Customers", id }],
    }),

    // Delete customer
    deleteCustomer: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `magento/customers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Customers", id }],
    }),
  }),
});

// ✅ Export hooks
export const {
  useGetCustomersQuery,
  useGetCustomerByIdQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = magentoCustomerApi;