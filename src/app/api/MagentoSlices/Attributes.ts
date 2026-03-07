import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../baseQueryWithAuth";

// ============ INTERFACES ============
export interface AttributeOption {
    label: string;
    value: string;
}

export interface MagentoAttribute {
    attribute_id?: number;
    attribute_code: string;
    frontend_input?: string;
    entity_type_id?: string;
    is_required?: boolean;
    options?: AttributeOption[];
    is_user_defined?: boolean;
    default_frontend_label?: string;
    frontend_labels?: any[];
    backend_type?: string;
    is_unique?: string;
    validation_rules?: any[];
}

export interface AttributeListResponse {
    items: MagentoAttribute[];
    total_count: number;
}

// Wrapper response
export interface AttributeApiResponse {
    success: boolean;
    status: number;
    message: string;
    data: AttributeListResponse;
}
// ============ API SLICE ============
export const attributeApi = createApi({
    reducerPath: "attributeApi",
    baseQuery: baseQueryWithAuth,
    tagTypes: ["Attribute"],
    endpoints: (builder) => ({

        // GET /attributes?page=1&pageSize=10
        getAttributes: builder.query<AttributeApiResponse, { page?: number; pageSize?: number } | void>({
            query: (params) => {
                const { page = 1, pageSize = 10 } = params || {};
                return `attributes?page=${page}&pageSize=${pageSize}`;
            },
            providesTags: ["Attribute"],
        }),

        // GET /attributes/{attribute_code}
        getAttribute: builder.query<MagentoAttribute, string>({
            query: (attribute_code) => `attributes/${attribute_code}`,
            providesTags: (result, error, attribute_code) => [{ type: "Attribute", id: attribute_code }],
        }),

        // GET /attributes/{attribute_code}/options
        getAttributeOptions: builder.query<AttributeOption[], string>({
            query: (attribute_code) => `attributes/${attribute_code}/options`,
            providesTags: (result, error, attribute_code) => [{ type: "Attribute", id: attribute_code }],
        }),

        // POST /attributes
        createAttribute: builder.mutation<MagentoAttribute, Partial<MagentoAttribute>>({
            query: (attribute) => ({
                url: "attributes",
                method: "POST",
                body: attribute,
            }),
            invalidatesTags: ["Attribute"],
        }),

        // PUT /attributes/{attribute_code}
        updateAttribute: builder.mutation<MagentoAttribute, { attribute_code: string; attribute: Partial<MagentoAttribute> }>({
            query: ({ attribute_code, attribute }) => ({
                url: `attributes/${attribute_code}`,
                method: "PUT",
                body: attribute,
            }),
            invalidatesTags: (result, error, { attribute_code }) => [{ type: "Attribute", id: attribute_code }],
        }),

        // DELETE /attributes/{attribute_code}
        deleteAttribute: builder.mutation<{ success: boolean }, string>({
            query: (attribute_code) => ({
                url: `attributes/${attribute_code}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, attribute_code) => [{ type: "Attribute", id: attribute_code }],
        }),

    }),
});

export const {
    useGetAttributesQuery,
    useGetAttributeQuery,
    useGetAttributeOptionsQuery,
    useCreateAttributeMutation,
    useUpdateAttributeMutation,
    useDeleteAttributeMutation,
} = attributeApi;