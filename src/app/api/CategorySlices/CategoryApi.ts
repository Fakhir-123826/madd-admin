// src/app/api/CategorySlices/CategoryApi.ts

import { createApi } from '@reduxjs/toolkit/query/react';
import dynamicBaseQuery from '../dynamicBaseQuery';

export interface Category {
  uuid: string;
  internal_id: number;
  magento_id: number;
  name: string;
  slug: string;
  description?: string;
  level: number;
  is_active: boolean;
  image_url?: string;
  position: number;
  include_in_menu: boolean;
  meta_title?: string;
  meta_description?: string;
  parent?: {
    uuid: string;
    name: string;
    slug: string;
  };
  created_at: string;
  updated_at: string;
}

export interface CategoryTree {
  uuid: string;
  name: string;
  slug: string;
  level: number;
  position: number;
  is_active: boolean;
  include_in_menu: boolean;
  children_count: number;
  children?: CategoryTree[];
}

export interface CategoryResponse {
  success: boolean;
  data: Category[];
  meta?: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

export interface CategoryTreeResponse {
  success: boolean;
  data: CategoryTree[];
}

export const categoryApi = createApi({
  reducerPath: 'categoryApi',
  baseQuery: dynamicBaseQuery,
  tagTypes: ['Category', 'CategoryTree', 'CategoryProducts'],
  endpoints: (builder) => ({
    // Get categories with filters
    getCategories: builder.query<
      CategoryResponse,
      {
        vendor_uuid: string;
        page?: number;
        per_page?: number;
        search?: string;
        is_active?: boolean;
        include_in_menu?: boolean;
        sort_by?: string;
        sort_order?: 'asc' | 'desc';
      }
    >({
      query: ({ vendor_uuid, ...params }) => {
        // Filter out undefined values
        const filteredParams: Record<string, any> = {};
        
        if (params.page !== undefined) filteredParams.page = params.page;
        if (params.per_page !== undefined) filteredParams.per_page = params.per_page;
        if (params.search !== undefined && params.search !== '') filteredParams.search = params.search;
        if (params.is_active !== undefined) filteredParams.is_active = params.is_active;
        if (params.include_in_menu !== undefined) filteredParams.include_in_menu = params.include_in_menu;
        if (params.sort_by !== undefined) filteredParams.sort_by = params.sort_by;
        if (params.sort_order !== undefined) filteredParams.sort_order = params.sort_order;
        
        return {
          url: `vendors/${vendor_uuid}/categories`,
          method: 'GET',
          params: filteredParams,
        };
      },
      providesTags: ['Category'],
    }),

    // Get category tree
    getCategoryTree: builder.query<
      CategoryTreeResponse,
      { vendor_uuid: string; depth?: number }
    >({
      query: ({ vendor_uuid, depth = 5 }) => ({
        url: `vendors/${vendor_uuid}/categories/tree`,
        method: 'GET',
        params: { depth },
      }),
      providesTags: ['CategoryTree'],
    }),

    // Get single category
    getCategory: builder.query<
      { success: boolean; data: Category },
      { vendor_uuid: string; uuid: string }
    >({
      query: ({ vendor_uuid, uuid }) => ({
        url: `vendors/${vendor_uuid}/categories/${uuid}`,
        method: 'GET',
      }),
      providesTags: ['Category'],
    }),

    // Get category products
    getCategoryProducts: builder.query<
      { success: boolean; data: any[]; category: any },
      { vendor_uuid: string; uuid: string }
    >({
      query: ({ vendor_uuid, uuid }) => ({
        url: `vendors/${vendor_uuid}/categories/${uuid}/products`,
        method: 'GET',
      }),
      providesTags: ['CategoryProducts'],
    }),

    // Create category
    createCategory: builder.mutation<
      { success: boolean; data: Category; message: string },
      { vendor_uuid: string; data: Partial<Category> }
    >({
      query: ({ vendor_uuid, data }) => ({
        url: `vendors/${vendor_uuid}/categories`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Category', 'CategoryTree'],
    }),

    // Update category
    updateCategory: builder.mutation<
      { success: boolean; data: Category; message: string },
      { vendor_uuid: string; uuid: string; data: Partial<Category> }
    >({
      query: ({ vendor_uuid, uuid, data }) => ({
        url: `vendors/${vendor_uuid}/categories/${uuid}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Category', 'CategoryTree'],
    }),

    // Delete category
    deleteCategory: builder.mutation<
      { success: boolean; message: string },
      { vendor_uuid: string; uuid: string }
    >({
      query: ({ vendor_uuid, uuid }) => ({
        url: `vendors/${vendor_uuid}/categories/${uuid}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category', 'CategoryTree'],
    }),

    // Sync all categories
    syncCategories: builder.mutation<
      { success: boolean; message: string; data: { synced_count: number } },
      { vendor_uuid: string }
    >({
      query: ({ vendor_uuid }) => ({
        url: `vendors/${vendor_uuid}/categories/sync`,
        method: 'POST',
      }),
      invalidatesTags: ['Category', 'CategoryTree'],
    }),

    // Sync single category by magento ID
    syncSingleCategory: builder.mutation<
      { success: boolean; message: string; data: Category },
      { vendor_uuid: string; magento_id: number }
    >({
      query: ({ vendor_uuid, magento_id }) => ({
        url: `vendors/${vendor_uuid}/categories/sync/${magento_id}`,
        method: 'POST',
      }),
      invalidatesTags: ['Category', 'CategoryTree'],
    }),

    // Assign product to category
    assignProductToCategory: builder.mutation<
      { success: boolean; message: string },
      { vendor_uuid: string; category_uuid: string; data: { sku: string; position?: number } }
    >({
      query: ({ vendor_uuid, category_uuid, data }) => ({
        url: `vendors/${vendor_uuid}/categories/${category_uuid}/products`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['CategoryProducts'],
    }),

    // Remove product from category
    removeProductFromCategory: builder.mutation<
      { success: boolean; message: string },
      { vendor_uuid: string; category_uuid: string; sku: string }
    >({
      query: ({ vendor_uuid, category_uuid, sku }) => ({
        url: `vendors/${vendor_uuid}/categories/${category_uuid}/products/${sku}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['CategoryProducts'],
    }),

    // Get category from Magento directly (bypass local cache)
    getMagentoCategory: builder.query<
      { success: boolean; data: any },
      { vendor_uuid: string; magento_id: number }
    >({
      query: ({ vendor_uuid, magento_id }) => ({
        url: `vendors/${vendor_uuid}/categories/magento/${magento_id}`,
        method: 'GET',
      }),
      providesTags: ['Category'],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryTreeQuery,
  useGetCategoryQuery,
  useGetCategoryProductsQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useSyncCategoriesMutation,
  useSyncSingleCategoryMutation,
  useAssignProductToCategoryMutation,
  useRemoveProductFromCategoryMutation,
  useGetMagentoCategoryQuery,
} = categoryApi;