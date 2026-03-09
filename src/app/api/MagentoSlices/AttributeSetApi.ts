import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../baseQueryWithAuth";

// ============ INTERFACES ============

export interface AttributeSet {
    attribute_set_id: number;
    attribute_set_name: string;
    sort_order: number;
    entity_type_id: number;
}

export interface AttributeSetListData {
    items: AttributeSet[];
    total_count: number;
    search_criteria: {
        filter_groups: any[];
        page_size: number;
        current_page: number;
    };
}

export interface AttributeSetApiResponse {
    success: boolean;
    status: number;
    message: string;
    data: AttributeSetListData;
}

export interface SingleAttributeSetApiResponse {
    success: boolean;
    status: number;
    message: string;
    data: AttributeSet;
}

export interface CreateAttributeSetPayload {
    attribute_set_name: string;
    entity_type_code?: string;
    sort_order?: number;
    entity_type_id?: number;
    skeleton_id?: number;
}

export interface UpdateAttributeSetPayload {
    attributeSet: {
        attribute_set_name: string;
        sort_order?: number;
        entity_type_id?: number;
    };
}

// ============ API SLICE ============

export const attributeSetApi = createApi({
    reducerPath: "attributeSetApi",
    baseQuery: baseQueryWithAuth,
    tagTypes: ["AttributeSet"],
    endpoints: (builder) => ({

        // GET /attribute-sets?page=1&pageSize=10
        getAttributeSets: builder.query<AttributeSetApiResponse, { page?: number; pageSize?: number } | void>({
            query: (params) => {
                const { page = 1, pageSize = 10 } = params || {};
                return `attribute-sets?currentPage=${page}&pageSize=${pageSize}`;
            },
            // ✅ HTTP status + internal status dono check
            transformResponse: (response: AttributeSetApiResponse) => {
                if (!response.success || response.status !== 200) {
                    throw new Error(response.message || "Failed to fetch attribute sets");
                }
                return response;
            },
            providesTags: ["AttributeSet"],
        }),

        // GET /attribute-sets/{id}
        getAttributeSet: builder.query<SingleAttributeSetApiResponse, number>({
            query: (id) => `attribute-sets/${id}`,
            transformResponse: (response: SingleAttributeSetApiResponse) => {
                if (!response.success || response.status !== 200) {
                    throw new Error(response.message || "Failed to fetch attribute set");
                }
                return response;
            },
            providesTags: (result, error, id) => [{ type: "AttributeSet", id }],
        }),

        // POST /attribute-sets
        createAttributeSet: builder.mutation<SingleAttributeSetApiResponse, CreateAttributeSetPayload>({
            query: (payload) => ({
                url: "attribute-sets",
                method: "POST",
                body: {
                    attribute_set_name: payload.attribute_set_name,
                    entity_type_code: payload.entity_type_code ?? "catalog_product",
                    sort_order: payload.sort_order ?? 0,
                    entity_type_id: payload.entity_type_id ?? 0,
                    skeleton_id: payload.skeleton_id ?? 4,
                },
            }),
            invalidatesTags: ["AttributeSet"],
        }),

        // PUT /attribute-sets/{id}
        updateAttributeSet: builder.mutation<SingleAttributeSetApiResponse, { id: number; payload: UpdateAttributeSetPayload }>({
            query: ({ id, payload }) => ({
                url: `attribute-sets/${id}`,
                method: "PUT",
                body: payload,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "AttributeSet", id }, "AttributeSet"],
        }),

        // DELETE /attribute-sets/{id}
        deleteAttributeSet: builder.mutation<{ success: boolean }, number>({
            query: (id) => ({
                url: `attribute-sets/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["AttributeSet"],
        }),

    }),
});

export const {
    useGetAttributeSetsQuery,
    useGetAttributeSetQuery,
    useCreateAttributeSetMutation,
    useUpdateAttributeSetMutation,
    useDeleteAttributeSetMutation,
} = attributeSetApi;