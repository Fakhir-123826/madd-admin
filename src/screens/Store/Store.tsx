import { FaPlus } from "react-icons/fa"
import AddButton from "../../component/AddButton"
import { useState } from "react";
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
const Store = () => {
    const [open, setOpen] = useState(false);
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Stores Management</h2>
                <AddButton />
            </div>

            <div className="bg-white p-6 ">

                {/* ################################ */}
                {/* First Section  strat here*/}
                {/* ################################ */}
                <div className="bg-white my-4">
                    {/* TOP ROW */}
                    <div className="flex items-start justify-between">
                        {/* LEFT */}
                        <div className="flex gap-4">
                            {/* AVATAR */}
                            <div className="h-20 w-22.5 rounded-full bg-gray-300" />

                            {/* STORE INFO */}
                            <div>
                                <h2 className="text-lg font-semibold">Store Name</h2>

                                <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                    <span>Last updated: 21 June 2025</span>
                                    <span>•</span>
                                    <span>ID: #2235467</span>
                                </div>

                                {/* STATUS */}
                                <div className="flex items-center gap-3 mt-3">
                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                                        Active
                                    </span>
                                    <button className="text-sm text-gray-500 hover:text-gray-700 underline">
                                        Change Status
                                    </button>
                                </div>
                                <div className="mt-2">
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                                        Description:
                                    </h3>

                                    <p className="text-sm text-gray-600 leading-relaxed max-w-4xl">
                                        What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and
                                        typesetting industry. Lorem Ipsum has been the industry's standard dummy
                                        text ever since the 1500s, when an unknown printer took a gal What is Lorem
                                        Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting
                                        industry. Lorem Ipsum has been the industry's standard dummy text ever
                                        since the 1500s, when an unknown printer took a gal
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT BUTTON */}
                        <button className="flex items-center p-2 gap-2 w-[170px] h-[40px] rounded-lg text-sm font-medium text-white bg-gradient-to-r from-teal-400 to-green-400 hover:opacity-90">
                            <span className="mr-4">✏️</span>  Edit Store
                        </button>
                    </div>
                </div>
                {/* ################################ */}
                {/* First Section  end here*/}
                {/* ################################ */}


                {/* ################################ */}
                {/* Second Section  strat here*/}
                {/* ################################ */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden  my-4">
                    {/* HEADER */}
                    <div className="px-6 py-4 bg-gradient-to-r from-teal-400 to-green-400 text-white font-medium">
                        Location & Contact Details
                    </div>

                    {/* MAP */}
                    <div className="p-6">
                        <div className="h-44 w-full rounded-lg overflow-hidden bg-gray-100">
                            {/* Replace with real map later */}
                            <img
                                src="https://maps.googleapis.com/maps/api/staticmap?center=Arizona,USA&zoom=10&size=600x300"
                                alt="Map"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* CONTENT GRID */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-6">
                            {/* LEFT COLUMN */}
                            <div className="space-y-8">
                                {/* CITY & POSTAL */}
                                <div>
                                    <h3 className="font-medium mb-3">City & Postal Code</h3>

                                    <div className="grid grid-cols-2 gap-6 text-sm">
                                        <div>
                                            <p className="text-gray-500">City</p>
                                            <p className="font-medium">Arizona, USA</p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500">Postal Code</p>
                                            <p className="font-medium">29445</p>
                                        </div>
                                    </div>
                                </div>

                                {/* PICKUP */}
                                <div>
                                    <h3 className="font-medium mb-3">Pick up</h3>

                                    <div className="flex items-center gap-3">
                                        <div className="w-11 h-6 bg-blue-500 rounded-full relative">
                                            <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full" />
                                        </div>
                                        <span className="text-sm">Pickup Availability</span>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT COLUMN */}
                            <div className="space-y-8">
                                {/* CONTACT INFO */}
                                <div>
                                    <h3 className="font-medium mb-3">Contact Info</h3>

                                    <div className="grid grid-cols-2 gap-6 text-sm">
                                        <div>
                                            <p className="text-gray-500">Email</p>
                                            <p className="font-medium">info@gmail.com</p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500">Phone Number</p>
                                            <p className="font-medium">+1 3464 5657</p>
                                        </div>
                                    </div>
                                </div>

                                {/* STORE AVAILABILITY */}
                                <div>
                                    <h3 className="font-medium mb-3">Store Availability</h3>

                                    <div className="grid grid-cols-2 gap-6 text-sm">
                                        <div>
                                            <p className="text-gray-500">Opening - Closing</p>
                                            <p className="font-medium">9am - 10pm</p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500">Break Time</p>
                                            <p className="font-medium">4pm - 6pm</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* ################################ */}
                {/* Second Section  end here*/}
                {/* ################################ */}


                {/* ################################ */}
                {/* Third Section  start here*/}
                {/* ################################ */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden  my-4">
                    {/* HEADER */}
                    <div className="px-6 py-4 bg-gradient-to-r from-teal-400 to-green-400 text-white font-medium">
                        Pickup point 1
                    </div>

                    {/* BODY */}
                    <div className="p-6 space-y-8">
                        {/* PICKUP POINT INFO */}
                        <div>
                            <h3 className="font-semibold mb-4">Pickup Point Info</h3>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
                                <div>
                                    <p className="text-gray-500">Point Name</p>
                                    <p className="font-medium">Arizona, USA</p>
                                </div>

                                <div>
                                    <p className="text-gray-500">Address</p>
                                    <p className="flex items-center gap-1 font-medium">
                                        📍 Street #3 main road
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500">Operating Hours</p>
                                    <p className="font-medium">3pm - 6pm</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-6 bg-blue-500 rounded-full relative">
                                        <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full" />
                                    </div>
                                    <span className="text-sm">Whole Day</span>
                                </div>
                            </div>
                        </div>

                        {/* CONTACT SECTION */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {/* CONTACT PERSON */}
                            <div>
                                <h3 className="font-semibold mb-3">Contact person</h3>

                                <div className="text-sm">
                                    <p className="text-gray-500">Phone Number</p>
                                    <p className="font-medium">+1 3567 3567</p>
                                </div>
                            </div>

                            {/* CONTACT INFO */}
                            <div>
                                <h3 className="font-semibold mb-3">Contact Info</h3>

                                <div className="grid grid-cols-2 gap-6 text-sm">
                                    <div>
                                        <p className="text-gray-500">Email</p>
                                        <p className="font-medium">info@gmail.com</p>
                                    </div>

                                    <div>
                                        <p className="text-gray-500">Phone Number</p>
                                        <p className="font-medium">+1 3464 5657</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ACTION BUTTONS */}
                        <div className="flex justify-end gap-4 pt-4">
                            <button className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-teal-400 to-green-400 text-white text-sm shadow">
                                ✏️ Edit Point
                            </button>

                            <button className="flex items-center gap-2 px-5 py-2 rounded-full bg-red-500 text-white text-sm shadow">
                                🗑 Delete Point
                            </button>
                        </div>
                    </div>
                </div>
                {/* ################################ */}
                {/* Third Section end here*/}
                {/* ################################ */}

                {/* ################################ */}
                {/* Fourth Section Start here*/}
                {/* ################################ */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {/* HEADER */}
                    <div className="px-6 py-4 bg-gradient-to-r from-teal-400 to-green-400 text-white font-medium">
                        Pickup point 2
                    </div>

                    {/* BODY */}
                    <div className="p-6 space-y-8">
                        {/* PICKUP POINT INFO */}
                        <div>
                            <h3 className="font-semibold mb-4">Pickup Point Info</h3>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
                                <div>
                                    <p className="text-gray-500">Point Name</p>
                                    <p className="font-medium">Arizona, USA</p>
                                </div>

                                <div>
                                    <p className="text-gray-500">Address</p>
                                    <p className="flex items-center gap-1 font-medium">
                                        📍 Street #3 main road
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500">Operating Hours</p>
                                    <p className="font-medium">3pm - 6pm</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-6 bg-blue-500 rounded-full relative">
                                        <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full" />
                                    </div>
                                    <span className="text-sm">Whole Day</span>
                                </div>
                            </div>
                        </div>

                        {/* CONTACT SECTION */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {/* CONTACT PERSON */}
                            <div>
                                <h3 className="font-semibold mb-3">Contact person</h3>

                                <div className="text-sm">
                                    <p className="text-gray-500">Phone Number</p>
                                    <p className="font-medium">+1 3567 3567</p>
                                </div>
                            </div>

                            {/* CONTACT INFO */}
                            <div>
                                <h3 className="font-semibold mb-3">Contact Info</h3>

                                <div className="grid grid-cols-2 gap-6 text-sm">
                                    <div>
                                        <p className="text-gray-500">Email</p>
                                        <p className="font-medium">info@gmail.com</p>
                                    </div>

                                    <div>
                                        <p className="text-gray-500">Phone Number</p>
                                        <p className="font-medium">+1 3464 5657</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ACTION BUTTONS */}
                        <div className="flex justify-end gap-4 pt-4">
                            <button className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-teal-400 to-green-400 text-white text-sm shadow">
                                ✏️ Edit Point
                            </button>

                            <button className="flex items-center gap-2 px-5 py-2 rounded-full bg-red-500 text-white text-sm shadow">
                                🗑 Delete Point
                            </button>
                        </div>
                    </div>
                </div>
                {/* ################################ */}
                {/* Fourth Section end here*/}
                {/* ################################ */}

                <button className="w-full h-12 rounded-lg bg-gradient-to-r from-teal-400 to-green-400 text-white font-medium flex items-center justify-center gap-2 shadow-sm hover:opacity-95 transition my-4">
                    <FaPlus className="text-sm" />
                    Add New Pickup Point
                </button>


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
                                            className="border-t hover:bg-gray-50 transition"
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

                    <button onClick={() => setOpen(true)} className="flex items-center gap-2 px-5 py-2 rounded-full bg-red-500 text-white text-sm shadow">
                        🗑 Delete Store
                    </button>
                </div>



                {/* ################################ */}
                {/* fith Section end here*/}
                {/* ################################ */}




            </div>
            {/* pop up */}
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-[380px] rounded-xl bg-white p-6 shadow-lg relative">

                        {/* Close Icon */}
                        <button
                            onClick={() => setOpen(false)}
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

                            <button
                                onClick={() => setOpen(false)}
                                className="rounded-lg bg-gray-200 px-6 py-2 text-sm text-gray-700 hover:bg-gray-300"
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Store