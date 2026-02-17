import React from 'react'
import AddButton from '../../../component/AddButton';
import { useParams } from 'react-router-dom';


type Order = {
    id: string;
    name: string;
    date: string;
    qty: number;
    status: "Processing" | "Delivered" | "Cancelled";
};

const orders: Order[] = [
    { id: "#2356856", name: "Jhon Smith", date: "3:45 pm - 5 july", qty: 2, status: "Processing" },
    { id: "#2356856", name: "Jhon Smith", date: "3:45 pm - 5 july", qty: 2, status: "Delivered" },
    { id: "#2356856", name: "Jhon Smith", date: "3:45 pm - 5 july", qty: 2, status: "Cancelled" },
    { id: "#2356856", name: "Jhon Smith", date: "3:45 pm - 5 july", qty: 2, status: "Delivered" },
    { id: "#2356856", name: "Jhon Smith", date: "3:45 pm - 5 july", qty: 2, status: "Cancelled" },
];

const getStatusStyle = (status: Order["status"]) => {
    switch (status) {
        case "Processing":
            return "bg-yellow-100 text-yellow-600";
        case "Delivered":
            return "bg-green-100 text-green-600";
        case "Cancelled":
            return "bg-red-100 text-red-600";
        default:
            return "bg-gray-100 text-gray-600";
    }
};



