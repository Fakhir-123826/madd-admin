import React, { useState } from "react";

const OrderFilter = ({ onApply }: { onApply: (filters: any) => void }) => {
    const [filters, setFilters] = useState({
        purchaseDateFrom: "",
        purchaseDateTo: "",
        grandTotalBaseFrom: "",
        grandTotalBaseTo: "",
        grandTotalPurchasedFrom: "",
        grandTotalPurchasedTo: "",
        purchasePoint: "All Store Views",
        id: "",
        billToName: "",
        shipToName: "",
        status: "",
        braintreeTransactionSource: "",
        disputeState: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleApply = () => {
        onApply(filters);
    };

    const handleCancel = () => {
        setFilters({
            purchaseDateFrom: "",
            purchaseDateTo: "",
            grandTotalBaseFrom: "",
            grandTotalBaseTo: "",
            grandTotalPurchasedFrom: "",
            grandTotalPurchasedTo: "",
            purchasePoint: "All Store Views",
            id: "",
            billToName: "",
            shipToName: "",
            status: "",
            braintreeTransactionSource: "",
            disputeState: "",
        });
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 space-y-6">
            {/* Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Purchase Date */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Purchase Date</label>
                    <div className="flex flex-col gap-2">
                        <input
                            type="date"
                            name="purchaseDateFrom"
                            value={filters.purchaseDateFrom}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg p-2 w-full h-10 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="From"
                        />
                        <input
                            type="date"
                            name="purchaseDateTo"
                            value={filters.purchaseDateTo}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg p-2 w-full h-10 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="To"
                        />
                    </div>
                </div>

                {/* Grand Total Base */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Grand Total (Base)</label>
                    <div className="flex flex-col gap-2">
                        <input
                            type="number"
                            name="grandTotalBaseFrom"
                            value={filters.grandTotalBaseFrom}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg p-2 w-full h-10 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="From"
                        />
                        <input
                            type="number"
                            name="grandTotalBaseTo"
                            value={filters.grandTotalBaseTo}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg p-2 w-full h-10 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="To"
                        />
                    </div>
                </div>

                {/* Grand Total Purchased */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Grand Total (Purchased)</label>
                    <div className="flex flex-col gap-2">
                        <input
                            type="number"
                            name="grandTotalPurchasedFrom"
                            value={filters.grandTotalPurchasedFrom}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg p-2 w-full h-10 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="From"
                        />
                        <input
                            type="number"
                            name="grandTotalPurchasedTo"
                            value={filters.grandTotalPurchasedTo}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg p-2 w-full h-10 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="To"
                        />
                    </div>
                </div>
                {/* Purchase Point */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Purchase Point</label>
                    <select
                        name="purchasePoint"
                        value={filters.purchasePoint}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-lg p-2 w-full h-10 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option>All Store Views</option>
                        <option>Store 1</option>
                        <option>Store 2</option>
                    </select>
                </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">ID</label>
                    <input
                        type="text"
                        name="id"
                        value={filters.id}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-lg p-2 w-full h-10 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Bill-to Name</label>
                    <input
                        type="text"
                        name="billToName"
                        value={filters.billToName}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-lg p-2 w-full h-10 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Ship-to Name</label>
                    <input
                        type="text"
                        name="shipToName"
                        value={filters.shipToName}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-lg p-2 w-full h-10 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                    <select
                        name="status"
                        value={filters.status}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-lg p-2 w-full h-10 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="">All</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Braintree Transaction Source</label>
                    <input
                        type="text"
                        name="braintreeTransactionSource"
                        value={filters.braintreeTransactionSource}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-lg p-2 w-full h-10 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Dispute State</label>
                    <input
                        type="text"
                        name="disputeState"
                        value={filters.disputeState}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-lg p-2 w-full h-10 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                <div className="col-span-1 sm:col-span-2 flex justify-end gap-4">
                    <button
                        onClick={handleCancel}
                        className="text-gray-500 hover:text-gray-700 transition font-semibold"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleApply}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-semibold transition"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderFilter;