// src/app/api/SettingsSlices/SettingsApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { dynamicBaseQuery } from "../dynamicBaseQuery";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GeneralSettings {
    site_name: string;
    site_logo: string | null;
    site_favicon: string | null;
    contact_email: string;
    contact_phone: string | null;
    address: string | null;
    default_currency: string;
    default_language: string;
    timezone: string;
    date_format: string;
    time_format: string;
}

export interface PaymentSettings {
    stripe_enabled: boolean;
    stripe_key: string | null;
    stripe_webhook_secret: string | null;
    paypal_enabled: boolean;
    paypal_client_id: string | null;
    paypal_mode: "sandbox" | "live";
    bank_transfer_enabled: boolean;
    bank_transfer_details: {
        bank_name?: string;
        account_name?: string;
        account_number?: string;
        sort_code?: string;
        iban?: string;
        swift?: string;
    } | null;
    default_payment_method: string;
}

export interface ShippingSettings {
    default_carrier: number | null;
    free_shipping_threshold: number;
    shipping_tax_class: string | null;
    international_shipping_enabled: boolean;
}

export interface TaxSettings {
    tax_calculation_method: "unit" | "row" | "total";
    tax_based_on: "shipping" | "billing" | "origin";
    default_tax_class: string | null;
    display_prices_with_tax: boolean;
    display_tax_totals: boolean;
}

export interface EmailSettings {
    mail_driver: "smtp" | "ses" | "sendmail" | "log";
    mail_host: string | null;
    mail_port: number | null;
    mail_username: string | null;
    mail_password: string | null;
    mail_encryption: "tls" | "ssl" | null;
    mail_from_address: string;
    mail_from_name: string;
}

export interface ApiSettings {
    api_rate_limit: number;
    api_rate_limit_per_minute: number;
    webhook_retry_attempts: number;
    webhook_retry_delay: number;
    enable_api_logging: boolean;
}

export interface SecuritySettings {
    two_factor_required: boolean;
    session_timeout: number;
    max_login_attempts: number;
    lockout_duration: number;
    password_expiry_days: number | null;
    require_email_verification: boolean;
    require_phone_verification: boolean;
}

export interface SystemSettings {
    general: GeneralSettings;
    api: ApiSettings;
    security: SecuritySettings;
}

export const settingsApi = createApi({
    reducerPath: "settingsApi",
    baseQuery: dynamicBaseQuery,
    tagTypes: ["Settings", "SystemSettings", "PaymentSettings", "ShippingSettings", "TaxSettings", "EmailSettings"],
    keepUnusedDataFor: 300, // Keep settings cached for 5 minutes

    endpoints: (builder) => ({

        // GET /settings - Get all settings
        getAllSettings: builder.query<{
            success: boolean;
            data: {
                general: GeneralSettings;
                payment: PaymentSettings;
                shipping: ShippingSettings;
                tax: TaxSettings;
                email: EmailSettings;
                api: ApiSettings;
                security: SecuritySettings;
            };
        }, void>({
            query: () => ({
                url: "settings",
                method: "GET",
            }),
            providesTags: ["Settings"],
        }),

        // GET /settings/system - Get system settings
        getSystemSettings: builder.query<{ success: boolean; data: SystemSettings }, void>({
            query: () => ({
                url: "settings/system",
                method: "GET",
            }),
            providesTags: ["SystemSettings"],
        }),

        // GET /settings/payment - Get payment settings
        getPaymentSettings: builder.query<{ success: boolean; data: PaymentSettings }, void>({
            query: () => ({
                url: "settings/payment",
                method: "GET",
            }),
            providesTags: ["PaymentSettings"],
        }),

        // GET /settings/shipping - Get shipping settings
        getShippingSettings: builder.query<{ success: boolean; data: ShippingSettings }, void>({
            query: () => ({
                url: "settings/shipping",
                method: "GET",
            }),
            providesTags: ["ShippingSettings"],
        }),

        // GET /settings/tax - Get tax settings
        getTaxSettings: builder.query<{ success: boolean; data: TaxSettings }, void>({
            query: () => ({
                url: "settings/tax",
                method: "GET",
            }),
            providesTags: ["TaxSettings"],
        }),

        // GET /settings/email - Get email settings
        getEmailSettings: builder.query<{ success: boolean; data: EmailSettings }, void>({
            query: () => ({
                url: "settings/email",
                method: "GET",
            }),
            providesTags: ["EmailSettings"],
        }),

        // PUT /settings - Update settings by group
        updateSettings: builder.mutation<{ success: boolean; message: string }, {
            group: "general" | "payment" | "shipping" | "tax" | "email" | "api" | "security";
            settings: Record<string, any>;
        }>({
            query: ({ group, settings }) => ({
                url: "settings",
                method: "PUT",
                body: { group, settings },
            }),
            invalidatesTags: (_result, _error, { group }) => {
                const tagMap: Record<string, any[]> = {
                    general: ["Settings", "SystemSettings"],
                    payment: ["Settings", "PaymentSettings"],
                    shipping: ["Settings", "ShippingSettings"],
                    tax: ["Settings", "TaxSettings"],
                    email: ["Settings", "EmailSettings"],
                    api: ["Settings", "SystemSettings"],
                    security: ["Settings", "SystemSettings"],
                };
                return tagMap[group] || ["Settings"];
            },
        }),
    }),
});

export const {
    useGetAllSettingsQuery,
    useGetSystemSettingsQuery,
    useGetPaymentSettingsQuery,
    useGetShippingSettingsQuery,
    useGetTaxSettingsQuery,
    useGetEmailSettingsQuery,
    useUpdateSettingsMutation,
} = settingsApi;

export default settingsApi;