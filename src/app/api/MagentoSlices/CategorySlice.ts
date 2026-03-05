import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../baseQueryWithAuth";

export interface MagentoCategory {
  id?: number;
  name: string;
  parent_id?: number;
  is_active?: boolean;
  position?: number;
  level?: number;
    children_data?: MagentoCategory[];
}


export const magentoCategoryApi = createApi({
  reducerPath: "magentoCategoryApi",

  baseQuery: baseQueryWithAuth,

  tagTypes: ["Categories"],

  endpoints: (builder) => ({
    // ✅ Get All Categories
    getCategories: builder.query<MagentoCategory[], void>({
      query: () => "categories",
      providesTags: ["Categories"],
    }),

    // ✅ Get Category By ID
    getCategoryById: builder.query<MagentoCategory, number>({
      query: (id) => `categories/${id}`,
    }),

    // ✅ Create Category
    createCategory: builder.mutation<MagentoCategory, Partial<MagentoCategory>>({
      query: (body) => ({
        url: "categories",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Categories"],
    }),

    // ✅ Update Category
    updateCategory: builder.mutation<
      MagentoCategory,
      { id: number; data: Partial<MagentoCategory> }
    >({
      query: ({ id, data }) => ({
        url: `categories/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Categories"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} = magentoCategoryApi;