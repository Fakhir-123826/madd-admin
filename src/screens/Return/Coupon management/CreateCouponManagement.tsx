import React, { useState } from 'react'
import AddButton from '../../../component/AddButton'
import { useParams } from 'react-router-dom';

const CreateCouponManagement = () => {
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [form, setForm] = useState({
        code: '',
        discountType: 'percentage',
        discountValue: '',
        oneTimeUse: false,
        perUserLimit: 'once',
        totalLimit: '',
        startDate: '',
        endDate: '',
        minOrderEnabled: false,
        minOrderValue: '',
        specificProductEnabled: false,
        productId: ''
    });

    const handleChange = (e:any) => {
        const { name, value, type, checked } = e.target;
        setForm((prev:any) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e:any) => {
        e.preventDefault();
        console.log(form);
    };

    return (
        <div className="bg-white shadow-sm p-6">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Coupon Management Basic Info</h2>
                <AddButton
                    label={isEdit ? "Update Coupon" : "Create Coupon"}
                    type="button"
                    onClick={()=>handleSubmit}
                />
            </div>

            {/* Form Card */}
            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6"
            >

                {/* SECTION TITLE */}
                <h2 className="text-lg font-semibold text-gray-800">Coupon Info</h2>

                {/* Coupon Code */}
                <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                        Coupon Code
                    </label>
                    <input
                        name="code"
                        value={form.code}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-xl p-3"
                        placeholder="Enter coupon code"
                    />
                </div>

                {/* Discount Wrapper */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-4">

                    <p className="text-sm font-semibold text-gray-700">Discount Type</p>

                    <div className="flex gap-6">
                        {["percentage", "flat", "shipping"].map(type => (
                            <label key={type} className="flex items-center gap-2 text-sm">
                                <input
                                    type="radio"
                                    name="discountType"
                                    value={type}
                                    checked={form.discountType === type}
                                    onChange={handleChange}
                                />
                                {type === "percentage" && "Percentage"}
                                {type === "flat" && "Flat Amount"}
                                {type === "shipping" && "Free Shipping"}
                            </label>
                        ))}
                    </div>

                    {form.discountType !== "shipping" && (
                        <input
                            name="discountValue"
                            value={form.discountValue}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg px-3 py-2 w-40"
                            placeholder="Value"
                        />
                    )}
                </div>

                {/* Usage Limits */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-4">

                    <p className="text-sm font-semibold text-gray-700">Usage Limits</p>

                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            name="oneTimeUse"
                            checked={form.oneTimeUse}
                            onChange={handleChange}
                        />
                        One time use
                    </label>

                    <div className="flex gap-6">
                        {["once", "twice", "unlimited"].map(limit => (
                            <label key={limit} className="flex items-center gap-2 text-sm">
                                <input
                                    type="radio"
                                    name="perUserLimit"
                                    value={limit}
                                    checked={form.perUserLimit === limit}
                                    onChange={handleChange}
                                />
                                {limit.charAt(0).toUpperCase() + limit.slice(1)}
                            </label>
                        ))}
                    </div>

                    <input
                        name="totalLimit"
                        value={form.totalLimit}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-lg px-3 py-2 w-40"
                        placeholder="Total usage limit"
                    />
                </div>

                {/* Validity */}
                <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Validity Period</p>

                    <div className="flex gap-4">
                        <input
                            type="date"
                            name="startDate"
                            value={form.startDate}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg px-3 py-2"
                        />
                        <input
                            type="date"
                            name="endDate"
                            value={form.endDate}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg px-3 py-2"
                        />
                    </div>
                </div>

                {/* Conditions */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-4">

                    <p className="text-sm font-semibold text-gray-700">Conditions</p>

                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            name="minOrderEnabled"
                            checked={form.minOrderEnabled}
                            onChange={handleChange}
                        />
                        Minimum Order Value
                    </label>

                    {form.minOrderEnabled && (
                        <input
                            name="minOrderValue"
                            value={form.minOrderValue}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg px-3 py-2 w-40"
                            placeholder="Amount"
                        />
                    )}

                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            name="specificProductEnabled"
                            checked={form.specificProductEnabled}
                            onChange={handleChange}
                        />
                        Specific Product
                    </label>

                    {form.specificProductEnabled && (
                        <input
                            name="productId"
                            value={form.productId}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg px-3 py-2 w-40"
                            placeholder="Product ID"
                        />
                    )}
                </div>

            </form>
        </div>
    )
}

export default CreateCouponManagement