import { createApi } from "@reduxjs/toolkit/query/react";
import { dynamicBaseQuery } from "../dynamicBaseQuery";

export const cmsApi = createApi({
    reducerPath: "cmsApi",
    baseQuery: dynamicBaseQuery,
    tagTypes: ["CmsBlocks", "CmsPages"],

    endpoints: (builder) => ({
        // CMS BLOCKS
        getCmsBlocks: builder.query<any, { vendorUuid: string; page?: number; per_page?: number }>({
            query: ({ vendorUuid, ...params }) => ({
                url: `vendors/${vendorUuid}/cms-blocks`,
                method: "GET",
                params,
            }),
            providesTags: ["CmsBlocks"],
        }),
        getCmsBlock: builder.query<any, { vendorUuid: string; uuid: string }>({
            query: ({ vendorUuid, uuid }) => ({
                url: `vendors/${vendorUuid}/cms-blocks/${uuid}`,
                method: "GET",
            }),
            providesTags: (_result, _error, { uuid }) => [{ type: "CmsBlocks", id: uuid }],
        }),
        createCmsBlock: builder.mutation<any, { vendorUuid: string; data: any }>({
            query: ({ vendorUuid, data }) => ({
                url: `vendors/${vendorUuid}/cms-blocks`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["CmsBlocks"],
        }),
        updateCmsBlock: builder.mutation<any, { vendorUuid: string; uuid: string; data: any }>({
            query: ({ vendorUuid, uuid, data }) => ({
                url: `vendors/${vendorUuid}/cms-blocks/${uuid}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (_result, _error, { uuid }) => [
                "CmsBlocks",
                { type: "CmsBlocks", id: uuid },
            ],
        }),
        deleteCmsBlock: builder.mutation<any, { vendorUuid: string; uuid: string }>({
            query: ({ vendorUuid, uuid }) => ({
                url: `vendors/${vendorUuid}/cms-blocks/${uuid}`,
                method: "DELETE",
            }),
            invalidatesTags: ["CmsBlocks"],
        }),
        syncCmsBlocks: builder.mutation<any, string>({
            query: (vendorUuid) => ({
                url: `vendors/${vendorUuid}/cms-blocks/sync`,
                method: "POST",
            }),
            invalidatesTags: ["CmsBlocks"],
        }),

        // CMS PAGES
        getCmsPages: builder.query<any, { vendorUuid: string; page?: number; per_page?: number }>({
            query: ({ vendorUuid, ...params }) => ({
                url: `vendors/${vendorUuid}/cms-pages`,
                method: "GET",
                params,
            }),
            providesTags: ["CmsPages"],
        }),
        getCmsPage: builder.query<any, { vendorUuid: string; uuid: string }>({
            query: ({ vendorUuid, uuid }) => ({
                url: `vendors/${vendorUuid}/cms-pages/${uuid}`,
                method: "GET",
            }),
            providesTags: (_result, _error, { uuid }) => [{ type: "CmsPages", id: uuid }],
        }),
        createCmsPage: builder.mutation<any, { vendorUuid: string; data: any }>({
            query: ({ vendorUuid, data }) => ({
                url: `vendors/${vendorUuid}/cms-pages`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["CmsPages"],
        }),
        updateCmsPage: builder.mutation<any, { vendorUuid: string; uuid: string; data: any }>({
            query: ({ vendorUuid, uuid, data }) => ({
                url: `vendors/${vendorUuid}/cms-pages/${uuid}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (_result, _error, { uuid }) => [
                "CmsPages",
                { type: "CmsPages", id: uuid },
            ],
        }),
        deleteCmsPage: builder.mutation<any, { vendorUuid: string; uuid: string }>({
            query: ({ vendorUuid, uuid }) => ({
                url: `vendors/${vendorUuid}/cms-pages/${uuid}`,
                method: "DELETE",
            }),
            invalidatesTags: ["CmsPages"],
        }),
        syncCmsPages: builder.mutation<any, string>({
            query: (vendorUuid) => ({
                url: `vendors/${vendorUuid}/cms-pages/sync`,
                method: "POST",
            }),
            invalidatesTags: ["CmsPages"],
        }),
    }),
});

export const {
    useGetCmsBlocksQuery,
    useGetCmsBlockQuery,
    useCreateCmsBlockMutation,
    useUpdateCmsBlockMutation,
    useDeleteCmsBlockMutation,
    useSyncCmsBlocksMutation,
    useGetCmsPagesQuery,
    useGetCmsPageQuery,
    useCreateCmsPageMutation,
    useUpdateCmsPageMutation,
    useDeleteCmsPageMutation,
    useSyncCmsPagesMutation,
} = cmsApi;

export default cmsApi;
