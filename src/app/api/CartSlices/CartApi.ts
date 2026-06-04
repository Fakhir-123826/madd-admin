import { createApi } from "@reduxjs/toolkit/query/react";
import { dynamicBaseQuery } from "../dynamicBaseQuery";

// Types
export interface PaymentMethod {
    code: string;
    title: string;
    is_default: boolean;
    sort_order: number;
}

export interface ShippingMethod {
    carrier_code: string;
    method_code: string;
    carrier_title: string;
    method_title: string;
    amount: number;
    base_amount: number;
    price_incl_tax: number;
    error_message?: string | null;
}

export interface ShippingAddress {
    country_id: string;
    region?: string;
    region_id?: number;
    city?: string;
    postcode?: string;
    street?: string;
    firstname?: string;
    lastname?: string;
    telephone?: string;
}

export interface GetPaymentMethodsParams {
    vendor_uuid: string;
    store_uuid: string;
    customer_id: number;
}

export interface GetShippingMethodsParams {
    vendor_uuid: string;
    store_uuid: string;
    customer_id: number;
    shipping_address: ShippingAddress;
}

export interface PaymentMethodsResponse {
    success: boolean;
    data: PaymentMethod[];
    message: string;
}

export interface ShippingMethodsResponse {
    success: boolean;
    data: ShippingMethod[];
    message: string;
}

// API Slice
export const cartApi = createApi({
    reducerPath: "cartApi",
    baseQuery: dynamicBaseQuery,
    tagTypes: ["PaymentMethods", "ShippingMethods"],
    
    endpoints: (builder) => ({
        // Get payment methods
        getPaymentMethods: builder.query<PaymentMethod[], GetPaymentMethodsParams>({
            query: (params) => ({
                url: "carts/payment-methods",
                method: "GET",
                params: params,
            }),
            transformResponse: (response: PaymentMethodsResponse) => response.data,
            providesTags: ["PaymentMethods"],
        }),
        
        // Get shipping methods
        getShippingMethods: builder.query<ShippingMethod[], GetShippingMethodsParams>({
            query: (params) => ({
                url: "carts/shipping-methods",
                method: "POST",
                body: params,
            }),
            transformResponse: (response: ShippingMethodsResponse) => response.data,
            providesTags: ["ShippingMethods"],
        }),
    }),
});

export const {
    useGetPaymentMethodsQuery,
    useGetShippingMethodsQuery,
} = cartApi;

export default cartApi;