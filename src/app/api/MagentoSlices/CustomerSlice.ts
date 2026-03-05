import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../baseQueryWithAuth";

export interface MagentoCustomer {
  id?: number;
  firstname: string;   // ✅ fix - pehle first_name tha
  lastname: string;    // ✅ fix - pehle last_name tha
  email: string;
  group_id?: number;
  is_active?: boolean;
  [key: string]: any;
}

export interface MagentoCustomerResponse {
  items: MagentoCustomer[];
  total_count: number;
}

// ✅ CustomerFilter ke saath match karta hai
export interface CustomerFilters {
  idFrom?: string;
  idTo?: string;
  customerSinceFrom?: string;
  customerSinceTo?: string;
  dateOfBirthFrom?: string;
  dateOfBirthTo?: string;
  name?: string;
  email?: string;
  phone?: string;
  zip?: string;
  stateProvince?: string;
  taxVatNumber?: string;
  group?: string;
  country?: string;
  webSite?: string;
  gender?: string;
}

export const magentoCustomerApi = createApi({
  reducerPath: "magentoCustomerApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Customers"],
  endpoints: (builder) => ({

    // ✅ GET CUSTOMERS WITH FILTERS
    getCustomers: builder.query<
      MagentoCustomerResponse,
      { filters?: CustomerFilters; page?: number; pageSize?: number } | void
    >({
      query: (params) => {
        const { filters = {}, page = 1, pageSize = 10 } = params || {};

        const body: Record<string, any> = { page, pageSize, filters: {} };

        // ID range
        if (filters.idFrom || filters.idTo) {
          body.filters.entity_id = {};
          if (filters.idFrom) body.filters.entity_id.from = Number(filters.idFrom);
          if (filters.idTo) body.filters.entity_id.to = Number(filters.idTo);
        }

        // Customer Since
        if (filters.customerSinceFrom || filters.customerSinceTo) {
          body.filters.created_at = {};
          if (filters.customerSinceFrom) body.filters.created_at.from = filters.customerSinceFrom;
          if (filters.customerSinceTo) body.filters.created_at.to = filters.customerSinceTo;
        }

        // Date of Birth
        if (filters.dateOfBirthFrom || filters.dateOfBirthTo) {
          body.filters.dob = {};
          if (filters.dateOfBirthFrom) body.filters.dob.from = filters.dateOfBirthFrom;
          if (filters.dateOfBirthTo) body.filters.dob.to = filters.dateOfBirthTo;
        }

        // Text filters
        if (filters.name) body.filters.firstname = { like: `%${filters.name}%` };
        if (filters.email) body.filters.email = { like: `%${filters.email}%` };
        if (filters.taxVatNumber) body.filters.taxvat = { like: `%${filters.taxVatNumber}%` };

        // Exact filters
        if (filters.group) body.filters.group_id = { eq: Number(filters.group) };
        if (filters.webSite) body.filters.website_id = { eq: Number(filters.webSite) };
        if (filters.gender) body.filters.gender = { eq: filters.gender };

        return {
          url: "customers/search",  // ✅ POST request
          method: "POST",
          body,
        };
      },
      providesTags: ["Customers"],
    }),

    getCustomerById: builder.query<MagentoCustomer, number>({
      query: (id) => `customers/${id}`,
      providesTags: (result, error, id) => [{ type: "Customers", id }],
    }),

    createCustomer: builder.mutation<MagentoCustomer, Partial<MagentoCustomer>>({
      query: (body) => ({
        url: "customers",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Customers"],
    }),

    updateCustomer: builder.mutation<MagentoCustomer, { id: number; data: Partial<MagentoCustomer> }>({
      query: ({ id, data }) => ({
        url: `customers/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Customers", id }],
    }),

    deleteCustomer: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `customers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Customers", id }],
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useGetCustomerByIdQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = magentoCustomerApi;