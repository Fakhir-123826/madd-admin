// app/api/AttributeSetSlices/AttributeSetApi.ts

import { createApi } from '@reduxjs/toolkit/query/react';
import { dynamicBaseQuery } from '../dynamicBaseQuery';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface AttributeSet {
    id: string;
    uuid: string;
    vendor_id: number;
    magento_attr_set_id: number | null;
    attribute_set_name: string;
    sort_order: number;
    entity_type_id: number;
    magento_entity_type_code: string;
    description: string | null;
    assigned_attribute_ids: number[] | null;
    attribute_group_data: any[] | null;
    last_synced_at: string | null;
    sync_status: 'pending' | 'synced' | 'failed' | 'local_only';
    sync_error_message: string | null;
    sync_attempts: number;
    is_active: boolean;
    local_display_name: string | null;
    local_notes: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    attribute_count?: number;
}

export interface AttributeGroup {
    attribute_group_id: number;
    attribute_group_name: string;
    attribute_set_id: number;
    sort_order: number;
    default_id: number | null;
    default_title: string | null;
}

export interface AssignedAttribute {
    attribute_id: number;
    attribute_code: string;
    frontend_label: string;
    sort_order: number;
}

export interface AttributeSetDetails {
    attribute_set: AttributeSet;
    attributes: AssignedAttribute[];
    groups: AttributeGroup[];
}

export interface GetAttributeSetsQueryParams {
    vendor_uuid: string;
    page?: number;
    per_page?: number;
    search?: string;
    sync_status?: 'pending' | 'synced' | 'failed' | 'local_only';
    is_active?: boolean;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
}

export interface CreateAttributeSetData {
    attribute_set_name: string;
    sort_order?: number;
    entity_type_id?: number;
    description?: string;
    assigned_attribute_ids?: number[];
    attribute_group_data?: any[];
    sync_to_magento?: boolean;
    is_active?: boolean;
    local_display_name?: string;
    local_notes?: string;
}

export interface UpdateAttributeSetData {
    attribute_set_name?: string;
    sort_order?: number;
    description?: string;
    assigned_attribute_ids?: number[];
    attribute_group_data?: any[];
    is_active?: boolean;
    local_display_name?: string;
    local_notes?: string;
    sync_to_magento?: boolean;
}

export interface AssignAttributeData {
    attribute_id: number;
    attribute_group_id: number;
    sort_order?: number;
}

export interface CreateAttributeGroupData {
    attribute_group_name: string;
    sort_order?: number;
}