const ProductBase = () => {
    const { id } = useParams();
    const isEdit = Boolean(id);
    return (
        <div>
            <div className="bg-white shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold">Category Basic Info</h2>
                    <AddButton
                        label={isEdit ? "Update Category" : "Create Category"}
                        type="button"

                        onClick={() => {
                            console.log("pop")
                        }}
                    />
                </div>

                <div className="bg-white rounded-xl shadow-sm overflow-hidden my-4">

                    {/* HEADER */}
                    <div className="px-6 py-4 bg-gradient-to-r from-teal-400 to-green-400 text-white font-medium">
                        Product Overview
                    </div>

                    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* LEFT IMAGE SECTION */}
                        <div>
                            <div className="w-full h-56 bg-gray-200 rounded-lg mb-4" />

                            <div className="flex gap-3">
                                <div className="w-20 h-16 bg-gray-200 rounded-md" />
                                <div className="w-20 h-16 bg-gray-200 rounded-md" />
                            </div>
                        </div>

                        {/* RIGHT CONTENT */}
                        <div className="lg:col-span-2">

                            {/* TITLE + PRICE */}
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl font-semibold">Product Name</h2>
                                    <p className="text-sm text-gray-500">Product ID</p>
                                    <p className="text-sm text-gray-500">Category: Electronics</p>
                                    <p className="text-sm text-gray-500">In Stock (345 items)</p>
                                </div>

                                <div className="text-right">
                                    <p className="text-xl font-semibold">$35</p>
                                    <span className="inline-block mt-2 px-3 py-1 text-xs bg-green-100 text-green-600 rounded-full">
                                        Active
                                    </span>
                                </div>
                            </div>

                            {/* DESCRIPTION */}
                            <div className="mt-6">
                                <h3 className="font-medium mb-2">Description:</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing
                                    and typesetting industry. Lorem Ipsum has been the industry’s standard
                                    dummy text ever since the 1500s.
                                </p>
                            </div>

                            {/* SIZES + COLORS */}
                            <div className="flex flex-wrap gap-10 mt-6">

                                <div>
                                    <h4 className="font-medium mb-2">Sizes:</h4>
                                    <div className="flex gap-3 text-sm text-gray-600">
                                        <span>1 inch</span>
                                        <span>4 inch</span>
                                        <span>6 inch</span>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-medium mb-2">Colors:</h4>
                                    <div className="flex gap-2">
                                        <span className="w-5 h-5 rounded-full bg-red-600" />
                                        <span className="w-5 h-5 rounded-full bg-blue-600" />
                                        <span className="w-5 h-5 rounded-full bg-purple-600" />
                                        <span className="w-5 h-5 rounded-full bg-green-600" />
                                    </div>
                                </div>

                            </div>

                            {/* ACTION BUTTONS */}
                            <div className="flex flex-wrap gap-4 mt-8">

                                <button className="flex items-center gap-2 px-5 py-2 rounded-full border border-red-500 text-red-500 hover:bg-red-50 transition">
                                    🗑 Delete Product
                                </button>

                                <button className="flex items-center gap-2 px-5 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition">
                                    🚫 Deactivate
                                </button>

                                <button className="flex items-center gap-2 px-5 py-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition">
                                    ✏️ Edit Product
                                </button>

                            </div>

                        </div>
                    </div>
                </div>





                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">

                    {/* HEADER */}
                    <div className="px-6 py-3 bg-gradient-to-r from-teal-400 to-green-400 text-white font-medium">
                        Vendor Information
                    </div>

                    {/* CONTENT */}
                    <div className="px-6 py-6">

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                            {/* Vendor Name */}
                            <div>
                                <p className="text-sm text-gray-500">Vendor Name</p>
                                <p className="text-sm font-medium text-gray-700 mt-1">Jhon Smith</p>
                            </div>

                            {/* Email */}
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="text-sm font-medium text-gray-700 mt-1">info@gmail.com</p>
                            </div>

                            {/* Phone */}
                            <div>
                                <p className="text-sm text-gray-500">Phone Number</p>
                                <p className="text-sm font-medium text-gray-700 mt-1">+91 35356 99</p>
                            </div>

                            {/* Address */}
                            <div>
                                <p className="text-sm text-gray-500">Address</p>
                                <p className="text-sm font-medium text-gray-700 mt-1">Address here</p>
                            </div>

                        </div>

                        {/* ACTION BUTTONS */}
                        <div className="flex justify-end gap-4 mt-6">

                            {/* Preview */}
                            <button className="flex items-center gap-2 px-5 py-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition">
                                <span className="w-6 h-6 flex items-center justify-center rounded-full border border-green-400">
                                    👁
                                </span>
                                Preview
                            </button>

                            {/* Deactivate */}
                            <button className="flex items-center gap-2 px-5 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition">
                                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-white text-blue-500">
                                    🚫
                                </span>
                                Deactivate
                            </button>

                        </div>

                    </div>
                </div>



                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">

                    {/* HEADER */}
                    <div className="px-6 py-3 bg-gradient-to-r from-teal-400 to-green-400 text-white font-medium">
                        Pricing Information
                    </div>

                    {/* CONTENT */}
                    <div className="px-6 py-6">

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                            {/* Regular Price */}
                            <div>
                                <p className="text-sm text-gray-500">Regular Price</p>
                                <p className="text-sm font-medium text-gray-700 mt-1">45$</p>
                            </div>

                            {/* Discount Price */}
                            <div>
                                <p className="text-sm text-gray-500">Discount Price</p>
                                <p className="text-sm font-medium text-gray-700 mt-1">45$</p>
                            </div>

                            {/* Tax */}
                            <div>
                                <p className="text-sm text-gray-500">Tax</p>
                                <p className="text-sm font-medium text-gray-700 mt-1">34%</p>
                            </div>

                        </div>

                        {/* BUTTON */}
                        <div className="flex justify-end mt-6">
                            <button className="flex items-center gap-2 px-5 py-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition">
                                <span className="w-6 h-6 flex items-center justify-center rounded-full border border-green-400">
                                    ✏️
                                </span>
                                Edit Pricing
                            </button>
                        </div>

                    </div>
                </div>




                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

                    <div className="px-6 py-3 bg-gradient-to-r from-teal-400 to-green-400 text-white font-medium">
                        Orders History
                    </div>

                    <div className="p-6">

                        <div className="grid grid-cols-5 text-sm text-gray-500 bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                            <span>Order ID</span>
                            <span>Customer Name</span>
                            <span>Date & Time</span>
                            <span>Quantity</span>
                            <span>Status</span>
                        </div>

                        <div className="mt-3 space-y-3">
                            {orders.map((order, index) => (
                                <div
                                    key={index}
                                    className="grid grid-cols-5 items-center px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm"
                                >
                                    <span className="text-gray-600 text-sm">{order.id}</span>
                                    <span className="text-gray-600 text-sm">{order.name}</span>
                                    <span className="text-gray-600 text-sm">{order.date}</span>
                                    <span className="text-gray-600 text-sm">{order.qty}</span>

                                    <span
                                        className={`text-xs font-medium px-3 py-1 rounded-md w-fit ${getStatusStyle(order.status)}`}
                                    >
                                        {order.status}
                                    </span>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            



            <div className="bg-white mt-6 rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

                <div className="bg-gradient-to-r from-teal-400 to-green-400 px-6 py-3">
                    <h3 className="text-white font-semibold">SEO</h3>
                </div>

                <div className="p-6 space-y-6">

                    {/* Meta Title */}
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">
                            Meta Title
                        </label>
                        <input
                            name="meta_title"
                            placeholder="Enter Title"
                            className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-400"
                        />
                    </div>

                    {/* Meta Description */}
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">
                            Meta Description
                            <span className="text-xs text-gray-400 ml-1">(100 words max)</span>
                        </label>
                        <textarea
                            name="meta_description"
                            rows={4}
                            placeholder="Description"
                            className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-400"
                        />
                    </div>

                    {/* Keywords */}
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">
                            Meta Keywords
                        </label>

                        <div className="w-full border border-gray-300 rounded-xl p-3 flex gap-2 flex-wrap bg-gray-50">
                            <span className="px-3 py-1 bg-gray-200 rounded-md text-xs text-gray-700">Keyword</span>
                            <span className="px-3 py-1 bg-gray-200 rounded-md text-xs text-gray-700">Keyword</span>
                            <span className="px-3 py-1 bg-gray-200 rounded-md text-xs text-gray-700">Keyword</span>
                        </div>
                    </div>

                    {/* URL */}
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">
                            URL Handle
                        </label>

                        <div className="relative">
                            <input
                                name="url"
                                placeholder="Product URL"
                                className="w-full border border-gray-300 rounded-xl p-3 pr-10 focus:ring-2 focus:ring-teal-400"
                            />

                            <span className="absolute right-3 top-3 text-gray-400">✎</span>
                        </div>
                    </div>

                    {/* Button */}
                    <div className="flex justify-end pt-4">
                        <button className="px-5 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg flex items-center gap-2">
                            ✎ Edit pricing
                        </button>
                    </div>

                </div>
            </div>

</div>

        </div>
    )
}

export default ProductBase