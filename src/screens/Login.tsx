import { useState } from 'react'
import logo from "../../public/madd-admin.png"
import { FaLock, FaUser, FaArrowRight } from "react-icons/fa";
import InputField from '../component/InputField';
import { Link } from 'react-router-dom';
import SigninSuggestion from '../component/SigninSuggestion';
import { useLoginAdminMutation } from "../app/AuthSlices/AuthSlices";

const Login = () => {
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [loginAdmin, { isLoading, error }] = useLoginAdminMutation();

    const handleLogin = async () => {
        try {
            const result = await loginAdmin({
                email,
                password,
            }).unwrap();

            console.log("Login Success:", result);

            // Optional: Save token
            localStorage.setItem("token", result.token);

        } catch (err) {
            console.error("Login Error:", err);
        }
    };

    return (
        <div>
            <div className="lg:min-h-screen lg:flex lg:flex-col lg:gap-6">
                <div className=" lg:flex lg:items-center lg:justify-between px-6 py-4">
                    <h3 className="pl-30 text-2xl font-semibold tracking-wide text-gray-800">
                        Log in
                    </h3>
                    {isLoading && <p>Registering...</p>}
                    {error && <p style={{ color: "red" }}>Something went wrong</p>}
                    <img
                        src={logo}
                        alt="main logo"
                        className="h-16 object-contain pr-30"
                    />
                </div>

                <div className="w-105 flex flex-col gap-5 translate-x-200 translate-y-10">

                    {/* Email */}
                    <InputField
                        label="Email address"
                        type="email"
                        value={email}
                        placeholder="esteban_schiller@gmail.com"
                        icon={FaUser}
                        onChange={setEmail}
                    />

                    {/* Password */}
                    <InputField
                        label="Password"
                        type="password"
                        value={password}
                        placeholder="Enter your password"
                        icon={FaLock}
                        onChange={setPassword}
                    />

                    {/* Forgot password */}
                    <div className="text-right">
                        <Link
                            to=""
                            className="text-sm font-medium text-blue-500 hover:text-blue-600 hover:underline"
                        >
                            Forgot Password?
                        </Link>
                    </div>

                    {/* Social signin */}
                    <SigninSuggestion
                        onGoogleClick={() => console.log("Google login")}
                        onAppleClick={() => console.log("Apple login")}
                        onSignupClick={() => console.log("Go to signup")}
                    />

                </div>

                <button
                    onClick={handleLogin}
                    className="w-24 h-24 bg-blue-400 text-white rounded-2xl flex flex-col items-center justify-center gap-2 shadow-lg
                 rotate-45 hover:bg-blue-500 transition-all duration-300 fixed bottom-6 right-6 z-50"
                >
                    <FaArrowRight className="-rotate-45 text-2xl relative right-2 top-3" />
                    <span className="-rotate-45 text-lg font-medium relative left-3 buttom-6">
                        Login
                    </span>
                </button>
            </div>
        </div>
    )
}

export default Login
