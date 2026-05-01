import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash, FaLock, FaKey } from "react-icons/fa";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useResetPasswordMutation } from "../app/api/AuthSlices/AuthSlices";
import { ROUTES } from "../router";

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const urlToken = searchParams.get("token") || "";
    const urlEmail = searchParams.get("email") || "";

    const [email, setEmail] = useState(urlEmail);
    const [token, setToken] = useState(urlToken);
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const navigate = useNavigate();
    const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation();

    const [message, setMessage] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    // If no token, redirect back to forgot password
    useEffect(() => {
        if (!urlToken) {
            navigate(ROUTES.FORGOT_PASSWORD);
        }
    }, [urlToken, navigate]);

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!token || !password || !passwordConfirmation) {
            setErrorMsg("Please fill all fields");
            return;
        }

        if (password !== passwordConfirmation) {
            setErrorMsg("Passwords do not match");
            return;
        }

        if (password.length < 8) {
            setErrorMsg("Password must be at least 8 characters long");
            return;
        }

        try {
            setErrorMsg("");
            setMessage("");

            const res = await resetPassword({
                email,
                token,
                password,
                password_confirmation: passwordConfirmation
            }).unwrap();

            setMessage(res?.message || "Password has been reset successfully!");
            
            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate(ROUTES.LOGIN);
            }, 3000);

        } catch (error: any) {
            console.error("Reset Password Error:", error);
            setErrorMsg(error?.data?.message || "Failed to reset password. The link may be expired.");
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-8 md:p-10">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-blue-50 text-blue-600 mb-4">
                            <FaKey className="text-2xl" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Create New Password</h1>
                        <p className="text-sm text-gray-500 mt-2">
                            Please enter your new password below.
                        </p>
                    </div>

                    {message ? (
                        <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 p-6 rounded-2xl text-center">
                            <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">Check</span>
                            </div>
                            <h3 className="font-bold mb-1">Success!</h3>
                            <p className="text-sm">{message}</p>
                            <p className="text-xs mt-4 opacity-70 italic">Redirecting to login...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleResetPassword} className="space-y-5">
                            {errorMsg && (
                                <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-xl text-xs font-medium">
                                    {errorMsg}
                                </div>
                            )}

                            {/* Hidden fields for accessibility/form context */}
                            <input type="hidden" value={email} />
                            <input type="hidden" value={token} />

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">New Password</label>
                                <div className="relative group">
                                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Confirm Password</label>
                                <div className="relative group">
                                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={passwordConfirmation}
                                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                                        className="w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isResetting}
                                className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {isResetting ? "Processing..." : "Create New Password"}
                            </button>

                            <div className="text-center mt-6">
                                <Link to={ROUTES.LOGIN} className="text-sm font-semibold text-blue-500 hover:text-blue-600 transition-colors">
                                    Back to Login
                                </Link>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
