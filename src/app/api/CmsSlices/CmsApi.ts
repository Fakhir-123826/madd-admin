import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseURL = import.meta.env.VITE_BASE_URL;

// Helper function to get base route from localStorage
const getUserBasePath = () => {
    try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const role = user?.roles?.[0] || user?.user_type;

        if (["super_admin", "admin"].includes(role)) return "admin";
        if (["vendor", "customer"].includes(role)) return role;

        return "admin";
    } catch {
        return "admin";
    }
};

// Custom dynamic base query that handles role-based routing
const dynamicBaseQuery = async (args: any, api: any, extraOptions: any) => {
    const basePath = getUserBasePath();
    
    // Handle both string URL and object args
    let url: string;
    let method: string = 'GET';
    let body: any = undefined;
    let params: any = undefined;
    
    if (typeof args === 'string') {
        url = args;
    } else {
        url = args.url;
        method = args.method || 'GET';
        body = args.body;
        params = args.params;
    }
    
    // Construct the full URL with dynamic base path
    let finalUrl = `${baseURL}/${basePath}/${url}`;
    
    // Add query parameters if they exist
    if (params) {
        const queryString = new URLSearchParams(params).toString();
        finalUrl += `?${queryString}`;
    }
    
    // Prepare headers
    const headers = new Headers();
    const token = localStorage.getItem("token");
    if (token) {
        headers.set("authorization", `Bearer ${token}`);
    }
    headers.set("Content-Type", "application/json");
    
    // Prepare fetch options
    const fetchOptions: RequestInit = {
        method,
        headers,
        ...extraOptions,
    };
    
    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        fetchOptions.body = JSON.stringify(body);
    }
    
    // Make the request
    try {
        const response = await fetch(finalUrl, fetchOptions);
        let data;
        
        // Try to parse JSON
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            data = await response.text();
        }
        
        // Handle unauthorized
        if (response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
            return { error: { status: 401, data: { message: "Unauthorized" } } };
        }
        
        if (!response.ok) {
            return { 
                error: { 
                    status: response.status, 
                    data: data,
                    message: data?.message || `Request failed with status ${response.status}`
                } 
            };
        }
        
        return { data };
    } catch (error) {
        console.error("API Request Error:", error);
        return { error: { status: 'FETCH_ERROR', error: String(error) } };
    }
};

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
