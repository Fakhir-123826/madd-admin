import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../router";

const VerifyEmail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const emailFromState = location.state?.email || "";
    
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const verificationUrl = params.get("url");

        if (verificationUrl) {
            setIsVerifying(true);
            fetch(verificationUrl)
                .then(async (response) => {
                    if (response.ok) {
                        setSuccess("Email verified successfully! Redirecting to login...");
                        setTimeout(() => navigate(ROUTES.LOGIN), 2000);
                    } else {
                        const data = await response.json().catch(() => ({}));
                        setError(data?.message || "Verification failed. The link may be invalid or expired.");
                    }
                })
                .catch(() => {
                    setError("Unable to verify email. Please check your connection and try again.");
                })
                .finally(() => {
                    setIsVerifying(false);
                });
        }
    }, [navigate]);

    // If no verification URL in query params, show a message
    if (!new URLSearchParams(window.location.search).get("url")) {
        return (
            <div
                className="min-h-screen flex overflow-hidden"
                style={{ fontFamily: "'Segoe UI', sans-serif" }}
            >
                {/* LEFT SIDE - Diagonal design */}
                <div className="relative hidden lg:flex lg:w-1/2 items-center justify-center overflow-hidden">
                    <div
                        className="absolute inset-0"
                        style={{
                            background:
                                "linear-gradient(135deg, #e8f8f0 0%, #c8eef0 30%, #a8d8f0 60%, #3ab5e6 100%)",
                        }}
                    />
                    <div
                        className="absolute"
                        style={{
                            width: "120%", height: "55%",
                            background: "rgba(255,255,255,0.55)",
                            transform: "rotate(-35deg) translateX(-10%) translateY(-30%)",
                            borderRadius: "8px", top: "10%", left: "-10%",
                        }}
                    />
                    <div
                        className="absolute"
                        style={{
                            width: "80%", height: "40%",
                            background: "linear-gradient(135deg, #3ab5e6cc, #1a8fc0cc)",
                            transform: "rotate(-35deg) translateX(20%) translateY(60%)",
                            borderRadius: "8px", bottom: "0%", left: "0%",
                        }}
                    />
                    <div
                        className="absolute"
                        style={{
                            width: "60%", height: "30%",
                            background: "rgba(255,255,255,0.3)",
                            transform: "rotate(-35deg) translateX(60%) translateY(20%)",
                            borderRadius: "8px", bottom: "15%", left: "10%",
                        }}
                    />
                    <div className="relative z-10 text-center px-12">
                        <div
                            className="mx-auto mb-6 flex items-center justify-center rounded-full"
                            style={{
                                width: 80, height: 80,
                                background: "rgba(255,255,255,0.25)",
                                backdropFilter: "blur(8px)",
                                border: "2px solid rgba(255,255,255,0.5)",
                            }}
                        >
                            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h1 className="text-4xl font-bold text-white drop-shadow-md mb-3">
                            Verify Your Email
                        </h1>
                        <p className="text-white/80 text-lg">
                            Click the link sent to your inbox
                        </p>
                    </div>
                </div>

                {/* RIGHT SIDE - Form Panel */}
                <div className="w-full lg:w-1/2 flex flex-col bg-white">
                    <div className="flex items-center justify-between px-10 py-6 border-b border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
                            Email Verification
                        </h2>
                        <img
                            src="madd-admin.png"
                            alt="MarketAdd Logo"
                            className="h-12 object-contain"
                        />
                    </div>

                    <div className="flex-1 flex flex-col justify-center px-10 lg:px-16 py-10 gap-6">
                        <div className="text-center">
                            <p className="text-gray-500 text-sm leading-relaxed">
                                A verification link was sent to
                            </p>
                            <p className="text-gray-800 font-semibold text-sm mt-1">
                                {emailFromState || "your email address"}
                            </p>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                            <svg
                                className="mx-auto mb-4"
                                width="48"
                                height="48"
                                viewBox="0 0 24 24"
                                fill="none"
                            >
                                <path
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    stroke="#3ab5e6"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M12 13v3m0 0v3m0-3h3m-3 0H9"
                                    stroke="#3ab5e6"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <p className="text-gray-700 text-sm mb-4">
                                Please check your email inbox and click the verification link to activate your account.
                            </p>
                            <p className="text-gray-400 text-xs">
                                Didn't receive the email? Check your spam folder or contact support.
                            </p>
                        </div>

                        <button
                            onClick={() => navigate(ROUTES.LOGIN)}
                            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white text-sm shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                            style={{
                                background: "linear-gradient(135deg, #3ab5e6, #1a8fc0)",
                            }}
                        >
                            Back to Login
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="2"
                                    strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                        <div className="text-center">
                            <button
                                onClick={() => window.location.reload()}
                                className="text-sm text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-1.5 mx-auto"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                I have verified, check again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Verification in progress UI
    return (
        <div
            className="min-h-screen flex overflow-hidden"
            style={{ fontFamily: "'Segoe UI', sans-serif" }}
        >
            {/* LEFT SIDE - Diagonal design */}
            <div className="relative hidden lg:flex lg:w-1/2 items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "linear-gradient(135deg, #e8f8f0 0%, #c8eef0 30%, #a8d8f0 60%, #3ab5e6 100%)",
                    }}
                />
                <div
                    className="absolute"
                    style={{
                        width: "120%", height: "55%",
                        background: "rgba(255,255,255,0.55)",
                        transform: "rotate(-35deg) translateX(-10%) translateY(-30%)",
                        borderRadius: "8px", top: "10%", left: "-10%",
                    }}
                />
                <div
                    className="absolute"
                    style={{
                        width: "80%", height: "40%",
                        background: "linear-gradient(135deg, #3ab5e6cc, #1a8fc0cc)",
                        transform: "rotate(-35deg) translateX(20%) translateY(60%)",
                        borderRadius: "8px", bottom: "0%", left: "0%",
                    }}
                />
                <div
                    className="absolute"
                    style={{
                        width: "60%", height: "30%",
                        background: "rgba(255,255,255,0.3)",
                        transform: "rotate(-35deg) translateX(60%) translateY(20%)",
                        borderRadius: "8px", bottom: "15%", left: "10%",
                    }}
                />
                <div className="relative z-10 text-center px-12">
                    <div
                        className="mx-auto mb-6 flex items-center justify-center rounded-full"
                        style={{
                            width: 80, height: 80,
                            background: "rgba(255,255,255,0.25)",
                            backdropFilter: "blur(8px)",
                            border: "2px solid rgba(255,255,255,0.5)",
                        }}
                    >
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold text-white drop-shadow-md mb-3">
                        Verifying...
                    </h1>
                    <p className="text-white/80 text-lg">
                        Please wait while we confirm your email
                    </p>
                </div>
            </div>

            {/* RIGHT SIDE - Verification Status */}
            <div className="w-full lg:w-1/2 flex flex-col bg-white">
                <div className="flex items-center justify-between px-10 py-6 border-b border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
                        Email Verification
                    </h2>
                    <img
                        src="madd-admin.png"
                        alt="MarketAdd Logo"
                        className="h-12 object-contain"
                    />
                </div>

                <div className="flex-1 flex flex-col justify-center px-10 lg:px-16 py-10 gap-6">
                    {isVerifying && !error && !success && (
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-cyan-500 mx-auto mb-6"></div>
                            <p className="text-gray-600">Verifying your email address...</p>
                        </div>
                    )}

                    {error && (
                        <>
                            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg text-center">
                                {error}
                            </div>
                            <button
                                onClick={() => navigate(ROUTES.LOGIN)}
                                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white text-sm shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                                style={{
                                    background: "linear-gradient(135deg, #3ab5e6, #1a8fc0)",
                                }}
                            >
                                Back to Login
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                    <path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="2"
                                        strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </>
                    )}

                    {success && (
                        <>
                            <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-lg text-center">
                                {success}
                            </div>
                            <div className="animate-pulse text-center text-gray-400 text-sm">
                                Redirecting...
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;