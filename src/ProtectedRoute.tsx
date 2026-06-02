import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const isAuthenticated = useSelector(
        (state: any) => state.auth.isAuthenticated
    );
    const expiresAt = useSelector((state: any) => state.auth.expiresAt);

    // localStorage se bhi check karo
    const token = localStorage.getItem("token") || localStorage.getItem("access_token");

    // Check if token has expired
    const isTokenExpired = expiresAt ? Date.now() >= expiresAt : false;

    if (!isAuthenticated && !token) {
        return <Navigate to="/login" replace />;
    }

    // If token is expired, redirect to login
    if (isTokenExpired) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;