// src/app/api/ConfigSlices/ConfigApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { dynamicBaseQuery } from "../dynamicBaseQuery";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Country {
    id: number;
    code: string;
    name: string;
    phone_code: string;
    eu_member: boolean;
    currency_code: string;
    tax_rate: number;
    timezone: string;
    language_codes: string[];
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface SalesPolicy {
    id: number;
    name: string;
    slug: string;
    description: string;
    content: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Currency {
    id: number;
    code: string;
    name: string;
    symbol: string;
    exchange_rate: number;
    is_default: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Language {
    id: number;
    code: string;
    name: string;
    native_name: string;
    direction: "ltr" | "rtl";
    is_default: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Theme {
    id: number;
    name: string;
    slug: string;
    version: string;
    description: string;
    preview_image: string;
    thumbnail: string;
    is_default: boolean;
    is_active: boolean;
    config: Record<string, any>;
    created_at: string;
    updated_at: string;
}

export interface Courier {
    id: number;
    name: string;
    code: string;
    description: string;
    api_url: string;
    api_key: string;
    api_secret: string;
    tracking_url: string;
    is_active: boolean;
    is_default: boolean;
    config: Record<string, any>;
    created_at: string;
    updated_at: string;
}

export const configApi = createApi({
    reducerPath: "configApi",
    baseQuery: dynamicBaseQuery,
    tagTypes: ["Countries", "SalesPolicies", "Currencies", "Languages", "Themes", "Couriers"],
    keepUnusedDataFor: 300,

    endpoints: (builder) => ({
        // ─── Countries ─────────────────────────────────────────────────────────
        getCountries: builder.query<{
            success: boolean;
            data: Country[];
            summary: any;
            meta: {
                current_page: number;
                last_page: number;
                per_page: number;
                total: number;
                from: number;
                to: number;
            };
            links: any;
        }, {
            page?: number;
            per_page?: number;
            search?: string;
            region?: string;
            is_active?: boolean;
            eu_member?: boolean;
            sort_by?: string;
            sort_order?: string;
        } | void>({
            query: (params) => {
                const queryParams = new URLSearchParams();
                if (params) {
                    Object.entries(params).forEach(([key, value]) => {
                        if (value !== undefined && value !== null && value !== "") {
                            queryParams.append(key, value.toString());
                        }
                    });
                }
                const url = `config/countries${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
                return { url, method: "GET" };
            },
            providesTags: ["Countries"],
        }),

        getCountry: builder.query<{ success: boolean; data: Country }, string | number>({
            query: (id) => ({
                url: `config/countries/${id}`,
                method: "GET",
            }),
            providesTags: (_result, _error, id) => [{ type: "Countries", id }],
        }),

        createCountry: builder.mutation<{ success: boolean; message: string; data: Country }, Partial<Country>>({
            query: (data) => ({
                url: "config/countries",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Countries"],
        }),

        updateCountry: builder.mutation<{ success: boolean; message: string; data: Country }, { id: string | number; data: Partial<Country> }>({
            query: ({ id, data }) => ({
                url: `config/countries/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [{ type: "Countries", id }, "Countries"],
        }),

        deleteCountry: builder.mutation<{ success: boolean; message: string }, string | number>({
            query: (id) => ({
                url: `config/countries/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Countries"],
        }),

        activateCountry: builder.mutation<{ success: boolean; message: string }, string>({
            query: (code) => ({
                url: `config/countries/${code}/activate`,
                method: "POST",
            }),
            invalidatesTags: ["Countries"],
        }),

        // ─── Sales Policies ───────────────────────────────────────────────────
        getSalesPolicies: builder.query<{ success: boolean; data: SalesPolicy[] }, void>({
            query: () => ({
                url: "config/sales-policies",
                method: "GET",
            }),
            providesTags: ["SalesPolicies"],
        }),

        getSalesPolicy: builder.query<{ success: boolean; data: SalesPolicy }, string | number>({
            query: (id) => ({
                url: `config/sales-policies/${id}`,
                method: "GET",
            }),
            providesTags: (_result, _error, id) => [{ type: "SalesPolicies", id }],
        }),

        createSalesPolicy: builder.mutation<{ success: boolean; message: string; data: SalesPolicy }, Partial<SalesPolicy>>({
            query: (data) => ({
                url: "config/sales-policies",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["SalesPolicies"],
        }),

        updateSalesPolicy: builder.mutation<{ success: boolean; message: string; data: SalesPolicy }, { id: string | number; data: Partial<SalesPolicy> }>({
            query: ({ id, data }) => ({
                url: `config/sales-policies/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [{ type: "SalesPolicies", id }, "SalesPolicies"],
        }),

        deleteSalesPolicy: builder.mutation<{ success: boolean; message: string }, string | number>({
            query: (id) => ({
                url: `config/sales-policies/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["SalesPolicies"],
        }),

        // ─── Currencies ──────────────────────────────────────────────────────
        getCurrencies: builder.query<{ success: boolean; data: Currency[] }, void>({
            query: () => ({
                url: "config/currencies",
                method: "GET",
            }),
            providesTags: ["Currencies"],
        }),

        getCurrency: builder.query<{ success: boolean; data: Currency }, string | number>({
            query: (id) => ({
                url: `config/currencies/${id}`,
                method: "GET",
            }),
            providesTags: (_result, _error, id) => [{ type: "Currencies", id }],
        }),

        createCurrency: builder.mutation<{ success: boolean; message: string; data: Currency }, Partial<Currency>>({
            query: (data) => ({
                url: "config/currencies",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Currencies"],
        }),

        updateCurrency: builder.mutation<{ success: boolean; message: string; data: Currency }, { id: string | number; data: Partial<Currency> }>({
            query: ({ id, data }) => ({
                url: `config/currencies/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [{ type: "Currencies", id }, "Currencies"],
        }),

        deleteCurrency: builder.mutation<{ success: boolean; message: string }, string | number>({
            query: (id) => ({
                url: `config/currencies/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Currencies"],
        }),

        updateExchangeRate: builder.mutation<{ success: boolean; message: string }, { code: string; exchange_rate: number }>({
            query: ({ code, exchange_rate }) => ({
                url: `config/currencies/${code}/exchange-rate`,
                method: "POST",
                body: { exchange_rate },
            }),
            invalidatesTags: ["Currencies"],
        }),

        // ─── Languages ───────────────────────────────────────────────────────
        getLanguages: builder.query<{ success: boolean; data: Language[] }, void>({
            query: () => ({
                url: "config/languages",
                method: "GET",
            }),
            providesTags: ["Languages"],
        }),

        getLanguage: builder.query<{ success: boolean; data: Language }, string | number>({
            query: (id) => ({
                url: `config/languages/${id}`,
                method: "GET",
            }),
            providesTags: (_result, _error, id) => [{ type: "Languages", id }],
        }),

        createLanguage: builder.mutation<{ success: boolean; message: string; data: Language }, Partial<Language>>({
            query: (data) => ({
                url: "config/languages",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Languages"],
        }),

        updateLanguage: builder.mutation<{ success: boolean; message: string; data: Language }, { id: string | number; data: Partial<Language> }>({
            query: ({ id, data }) => ({
                url: `config/languages/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [{ type: "Languages", id }, "Languages"],
        }),

        deleteLanguage: builder.mutation<{ success: boolean; message: string }, string | number>({
            query: (id) => ({
                url: `config/languages/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Languages"],
        }),

        // ─── Themes ──────────────────────────────────────────────────────────
        getThemes: builder.query<{ success: boolean; data: Theme[] }, void>({
            query: () => ({
                url: "config/themes",
                method: "GET",
            }),
            providesTags: ["Themes"],
        }),

        getTheme: builder.query<{ success: boolean; data: Theme }, string | number>({
            query: (id) => ({
                url: `config/themes/${id}`,
                method: "GET",
            }),
            providesTags: (_result, _error, id) => [{ type: "Themes", id }],
        }),

        createTheme: builder.mutation<{ success: boolean; message: string; data: Theme }, Partial<Theme>>({
            query: (data) => ({
                url: "config/themes",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Themes"],
        }),

        updateTheme: builder.mutation<{ success: boolean; message: string; data: Theme }, { id: string | number; data: Partial<Theme> }>({
            query: ({ id, data }) => ({
                url: `config/themes/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [{ type: "Themes", id }, "Themes"],
        }),

        deleteTheme: builder.mutation<{ success: boolean; message: string }, string | number>({
            query: (id) => ({
                url: `config/themes/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Themes"],
        }),

        setDefaultTheme: builder.mutation<{ success: boolean; message: string }, string | number>({
            query: (id) => ({
                url: `config/themes/${id}/set-default`,
                method: "POST",
            }),
            invalidatesTags: ["Themes"],
        }),

        // ─── Couriers ────────────────────────────────────────────────────────
        getCouriers: builder.query<{ success: boolean; data: Courier[] }, void>({
            query: () => ({
                url: "config/couriers",
                method: "GET",
            }),
            providesTags: ["Couriers"],
        }),

        getCourier: builder.query<{ success: boolean; data: Courier }, string | number>({
            query: (id) => ({
                url: `config/couriers/${id}`,
                method: "GET",
            }),
            providesTags: (_result, _error, id) => [{ type: "Couriers", id }],
        }),

        createCourier: builder.mutation<{ success: boolean; message: string; data: Courier }, Partial<Courier>>({
            query: (data) => ({
                url: "config/couriers",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Couriers"],
        }),

        updateCourier: builder.mutation<{ success: boolean; message: string; data: Courier }, { id: string | number; data: Partial<Courier> }>({
            query: ({ id, data }) => ({
                url: `config/couriers/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [{ type: "Couriers", id }, "Couriers"],
        }),

        deleteCourier: builder.mutation<{ success: boolean; message: string }, string | number>({
            query: (id) => ({
                url: `config/couriers/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Couriers"],
        }),

        testCourierConnection: builder.mutation<{ success: boolean; message: string }, string | number>({
            query: (id) => ({
                url: `config/couriers/${id}/test`,
                method: "POST",
            }),
            invalidatesTags: ["Couriers"],
        }),
    }),
});

export const {
    // Countries
    useGetCountriesQuery,
    useGetCountryQuery,
    useCreateCountryMutation,
    useUpdateCountryMutation,
    useDeleteCountryMutation,
    useActivateCountryMutation,

    // Sales Policies
    useGetSalesPoliciesQuery,
    useGetSalesPolicyQuery,
    useCreateSalesPolicyMutation,
    useUpdateSalesPolicyMutation,
    useDeleteSalesPolicyMutation,

    // Currencies
    useGetCurrenciesQuery,
    useGetCurrencyQuery,
    useCreateCurrencyMutation,
    useUpdateCurrencyMutation,
    useDeleteCurrencyMutation,
    useUpdateExchangeRateMutation,

    // Languages
    useGetLanguagesQuery,
    useGetLanguageQuery,
    useCreateLanguageMutation,
    useUpdateLanguageMutation,
    useDeleteLanguageMutation,

    // Themes
    useGetThemesQuery,
    useGetThemeQuery,
    useCreateThemeMutation,
    useUpdateThemeMutation,
    useDeleteThemeMutation,
    useSetDefaultThemeMutation,

    // Couriers
    useGetCouriersQuery,
    useGetCourierQuery,
    useCreateCourierMutation,
    useUpdateCourierMutation,
    useDeleteCourierMutation,
    useTestCourierConnectionMutation,
} = configApi;

export default configApi;