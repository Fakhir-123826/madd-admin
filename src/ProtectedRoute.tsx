import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const isAuthenticated = useSelector(
        (state: any) => state.auth.isAuthenticated
    );

    // localStorage se bhi check karo
    const token = localStorage.getItem("admin_token");

    if (!isAuthenticated && !token) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;