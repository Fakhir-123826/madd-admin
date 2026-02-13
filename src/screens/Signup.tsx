import { useState } from "react";
import logo from "../../public/madd-admin.png"
import SigninSuggestion from "../component/SigninSuggestion";
import { Link } from "react-router-dom";
import { FaLock, FaUser, FaArrowRight } from "react-icons/fa";
import InputField from "../component/InputField";
import { useRegisterAdminMutation } from "../app/api/AuthSlices/AuthSlices";

const Signup = () => {
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    const [register, { isLoading, error }] = useRegisterAdminMutation();

    const handleSignup = async () => {
        try {
            const result = await register({
                firstname,
                lastname,
                email,
                password,
                password_confirmation: passwordConfirmation,
            }).unwrap();

            console.log("Success:", result);
        } catch (err) {
            console.error("Error:", err);
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


                    <div className="flex justify-center items-center">
                        <div className="w-50 mr-3.5">
                            <InputField
                                label="First Name"
                                type="First Name"
                                value={firstname}
                                placeholder="esteban_schiller@gmail.com"
                                icon={FaUser}
                                onChange={setFirstname}
                            />

                        </div>
                        <div className="w-50 ml-3.5">
                            <InputField
                                label="Last Name"
                                type="Last Name"
                                value={lastname}
                                placeholder="esteban_schiller@gmail.com"
                                icon={FaUser}
                                onChange={setLastname}
                            />
                        </div>
                    </div>
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
                    <InputField
                        label="Confirmation Password"
                        type="password"
                        value={passwordConfirmation}
                        placeholder="Enter your password"
                        icon={FaLock}
                        onChange={setPasswordConfirmation}
                    />


                    {/* Social signin */}
                    <SigninSuggestion
                        onGoogleClick={() => console.log("Google login")}
                        onAppleClick={() => console.log("Apple login")}
                        onSignupClick={() => console.log("Go to signup")}
                    />

                </div>

                <button
                    onClick={handleSignup}
                    className="w-24 h-24 bg-blue-400 text-white rounded-2xl flex flex-col items-center justify-center gap-2 shadow-lg
                 rotate-45 hover:bg-blue-500 transition-all duration-300 fixed bottom-6 right-6 z-50"
                >
                    <FaArrowRight className="-rotate-45 text-2xl relative right-2 top-3" />
                    <span className="-rotate-45 text-lg font-medium relative left-3 buttom-6">
                        Signup
                    </span>
                </button>

            </div>
        </div>
    )
}

export default Signup
