    import React, { useState } from "react";
    import { Eye, Send, X } from "lucide-react";
    import { MdDeleteForever } from "react-icons/md";

    interface Invoice {
    id: number;
    title: string;
    paidBy: string;
    invoiceTo: string;
    previewImage: string;
    includesTax: boolean;
    autoEmail: boolean;
    }

    /* -------------------- Toggle Switch Component -------------------- */

    interface ToggleProps {
    label: string;
    enabled: boolean;
    onChange: () => void;
    }

    const ToggleSwitch: React.FC<ToggleProps> = ({
    label,
    enabled,
    onChange,
    }) => {
    return (
        <div className="flex flex-col items-center gap-2 w-24">
        <span className="text-gray-700 text-sm font-bold">{label}</span>
        <button
            onClick={onChange}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-all duration-300 ${
            enabled ? "bg-blue-500" : "bg-gray-300"
            }`}
        >
            <div
            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                enabled ? "translate-x-5" : "translate-x-0"
            }`}
            />
        </button>
        </div>
    );
    };

    /* -------------------- Main Component -------------------- */

    function InvoiceManagement() {
    const [invoices, setInvoices] = useState<Invoice[]>([
        {
        id: 1,
        title: "Customer Invoice",
        paidBy: "341",
        invoiceTo: "Thank You for your Purchase",
        previewImage:
            "https://marketplace.canva.com/EAGCxMXySx4/1/0/1131w/canva-simple-minimalist-business-invoice-aBb_N6_4CUg.jpg",
        includesTax: true,
        autoEmail: true,
        },
        {
        id: 2,
        title: "Vendor Invoice",
        paidBy: "341",
        invoiceTo: "Thank You for your Purchase",
        previewImage:
            "https://marketplace.canva.com/EAGCxMXySx4/1/0/1131w/canva-simple-minimalist-business-invoice-aBb_N6_4CUg.jpg",
        includesTax: false,
        autoEmail: true,
        },
        {
        id: 3,
        title: "Freelancer Invoice",
        paidBy: "341",
        invoiceTo: "Thank You for your Purchase",
        previewImage:
            "https://marketplace.canva.com/EAGCxMXySx4/1/0/1131w/canva-simple-minimalist-business-invoice-aBb_N6_4CUg.jpg",
        includesTax: true,
        autoEmail: false,
        },
    ]);

    // State for modals
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [deletedInvoiceTitle, setDeletedInvoiceTitle] = useState("");

    const toggleField = (id: number, field: "includesTax" | "autoEmail") => {
        setInvoices((prev) =>
        prev.map((invoice) =>
            invoice.id === id
            ? { ...invoice, [field]: !invoice[field] }
            : invoice
        )
        );
    };

    const handleDeleteClick = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        if (selectedInvoice) {
        setInvoices(invoices.filter(inv => inv.id !== selectedInvoice.id));
        setDeletedInvoiceTitle(selectedInvoice.title);
        setShowDeleteModal(false);
        setShowSuccessModal(true);
        }
    };

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
        setSelectedInvoice(null);
    };

    return (
        <div className="min-h-screen bg-white rounded-xl p-6">
        <div className="max-w-6xl mx-auto space-y-8">
            <h1 className="text-2xl font-bold text-gray-800">
            Invoice Management
            </h1>

            {invoices.map((invoice) => (
            <div
                key={invoice.id}
                className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
                {/* Top Gradient Header */}
                <div className="bg-gradient-to-r from-teal-500 to-green-500 text-white px-6 py-3 font-bold">
                {invoice.title}
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col md:flex-row justify-between gap-8 w-[60]">
                
                {/* Left Side */}
                <div className="space-y-4 w-full">



                    {/* Paid By */}
                    <div>
                    <p className="text-sm text-gray-500 font-bold">Prefix: INV</p>
                    <p className="font-normal text-gray-800">
                        {invoice.paidBy}
                    </p>
                    </div>

                    {/* Invoice To */}
                    <div>
                    <p className="text-sm text-gray-500 font-bold">Footer Message</p>
                    <p className="font-normal text-gray-800">
                        {invoice.invoiceTo}
                    </p>
                    </div>
                
                    {/* Buttons */}
                    <div className="flex flex-wrap gap-4 pt-6">
                    {/* Delete Button */}
                    <button 
                        onClick={() => handleDeleteClick(invoice)}
                        className="flex items-center gap-3 px-6 py-1 rounded-full bg-red-500 text-white text-sm font-medium shadow-md hover:bg-red-600 transition-all duration-200 hover:shadow-lg"
                    >
                        <span className="relative -left-5 flex items-center justify-center w-8 h-8 rounded-full bg-white">
                        <MdDeleteForever className="text-red-500" size={20} />
                        </span>
                        Delete
                    </button>
                    </div>
                </div>

                
                    {/* Toggles */}
                    <div className="">
                    <div className="flex gap-12 pt-2">
                        <ToggleSwitch
                        label="Includes Tax"
                        enabled={invoice.includesTax}
                        onChange={() =>
                            toggleField(invoice.id, "includesTax")
                        }
                        />

                        <ToggleSwitch
                        label="Auto Email"
                        enabled={invoice.autoEmail}
                        onChange={() =>
                            toggleField(invoice.id, "autoEmail")
                        }
                        />
                    </div>
                    </div>

                {/* Right Side - Invoice Preview */}
                <div className="flex justify-center md:justify-end">
                    <img
                    src={invoice.previewImage}
                    alt="Invoice Preview"
                    className="w-64 h-auto rounded-lg shadow"
                    />
                </div>
                </div>
            </div>
            ))}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedInvoice && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
            <div className="bg-white rounded-2xl p-8 w-[400px] text-center relative shadow-2xl animate-[scaleIn_0.3s_ease-out]">
                
                {/* Close button */}
                <button
                onClick={() => setShowDeleteModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                <X size={20} />
                </button>

                {/* Bin Icon */}
                <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-red-100 flex items-center justify-center">
                <MdDeleteForever className="text-red-500" size={40} />
                </div>

                {/* Confirmation Text - Heading bold, message normal */}
                <p className="text-gray-700 text-lg font-bold mb-2">
                Are you sure want to delete this Invoice?
                </p>
                <p className="text-gray-500 text-sm mb-8">
                This action cannot be undone.
                </p>

                {/* Buttons */}
                <div className="flex gap-4 justify-center">
                <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-8 py-2.5 border-2 border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium w-24"
                >
                    No
                </button>

                <button
                    onClick={handleConfirmDelete}
                    className="px-8 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium shadow-md w-24"
                >
                    Yes
                </button>
                </div>
            </div>
            </div>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
            <div className="bg-white rounded-2xl p-8 w-[450px] text-center relative shadow-2xl animate-[scaleIn_0.3s_ease-out]">
                
                {/* Close button */}
                <button
                onClick={handleCloseSuccessModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                <X size={20} />
                </button>

                {/* Tick Icon */}
                <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-r from-teal-500 to-green-500 flex items-center justify-center text-white text-4xl shadow-lg">
                ✓
                </div>

                {/* Success Content - Heading bold, message normal */}
                <h2 className="text-2xl font-bold mb-3 text-gray-800">
                Invoice Deleted!
                </h2>
                
                <p className="text-gray-600 text-lg">
                Invoice <span className="font-semibold text-teal-600">"{deletedInvoiceTitle}"</span>
                </p>
                <p className="text-gray-500 mb-4">
                has been successfully deleted.
                </p>

                {/* OK Button */}
                <button
                onClick={handleCloseSuccessModal}
                className="mt-4 px-10 py-2.5 bg-gradient-to-r from-teal-500 to-green-500 text-white rounded-lg hover:from-teal-600 hover:to-green-600 transition-all duration-200 font-medium shadow-md"
                >
                OK
                </button>
            </div>
            </div>
        )}

        {/* Add custom animations */}
        <style>{`
            @keyframes scaleIn {
            from {
                opacity: 0;
                transform: scale(0.9);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
            }
        `}</style>
        </div>
    );
    }

    export default InvoiceManagement;