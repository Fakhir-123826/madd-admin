import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseURL = import.meta.env.VITE_BASE_URL;

export interface SuspendVendorPayload {
    reason: string;
}

export interface UpdateVendorPlanPayload {
    plan_id: number;
    duration_months?: number;
}

export interface RejectKycPayload {
    reason: string;
}

export interface CreateVendorPayload {
    user_id: number,
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone?: string;
    country_code: string;
    company_name: string;
    company_slug?: string;

    description?: string;
    plan_id?: number;
    status?: string;
}


export const vendorApi = createApi({
    reducerPath: "vendorApi",

    baseQuery: fetchBaseQuery({
        baseUrl: baseURL,

        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");

            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }

            headers.set("Content-Type", "application/json");

            return headers;
        },
    }),

    tagTypes: ["Vendors"],

    endpoints: (builder) => ({

        /*
        =========================================
        GET ALL VENDORS
        =========================================
        */
        getVendors: builder.query<any, void>({
            query: () => ({
                url: "admin/vendors",
                method: "GET",
            }),
            providesTags: ["Vendors"],
        }),

        /*
        =========================================
        GET SINGLE VENDOR
        =========================================
        */
        getSingleVendor: builder.query<any, string>({
            query: (id) => ({
                url: `admin/vendors/${id}`,
                method: "GET",
            }),
            providesTags: ["Vendors"],
        }),

        /*
        =========================================
        APPROVE VENDOR
        =========================================
        */
        approveVendor: builder.mutation<any, string>({
            query: (id) => ({
                url: `admin/vendors/${id}/approve`,
                method: "POST",
                body: {},
            }),
            invalidatesTags: ["Vendors"],
        }),

        /*
        =========================================
        SUSPEND VENDOR
        =========================================
        */
        suspendVendor: builder.mutation<
            any,
            { id: string; data: SuspendVendorPayload }
        >({
            query: ({ id, data }) => ({
                url: `admin/vendors/${id}/suspend`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Vendors"],
        }),

        /*
        =========================================
        ACTIVATE VENDOR
        =========================================
        */
        activateVendor: builder.mutation<any, string>({
            query: (id) => ({
                url: `admin/vendors/${id}/activate`,
                method: "POST",
                body: {},
            }),
            invalidatesTags: ["Vendors"],
        }),

        /*
        =========================================
        UPDATE VENDOR PLAN
        =========================================
        */
        updateVendorPlan: builder.mutation<
            any,
            { id: string; data: UpdateVendorPlanPayload }
        >({
            query: ({ id, data }) => ({
                url: `admin/vendors/${id}/plan`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Vendors"],
        }),

        /*
        =========================================
        VERIFY KYC
        =========================================
        */
        verifyVendorKyc: builder.mutation<any, string>({
            query: (id) => ({
                url: `admin/vendors/${id}/kyc-verify`,
                method: "POST",
                body: {},
            }),
            invalidatesTags: ["Vendors"],
        }),


        createVendor: builder.mutation<any, CreateVendorPayload>({
            query: (data) => ({
                url: "admin/vendors",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Vendors"],
        }),
        /*
        =========================================
        REJECT KYC
        =========================================
        */
        rejectVendorKyc: builder.mutation<
            any,
            { id: string; data: RejectKycPayload }
        >({
            query: ({ id, data }) => ({
                url: `admin/vendors/${id}/kyc-reject`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Vendors"],
        }),
    }),
});

export const {
    useGetVendorsQuery,
    useGetSingleVendorQuery,
    useCreateVendorMutation,
    useApproveVendorMutation,
    useSuspendVendorMutation,
    useActivateVendorMutation,
    useUpdateVendorPlanMutation,
    useVerifyVendorKycMutation,
    useRejectVendorKycMutation,
} = vendorApi;

export default vendorApi;