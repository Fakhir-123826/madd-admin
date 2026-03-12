// import { useState } from 'react'
// import logo from "../../public/madd-admin.png"
// import { FaLock, FaUser, FaArrowRight } from "react-icons/fa";
// import InputField from '../component/InputField';
// import { Link } from 'react-router-dom';
// import SigninSuggestion from '../component/SigninSuggestion';
// import { useLoginAdminMutation } from "../app/api/AuthSlices/AuthSlices";

// const Login = () => {
//     const [password, setPassword] = useState("");
//     const [email, setEmail] = useState("");
//     const [loginAdmin, { isLoading, error }] = useLoginAdminMutation();

//     const handleLogin = async () => {
//         try {
//             const result = await loginAdmin({
//                 email,
//                 password,
//             }).unwrap();

//             console.log("Login Success:", result);

//             // Optional: Save token
//             localStorage.setItem("token", result.token);

//         } catch (err) {
//             console.error("Login Error:", err);
//         }
//     };

//     return (
//         <div>
//             <div className="lg:min-h-screen lg:flex lg:flex-col lg:gap-6">
//                 <div className=" lg:flex lg:items-center lg:justify-between px-6 py-4">
//                     <h3 className="pl-30 text-2xl font-semibold tracking-wide text-gray-800">
//                         Log in
//                     </h3>
//                     {isLoading && <p>Registering...</p>}
//                     {error && <p style={{ color: "red" }}>Something went wrong</p>}
//                     <img
//                         src={logo}
//                         alt="main logo"
//                         className="h-16 object-contain pr-30"
//                     />
//                 </div>

//                 <div className="w-105 flex flex-col gap-5 translate-x-200 translate-y-10">

//                     {/* Email */}
//                     <InputField
//                         label="Email address"
//                         type="email"
//                         value={email}
//                         placeholder="esteban_schiller@gmail.com"
//                         icon={FaUser}
//                         onChange={setEmail}
//                     />

//                     {/* Password */}
//                     <InputField
//                         label="Password"
//                         type="password"
//                         value={password}
//                         placeholder="Enter your password"
//                         icon={FaLock}
//                         onChange={setPassword}
//                     />

//                     {/* Forgot password */}
//                     <div className="text-right">
//                         <Link
//                             to=""
//                             className="text-sm font-medium text-blue-500 hover:text-blue-600 hover:underline"
//                         >
//                             Forgot Password?
//                         </Link>
//                     </div>

//                     {/* Social signin */}
//                     <SigninSuggestion
//                         onGoogleClick={() => console.log("Google login")}
//                         onAppleClick={() => console.log("Apple login")}
//                         onSignupClick={() => console.log("Go to signup")}
//                     />

//                 </div>

//                 <button
//                     onClick={handleLogin}
//                     className="w-24 h-24 bg-blue-400 text-white rounded-2xl flex flex-col items-center justify-center gap-2 shadow-lg
//                  rotate-45 hover:bg-blue-500 transition-all duration-300 fixed bottom-6 right-6 z-50"
//                 >
//                     <FaArrowRight className="-rotate-45 text-2xl relative right-2 top-3" />
//                     <span className="-rotate-45 text-lg font-medium relative left-3 buttom-6">
//                         Login
//                     </span>
//                 </button>
//             </div>
//         </div>
//     )
// }

// export default Login


import { useState } from 'react'
import { FaLock, FaUser, FaArrowRight } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { useLoginAdminMutation } from "../app/api/AuthSlices/AuthSlices";


