// import { useState } from "react";
// import logo from "../../public/madd-admin.png"
// import SigninSuggestion from "../component/SigninSuggestion";
// import { Link } from "react-router-dom";
// import { FaLock, FaUser, FaArrowRight } from "react-icons/fa";
// import InputField from "../component/InputField";
// import { useRegisterAdminMutation } from "../app/api/AuthSlices/AuthSlices";

// const Signup = () => {
//     const [firstname, setFirstname] = useState("");
//     const [lastname, setLastname] = useState("");
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [passwordConfirmation, setPasswordConfirmation] = useState("");

//     const [register, { isLoading, error }] = useRegisterAdminMutation();

//     const handleSignup = async () => {
//         try {
//             const result = await register({
//                 firstname,
//                 lastname,
//                 email,
//                 password,
//                 password_confirmation: passwordConfirmation,
//             }).unwrap();

//             console.log("Success:", result);
//         } catch (err) {
//             console.error("Error:", err);
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


//                     <div className="flex justify-center items-center">
//                         <div className="w-50 mr-3.5">
//                             <InputField
//                                 label="First Name"
//                                 type="First Name"
//                                 value={firstname}
//                                 placeholder="esteban_schiller@gmail.com"
//                                 icon={FaUser}
//                                 onChange={setFirstname}
//                             />

//                         </div>
//                         <div className="w-50 ml-3.5">
//                             <InputField
//                                 label="Last Name"
//                                 type="Last Name"
//                                 value={lastname}
//                                 placeholder="esteban_schiller@gmail.com"
//                                 icon={FaUser}
//                                 onChange={setLastname}
//                             />
//                         </div>
//                     </div>
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
//                     <InputField
//                         label="Confirmation Password"
//                         type="password"
//                         value={passwordConfirmation}
//                         placeholder="Enter your password"
//                         icon={FaLock}
//                         onChange={setPasswordConfirmation}
//                     />


//                     {/* Social signin */}
//                     <SigninSuggestion
//                         onGoogleClick={() => console.log("Google login")}
//                         onAppleClick={() => console.log("Apple login")}
//                         onSignupClick={() => console.log("Go to signup")}
//                     />

//                 </div>

//                 <button
//                     onClick={handleSignup}
//                     className="w-24 h-24 bg-blue-400 text-white rounded-2xl flex flex-col items-center justify-center gap-2 shadow-lg
//                  rotate-45 hover:bg-blue-500 transition-all duration-300 fixed bottom-6 right-6 z-50"
//                 >
//                     <FaArrowRight className="-rotate-45 text-2xl relative right-2 top-3" />
//                     <span className="-rotate-45 text-lg font-medium relative left-3 buttom-6">
//                         Signup
//                     </span>
//                 </button>

//             </div>
//         </div>
//     )
// }


import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaLock, FaUser, FaArrowRight, FaBuilding, FaMapMarkerAlt, FaCity, FaEnvelope, FaPhone, FaSpinner } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { useRegisterMutation, useSocialLoginMutation } from "../app/api/AuthSlices/AuthSlices";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ROUTES } from "../router";
import { useGoogleLogin } from "@react-oauth/google";

