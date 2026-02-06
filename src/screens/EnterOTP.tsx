import React from 'react'

import logo from "../../public/madd-admin.png"
function EnterOTP() {
    return (
        <div>

            <div className="lg:min-h-screen lg:flex lg:flex-col lg:gap-6">
                <div className=" lg:flex lg:items-center lg:justify-between px-6 py-4">
                    <h3 className="text-blue-500 pl-15 pr-15 pt-2.5 pb-2.5 text-2xl font-semibold tracking-wide shadow-xl">
                        Enter OTP
                    </h3>
                    <img
                        src={logo}
                        alt="main logo"
                        className="h-16 object-contain pr-30"
                    />
                </div>



                <div className="fixed inset-0 z-50 flex items-center justify-center /*bg-black/40*/">
                    <div className="relative w-[420px] rounded-2xl bg-white p-6 shadow-xl">

                        {/* Close button */}
                        <button
                            className="absolute right-4 top-4 text-xl text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>

                        {/* Title */}
                        <h2 className="mb-6 text-center text-lg font-medium text-gray-800">
                            Entre 6 digit OTP that have been sent <br />
                            to your email
                        </h2>

                        {/* OTP inputs */}
                        <div className="mb-6 flex justify-between">
                            {[1, 2, 3, 4, 5, 6].map((_, i) => (
                                <input
                                    key={i}
                                    type="text"
                                    maxLength={1}
                                    className="h-12 w-12 rounded-lg border border-gray-300 text-center text-lg font-semibold
                     focus:outline-none focus:ring-2 focus:ring-green-400"
                                />
                            ))}
                        </div>

                        {/* Button */}
                        <button
                            className="h-12 w-full rounded-xl bg-gradient-to-r from-cyan-400 to-green-400
                 text-lg font-semibold text-white hover:opacity-90 transition"
                        >
                            Send OTP
                        </button>

                    </div>
                </div>



            </div>



        </div>
    )
}

export default EnterOTP
