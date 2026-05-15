import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";

const baseURL = import.meta.env.VITE_BASE_URL;

/**
 * Helper to get the correct base path based on user role
 */
const getUserBasePath = () => {
    try {
        const userStr = localStorage.getItem("user");
        if (!userStr) return "";
        const user = JSON.parse(userStr);
        const role = user.role?.toLowerCase() || "";

        if (role === "super_admin" || role === "admin") return "admin";
        if (role === "vendor") return "vendor";
        if (role === "customer") return "customer";
        return role;
    } catch (e) {
        return "";
    }
};

const rawBaseQuery = fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers) => {
        const token = localStorage.getItem("token") || localStorage.getItem("access_token");
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        headers.set("Accept", "application/json");
        return headers;
    },
});

export const baseQueryWithAuth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions
) => {
    const rolePath = getUserBasePath();
    
    if (typeof args === "string") {
        // If it's a string, prefix it if it doesn't already have the role prefix or http
        if (rolePath && !args.startsWith("http") && !args.startsWith(`${rolePath}/`)) {
            // Remove 'admin/' if it's explicitly there to avoid duplication
            const cleanUrl = args.startsWith("admin/") ? args.replace("admin/", "") : args;
            args = `${rolePath}/${cleanUrl}`;
        }
    } else {
        // If it's an object (FetchArgs), prefix the url
        if (rolePath && args.url && !args.url.startsWith("http") && !args.url.startsWith(`${rolePath}/`)) {
            const cleanUrl = args.url.startsWith("admin/") ? args.url.replace("admin/", "") : args.url;
            args = { ...args, url: `${rolePath}/${cleanUrl}` };
        }
    }

    const result = await rawBaseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("access_token");
        window.location.href = "/login";
    }

    return result;
};