import { useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../app/api/AuthSlices/authSlice";
import toast from "react-hot-toast";

/**
 * TokenExpiryWatcher
 * 
 * Global component that monitors the token's `expiresAt` timestamp.
 * When the token expires, it automatically:
 *   1. Dispatches `logout()` to clear Redux state & localStorage
 *   2. Shows a toast notification
 *   3. Redirects to /login
 *
 * This works regardless of which screen the user is on.
 */
const TokenExpiryWatcher = () => {
    const dispatch = useDispatch();
    const expiresAt = useSelector((state: any) => state.auth.expiresAt);
    const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleExpiry = useCallback(() => {
        dispatch(logout());
        toast.error("Session expired. Please login again.", {
            duration: 5000,
            id: "session-expired", // prevent duplicate toasts
        });
        // Force navigate to login - using window.location to work outside Router context
        window.location.href = "/login";
    }, [dispatch]);

    useEffect(() => {
        // Clear any existing timer
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }

        // Only set timer if user is authenticated and we have an expiry time
        if (!isAuthenticated || !expiresAt) {
            return;
        }

        const timeRemaining = expiresAt - Date.now();

        // Already expired
        if (timeRemaining <= 0) {
            handleExpiry();
            return;
        }

        // Set timeout for when token expires
        // Note: setTimeout max is ~24.8 days (2^31 - 1 ms), so 86400s (24h) is fine
        timerRef.current = setTimeout(() => {
            handleExpiry();
        }, timeRemaining);

        // Cleanup on unmount or when dependencies change
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [expiresAt, isAuthenticated, handleExpiry]);

    // Also check on tab focus (in case timer drifted while tab was inactive)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible" && isAuthenticated && expiresAt) {
                if (Date.now() >= expiresAt) {
                    handleExpiry();
                }
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [expiresAt, isAuthenticated, handleExpiry]);

    return null; // This component renders nothing
};

export default TokenExpiryWatcher;