export interface ApiResponse<T = any> {
    success: boolean;
    data: T;
    message?: string;
    error?: string;
    sync_result?: any;
    meta?: {
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// API Slice
// ─────────────────────────────────────────────────────────────────────────────

export const attributeSetApi = createApi({
    reducerPath: 'attributeSetApi',
    baseQuery: dynamicBaseQuery,
    tagTypes: ['AttributeSet', 'AttributeSetDetail', 'AttributeSetAttributes', 'AttributeSetGroups'],
    
    endpoints: (builder) => ({
        
        // ─────────────────────────────────────────────────────────────────────
        // GET: List all attribute sets for a vendor
        // URL: /attribute-sets/{vendorUuid}
        // ─────────────────────────────────────────────────────────────────────
        getAttributeSets: builder.query<ApiResponse<AttributeSet[]>, GetAttributeSetsQueryParams>({
            query: ({ vendor_uuid, page = 1, per_page = 15, search, sync_status, is_active, sort_by = 'created_at', sort_order = 'desc' }) => {
                const params = new URLSearchParams();
                params.append('page', page.toString());
                params.append('per_page', per_page.toString());
                if (search) params.append('search', search);
                if (sync_status) params.append('sync_status', sync_status);
                if (is_active !== undefined) params.append('is_active', is_active.toString());
                if (sort_by) params.append('sort_by', sort_by);
                if (sort_order) params.append('sort_order', sort_order);
                
                return {
                    url: `attribute-sets/${vendor_uuid}?${params.toString()}`,
                    method: 'GET',
                };
            },
            providesTags: (result) => 
                result?.data
                    ? [
                        ...result.data.map(({ id }) => ({ type: 'AttributeSet' as const, id })),
                        { type: 'AttributeSet', id: 'LIST' },
                      ]
                    : [{ type: 'AttributeSet', id: 'LIST' }],
        }),

        // ─────────────────────────────────────────────────────────────────────
        // GET: Single attribute set by ID
        // URL: /attribute-sets/{vendorUuid}/{id}
        // ─────────────────────────────────────────────────────────────────────
        getAttributeSet: builder.query<ApiResponse<AttributeSet>, { vendor_uuid: string; id: string }>({
            query: ({ vendor_uuid, id }) => ({
                url: `attribute-sets/${vendor_uuid}/${id}`,
                method: 'GET',
            }),
            providesTags: (result, error, { id }) => [{ type: 'AttributeSetDetail', id }],
        }),

        // ─────────────────────────────────────────────────────────────────────
        // GET: Attribute set with full details (including attributes and groups)
        // URL: /attribute-sets/{vendorUuid}/{id}/details
        // ─────────────────────────────────────────────────────────────────────
        getAttributeSetDetails: builder.query<ApiResponse<AttributeSetDetails>, { vendor_uuid: string; id: string }>({
            query: ({ vendor_uuid, id }) => ({
                url: `attribute-sets/${vendor_uuid}/${id}/details`,
                method: 'GET',
            }),
            providesTags: (result, error, { id }) => [
                { type: 'AttributeSetDetail', id },
                { type: 'AttributeSetAttributes', id },
                { type: 'AttributeSetGroups', id },
            ],
        }),

        // ─────────────────────────────────────────────────────────────────────
        // GET: Get all attributes assigned to an attribute set
        // URL: /attribute-sets/{vendorUuid}/{id}/attributes
        // ─────────────────────────────────────────────────────────────────────
        getAttributeSetAttributes: builder.query<ApiResponse<AssignedAttribute[]>, { vendor_uuid: string; id: string }>({
            query: ({ vendor_uuid, id }) => ({
                url: `attribute-sets/${vendor_uuid}/${id}/attributes`,
                method: 'GET',
            }),
            providesTags: (result, error, { id }) => [{ type: 'AttributeSetAttributes', id }],
        }),

        // ─────────────────────────────────────────────────────────────────────
        // GET: Get all groups in an attribute set
        // URL: /attribute-sets/{vendorUuid}/{id}/groups
        // ─────────────────────────────────────────────────────────────────────
        getAttributeSetGroups: builder.query<ApiResponse<AttributeGroup[]>, { vendor_uuid: string; id: string }>({
            query: ({ vendor_uuid, id }) => ({
                url: `attribute-sets/${vendor_uuid}/${id}/groups`,
                method: 'GET',
            }),
            providesTags: (result, error, { id }) => [{ type: 'AttributeSetGroups', id }],
        }),

        // ─────────────────────────────────────────────────────────────────────
        // POST: Create new attribute set
        // URL: /attribute-sets/{vendorUuid}
        // ─────────────────────────────────────────────────────────────────────
        createAttributeSet: builder.mutation<ApiResponse<AttributeSet>, { vendor_uuid: string; data: CreateAttributeSetData }>({
            query: ({ vendor_uuid, data }) => ({
                url: `attribute-sets/${vendor_uuid}`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [{ type: 'AttributeSet', id: 'LIST' }],
        }),

        // ─────────────────────────────────────────────────────────────────────
        // PUT: Update attribute set
        // URL: /attribute-sets/{vendorUuid}/{id}
        // ─────────────────────────────────────────────────────────────────────
        updateAttributeSet: builder.mutation<ApiResponse<AttributeSet>, { vendor_uuid: string; id: string; data: UpdateAttributeSetData }>({
            query: ({ vendor_uuid, id, data }) => ({
                url: `attribute-sets/${vendor_uuid}/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'AttributeSet', id: 'LIST' },
                { type: 'AttributeSetDetail', id },
            ],
        }),

        // ─────────────────────────────────────────────────────────────────────
        // DELETE: Delete attribute set (soft delete)
        // URL: /attribute-sets/{vendorUuid}/{id}
        // ─────────────────────────────────────────────────────────────────────
        deleteAttributeSet: builder.mutation<ApiResponse<void>, { vendor_uuid: string; id: string; delete_from_magento?: boolean }>({
            query: ({ vendor_uuid, id, delete_from_magento }) => ({
                url: `attribute-sets/${vendor_uuid}/${id}`,
                method: 'DELETE',
                params: { delete_from_magento: delete_from_magento || false },
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'AttributeSet', id: 'LIST' },
                { type: 'AttributeSetDetail', id },
            ],
        }),

        // ─────────────────────────────────────────────────────────────────────
        // POST: Sync single attribute set from Magento by ID
        // URL: /attribute-sets/{vendorUuid}/sync-from-magento/{magentoAttrSetId}
        // ─────────────────────────────────────────────────────────────────────
        syncSingleAttributeSet: builder.mutation<ApiResponse<AttributeSet>, { vendor_uuid: string; magentoAttrSetId: number }>({
            query: ({ vendor_uuid, magentoAttrSetId }) => ({
                url: `attribute-sets/${vendor_uuid}/sync-from-magento/${magentoAttrSetId}`,
                method: 'POST',
            }),
            invalidatesTags: [{ type: 'AttributeSet', id: 'LIST' }],
        }),

        // ─────────────────────────────────────────────────────────────────────
        // POST: Bulk sync attribute sets from Magento
        // URL: /attribute-sets/{vendorUuid}/bulk-sync
        // ─────────────────────────────────────────────────────────────────────
        syncAttributeSets: builder.mutation<ApiResponse<{ synced_count: number; errors?: any[] }>, { vendor_uuid: string }>({
            query: ({ vendor_uuid }) => ({
                url: `attribute-sets/${vendor_uuid}/bulk-sync`,
                method: 'POST',
            }),
            invalidatesTags: [{ type: 'AttributeSet', id: 'LIST' }],
        }),

        // ─────────────────────────────────────────────────────────────────────
        // POST: Push local attribute set to Magento
        // URL: /attribute-sets/{vendorUuid}/{id}/push-to-magento
        // ─────────────────────────────────────────────────────────────────────
        pushToMagento: builder.mutation<
            ApiResponse<{ success: boolean; action: string; magento_attr_set_id: number }>,
            { vendor_uuid: string; id: string }
        >({
            query: ({ vendor_uuid, id }) => ({
                url: `attribute-sets/${vendor_uuid}/${id}/push-to-magento`,
                method: 'POST',
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'AttributeSet', id: 'LIST' },
                { type: 'AttributeSetDetail', id },
            ],
        }),

        // ─────────────────────────────────────────────────────────────────────
        // POST: Assign attribute to attribute set
        // URL: /attribute-sets/{vendorUuid}/{id}/assign-attribute
        // ─────────────────────────────────────────────────────────────────────
        assignAttributeToSet: builder.mutation<
            ApiResponse<AssignedAttribute>, 
            { vendor_uuid: string; id: string; data: AssignAttributeData }
        >({
            query: ({ vendor_uuid, id, data }) => ({
                url: `attribute-sets/${vendor_uuid}/${id}/assign-attribute`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'AttributeSetAttributes', id },
                { type: 'AttributeSetDetail', id },
            ],
        }),

        // ─────────────────────────────────────────────────────────────────────
        // DELETE: Remove attribute from attribute set
        // URL: /attribute-sets/{vendorUuid}/{id}/remove-attribute/{attributeId}
        // ─────────────────────────────────────────────────────────────────────
        removeAttributeFromSet: builder.mutation<
            ApiResponse<void>, 
            { vendor_uuid: string; id: string; attributeId: number }
        >({
            query: ({ vendor_uuid, id, attributeId }) => ({
                url: `attribute-sets/${vendor_uuid}/${id}/remove-attribute/${attributeId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'AttributeSetAttributes', id },
                { type: 'AttributeSetDetail', id },
            ],
        }),

        // ─────────────────────────────────────────────────────────────────────
        // POST: Create attribute group
        // URL: /attribute-sets/{vendorUuid}/{attributeSetId}/groups
        // ─────────────────────────────────────────────────────────────────────
        createAttributeGroup: builder.mutation<
            ApiResponse<AttributeGroup>,
            { vendor_uuid: string; attributeSetId: string; data: CreateAttributeGroupData }
        >({
            query: ({ vendor_uuid, attributeSetId, data }) => ({
                url: `attribute-sets/${vendor_uuid}/${attributeSetId}/groups`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: (result, error, { attributeSetId }) => [
                { type: 'AttributeSetGroups', id: attributeSetId },
                { type: 'AttributeSetDetail', id: attributeSetId },
            ],
        }),

        // ─────────────────────────────────────────────────────────────────────
        // PUT: Update attribute group
        // URL: /attribute-sets/{vendorUuid}/{attributeSetId}/groups/{groupId}
        // ─────────────────────────────────────────────────────────────────────
        updateAttributeGroup: builder.mutation<
            ApiResponse<AttributeGroup>,
            { vendor_uuid: string; attributeSetId: string; groupId: number; name: string; sortOrder?: number }
        >({
            query: ({ vendor_uuid, attributeSetId, groupId, name, sortOrder }) => ({
                url: `attribute-sets/${vendor_uuid}/${attributeSetId}/groups/${groupId}`,
                method: 'PUT',
                body: { name, sort_order: sortOrder },
            }),
            invalidatesTags: (result, error, { attributeSetId }) => [
                { type: 'AttributeSetGroups', id: attributeSetId },
                { type: 'AttributeSetDetail', id: attributeSetId },
            ],
        }),

        // ─────────────────────────────────────────────────────────────────────
        // DELETE: Delete attribute group
        // URL: /attribute-sets/{vendorUuid}/{attributeSetId}/groups/{groupId}
        // ─────────────────────────────────────────────────────────────────────
        deleteAttributeGroup: builder.mutation<
            ApiResponse<void>,
            { vendor_uuid: string; attributeSetId: string; groupId: number }
        >({
            query: ({ vendor_uuid, attributeSetId, groupId }) => ({
                url: `attribute-sets/${vendor_uuid}/${attributeSetId}/groups/${groupId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, { attributeSetId }) => [
                { type: 'AttributeSetGroups', id: attributeSetId },
                { type: 'AttributeSetDetail', id: attributeSetId },
            ],
        }),
    }),
});

// ─────────────────────────────────────────────────────────────────────────────
// Export hooks
// ─────────────────────────────────────────────────────────────────────────────

export const {
    // Queries
    useGetAttributeSetsQuery,
    useGetAttributeSetQuery,
    useGetAttributeSetDetailsQuery,
    useGetAttributeSetAttributesQuery,
    useGetAttributeSetGroupsQuery,
    
    // Mutations
    useCreateAttributeSetMutation,
    useUpdateAttributeSetMutation,
    useDeleteAttributeSetMutation,
    useSyncAttributeSetsMutation,
    useSyncSingleAttributeSetMutation,
    useAssignAttributeToSetMutation,
    useRemoveAttributeFromSetMutation,
    useCreateAttributeGroupMutation,
    useUpdateAttributeGroupMutation,
    useDeleteAttributeGroupMutation,
    usePushToMagentoMutation,
} = attributeSetApi;

export default attributeSetApi;