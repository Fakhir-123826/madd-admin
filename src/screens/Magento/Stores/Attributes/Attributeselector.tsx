import { useState, useEffect } from "react";
import { X, Search } from "lucide-react";
import { useGetAttributesQuery, type MagentoAttribute } from "../../../../app/api/MagentoSlices/Attributes";

interface AttributeSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    onAddSelected: (attributes: MagentoAttribute[]) => void;
    alreadySelected?: string[]; // attribute_codes jo already selected hain
}

export default function AttributeSelector({
    isOpen,
    onClose,
    onAddSelected,
    alreadySelected = [],
}: AttributeSelectorProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<string[]>([]);
    const itemsPerPage = 10;

    const { data: response, isLoading, isFetching } = useGetAttributesQuery({
        page: currentPage,
        pageSize: itemsPerPage,
    });

    const isSuccess = response?.success && response?.status === 200;
    const allAttributes: MagentoAttribute[] = isSuccess ? response.data.items : [];
    const totalCount = isSuccess ? response.data.total_count : 0;
    const totalPages = Math.ceil(totalCount / itemsPerPage);

    // Search filter — frontend pe
    const attributes = allAttributes.filter((attr) => {
        const label = attr.default_frontend_label?.toLowerCase() || "";
        const code = attr.attribute_code?.toLowerCase() || "";
        const q = search.toLowerCase();
        return label.includes(q) || code.includes(q);
    });

    // Reset on close
    useEffect(() => {
        if (!isOpen) {
            setSelected([]);
            setSearch("");
            setCurrentPage(1);
        }
    }, [isOpen]);

    const toggleSelect = (code: string) => {
        setSelected((prev) =>
            prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
        );
    };

    const handleAddSelected = () => {
        const selectedAttributes = allAttributes.filter((a) =>
            selected.includes(a.attribute_code)
        );
        onAddSelected(selectedAttributes);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/30 z-40 transition-opacity"
                onClick={onClose}
            />

            {/* Offcanvas */}
            <div className="fixed right-0 top-0 h-full w-[520px] bg-white z-50 shadow-2xl flex flex-col transition-transform">

                {/* HEADER */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">Select Attribute</h2>
                        {selected.length > 0 && (
                            <p className="text-xs text-teal-600 mt-0.5">
                                {selected.length} selected
                            </p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* SEARCH */}
                <div className="px-6 py-4 border-b border-gray-100">
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by code or label..."
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-50 transition-all"
                        />
                    </div>
                </div>

                {/* TABLE */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {isLoading || isFetching ? (
                        <div className="text-center py-10 text-gray-400 text-sm">Loading attributes...</div>
                    ) : attributes.length === 0 ? (
                        <div className="text-center py-10 text-gray-400 text-sm">No attributes found</div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gradient-to-r from-teal-400 to-green-400 text-white rounded-xl">
                                    <th className="p-3 text-left rounded-l-xl w-10"></th>
                                    <th className="p-3 text-left">Code</th>
                                    <th className="p-3 text-left">Label</th>
                                    <th className="p-3 text-left rounded-r-xl">Type</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attributes.map((attr) => {
                                    const isAlreadyAdded = alreadySelected.includes(attr.attribute_code);
                                    const isChecked = selected.includes(attr.attribute_code);

                                    return (
                                        <tr
                                            key={attr.attribute_code}
                                            onClick={() => !isAlreadyAdded && toggleSelect(attr.attribute_code)}
                                            className={`border-b border-gray-50 transition-colors
                        ${isAlreadyAdded ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:bg-teal-50/50"}
                        ${isChecked ? "bg-teal-50" : ""}`}
                                        >
                                            {/* Checkbox */}
                                            <td className="p-3">
                                                <input
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    disabled={isAlreadyAdded}
                                                    onChange={() => toggleSelect(attr.attribute_code)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="w-4 h-4 accent-teal-500 cursor-pointer"
                                                />
                                            </td>

                                            {/* Code */}
                                            <td className="p-3 font-mono text-xs text-gray-500">
                                                {attr.attribute_code}
                                            </td>

                                            {/* Label */}
                                            <td className="p-3 text-gray-700 font-medium">
                                                {attr.default_frontend_label || "—"}
                                            </td>

                                            {/* Input Type */}
                                            <td className="p-3">
                                                <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-xs font-medium">
                                                    {attr.frontend_input || "—"}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* PAGINATION */}
                {totalPages > 1 && (
                    <div className="flex justify-center gap-2 px-6 py-3 border-t border-gray-100">
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`px-3 py-1 rounded text-xs ${currentPage === i + 1
                                        ? "bg-gradient-to-r from-teal-400 to-green-400 text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                )}

                {/* FOOTER */}
                <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleAddSelected}
                        disabled={selected.length === 0}
                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-teal-400 to-green-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Add Selected ({selected.length})
                    </button>
                </div>

            </div>
        </>
    );
}