// Login.tsx
import { useEffect, useState } from "react";
import { FaLock, FaUser, FaArrowRight, FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { useLoginAdminMutation, useSocialLoginMutation } from "../app/api/AuthSlices/AuthSlices";
import { selectIsAuthenticated } from "../app/api/AuthSlices/authSlice";
import { ROUTES } from "../router";
import { useGoogleLogin } from "@react-oauth/google";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const isAuthenticated = useSelector(selectIsAuthenticated);

    const [loginAdmin, { isLoading, error }] = useLoginAdminMutation();
    const [socialLogin, { isLoading: isSocialLoading }] = useSocialLoginMutation();

    const loginWithGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const res = await socialLogin({
                    provider: 'google',
                    access_token: tokenResponse.access_token,
                }).unwrap();
                
                const user = res.data.user;
                if (!user.is_email_verified) {
                    navigate(ROUTES.VERIFY_EMAIL, { state: { email: user.email } });
                } else if (!user.is_vendor) {
                    navigate(ROUTES.DASHBOARD, { replace: true });
                }
            } catch (error) {
                console.error("Google login error:", error);
            }
        },
        onError: (error) => console.log('Google Login Failed:', error)
    });

    // ── If already authenticated, skip to dashboard ───────────────────────────
    useEffect(() => {
        // Check both old "token" key and new "access_token" key
        const token = localStorage.getItem("access_token") || localStorage.getItem("token");

        console.log("token found:", token);
        console.log("isAuthenticated:", isAuthenticated);

        if (isAuthenticated || token) {
            navigate(ROUTES.DASHBOARD, { replace: true });
        }
    }, [isAuthenticated, navigate]);

    // ── Login handler ─────────────────────────────────────────────────────────
    const handleLogin = async () => {
        if (!email || !password) return;

        try {
            const result = await loginAdmin({ email, password }).unwrap();

            // onQueryStarted in AuthSlices already persisted credentials to
            // Redux + localStorage. We just need to handle routing here.

            const user = result.data.user;

            // Email not verified → go to verification screen
            if (!user.is_email_verified) {
                navigate(ROUTES.VERIFY_EMAIL, { state: { email } });
                return;
            }

            // All good → dashboard
            navigate(ROUTES.DASHBOARD, { replace: true });
        } catch (err: any) {
            const status = err?.status;
            const data = err?.data;

            // Server says "go verify your email"
            if (status === 403 && data?.requires_verification) {
                navigate(ROUTES.VERIFY_EMAIL, { state: { email } });
            }
            // All other errors are shown via the `error` object from the mutation
        }
    };

    // ── Error message ─────────────────────────────────────────────────────────
    const errorMessage =
        (error as any)?.data?.message ?? "Invalid email or password. Please try again.";

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div
            className="min-h-screen flex overflow-hidden"
            style={{ fontFamily: "'Segoe UI', sans-serif" }}
        >
            {/* ── LEFT panel ─────────────────────────────────────────────────── */}
            <div className="relative hidden lg:flex lg:w-1/2 items-center justify-center overflow-hidden">
                {/* Base gradient */}
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "linear-gradient(135deg, #e8f8f0 0%, #c8eef0 30%, #a8d8f0 60%, #3ab5e6 100%)",
                    }}
                />
                {/* Decorative diagonal shapes */}
                <div
                    className="absolute"
                    style={{
                        width: "120%",
                        height: "55%",
                        background: "rgba(255,255,255,0.55)",
                        transform: "rotate(-35deg) translateX(-10%) translateY(-30%)",
                        borderRadius: "8px",
                        top: "10%",
                        left: "-10%",
                    }}
                />
                <div
                    className="absolute"
                    style={{
                        width: "80%",
                        height: "40%",
                        background: "linear-gradient(135deg, #3ab5e6cc, #1a8fc0cc)",
                        transform: "rotate(-35deg) translateX(20%) translateY(60%)",
                        borderRadius: "8px",
                        bottom: "0%",
                        left: "0%",
                    }}
                />
                <div
                    className="absolute"
                    style={{
                        width: "60%",
                        height: "30%",
                        background: "rgba(255,255,255,0.3)",
                        transform: "rotate(-35deg) translateX(60%) translateY(20%)",
                        borderRadius: "8px",
                        bottom: "15%",
                        left: "10%",
                    }}
                />
                <div className="relative z-10 text-center px-12">
                    <h1 className="text-4xl font-bold drop-shadow-md mb-3 text-blue-900">
                        Welcome Back
                    </h1>
                    <p className="text-blue-900/80 text-lg">Sign in to manage your store</p>
                </div>
            </div>

            {/* ── RIGHT panel ────────────────────────────────────────────────── */}
            <div className="w-full lg:w-1/2 flex flex-col bg-white">
                {/* Top bar */}
                <div className="flex items-center justify-between px-10 py-6 border-b border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Log in</h2>
                    <img src="madd-admin.png" alt="MarketAdd Logo" className="h-12 object-contain" />
                </div>

                {/* Form body */}
                <div className="flex-1 flex flex-col justify-center px-10 lg:px-16 py-10 gap-6">
                    {/* Error banner */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
                            {errorMessage}
                        </div>
                    )}

                    {/* Email field */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-gray-600">Email address</label>
                        <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus-within:border-blue-400 focus-within:bg-white transition-all">
                            <FaUser className="text-gray-400 text-sm flex-shrink-0" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                                placeholder="superadmin@madd.com"
                                className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder-gray-400"
                            />
                        </div>
                    </div>

                    {/* Password field */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-gray-600">Password</label>
                        <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus-within:border-blue-400 focus-within:bg-white transition-all">
                            <FaLock className="text-gray-400 text-sm flex-shrink-0" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                                placeholder="Enter your password"
                                className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder-gray-400"
                            />
                            <span
                                onClick={() => setShowPassword((v) => !v)}
                                className="cursor-pointer text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                    </div>

                    {/* Forgot password */}
                    <div className="text-right -mt-3">
                        <Link
                            to={ROUTES.FORGOT_PASSWORD}
                            className="text-sm font-medium text-blue-500 hover:text-blue-600 hover:underline transition-colors"
                        >
                            Forgot Password?
                        </Link>
                    </div>

                    {/* Login button */}
                    <button
                        onClick={handleLogin}
                        disabled={isLoading || !email || !password}
                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white text-sm shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                        style={{ background: "linear-gradient(135deg, #3ab5e6, #1a8fc0)" }}
                    >
                        {isLoading ? (
                            <>
                                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                                Logging in...
                            </>
                        ) : (
                            <>
                                Login <FaArrowRight className="text-xs" />
                            </>
                        )}
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-4">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-xs text-gray-400 font-medium">OR</span>
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    {/* Google */}
                    <button
                        onClick={() => loginWithGoogle()}
                        disabled={isLoading || isSocialLoading}
                        className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 transition-all hover:border-gray-300 hover:shadow-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        <FcGoogle className="text-lg" />
                        {isSocialLoading ? "Connecting..." : "Continue with Google"}
                    </button>

                    {/* Apple */}
                    <button
                        onClick={() => console.log("Apple login")}
                        className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 transition-all hover:border-gray-300 hover:shadow-sm cursor-pointer"
                    >
                        <FaApple className="text-lg text-gray-800" />
                        Continue with Apple
                    </button>

                    {/* Sign up link */}
                    <p className="text-center text-sm text-gray-500">
                        Don't have an account?{" "}
                        <Link
                            to={ROUTES.REGISTER}
                            className="text-blue-500 font-semibold hover:underline"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;