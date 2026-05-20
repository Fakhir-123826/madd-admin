/**
 * Shared Dynamic Base Query
 * 
 * Automatically prefixes API URLs with the correct role-based path:
 *   - admin    → admin/...
 *   - vendor   → vendor/...
 *   - customer → customer/...
 * 
 * Reads the user's role from localStorage and constructs URLs dynamically.
 * All API slices should import and use this instead of duplicating the logic.
 */

const baseURL = import.meta.env.VITE_BASE_URL;

// ─── Role Detection ───────────────────────────────────────────────────────────

export type UserRole = "super_admin" | "admin" | "vendor" | "customer" | string;

/**
 * Get the current user's role from localStorage
 */
export const getUserRole = (): UserRole => {
    try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        return user?.roles?.[0] || user?.user_type || "admin";
    } catch {
        return "admin";
    }
};

/**
 * Get the API base path prefix based on user role.
 * Maps role → API route prefix:
 *   super_admin / admin → "admin"
 *   vendor              → "vendor"
 *   customer            → "customer"
 */
export const getUserBasePath = () => {
    try {
        const userStr = localStorage.getItem("user");
        if (!userStr) return "";
        const user = JSON.parse(userStr);
        
        // Check both user.role (singular) and user.roles (plural array)
        const role = (user.role || (Array.isArray(user.roles) ? user.roles[0] : "") || "").toLowerCase();

        if (role === "super_admin" || role === "admin") return "admin";
        if (role === "vendor") return "vendor";
        if (role === "customer") return "customer";
        return role;
    } catch (e) {
        return "";
    }
};

/**
 * Check if current user has admin access (admin or super_admin)
 */
export const hasAdminAccess = (): boolean => {
    const role = getUserRole();
    return ["super_admin", "admin"].includes(role);
};

/**
 * Check if current user is a vendor
 */
export const isVendor = (): boolean => {
    return getUserRole() === "vendor";
};

// ─── Dynamic Base Query ───────────────────────────────────────────────────────

/**
 * Custom base query for RTK Query that dynamically prefixes URLs
 * with the role-based path (admin/vendor/customer).
 * 
 * Usage in API slices:
 *   baseQuery: dynamicBaseQuery,
 *   
 *   // In endpoints, just use the path WITHOUT the role prefix:
 *   query: () => ({ url: "plans", method: "GET" })
 *   // This will automatically become: admin/plans or vendor/plans
 */
export const dynamicBaseQuery = async (args: any, api: any, extraOptions: any) => {
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

    // Remove any existing base path prefix if present (safety)
    const cleanEndpoint = url.replace(/^(admin|vendor|customer)\//, '');

    // Construct the full URL with dynamic base path
    let finalUrl = `${baseURL}/${basePath}/${cleanEndpoint}`;

    // Add query parameters if they exist
    if (params) {
        const queryString = new URLSearchParams(params).toString();
        if (queryString) {
            finalUrl += `?${queryString}`;
        }
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
    };

    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE')) {
        fetchOptions.body = JSON.stringify(body);
    }

    // Make the request
    try {
        const response = await fetch(finalUrl, fetchOptions);
        let data;

        // Try to parse JSON, but handle non-JSON responses
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

        // Handle other error status codes
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

export default dynamicBaseQuery;
