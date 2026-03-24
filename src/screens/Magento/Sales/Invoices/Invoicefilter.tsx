import React, { useState } from "react";

interface Filters {
    invoiceDateFrom: string;
    invoiceDateTo: string;
    orderDateFrom: string;
    orderDateTo: string;
    grandTotalBaseFrom: string;
    grandTotalBaseTo: string;
    grandTotalPurchasedFrom: string;
    grandTotalPurchasedTo: string;
    invoice: string;
    orderNumber: string;
    billToName: string;
    status: string;
}

interface InvoiceFilterProps {
    onApply: (filters: Filters) => void;
}

const InvoiceFilter = ({ onApply }: InvoiceFilterProps) => {
    const [filters, setFilters] = useState<Filters>({
        invoiceDateFrom: "",
        invoiceDateTo: "",
        orderDateFrom: "",
        orderDateTo: "",
        grandTotalBaseFrom: "",
        grandTotalBaseTo: "",
        grandTotalPurchasedFrom: "",
        grandTotalPurchasedTo: "",
        invoice: "",
        orderNumber: "",
        billToName: "",
        status: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleApply = () => onApply(filters);

    const handleCancel = () => {
        setFilters({
            invoiceDateFrom: "", invoiceDateTo: "",
            orderDateFrom: "", orderDateTo: "",
            grandTotalBaseFrom: "", grandTotalBaseTo: "",
            grandTotalPurchasedFrom: "", grandTotalPurchasedTo: "",
            invoice: "", orderNumber: "", billToName: "", status: "",
        });
    };

    const inputClass = "w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-700 outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all";
    const labelClass = "block text-xs font-semibold text-gray-600 mb-2";

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">

            {/* ROW 1 — Date & Total Range Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                {/* Invoice Date */}
                <div>
                    <label className={labelClass}>Invoice Date</label>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 w-6">from</span>
                            <input type="date" name="invoiceDateFrom" value={filters.invoiceDateFrom}
                                onChange={handleChange} className={inputClass} />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 w-6">to</span>
                            <input type="date" name="invoiceDateTo" value={filters.invoiceDateTo}
                                onChange={handleChange} className={inputClass} />
                        </div>
                    </div>
                </div>

                {/* Order Date */}
                <div>
                    <label className={labelClass}>Order Date</label>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 w-6">from</span>
                            <input type="date" name="orderDateFrom" value={filters.orderDateFrom}
                                onChange={handleChange} className={inputClass} />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 w-6">to</span>
                            <input type="date" name="orderDateTo" value={filters.orderDateTo}
                                onChange={handleChange} className={inputClass} />
                        </div>
                    </div>
                </div>

                {/* Grand Total (Base) */}
                <div>
                    <label className={labelClass}>Grand Total (Base)</label>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 w-6">from</span>
                            <input type="number" name="grandTotalBaseFrom" value={filters.grandTotalBaseFrom}
                                onChange={handleChange} placeholder="0.00" className={inputClass} />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 w-6">to</span>
                            <input type="number" name="grandTotalBaseTo" value={filters.grandTotalBaseTo}
                                onChange={handleChange} placeholder="0.00" className={inputClass} />
                        </div>
                    </div>
                </div>

                {/* Grand Total (Purchased) */}
                <div>
                    <label className={labelClass}>Grand Total (Purchased)</label>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 w-6">from</span>
                            <input type="number" name="grandTotalPurchasedFrom" value={filters.grandTotalPurchasedFrom}
                                onChange={handleChange} placeholder="0.00" className={inputClass} />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 w-6">to</span>
                            <input type="number" name="grandTotalPurchasedTo" value={filters.grandTotalPurchasedTo}
                                onChange={handleChange} placeholder="0.00" className={inputClass} />
                        </div>
                    </div>
                </div>
            </div>

            {/* ROW 2 — Text & Select Fields + Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                {/* Invoice */}
                <div>
                    <label className={labelClass}>Invoice</label>
                    <input type="text" name="invoice" value={filters.invoice}
                        onChange={handleChange} className={inputClass} />
                </div>

                {/* Order # */}
                <div>
                    <label className={labelClass}>Order #</label>
                    <input type="text" name="orderNumber" value={filters.orderNumber}
                        onChange={handleChange} className={inputClass} />
                </div>

                {/* Bill-to Name */}
                <div>
                    <label className={labelClass}>Bill-to Name</label>
                    <input type="text" name="billToName" value={filters.billToName}
                        onChange={handleChange} className={inputClass} />
                </div>

                {/* Status */}
                <div>
                    <label className={labelClass}>Status</label>
                    <select name="status" value={filters.status} onChange={handleChange} className={inputClass}>
                        <option value=""></option>
                        <option value="paid">Paid</option>
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* BUTTONS */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
                <button onClick={handleCancel}
                    className="text-xs font-medium text-gray-500 hover:text-gray-700 transition-all px-3 py-2">
                    Cancel
                </button>
                <button onClick={handleApply}
                    className="px-5 py-2.5 rounded-xl text-white text-xs font-semibold hover:opacity-90 transition-all"
                    style={{ background: "linear-gradient(to right, #38bdf8, #3b82f6)" }}>
                    Apply Filters
                </button>
            </div>

        </div>
    );
};

export default InvoiceFilter;