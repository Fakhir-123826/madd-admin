import { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [token, setToken] = useState(""); // OTP/token from backend
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const [step, setStep] = useState(1);
    // step 1 = email form
    // step 2 = reset password form

    // STEP 1 → Send OTP
    const handleSendOTP = async () => {
        if (!email) {
            setMessage("Please enter your email");
            return;
        }

        try {
            setLoading(true);
            setMessage("");

            const response = await axios.post(
                "http://127.0.0.1:8000/api/auth/forgot-password",
                { email },
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            // Assuming backend returns token (or you may input OTP manually)
            console.log(response.data);

            setMessage("OTP sent successfully!");
            setStep(2); // 👉 move to reset form

        } catch (error) {
            console.error(error);
            setMessage("Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    // STEP 2 → Reset Password
    const handleResetPassword = async () => {
        if (!token || !password || !passwordConfirmation) {
            setMessage("Please fill all fields");
            return;
        }

        if (password !== passwordConfirmation) {
            setMessage("Passwords do not match");
            return;
        }

        try {
            setLoading(true);
            setMessage("");

            const response = await axios.post(
                "http://127.0.0.1:8000/api/auth/reset-password",
                {
                    email,
                    token,
                    password,
                    password_confirmation: passwordConfirmation
                },
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            console.log(response.data);
            setMessage("Password reset successfully!");

        } catch (error) {
            console.error(error);
            setMessage("Reset failed!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="lg:min-h-screen lg:flex lg:flex-col lg:gap-6">

            {/* HEADER */}
            <div className="lg:flex lg:items-center lg:justify-between px-6 py-4">
                <h3 className="text-blue-500 text-2xl font-semibold shadow-xl">
                    Forgot Password
                </h3>
            </div>

            {/* STEP 1: EMAIL FORM */}
            {step === 1 && (
                <div className="flex justify-center items-center">
                    <div className="w-[420px] rounded-2xl bg-white p-6 shadow-xl">

                        <h2 className="mb-6 text-lg font-medium text-gray-800">
                            Enter your email address
                        </h2>

                        <input
                            type="email"
                            placeholder="example@xyz.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="h-11 w-full rounded-lg bg-gray-100 px-4 border mb-4"
                        />

                        {message && <p className="mb-4 text-sm text-center">{message}</p>}

                        <button
                            onClick={handleSendOTP}
                            disabled={loading}
                            className="h-12 w-full rounded-xl bg-gradient-to-r from-cyan-400 to-green-400 text-white"
                        >
                            {loading ? "Sending..." : "Send OTP"}
                        </button>

                    </div>
                </div>
            )}

            {/* STEP 2: RESET PASSWORD FORM */}
            {step === 2 && (
                <div className="flex justify-center items-center">
                    <div className="w-[420px] rounded-2xl bg-white p-6 shadow-xl">

                        <h2 className="mb-6 text-lg font-medium text-gray-800">
                            Reset your password
                        </h2>

                        {/* Token (OTP) */}
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            className="h-11 w-full rounded-lg bg-gray-100 px-4 border mb-4"
                        />

                        {/* New Password */}
                        <div className="relative mb-4">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="New Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-11 w-full rounded-lg bg-gray-100 px-4 pr-10 border"
                            />

                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 cursor-pointer text-gray-500"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>

                        {/* Confirm Password */}
                        <div className="relative mb-4">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm Password"
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                className="h-11 w-full rounded-lg bg-gray-100 px-4 pr-10 border"
                            />

                            <span
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-3 cursor-pointer text-gray-500"
                            >
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                        {message && <p className="mb-4 text-sm text-center">{message}</p>}

                        <button
                            onClick={handleResetPassword}
                            disabled={loading}
                            className="h-12 w-full rounded-xl bg-gradient-to-r from-cyan-400 to-green-400 text-white"
                        >
                            {loading ? "Resetting..." : "Confirm Password"}
                        </button>

                    </div>
                </div>
            )}

        </div>
    );
}

export default ForgotPassword;