const Login = () => {
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [loginAdmin, { isLoading, error }] = useLoginAdminMutation();
const navigate = useNavigate()
    const handleLogin = async () => {
        try {
            const result = await loginAdmin({ email, password }).unwrap();
            console.log("Login Success:", result);
            localStorage.setItem("token", result.token);
            navigate("/MagentoOrders");
        } catch (err) {
            console.error("Login Error:", err);
        }
    };

    return (
        <div className="min-h-screen flex overflow-hidden" style={{ fontFamily: "'Segoe UI', sans-serif" }}>

            {/* LEFT - Diagonal Gradient Background */}
            <div className="relative hidden lg:flex lg:w-1/2 items-center justify-center overflow-hidden">
                {/* Base gradient */}
                <div className="absolute inset-0" style={{
                    background: "linear-gradient(135deg, #e8f8f0 0%, #c8eef0 30%, #a8d8f0 60%, #3ab5e6 100%)"
                }} />

                {/* Diagonal shape 1 - white */}
                <div className="absolute" style={{
                    width: "120%",
                    height: "55%",
                    background: "rgba(255,255,255,0.55)",
                    transform: "rotate(-35deg) translateX(-10%) translateY(-30%)",
                    borderRadius: "8px",
                    top: "10%",
                    left: "-10%",
                }} />

                {/* Diagonal shape 2 - teal */}
                <div className="absolute" style={{
                    width: "80%",
                    height: "40%",
                    background: "linear-gradient(135deg, #3ab5e6cc, #1a8fc0cc)",
                    transform: "rotate(-35deg) translateX(20%) translateY(60%)",
                    borderRadius: "8px",
                    bottom: "0%",
                    left: "0%",
                }} />

                {/* Diagonal shape 3 - light blue */}
                <div className="absolute" style={{
                    width: "60%",
                    height: "30%",
                    background: "rgba(255,255,255,0.3)",
                    transform: "rotate(-35deg) translateX(60%) translateY(20%)",
                    borderRadius: "8px",
                    bottom: "15%",
                    left: "10%",
                }} />

                {/* Centered text on left */}
                <div className="relative z-10 text-center px-12">
                    <h1 className="text-4xl font-bold text-white drop-shadow-md mb-3">Welcome Back</h1>
                    <p className="text-white/80 text-lg">Sign in to manage your store</p>
                </div>
            </div>

            {/* RIGHT - Form Panel */}
            <div className="w-full lg:w-1/2 flex flex-col bg-white">

                {/* Top bar with logo */}
                <div className="flex items-center justify-between px-10 py-6 border-b border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Log in</h2>
                    <img src="madd-admin.png" alt="MarketAdd Logo" className="h-12 object-contain" />
                </div>

                {/* Form */}
                <div className="flex-1 flex flex-col justify-center px-10 lg:px-16 py-10 gap-6 w-full">

                    {/* Error */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
                            Invalid email or password. Please try again.
                        </div>
                    )}

                    {/* Email */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-gray-600">Email address</label>
                        <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus-within:border-blue-400 focus-within:bg-white transition-all">
                            <FaUser className="text-gray-400 text-sm flex-shrink-0" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="esteban_schiller@gmail.com"
                                className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder-gray-400"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-gray-600">Password</label>
                        <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus-within:border-blue-400 focus-within:bg-white transition-all">
                            <FaLock className="text-gray-400 text-sm flex-shrink-0" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder-gray-400"
                            />
                        </div>
                    </div>

                    {/* Forgot Password */}
                    <div className="text-right -mt-3">
                        <Link to="" className="text-sm font-medium text-blue-500 hover:text-blue-600 hover:underline transition-colors">
                            Forgot Password?
                        </Link>
                    </div>

                    {/* Login Button */}
                    <button
                        onClick={handleLogin}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white text-sm shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                        style={{ background: "linear-gradient(135deg, #3ab5e6, #1a8fc0)" }}
                    >
                        {isLoading ? "Logging in..." : (
                            <>
                                Login
                                <FaArrowRight className="text-xs" />
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
                        onClick={() => console.log("Google login")}
                        className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 transition-all hover:border-gray-300 hover:shadow-sm"
                    >
                        <FcGoogle className="text-lg" />
                        Continue with Google
                    </button>

                    {/* Apple */}
                    <button
                        onClick={() => console.log("Apple login")}
                        className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 transition-all hover:border-gray-300 hover:shadow-sm"
                    >
                        <FaApple className="text-lg text-gray-800" />
                        Continue with Apple
                    </button>

                    {/* Signup link */}
                    <p className="text-center text-sm text-gray-500">
                        Don't have an account?{" "}
                        <Link to="/Signup" className="text-blue-500 font-semibold hover:underline">
                            Sign up
                        </Link>
                    </p>

                </div>
            </div>
        </div>
    );
};

export default Login;