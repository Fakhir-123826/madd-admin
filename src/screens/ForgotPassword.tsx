import React from 'react'

import logo from "../../public/madd-admin.png"
function ForgotPassword() {
    return (
        <div>
            <div className="lg:min-h-screen lg:flex lg:flex-col lg:gap-6">
                <div className=" lg:flex lg:items-center lg:justify-between px-6 py-4">
                    <h3 className="text-blue-500 pl-15 pr-15 pt-2.5 pb-2.5 text-2xl font-semibold tracking-wide shadow-xl">
                        Forgot Password
                    </h3>
                    <img
                        src={logo}
                        alt="main logo"
                        className="h-16 object-contain pr-30"
                    />
                </div>


                <div className=" z-50 flex justify-center items-center">
                    <div className="relative w-[420px] rounded-2xl bg-white p-6 shadow-xl">

                        {/* Close button */}
                        <button className="absolute right-4 top-4 text-xl text-gray-500 hover:text-gray-700">
                            ✕
                        </button>

                        {/* Title */}
                        <h2 className="mb-6 text-lg font-medium text-gray-800">
                            Entre your new password
                        </h2>

                        {/* New password */}
                        <div className="mb-4">
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Enter new password
                            </label>
                            <input
                                type="password"
                                placeholder="New Password"
                                className="h-11 w-full rounded-lg bg-gray-100 px-4
                   text-sm border border-gray-200
                   focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                        </div>

                        {/* Confirm password */}
                        <div className="mb-6">
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Enter new password again
                            </label>
                            <input
                                type="password"
                                placeholder="New Password"
                                className="h-11 w-full rounded-lg bg-gray-100 px-4
                   text-sm border border-gray-200
                   focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                        </div>

                        {/* Button */}
                        <button
                            className="h-12 w-full rounded-xl bg-gradient-to-r from-cyan-400 to-green-400
                 text-lg font-semibold text-white hover:opacity-90 transition"
                        >
                            Confirm Password
                        </button>

                    </div>
                </div>


                <div className=" z-50 flex justify-center items-center">
                    <div className="relative w-[420px] rounded-2xl bg-white p-6 shadow-xl">

                        {/* Close button */}
                        <button className="absolute right-4 top-4 text-xl text-gray-500 hover:text-gray-700">
                            ✕
                        </button>

                        {/* Title */}
                        <h2 className="mb-6 text-lg font-medium text-gray-800">
                            Entre your email address below
                        </h2>


                        <div className="mb-6">
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <input
                                type="password"
                                placeholder="New Password"
                                className="h-11 w-full rounded-lg bg-gray-100 px-4
                   text-sm border border-gray-200
                   focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
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

export default ForgotPassword