const Signup = () => {
    // Form fields
    const [first_name, setFirst_name] = useState("");
    const [last_name, setLast_name] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [userType, setUserType] = useState("customer");
    const [countryCode, setCountryCode] = useState("");
    const [phone, setPhone] = useState("");
    const [locale, setLocale] = useState("en");
    const [marketingOptIn, setMarketingOptIn] = useState(false);
    const [referralCode, setReferralCode] = useState("");
    
    // Vendor fields
    const [companyName, setCompanyName] = useState("");
    const [vatNumber, setVatNumber] = useState("");
    const [addressLine1, setAddressLine1] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");
    
    // UI states
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [success, setSuccess] = useState(false);
    const [countries, setCountries] = useState([]);
    const [loadingCountries, setLoadingCountries] = useState(true);
    
    const navigate = useNavigate();
    const [register, { isLoading, error }] = useRegisterMutation();
    const [socialLogin, { isLoading: isSocialLoading }] = useSocialLoginMutation();
    const errorData = (error as any)?.data;
    const fieldErrors = errorData?.errors;
    const generalError = errorData?.message;
    
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
    
    // Fetch countries from backend
    useEffect(() => {
        const fetchCountries = async () => {
            try {
                setLoadingCountries(true);
                const response = await fetch('http://127.0.0.1:8000/api/v1/countries');
                const result = await response.json();
                
                if (result.success && result.data && result.data.length > 0) {
                    setCountries(result.data);
                    setCountryCode(result.data[0].code);
                } else {
                    // Fallback if no countries found
                    setCountries(fallbackCountries);
                    setCountryCode("US");
                }
            } catch (error) {
                console.error("Failed to fetch countries:", error);
                setCountries(fallbackCountries);
                setCountryCode("US");
            } finally {
                setLoadingCountries(false);
            }
        };
        
        fetchCountries();
    }, []);
    
    // Fallback countries
    const fallbackCountries = [
        { code: "US", name: "United States", phone_code: "+1", flag: "🇺🇸" },
        { code: "GB", name: "United Kingdom", phone_code: "+44", flag: "🇬🇧" },
        { code: "CA", name: "Canada", phone_code: "+1", flag: "🇨🇦" },
        { code: "AU", name: "Australia", phone_code: "+61", flag: "🇦🇺" },
        { code: "DE", name: "Germany", phone_code: "+49", flag: "🇩🇪" },
        { code: "FR", name: "France", phone_code: "+33", flag: "🇫🇷" },
        { code: "ES", name: "Spain", phone_code: "+34", flag: "🇪🇸" },
        { code: "IT", name: "Italy", phone_code: "+39", flag: "🇮🇹" },
        { code: "JP", name: "Japan", phone_code: "+81", flag: "🇯🇵" },
        { code: "CN", name: "China", phone_code: "+86", flag: "🇨🇳" },
        { code: "IN", name: "India", phone_code: "+91", flag: "🇮🇳" },
        { code: "BR", name: "Brazil", phone_code: "+55", flag: "🇧🇷" },
        { code: "MX", name: "Mexico", phone_code: "+52", flag: "🇲🇽" },
    ];

    const SecurityFields = () => (
        <div className="space-y-5">
            <div className="flex items-center gap-3 mb-1">
                <div className="w-1 h-5 bg-blue-500 rounded-full" />
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                    Security & Preferences
                </h3>
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-600">Password *</label>
                <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus-within:border-blue-400 focus-within:bg-white transition-all">
                    <FaLock className="text-gray-400 text-sm flex-shrink-0" />
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min. 8 characters"
                        className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder-gray-400"
                    />
                    <span onClick={() => setShowPassword(!showPassword)} className="cursor-pointer text-gray-500">
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>
            </div>
            
            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-600">Confirm Password *</label>
                <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus-within:border-blue-400 focus-within:bg-white transition-all">
                    <FaLock className="text-gray-400 text-sm flex-shrink-0" />
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        placeholder="Re-enter password"
                        className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder-gray-400"
                    />
                    <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="cursor-pointer text-gray-500">
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-600">Preferred Language</label>
                <select
                    value={locale}
                    onChange={(e) => setLocale(e.target.value)}
                    className="border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:border-blue-400 focus:bg-white outline-none transition-all"
                >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                </select>
            </div>

            <div className="flex items-center gap-3 mt-4">
                <input
                    type="checkbox"
                    id="marketing"
                    checked={marketingOptIn}
                    onChange={(e) => setMarketingOptIn(e.target.checked)}
                    className="w-4 h-4 text-blue-500 rounded border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="marketing" className="text-sm text-gray-600 cursor-pointer">
                    I'd like to receive marketing emails
                </label>
            </div>
        </div>
    );
    
    // Validation functions for each step
    const isStep1Valid = () => {
        return first_name.trim() !== "" && last_name.trim() !== "" && email.trim() !== "" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const isStep2Valid = () => {
        return countryCode !== "";
    };

    const isStep3Valid = () => {
        if (userType === "vendor") {
            return companyName.trim() !== "" && addressLine1.trim() !== "" && city.trim() !== "" && postalCode.trim() !== "";
        }
        // For customer, Step 3 is Security
        return password.length >= 8 && password === passwordConfirmation;
    };

    const isStep4Valid = () => {
        // Only for vendor
        return password.length >= 8 && password === passwordConfirmation;
    };

    const isFormValid = () => {
        if (userType === "vendor") {
            return isStep1Valid() && isStep2Valid() && isStep3Valid() && isStep4Valid();
        }
        return isStep1Valid() && isStep2Valid() && isStep3Valid();
    };
    
    const handleSignup = async () => {
        if (!isFormValid()) return;
        
        try {
            const payload = {
                first_name: first_name.trim(),
                last_name: last_name.trim(),
                email: email.trim().toLowerCase(),
                password: password,
                password_confirmation: passwordConfirmation,
                user_type: userType,
                country_code: countryCode,
                phone: phone || null,
                locale: locale,
                marketing_opt_in: marketingOptIn,
            };
            
            if (referralCode) {
                payload.referral_code = referralCode;
            }
            
            if (userType === "vendor") {
                payload.company_name = companyName.trim();
                payload.vat_number = vatNumber || null;
                payload.address_line1 = addressLine1.trim();
                payload.city = city.trim();
                payload.postal_code = postalCode.trim();
            }
            
            const result = await register(payload).unwrap();
            console.log("Success:", result);
            setSuccess(true);
            setTimeout(() => navigate(ROUTES.LOGIN), 3000);
        } catch (err) {
            console.error("Error:", err);
        }
    };
    
    return (
        <div className="min-h-screen flex overflow-hidden" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
            {/* LEFT PANEL - Diagonal Gradient Background */}
            <div className="relative hidden lg:flex lg:w-1/2 items-center justify-center overflow-hidden">
                <div className="absolute inset-0" style={{
                    background: "linear-gradient(135deg, #e8f8f0 0%, #c8eef0 30%, #a8d8f0 60%, #3ab5e6 100%)"
                }} />
                <div className="absolute" style={{
                    width: "120%",
                    height: "55%",
                    background: "rgba(255,255,255,0.55)",
                    transform: "rotate(-35deg) translateX(-10%) translateY(-30%)",
                    borderRadius: "8px",
                    top: "10%",
                    left: "-10%",
                }} />
                <div className="absolute" style={{
                    width: "80%",
                    height: "40%",
                    background: "linear-gradient(135deg, #3ab5e6cc, #1a8fc0cc)",
                    transform: "rotate(-35deg) translateX(20%) translateY(60%)",
                    borderRadius: "8px",
                    bottom: "0%",
                    left: "0%",
                }} />
                <div className="absolute" style={{
                    width: "60%",
                    height: "30%",
                    background: "rgba(255,255,255,0.3)",
                    transform: "rotate(-35deg) translateX(60%) translateY(20%)",
                    borderRadius: "8px",
                    bottom: "15%",
                    left: "10%",
                }} />
                <div className="relative z-10 text-white px-16 max-w-2xl">
                    <div className="mb-8">
                        <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                            {userType === "vendor" ? "Vendor Portal" : "Customer Portal"}
                        </span>
                        <h1 className="text-5xl font-extrabold leading-tight mb-6 drop-shadow-lg">
                            {userType === "vendor" ? (
                                <>Grow Your <br /><span className="text-blue-900/40">Business Faster</span></>
                            ) : (
                                <>Start Your <br /><span className="text-blue-900/40">Shopping Journey</span></>
                            )}
                        </h1>
                        <p className="text-white/90 text-xl font-medium leading-relaxed">
                            {userType === "vendor" 
                                ? "Join thousands of successful sellers and scale your business with ease."
                                : "Join our community to browse, buy, and track your orders in one place."}
                        </p>
                    </div>

                    <div className="space-y-8 mt-12">
                        {userType === "vendor" ? (
                            <>
                                <div className="flex items-start gap-5 group">
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl group-hover:bg-white/30 transition-all">
                                        📈
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold mb-1">Sales Tracking</h3>
                                        <p className="text-white/70 text-sm leading-snug">Monitor your sales performance with real-time data and insights.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-5 group">
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl group-hover:bg-white/30 transition-all">
                                        📦
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold mb-1">Inventory Control</h3>
                                        <p className="text-white/70 text-sm leading-snug">Manage your products and stock effortlessly across all regions.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-5 group">
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl group-hover:bg-white/30 transition-all">
                                        🌍
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold mb-1">Global Reach</h3>
                                        <p className="text-white/70 text-sm leading-snug">Expand your business to international markets with zero friction.</p>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex items-start gap-5 group">
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl group-hover:bg-white/30 transition-all">
                                        🛍️
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold mb-1">Best Deals</h3>
                                        <p className="text-white/70 text-sm leading-snug">Get access to exclusive discounts and the best prices online.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-5 group">
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl group-hover:bg-white/30 transition-all">
                                        🚚
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold mb-1">Fast Delivery</h3>
                                        <p className="text-white/70 text-sm leading-snug">Track your orders in real-time and enjoy blazing fast shipping.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-5 group">
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl group-hover:bg-white/30 transition-all">
                                        💖
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold mb-1">Wishlist Sync</h3>
                                        <p className="text-white/70 text-sm leading-snug">Save your favorite items and sync them across all your devices.</p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            
            {/* RIGHT PANEL - Form */}
            <div className="w-full lg:w-1/2 flex flex-col bg-white overflow-y-auto">
                <div className="flex items-center justify-between px-10 py-6 border-b border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Sign up</h2>
                    <img src="madd-admin.png" alt="MarketAdd Logo" className="h-12 object-contain" />
                </div>
                
                <div className="flex-1 flex flex-col justify-center px-10 lg:px-16 py-8 gap-5 w-full">
                    
                    {/* Error Display - Only backend errors */}
                    {error && !success && (
                        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg flex flex-col gap-1">
                            {fieldErrors ? (
                                Object.values(fieldErrors).flat().map((msg: any, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <span className="text-red-400">•</span>
                                        <span>{msg}</span>
                                    </div>
                                ))
                            ) : (
                                <span>{generalError ?? "Something went wrong."}</span>
                            )}
                        </div>
                    )}
                    
                    {/* Success Box */}
                    {success && (
                        <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
                            <span className="text-green-500 text-base">✓</span>
                            Account created successfully! Redirecting to login...
                        </div>
                    )}
                    
                    {/* Progress Indicator */}
                    <div className="flex items-center justify-between mb-8 px-2">
                        {(userType === "vendor" ? [1, 2, 3, 4] : [1, 2, 3]).map((s) => (
                            <div key={s} className="flex items-center flex-1 last:flex-none">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                                    step >= s ? 'bg-blue-500 text-white shadow-lg shadow-blue-200' : 'bg-gray-100 text-gray-400'
                                }`}>
                                    {step > s ? '✓' : s}
                                </div>
                                {s < (userType === "vendor" ? 4 : 3) && (
                                    <div className={`flex-1 h-1 mx-2 rounded-full transition-all duration-500 ${
                                        step > s ? 'bg-blue-500' : 'bg-gray-100'
                                    }`} />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="min-h-[400px]">
                        {/* STEP 1: Basic Account Info */}
                        {step === 1 && (
                            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                                {/* Account Type Selection - Modern Sliding Toggle */}
                                <div className="flex flex-col gap-3">
                                    <label className="text-sm font-semibold text-gray-600">Account Type *</label>
                                    <div className="relative flex w-full p-1 bg-gray-100 rounded-2xl border border-gray-200">
                                        <div 
                                            className="absolute top-1 bottom-1 transition-all duration-300 ease-out bg-white rounded-xl shadow-sm border border-gray-200"
                                            style={{ 
                                                width: "calc(50% - 4px)", 
                                                left: userType === "customer" ? "4px" : "calc(50%)" 
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setUserType("customer");
                                                if (step > 3) setStep(3);
                                            }}
                                            className={`relative z-10 flex-1 py-3 text-sm font-semibold transition-colors duration-300 ${userType === "customer" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                                        >
                                            Customer
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setUserType("vendor")}
                                            className={`relative z-10 flex-1 py-3 text-sm font-semibold transition-colors duration-300 ${userType === "vendor" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                                        >
                                            Vendor (Seller)
                                        </button>
                                    </div>
                                </div>

                                <div className="h-2" />

                                <div className="flex items-center gap-3 mb-1">
                                    <div className="w-1 h-5 bg-blue-500 rounded-full" />
                                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                                        Personal Information
                                    </h3>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-1 flex flex-col gap-1.5">
                                        <label className="text-sm font-semibold text-gray-600">First Name *</label>
                                        <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus-within:border-blue-400 focus-within:bg-white transition-all">
                                            <FaUser className="text-gray-400 text-sm flex-shrink-0" />
                                            <input
                                                type="text"
                                                value={first_name}
                                                onChange={(e) => setFirst_name(e.target.value)}
                                                placeholder="John"
                                                className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder-gray-400"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-1 flex flex-col gap-1.5">
                                        <label className="text-sm font-semibold text-gray-600">Last Name *</label>
                                        <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus-within:border-blue-400 focus-within:bg-white transition-all">
                                            <FaUser className="text-gray-400 text-sm flex-shrink-0" />
                                            <input
                                                type="text"
                                                value={last_name}
                                                onChange={(e) => setLast_name(e.target.value)}
                                                placeholder="Doe"
                                                className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder-gray-400"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-gray-600">Email address *</label>
                                    <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus-within:border-blue-400 focus-within:bg-white transition-all">
                                        <FaEnvelope className="text-gray-400 text-sm flex-shrink-0" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="john.doe@example.com"
                                            className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder-gray-400"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 2: Location Info */}
                        {step === 2 && (
                            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="flex items-center gap-3 mb-1">
                                    <div className="w-1 h-5 bg-blue-500 rounded-full" />
                                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                                        Location Details
                                    </h3>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-gray-600">Country *</label>
                                    {loadingCountries ? (
                                        <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 bg-gray-50">
                                            <FaSpinner className="animate-spin text-gray-400" />
                                            <span className="text-sm text-gray-500">Loading countries...</span>
                                        </div>
                                    ) : (
                                        <select
                                            value={countryCode}
                                            onChange={(e) => setCountryCode(e.target.value)}
                                            className="border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:border-blue-400 focus:bg-white outline-none transition-all cursor-pointer"
                                            required
                                        >
                                            <option value="">Select your country</option>
                                            {countries.map((country: any) => (
                                                <option key={country.code} value={country.code}>
                                                    {country.flag || "🌍"} {country.name} ({country.phone_code})
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-gray-600">Phone Number (Optional)</label>
                                    <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus-within:border-blue-400 focus-within:bg-white transition-all">
                                        <FaPhone className="text-gray-400 text-sm flex-shrink-0" />
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="+1234567890"
                                            className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder-gray-400"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: Business Info (Vendor Only) / Security (Customer Only) */}
                        {step === 3 && (
                            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                                {userType === "vendor" ? (
                                    <>
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-1 h-5 bg-blue-500 rounded-full" />
                                            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                                                Business Information
                                            </h3>
                                        </div>
                                        
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-sm font-semibold text-gray-600">Company Name *</label>
                                            <input
                                                type="text"
                                                value={companyName}
                                                onChange={(e) => setCompanyName(e.target.value)}
                                                placeholder="Your Business Name"
                                                className="border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:border-blue-400 focus:bg-white outline-none transition-all w-full"
                                            />
                                        </div>
                                        
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-sm font-semibold text-gray-600">Address Line 1 *</label>
                                            <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus-within:border-blue-400 focus-within:bg-white transition-all">
                                                <FaMapMarkerAlt className="text-gray-400 text-sm flex-shrink-0" />
                                                <input
                                                    type="text"
                                                    value={addressLine1}
                                                    onChange={(e) => setAddressLine1(e.target.value)}
                                                    placeholder="Street address"
                                                    className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder-gray-400"
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="flex gap-4">
                                            <div className="flex-1 flex flex-col gap-1.5">
                                                <label className="text-sm font-semibold text-gray-600">City *</label>
                                                <input
                                                    type="text"
                                                    value={city}
                                                    onChange={(e) => setCity(e.target.value)}
                                                    placeholder="City"
                                                    className="border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:border-blue-400 focus:bg-white outline-none transition-all w-full"
                                                />
                                            </div>
                                            <div className="flex-1 flex flex-col gap-1.5">
                                                <label className="text-sm font-semibold text-gray-600">Postal Code *</label>
                                                <input
                                                    type="text"
                                                    value={postalCode}
                                                    onChange={(e) => setPostalCode(e.target.value)}
                                                    placeholder="Postal Code"
                                                    className="border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:border-blue-400 focus:bg-white outline-none transition-all w-full"
                                                />
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <SecurityFields />
                                )}
                            </div>
                        )}

                        {/* STEP 4: Security (Vendor Only) */}
                        {step === 4 && userType === "vendor" && (
                            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                                <SecurityFields />
                            </div>
                        )}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex gap-4 mt-8">
                        {step > 1 && (
                            <button
                                onClick={() => setStep(step - 1)}
                                className="flex-1 py-3.5 rounded-xl font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all"
                            >
                                Back
                            </button>
                        )}
                        
                        {((userType === "vendor" && step < 4) || (userType === "customer" && step < 3)) ? (
                            <button
                                onClick={() => setStep(step + 1)}
                                disabled={
                                    (step === 1 && !isStep1Valid()) || 
                                    (step === 2 && !isStep2Valid()) || 
                                    (step === 3 && userType === "vendor" && !isStep3Valid())
                                }
                                className={`flex-[2] flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white text-sm shadow-md transition-all duration-300 
                                    ${(
                                        (step === 1 && !isStep1Valid()) || 
                                        (step === 2 && !isStep2Valid()) || 
                                        (step === 3 && userType === "vendor" && !isStep3Valid())
                                    ) 
                                        ? 'opacity-50 cursor-not-allowed bg-gray-300' 
                                        : 'bg-blue-500 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer'
                                    }`}
                            >
                                Continue
                                <FaArrowRight className="text-xs" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSignup}
                                disabled={
                                    (userType === "vendor" ? !isStep4Valid() : !isStep3Valid()) || 
                                    isLoading || success
                                }
                                className={`flex-[2] flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white text-sm shadow-md transition-all duration-300 
                                    ${(
                                        (userType === "vendor" ? !isStep4Valid() : !isStep3Valid()) || 
                                        isLoading || success
                                    ) 
                                        ? 'opacity-50 cursor-not-allowed bg-gray-300' 
                                        : 'bg-green-500 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer'
                                    }`}
                            >
                                {isLoading ? <FaSpinner className="animate-spin" /> : "Complete Signup"}
                            </button>
                        )}
                    </div>

                    {/* Social Login (Only on Step 1) */}
                    {step === 1 && (
                        <>
                            <div className="flex items-center gap-4 mt-8">
                                <div className="flex-1 h-px bg-gray-200" />
                                <span className="text-xs text-gray-400 font-medium">OR</span>
                                <div className="flex-1 h-px bg-gray-200" />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mt-6">
                                <button
                                    onClick={() => loginWithGoogle()}
                                    disabled={isLoading || isSocialLoading}
                                    className="flex items-center justify-center gap-3 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 transition-all"
                                >
                                    <FcGoogle className="text-lg" />
                                    Google
                                </button>
                                <button
                                    onClick={() => console.log("Apple login")}
                                    className="flex items-center justify-center gap-3 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 transition-all"
                                >
                                    <FaApple className="text-lg text-gray-800" />
                                    Apple
                                </button>
                            </div>
                        </>
                    )}
                    
                    <p className="text-center text-sm text-gray-500 mt-8">
                        Already have an account?{" "}
                        <Link to={ROUTES.LOGIN} className="text-blue-500 font-semibold hover:underline">
                            Log in
                        </Link>
                    </p>
                    
                </div>
            </div>
        </div>
    );
};

export default Signup;