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
import { useRegisterMutation } from "../app/api/AuthSlices/AuthSlices";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ROUTES } from "../router";

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
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [success, setSuccess] = useState(false);
    const [countries, setCountries] = useState([]);
    const [loadingCountries, setLoadingCountries] = useState(true);
    
    const navigate = useNavigate();
    const [register, { isLoading, error }] = useRegisterMutation();
    const errorData = (error as any)?.data;
    const fieldErrors = errorData?.errors;
    const generalError = errorData?.message;
    
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
    
    // Validation function
    const isFormValid = () => {
        if (!first_name.trim()) return false;
        if (!last_name.trim()) return false;
        if (!email.trim()) return false;
        if (!password) return false;
        if (!passwordConfirmation) return false;
        if (password !== passwordConfirmation) return false;
        if (password.length < 8) return false;
        if (!countryCode) return false;
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return false;
        
        if (userType === "vendor") {
            if (!companyName.trim()) return false;
            if (!addressLine1.trim()) return false;
            if (!city.trim()) return false;
            if (!postalCode.trim()) return false;
        }
        
        return true;
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
                <div className="relative z-10 text-center px-12">
                    <h1 className="text-4xl font-bold text-white drop-shadow-md mb-3">Create Account</h1>
                    <p className="text-white/80 text-lg">Join us and manage your store</p>
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
                    
                    {/* Account Type Selection */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-gray-600">Account Type *</label>
                        <div className="flex gap-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    value="customer"
                                    checked={userType === "customer"}
                                    onChange={(e) => setUserType(e.target.value)}
                                    className="w-4 h-4 text-blue-500"
                                />
                                <span className="text-sm text-gray-700">Customer</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    value="vendor"
                                    checked={userType === "vendor"}
                                    onChange={(e) => setUserType(e.target.value)}
                                    className="w-4 h-4 text-blue-500"
                                />
                                <span className="text-sm text-gray-700">Vendor (Seller)</span>
                            </label>
                        </div>
                    </div>
                    
                    {/* First Name + Last Name */}
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
                    
                    {/* Email */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-gray-600">Email address *</label>
                        <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus-within:border-blue-400 focus-within:bg-white transition-all">
                            <FaEnvelope className="text-gray-400 text-sm flex-shrink-0" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="esteban_schiller@gmail.com"
                                className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder-gray-400"
                            />
                        </div>
                    </div>
                    
                    {/* Country Code - Dynamic from backend */}
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
                    
                    {/* Phone (Optional) */}
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
                    
                    {/* Referral Code */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-gray-600">Referral Code (Optional)</label>
                        <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus-within:border-blue-400 focus-within:bg-white transition-all">
                            <FaUser className="text-gray-400 text-sm flex-shrink-0" />
                            <input
                                type="text"
                                value={referralCode}
                                onChange={(e) => setReferralCode(e.target.value)}
                                placeholder="Enter referral code"
                                className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder-gray-400"
                            />
                        </div>
                    </div>
                    
                    {/* Password */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-gray-600">Password *</label>
                        <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus-within:border-blue-400 focus-within:bg-white transition-all">
                            <FaLock className="text-gray-400 text-sm flex-shrink-0" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password (min. 8 characters)"
                                className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder-gray-400"
                            />
                            <span onClick={() => setShowPassword(!showPassword)} className="cursor-pointer text-gray-500">
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                    </div>
                    
                    {/* Confirm Password */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-gray-600">Confirm Password *</label>
                        <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus-within:border-blue-400 focus-within:bg-white transition-all">
                            <FaLock className="text-gray-400 text-sm flex-shrink-0" />
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                placeholder="Re-enter your password"
                                className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder-gray-400"
                            />
                            <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="cursor-pointer text-gray-500">
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                        {password && passwordConfirmation && password !== passwordConfirmation && (
                            <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                        )}
                    </div>
                    
                    {/* Locale/Language */}
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
                            <option value="it">Italiano</option>
                            <option value="pt">Português</option>
                            <option value="ja">日本語</option>
                            <option value="zh">中文</option>
                        </select>
                    </div>
                    
                    {/* Vendor Specific Fields */}
                    {userType === "vendor" && (
                        <div className="border-t border-gray-200 pt-4 mt-2 space-y-4">
                            <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <FaBuilding className="text-blue-500" />
                                Business Information
                            </h3>
                            
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
                                <label className="text-sm font-semibold text-gray-600">VAT Number (Optional)</label>
                                <input
                                    type="text"
                                    value={vatNumber}
                                    onChange={(e) => setVatNumber(e.target.value)}
                                    placeholder="VAT123456789"
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
                                    <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus-within:border-blue-400 focus-within:bg-white transition-all">
                                        <FaCity className="text-gray-400 text-sm flex-shrink-0" />
                                        <input
                                            type="text"
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            placeholder="City"
                                            className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder-gray-400"
                                        />
                                    </div>
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
                        </div>
                    )}
                    
                    {/* Marketing Opt-in */}
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="marketing"
                            checked={marketingOptIn}
                            onChange={(e) => setMarketingOptIn(e.target.checked)}
                            className="w-4 h-4 text-blue-500 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <label htmlFor="marketing" className="text-sm text-gray-600 cursor-pointer">
                            I'd like to receive marketing emails and updates about new features
                        </label>
                    </div>
                    
                    {/* Signup Button - Disabled until form is valid */}
                    <button
                        onClick={handleSignup}
                        disabled={!isFormValid() || isLoading || loadingCountries || success}
                        className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white text-sm shadow-md transition-all duration-300 
                            ${!isFormValid() || isLoading || loadingCountries || success 
                                ? 'opacity-50 cursor-not-allowed' 
                                : 'hover:shadow-lg hover:-translate-y-0.5 cursor-pointer'
                            }`}
                        style={{ 
                            background: !isFormValid() || isLoading || loadingCountries || success 
                                ? 'linear-gradient(135deg, #b0d4e8, #8cbcd4)' 
                                : 'linear-gradient(135deg, #3ab5e6, #1a8fc0)' 
                        }}
                    >
                        {isLoading ? (
                            <>
                                <FaSpinner className="animate-spin" />
                                Creating account...
                            </>
                        ) : (
                            <>
                                Sign up
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
                    
                    {/* Social Buttons */}
                    <button
                        onClick={() => console.log("Google login")}
                        className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 transition-all hover:border-gray-300 hover:shadow-sm"
                    >
                        <FcGoogle className="text-lg" />
                        Continue with Google
                    </button>
                    
                    <button
                        onClick={() => console.log("Apple login")}
                        className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 transition-all hover:border-gray-300 hover:shadow-sm"
                    >
                        <FaApple className="text-lg text-gray-800" />
                        Continue with Apple
                    </button>
                    
                    {/* Login Link */}
                    <p className="text-center text-sm text-gray-500">
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