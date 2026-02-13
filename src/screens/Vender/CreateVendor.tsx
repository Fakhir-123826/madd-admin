import React, { useState } from 'react'
import AddButton from '../../component/AddButton'

const CreateVendor = () => {

    const [planStatus, setPlanStatus] = useState("")
    const [status, setStatus] = useState("")
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Stores Management</h2>
                <AddButton
                    label="Add New Store"
                    type="button" 
                    onClick={() => console.log("Clicked")}
                />
            </div>

            <div className="bg-white p-6 px-10 rounded-xl space-y-6">
                {/* TITLE */}
                <h2 className="text-sm font-semibold">Vendor Info</h2>

                {/* VENDOR NAME */}
                <div>
                    <label className="text-xs font-medium">Vendor Name</label>
                    <input
                        type="text"
                        placeholder="Vendor Name"
                        className="mt-1 w-full rounded-md
                            border border-gray-300
                            px-3 py-3 text-md
                            outline-none
                            focus:border-blue-400
                            focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                {/* EMAIL + PHONE */}
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs font-medium">Entre Email</label>
                        <input
                            type="email"
                            placeholder="Category Name"
                            className="mt-1 w-full rounded-md
                            border border-gray-300
                            px-3 py-3 text-md
                            outline-none
                            focus:border-blue-400
                            focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-medium">Entre Phone Number</label>
                        <input
                            type="text"
                            placeholder="Entre URL"
                            className="mt-1 w-full rounded-md
                            border border-gray-300
                            px-3 py-3 text-md
                            outline-none
                            focus:border-blue-400
                            focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                </div>

                {/* STORE NAME + STORE URL */}
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs font-medium">Store Name (Optional)</label>
                        <input
                            type="text"
                            placeholder="Store Name"
                            className="mt-1 w-full rounded-md
                            border border-gray-300
                            px-3 py-3 text-md
                            outline-none
                            focus:border-blue-400
                            focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-medium">Store URL (Optional)</label>
                        <input
                            type="text"
                            placeholder="Entre URL"
                            className="mt-1 w-full rounded-md
                            border border-gray-300
                            px-3 py-3 text-md
                            outline-none
                            focus:border-blue-400
                            focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                </div>

                {/* SELECT PLAN */}
                <div>
                    <label className="text-xs font-medium">Select Plan</label>
                    <select className="mt-1 w-full rounded-md
                            border border-gray-300
                            px-3 py-3 text-md
                            outline-none
                            focus:border-blue-400
                            focus:ring-2 focus:ring-blue-400">
                        <option>Select Plan</option>
                        <option>Basic</option>
                        <option>Premium</option>
                    </select>
                </div>

                {/* DESCRIPTION */}
                <div>
                    <label className="text-xs font-medium">
                        Description <span className="text-gray-400">(100 words max)</span>
                    </label>
                    <textarea
                        rows={4}
                        placeholder="Description"
                        className="mt-1 w-full rounded-md
                            border border-gray-300
                            px-3 py-3 text-md
                            outline-none
                            focus:border-blue-400
                            focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                {/* STORE LOGO */}
                <div>
                    <h3 className="text-xs font-medium mb-2">Store Logo</h3>

                    <div className="h-28 w-28 rounded-lg overflow-hidden border-gray-300 flex items-center justify-center bg-gray-100">
                        <img
                            src="/store.png"
                            alt="Store Logo"
                            className="h-full w-full object-cover"
                        />
                    </div>
                </div>

                {/* STATUS TOGGLES */}
                <div className="grid grid-cols-2 gap-16 pt-2">
                    {/* STATUS */}
                    <div>
                        <p className="text-sm font-medium mb-3">Status</p>

                        <div className="flex items-center gap-6">
                            {/* Active */}
                            <label className="flex items-center gap-2 text-sm cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only"
                                    checked={status === "active"}
                                    onChange={() => setStatus("active")}
                                />
                                <div
                                    className={`w-10 h-5 rounded-full relative transition ${status === "active" ? "bg-blue-500" : "bg-gray-300"
                                        }`}
                                >
                                    <span
                                        className={`absolute top-0.5 h-4 w-4 bg-white rounded-full transition ${status === "active" ? "left-5" : "left-0.5"
                                            }`}
                                    />
                                </div>
                                Active
                            </label>

                            {/* Inactive */}
                            <label className="flex items-center gap-2 text-sm cursor-pointer text-gray-500">
                                <input
                                    type="checkbox"
                                    className="sr-only"
                                    checked={status === "inactive"}
                                    onChange={() => setStatus("inactive")}
                                />
                                <div
                                    className={`w-10 h-5 rounded-full relative transition ${status === "inactive" ? "bg-blue-500" : "bg-gray-300"
                                        }`}
                                >
                                    <span
                                        className={`absolute top-0.5 h-4 w-4 bg-white rounded-full transition ${status === "inactive" ? "left-5" : "left-0.5"
                                            }`}
                                    />
                                </div>
                                Inactive
                            </label>
                        </div>
                    </div>

                    {/* PLAN STATUS */}
                    <div>
                        <p className="text-sm font-medium mb-3">Plan Status</p>

                        <div className="flex items-center gap-6">
                            {/* Active */}
                            <label className="flex items-center gap-2 text-sm cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only"
                                    checked={planStatus === "active"}
                                    onChange={() => setPlanStatus("active")}
                                />
                                <div
                                    className={`w-10 h-5 rounded-full relative transition ${planStatus === "active" ? "bg-blue-500" : "bg-gray-300"
                                        }`}
                                >
                                    <span
                                        className={`absolute top-0.5 h-4 w-4 bg-white rounded-full transition ${planStatus === "active" ? "left-5" : "left-0.5"
                                            }`}
                                    />
                                </div>
                                Active
                            </label>

                            {/* Inactive */}
                            <label className="flex items-center gap-2 text-sm cursor-pointer text-gray-500">
                                <input
                                    type="checkbox"
                                    className="sr-only"
                                    checked={planStatus === "inactive"}
                                    onChange={() => setPlanStatus("inactive")}
                                />
                                <div
                                    className={`w-10 h-5 rounded-full relative transition ${planStatus === "inactive" ? "bg-blue-500" : "bg-gray-300"
                                        }`}
                                >
                                    <span
                                        className={`absolute top-0.5 h-4 w-4 bg-white rounded-full transition ${planStatus === "inactive" ? "left-5" : "left-0.5"
                                            }`}
                                    />
                                </div>
                                Inactive
                            </label>
                        </div>
                    </div>
                </div>


                <div className="flex justify-end gap-4 pt-4">
                    <button className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-teal-400 to-green-400 text-white text-sm shadow">
                        ✏️ Edit Point
                    </button>

                    <button className="flex items-center gap-2 px-5 py-2 rounded-full bg-red-500 text-white text-sm shadow">
                        🗑 Delete Point
                    </button>
                </div>
                <button
                    className="rounded-lg bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
                >
                    Suspend Instead
                </button>

                {/* {open && ( */}
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-[380px] rounded-xl bg-white p-6 shadow-lg relative">
                        {/* onClick={() => setOpen(false)} */}
                        {/* Close Icon */}
                        <button

                            className="absolute right-4 top-4 text-gray-500 hover:text-black"
                        >
                            ✕
                        </button>

                        {/* Icon */}
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                            <span className="text-2xl">👤</span>
                        </div>

                        {/* Text */}
                        <h2 className="text-center text-lg font-semibold text-gray-800">
                            Are you sure you want to delete
                            <br />
                            <span className="font-bold">“Thai restaurant”</span> account?
                        </h2>

                        {/* Actions */}
                        <div className="mt-6 flex justify-center gap-4">
                            <button
                                className="rounded-lg bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
                            >
                                Suspend Instead
                            </button>
                            {/* onClick={() => setOpen(false)} */}
                            <button

                                className="rounded-lg bg-gray-200 px-6 py-2 text-sm text-gray-700 hover:bg-gray-300"
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
                {/* )} */}
            </div>
        </div>
    )
}

export default CreateVendor