import { useState, useEffect } from "react";
import { FaArrowLeft, FaUser, FaEnvelopeOpenText } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useForgotPasswordMutation } from "../app/api/AuthSlices/AuthSlices";
import { ROUTES } from "../router";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [isEmailSent, setIsEmailSent] = useState(false);
    
    // Cooldown timer for resending link to avoid backend rate limit
    const [cooldown, setCooldown] = useState(0);

    const navigate = useNavigate();
    const [forgotPassword, { isLoading: isSending }] = useForgotPasswordMutation();

    const [message, setMessage] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        let timer: any;
        if (cooldown > 0) {
            timer = setInterval(() => {
                setCooldown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [cooldown]);

    const handleSendResetLink = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        
        if (!email) {
            setErrorMsg("Please enter your email");
            return;
        }

        try {
            setErrorMsg("");
            setMessage("");

            const res = await forgotPassword({ email }).unwrap();
            setMessage(res?.message || "Reset link sent successfully!");
            setIsEmailSent(true);
            setCooldown(60); // Set 60 seconds cooldown
        } catch (error: any) {
            console.error("Forgot Password Error:", error);
            const apiMessage = error?.data?.message || "";
            // If backend rate limit is hit, start cooldown anyway to prevent spam
            if (apiMessage.toLowerCase().includes("wait") || apiMessage.toLowerCase().includes("too many attempts")) {
                setCooldown(60);
                setErrorMsg(apiMessage || "Please wait a minute before retrying.");
            } else {
                setErrorMsg(apiMessage || "Failed to send reset link. Please try again.");
            }
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col md:flex-row bg-white overflow-hidden">
            {/* Left Section: Branding/Illustration */}
            <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-12 flex-col justify-between relative overflow-hidden">
                {/* Abstract Shapes */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full -ml-48 -mb-48"></div>
                
                <div className="relative z-10">
                    <img src="/madd-admin.png" alt="MADD Logo" className="h-12 w-auto brightness-0 invert" />
                </div>
                
                <div className="relative z-10 text-white">
                    <h1 className="text-4xl font-bold leading-tight mb-4">Password Recovery</h1>
                    <p className="text-blue-100 text-lg max-w-md">
                        Don't worry, it happens to the best of us. Let's get you back into your account.
                    </p>
                </div>
                
                <div className="relative z-10 text-blue-200 text-sm">
                    © 2026 MADD Admin Dashboard. All rights reserved.
                </div>
            </div>

            {/* Right Section: Form */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 bg-gray-50/30">
                <div className="w-full max-w-md">
                    {/* Back Button */}
                    <button 
                        onClick={() => navigate(ROUTES.LOGIN)}
                        className="group flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors mb-10"
                    >
                        <FaArrowLeft className="mr-2 transform group-hover:-translate-x-1 transition-transform" />
                        Back to Login
                    </button>

                    <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
                        {isEmailSent ? (
                            <div className="text-center animate-in fade-in zoom-in duration-500">
                                <div className="h-20 w-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <FaEnvelopeOpenText className="text-3xl" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-3">Check Your Email</h2>
                                <p className="text-gray-500 text-sm leading-relaxed mb-8">
                                    We've sent a password reset link to: <br/>
                                    <span className="font-semibold text-gray-800">{email}</span>. <br/>
                                    Please check your inbox and click the link to create a new password.
                                </p>
                                
                                <div className="space-y-4">
                                    <div className="flex flex-col items-center gap-2">
                                        <p className="text-xs text-gray-400">Didn't receive the email?</p>
                                        <button 
                                            onClick={() => handleSendResetLink()} 
                                            disabled={isSending || cooldown > 0}
                                            className={`text-sm font-semibold transition-colors ${
                                                cooldown > 0 
                                                    ? "text-gray-400 cursor-not-allowed" 
                                                    : "text-blue-500 hover:text-blue-600 hover:underline"
                                            }`}
                                        >
                                            {cooldown > 0 ? `Resend link in ${cooldown}s` : "Resend reset link"}
                                        </button>
                                    </div>
                                    
                                    <button 
                                        onClick={() => setIsEmailSent(false)}
                                        className="w-full py-3 text-gray-500 hover:text-gray-700 font-medium text-sm transition-colors border border-gray-100 rounded-xl hover:bg-gray-50"
                                    >
                                        Try another email
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold text-gray-900">Forgot Password?</h2>
                                    <p className="text-sm text-gray-500 mt-2">
                                        Enter your email and we'll send you a link to reset your password.
                                    </p>
                                </div>

                                <form onSubmit={handleSendResetLink} className="space-y-6">
                                    {errorMsg && (
                                        <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-xl text-xs font-medium animate-shake">
                                            {errorMsg}
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Email Address</label>
                                        <div className="relative group">
                                            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
                                                placeholder="example@madd.com"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSending || cooldown > 0}
                                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {isSending ? "Sending..." : "Send Reset Link"}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;