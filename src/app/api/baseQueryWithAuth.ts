import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const baseURL = import.meta.env.VITE_BASE_URL;
export const baseQueryWithAuth = fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers) => {
        const token = localStorage.getItem("token");
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
    },
});