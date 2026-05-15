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
        headers.set("Accept", "application/json");
        return headers;
    },
});

export const baseQueryWithoutAuth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions
) => {
    const rolePath = getUserBasePath();
    
    if (typeof args === "string") {
        if (rolePath && !args.startsWith("http") && !args.startsWith(`${rolePath}/`)) {
            const cleanUrl = args.startsWith("admin/") ? args.replace("admin/", "") : args;
            args = `${rolePath}/${cleanUrl}`;
        }
    } else {
        if (rolePath && args.url && !args.url.startsWith("http") && !args.url.startsWith(`${rolePath}/`)) {
            const cleanUrl = args.url.startsWith("admin/") ? args.url.replace("admin/", "") : args.url;
            args = { ...args, url: `${rolePath}/${cleanUrl}` };
        }
    }

    return await rawBaseQuery(args, api, extraOptions);
};