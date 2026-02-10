import React, { useState } from 'react'
import AddButton from '../../component/AddButton'
import { FaPlus } from "react-icons/fa"

const stats = [
    { label: "Total Products", value: "2256" },
    { label: "Completed Orders", value: "3466" },
    { label: "Revenue Generated", value: "234$" },
    { label: "Created on", value: "3 July 2025" },
];

const orders = [
    {
        id: "#2356856",
        customer: "Jhon Smith",
        date: "3:45 pm · 5 July",
        amount: "245$",
        payment: "Paid",
        delivery: "Delivery",
        status: "Delivered",
    },
    {
        id: "#2356856",
        customer: "Jhon Smith",
        date: "3:45 pm · 5 July",
        amount: "245$",
        payment: "Pending",
        delivery: "Delivery",
        status: "Processing",
    },
    {
        id: "#2356856",
        customer: "Jhon Smith",
        date: "3:45 pm · 5 July",
        amount: "245$",
        payment: "Paid",
        delivery: "Delivery",
        status: "Cancelled",
    },
    {
        id: "#2356856",
        customer: "Jhon Smith",
        date: "3:45 pm · 5 July",
        amount: "245$",
        payment: "Refunded",
        delivery: "Delivery",
        status: "Shipped",
    },
];

const badgeStyle = (type: string) => {
    switch (type) {
        case "Paid":
            return "bg-green-100 text-green-600";
        case "Pending":
            return "bg-yellow-100 text-yellow-600";
        case "Refunded":
            return "bg-blue-100 text-blue-600";
        case "Delivered":
            return "bg-green-100 text-green-600";
        case "Processing":
            return "bg-yellow-100 text-yellow-600";
        case "Cancelled":
            return "bg-red-100 text-red-600";
        case "Shipped":
            return "bg-blue-100 text-blue-600";
        default:
            return "";
    }
};
const Vendor = () => {
    // const [open, setOpen] = useState(false);

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Stores Management</h2>
                <AddButton />
            </div>

            <div className="bg-white p-6 rounded-lg">

                {/* ################################ */}
                {/* First Section  strat here*/}
                {/* ################################ */}
                <div className="bg-white p-6 rounded-xl">
                    {/* TOP ROW */}
                    <div className="flex items-start justify-between">
                        <div className="flex gap-4">
                            {/* AVATAR */}
                            <div className="h-16 w-16 rounded-full bg-gray-200" />

                            {/* HEADER INFO */}
                            <div>
                                <h2 className="text-base font-semibold">Vendor Name</h2>

                                <div className="flex gap-4 text-xs text-gray-500 mt-1">
                                    <span>Created Date: 21 june 2025</span>
                                    <span>ID: #2235467</span>
                                </div>

                                <div className="flex items-center gap-3 mt-2">
                                    <span className="px-4 py-1 rounded-full text-xs bg-green-100 text-green-600">
                                        Active
                                    </span>
                                    <button className="text-xs text-gray-400 hover:text-gray-600">
                                        Change Status
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button className="flex items-center gap-2 px-4 py-2 rounded-md text-sm text-white bg-gradient-to-r from-teal-400 to-green-400">
                            ✏️ Edit Vendor
                        </button>
                    </div>

                    {/* LOCATION INFO */}
                    <div className="mt-8">
                        <h3 className="text-sm font-semibold mb-3">Location Info</h3>

                        <div className="grid grid-cols-3 gap-10 text-sm w-150">
                            <div>
                                <p className="text-gray-500">City</p>
                                <p className="mt-1">Arizona, USA</p>
                            </div>

                            <div>
                                <p className="text-gray-500">Postal Code</p>
                                <p className="mt-1">29445</p>
                            </div>

                            <div>
                                <p className="text-gray-500">Location</p>
                                <p className="mt-1 flex items-center gap-1">
                                    📍 Street #3 main road
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* CONTACT + PLAN */}
                    <div className="grid grid-cols-2 gap-20 mt-8 w-195">
                        {/* CONTACT INFO */}
                        <div>
                            <h3 className="text-sm font-semibold mb-3">Contact Info</h3>

                            <div className="grid grid-cols-2 gap-10 text-sm ">
                                <div>
                                    <p className="text-gray-500">Email</p>
                                    <p className="mt-1">info@gmail.com</p>
                                </div>

                                <div>
                                    <p className="text-gray-500">Phone Number</p>
                                    <p className="mt-1">+1 3464 5657</p>
                                </div>
                            </div>
                        </div>

                        {/* PLAN INFO */}
                        <div>
                            <h3 className="text-sm font-semibold mb-3">Plan Info</h3>

                            <div className="grid grid-cols-2 gap-10 text-sm">
                                <div>
                                    <p className="text-gray-500">Plan Name</p>
                                    <span className="inline-flex items-center gap-1 mt-1 px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-xs">
                                        Basic Plan ⌄
                                    </span>
                                </div>

                                <div>
                                    <p className="text-gray-500">Plan Status</p>
                                    <span className="inline-flex items-center gap-1 mt-1 px-3 py-1 rounded-full bg-green-100 text-green-600 text-xs">
                                        Active ⌄
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* STORE INFO */}
                    <div className="mt-8">
                        <h3 className="text-sm font-semibold mb-3">Store Info</h3>

                        <div className="grid grid-cols-2 gap-10 text-sm w-90">
                            <div>
                                <p className="text-gray-500">Store Name</p>
                                <p className="mt-1">Blossom Store</p>
                            </div>

                            <div>
                                <p className="text-gray-500">Store URL</p>
                                <p className="mt-1 text-gray-400">URL Here</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* ################################ */}
                {/* First Section  end here*/}
                {/* ################################ */}











                {/* ################################ */}
                {/* fith Section Start here*/}
                {/* ################################ */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {/* HEADER */}
                    <div className="px-6 py-4 bg-gradient-to-r from-teal-400 to-green-400 text-white font-semibold">
                        Store Activity
                    </div>

                    {/* STATS */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-6 py-5 text-sm">
                        {stats.map((item, i) => (
                            <div key={i}>
                                <p className="text-gray-500">{item.label}</p>
                                <p className="font-semibold text-gray-800">{item.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* RECENT ORDERS */}
                    <div className="px-6 pb-4">
                        <h3 className="font-semibold mb-3 text-sm">Recent Orders</h3>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm border border-gray-100 rounded-lg overflow-hidden">
                                <thead className="bg-gray-50 text-gray-600">
                                    <tr>
                                        <th className="p-3 text-left">Order ID</th>
                                        <th className="p-3 text-left">Customer Name</th>
                                        <th className="p-3 text-left">Date & Time</th>
                                        <th className="p-3 text-left">Total Amount</th>
                                        <th className="p-3 text-left">Payment</th>
                                        <th className="p-3 text-left">Pickup / Delivery</th>
                                        <th className="p-3 text-left">Status</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {orders.map((order, i) => (
                                        <tr
                                            key={i}
                                            className="shadow-md my-12 hover:bg-gray-50 transition"
                                        >
                                            <td className="p-3">{order.id}</td>
                                            <td className="p-3">{order.customer}</td>
                                            <td className="p-3">{order.date}</td>
                                            <td className="p-3">{order.amount}</td>

                                            <td className="p-3">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-medium ${badgeStyle(
                                                        order.payment
                                                    )}`}
                                                >
                                                    {order.payment}
                                                </span>
                                            </td>

                                            <td className="p-3">{order.delivery}</td>

                                            <td className="p-3">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-medium ${badgeStyle(
                                                        order.status
                                                    )}`}
                                                >
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* SHOW MORE */}
                    <button className="my-4 w-full h-11 bg-gradient-to-r from-teal-400 to-green-400 text-white flex items-center justify-center gap-2 text-sm font-medium">
                        <FaPlus className="text-xs" />
                        Show more
                    </button>
                </div>



                <div className="my-6 flex justify-start gap-4 pt-4">
                    <button className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-teal-400 to-green-400 text-white text-sm shadow">
                        ✏️ Edit Point
                    </button>
{/* onClick={() => setOpen(true)} */}
                    <button  className="flex items-center gap-2 px-5 py-2 rounded-full bg-red-500 text-white text-sm shadow">
                        🗑 Delete Store
                    </button>
                </div>
                {/* ################################ */}
                {/* fith Section end here*/}
                {/* ################################ */}
            </div>


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
    )
}

export default Vendor