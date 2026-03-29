import { useState, useRef } from 'react';

function EnterOTP() {
    const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').slice(0, 6);
        const newOtp = [...otp];
        for (let i = 0; i < pasted.length; i++) {
            if (/^\d$/.test(pasted[i])) newOtp[i] = pasted[i];
        }
        setOtp(newOtp);
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 relative overflow-hidden">

            {/* Very Soft & Clean Background Accents */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Light Top Right Accent */}
                <div className="absolute top-[-10%] right-[-10%] w-[650px] h-[650px] 
                        bg-gradient-to-br from-teal-100/30 to-cyan-100/20 
                        rounded-full blur-[120px]" />

                {/* Light Bottom Left Accent */}
                <div className="absolute bottom-[-15%] left-[-15%] w-[550px] h-[550px] 
                        bg-gradient-to-br from-emerald-100/25 to-blue-100/15 
                        rounded-full blur-[100px]" />
            </div>

            <div className="relative w-full max-w-md z-10">

                {/* Logo */}
                <div className="flex justify-end mb-10">
                    <img
                        src="madd-admin.png"
                        alt="MarketAdd"
                        className="h-10 object-contain"
                    />
                </div>

                {/* OTP Card */}
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">

                    {/* Close Button */}
                    <button className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 text-xl">
                        ✕
                    </button>

                    {/* Title */}
                    <h2 className="text-center text-xl font-semibold text-gray-800 mb-1">
                        Entre 6 digit OTP
                    </h2>
                    <p className="text-center text-gray-600 text-[15px] mb-8">
                        that have been sent to your email
                    </p>

                    {/* OTP Inputs */}
                    <div className="flex justify-center gap-3 mb-10">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                // ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={handlePaste}
                                className="w-12 h-14 text-center text-2xl font-medium bg-gray-50 
                           border border-gray-200 rounded-2xl focus:outline-none 
                           focus:border-teal-400 focus:ring-2 focus:ring-teal-200/50 
                           transition-all"
                            />
                        ))}
                    </div>

                    {/* Send OTP Button */}
                    <button
                        className="w-full h-12 rounded-2xl bg-gradient-to-r from-teal-400 to-emerald-500 
                       text-white font-semibold text-base shadow-sm 
                       hover:brightness-105 transition-all active:scale-[0.985]"
                    >
                        Send OTP
                    </button>

                </div>

                {/* Resend Text */}
                <p className="text-center text-gray-500 text-sm mt-6">
                    Didn't receive the code?{' '}
                    <span className="text-teal-600 font-medium hover:underline cursor-pointer">
                        Resend
                    </span>
                </p>
            </div>
        </div>
    );
}

export default EnterOTP;