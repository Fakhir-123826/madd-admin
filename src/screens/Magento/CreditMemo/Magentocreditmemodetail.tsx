import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPrint, FaEdit } from "react-icons/fa";

const MagentoCreditMemoDetail = () => {
    const navigate = useNavigate();
    const [comment, setComment] = useState("");
    const [notifyEmail, setNotifyEmail] = useState(false);
    const [visibleStorefront, setVisibleStorefront] = useState(false);

    const memo = {
        number: "000000001",
        date: "Feb 24, 2026",
        status: "Refunded",
        order: { number: "000000002", date: "Feb 24, 2026, 1:06:34 AM", status: "Closed", purchasedFrom: ["Main Website", "Main Website Store", "Default Store View"] },
        account: { name: "Veronica Costello", email: "roni_cost@example.com", group: "General" },
        billing: { name: "Veronica Costello", address: "6146 Honey Bluff Parkway", city: "Calder, Michigan, 49628-7978", country: "United States", phone: "T: (555) 229-3326" },
        shipping: { name: "Veronica Costello", address: "6146 Honey Bluff Parkway", city: "Calder, Michigan, 49628-7978", country: "United States", phone: "T: (555) 229-3326" },
        payment: { method: "Check / Money order", note: "The order was placed using USD." },
        shippingMethod: { method: "Flat Rate - Fixed", charges: "$5.00" },
        items: [
            { product: "Minerva LumaTech™ V-Tee", sku: "WS08-XS-Blue", size: "XS", color: "Blue", price: "$32.00", qty: 1, subtotal: "$32.00", tax: "$2.64", discount: "$0.00", rowTotal: "$34.64" },
        ],
        totals: { subtotal: "$32.00", shipping: "$5.00", adjustmentRefund: "$0.00", adjustmentFee: "$0.00", tax: "$2.64", grandTotal: "$39.64" },
    };

    const InfoRow = ({ label, value, alt }: { label: string; value: React.ReactNode; alt?: boolean }) => (
        <div className={`flex items-start justify-between px-3 py-2.5 rounded-lg ${alt ? "bg-gray-50" : "bg-white"}`}>
            <span className="text-xs text-gray-500">{label}</span>
            <span className="text-xs text-gray-700 font-medium text-right max-w-[60%]">{value}</span>
        </div>
    );

    const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
            </div>
            <div className="p-6">{children}</div>
        </div>
    );

    return (
        <div className="space-y-5">

            {/* TOP BAR */}
            <div className="bg-white rounded-xl shadow-sm px-6 py-4 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 text-gray-500 text-xs hover:bg-gray-50 transition-all">
                        <FaArrowLeft className="text-xs" /> Back
                    </button>
                    <div>
                        <h2 className="text-base font-semibold text-gray-800">Credit Memo # {memo.number}</h2>
                        <p className="text-xs text-gray-400 mt-0.5">The credit memo confirmation email is not sent</p>
                    </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-xs hover:bg-gray-50 transition-all">
                    <FaPrint className="text-xs" /> Print
                </button>
            </div>

            {/* CREDIT MEMO INFORMATION */}
            <SectionCard title="Credit Memo Information">
                <div className="space-y-1">
                    <InfoRow label="Credit Memo Date" value={memo.date} alt />
                    <InfoRow label="Status" value={
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-600 border border-green-200">
                            {memo.status}
                        </span>
                    } />
                </div>
            </SectionCard>

            {/* ORDER & ACCOUNT INFORMATION */}
            <SectionCard title="Order & Account Information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <p className="text-xs font-semibold text-blue-500 mb-3 cursor-pointer hover:underline">
                            Order # {memo.order.number}
                            <span className="text-gray-400 font-normal ml-1">(The order confirmation email is not sent)</span>
                        </p>
                        <div className="space-y-1">
                            <InfoRow label="Order Date" value={memo.order.date} alt />
                            <InfoRow label="Order Status" value={
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                                    {memo.order.status}
                                </span>
                            } />
                            <InfoRow label="Purchased From" value={
                                <div className="text-right">
                                    {memo.order.purchasedFrom.map((p, i) => (
                                        <p key={i} className="text-xs text-gray-700">{p}</p>
                                    ))}
                                </div>
                            } alt />
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-700 mb-3">Account Information</p>
                        <div className="space-y-1">
                            <InfoRow label="Customer Name" value={memo.account.name} alt />
                            <InfoRow label="Email" value={
                                <a href={`mailto:${memo.account.email}`} className="text-xs text-blue-500 hover:underline">
                                    {memo.account.email}
                                </a>
                            } />
                            <InfoRow label="Customer Group" value={memo.account.group} alt />
                        </div>
                    </div>
                </div>
            </SectionCard>

            {/* ADDRESS INFORMATION */}
            <SectionCard title="Address Information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {[
                        { title: "Billing Address", data: memo.billing },
                        { title: "Shipping Address", data: memo.shipping },
                    ].map((addr) => (
                        <div key={addr.title} className="bg-gray-50 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <p className="text-xs font-semibold text-gray-700">{addr.title}</p>
                                <button className="text-xs text-blue-500 hover:underline flex items-center gap-1">
                                    <FaEdit className="text-[9px]" /> Edit
                                </button>
                            </div>
                            <p className="text-xs font-medium text-gray-700">{addr.data.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{addr.data.address}</p>
                            <p className="text-xs text-gray-500">{addr.data.city}</p>
                            <p className="text-xs text-gray-500">{addr.data.country}</p>
                            <p className="text-xs text-gray-500">{addr.data.phone}</p>
                        </div>
                    ))}
                </div>
            </SectionCard>

            {/* PAYMENT & SHIPPING */}
            <SectionCard title="Payment & Shipping Method">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-xs font-semibold text-gray-700 mb-2">Payment Information</p>
                        <p className="text-xs text-gray-700">{memo.payment.method}</p>
                        <p className="text-xs text-gray-400 mt-1">{memo.payment.note}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-xs font-semibold text-gray-700 mb-2">Shipping Information</p>
                        <p className="text-xs font-medium text-gray-700">{memo.shippingMethod.method}</p>
                        <p className="text-xs text-gray-500 mt-1">
                            Total Shipping Charges: <span className="font-semibold text-gray-700">{memo.shippingMethod.charges}</span>
                        </p>
                    </div>
                </div>
            </SectionCard>

            {/* ITEMS REFUNDED */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-800">Items Refunded</h3>
                </div>
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", minWidth: "700px", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "linear-gradient(to right, #38bdf8, #3b82f6)" }}>
                                {["Product", "Price", "Qty", "Subtotal", "Tax Amount", "Discount Amount", "Row Total"].map(h => (
                                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wide whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {memo.items.map((item, i) => (
                                <tr key={i} style={{ borderBottom: "1px solid #f3f4f6" }} className="hover:bg-gray-50 transition-all">
                                    <td className="px-4 py-3">
                                        <p className="text-xs font-medium text-gray-700">{item.product}</p>
                                        <p className="text-xs text-gray-400">SKU: {item.sku}</p>
                                        <p className="text-xs text-gray-400">Size: {item.size}</p>
                                        <p className="text-xs text-gray-400">Color: {item.color}</p>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">{item.price}</td>
                                    <td className="px-4 py-3 text-xs font-semibold text-blue-500">{item.qty}</td>
                                    <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">{item.subtotal}</td>
                                    <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">{item.tax}</td>
                                    <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">{item.discount}</td>
                                    <td className="px-4 py-3 text-xs font-semibold text-gray-700 whitespace-nowrap">{item.rowTotal}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* HISTORY + TOTALS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Credit Memo History */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-800">Credit Memo History</h3>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="text-xs font-medium text-gray-600 mb-1.5 block">Comment Text</label>
                            <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={4}
                                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-700 outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all resize-none"
                                placeholder="Add a comment..." />
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={notifyEmail} onChange={(e) => setNotifyEmail(e.target.checked)}
                                className="accent-teal-500 w-3.5 h-3.5" />
                            <span className="text-xs text-gray-600">Notify Customer by Email</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={visibleStorefront} onChange={(e) => setVisibleStorefront(e.target.checked)}
                                className="accent-teal-500 w-3.5 h-3.5" />
                            <span className="text-xs text-gray-600">Visible on Storefront</span>
                        </label>
                        <button className="px-5 py-2.5 rounded-xl text-white text-xs font-semibold hover:opacity-90 transition-all"
                            style={{ background: "linear-gradient(to right, #2dd4bf, #22c55e)" }}>
                            Submit Comment
                        </button>
                    </div>
                </div>

                {/* Credit Memo Totals */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-800">Credit Memo Totals</h3>
                    </div>
                    <div className="p-6 space-y-1">
                        <InfoRow label="Subtotal" value={memo.totals.subtotal} alt />
                        <InfoRow label="Shipping & Handling" value={memo.totals.shipping} />
                        <InfoRow label="Adjustment Refund" value={memo.totals.adjustmentRefund} alt />
                        <InfoRow label="Adjustment Fee" value={memo.totals.adjustmentFee} />
                        <InfoRow label="Tax" value={memo.totals.tax} alt />
                        <div className="mt-3 flex items-center justify-between px-4 py-3 rounded-xl"
                            style={{ background: "linear-gradient(to right, #38bdf8, #3b82f6)" }}>
                            <span className="text-sm font-bold text-white">Grand Total</span>
                            <span className="text-sm font-bold text-white">{memo.totals.grandTotal}</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default MagentoCreditMemoDetail;