import { useState } from "react";
import { FaFilter } from "react-icons/fa";
import { useGetProductsQuery, type MagentoProduct } from "../../../app/api/MagentoSlices/ProductSlice";
import { useGetStockQuery } from "../../../app/api/MagentoSlices/InventoryApi";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import StoreViewDropdown from "../../../component/StoreViewDropdown";
import type { StoreViewSelection } from "../../../model/MagentoProduct/StoreViewSelection";

// ============ SINGLE ROW — ek SKU ka stock fetch karta hai ============
function InventoryRow({ product, tdBase }: { product: MagentoProduct; tdBase: string }) {
    const { data: stockRes, isLoading } = useGetStockQuery(product.sku);
    const stock = stockRes?.data;
    const navigate = useNavigate();

    const qtyColor = () => {
        if (isLoading) return "text-gray-400";
        const qty = stock?.qty ?? 0;
        if (qty === 0) return "text-red-500 font-bold";
        if (qty < 10) return "text-orange-500 font-semibold";
        return "text-green-600 font-semibold";
    };

    return (
        <tr className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <td className={`${tdBase} font-medium text-black`}>#{product.id}</td>
            <td className={tdBase}>{product.sku}</td>
            <td className={tdBase}>{product.name}</td>
            <td className={tdBase}>{product.type_id}</td>
            <td className={`${tdBase} font-semibold`}>
                ${Number(product.price ?? 0).toFixed(2)}
            </td>

            {/* QTY */}
            <td className={`${tdBase} ${qtyColor()}`}>
                {isLoading ? (
                    <span className="text-gray-400 text-xs">Loading...</span>
                ) : (
                    stock?.qty ?? "—"
                )}
            </td>

            {/* In Stock */}
            <td className={tdBase}>
                {isLoading ? (
                    <span className="text-gray-400 text-xs">...</span>
                ) : stock?.is_in_stock ? (
                    <span className="px-3 py-1 rounded-md text-xs font-medium bg-green-100 text-green-600">
                        In Stock
                    </span>
                ) : (
                    <span className="px-3 py-1 rounded-md text-xs font-medium bg-red-100 text-red-600">
                        Out of Stock
                    </span>
                )}
            </td>

            {/* Min Qty */}
            <td className={tdBase}>{isLoading ? "..." : stock?.min_qty ?? "—"}</td>

            {/* Max Sale Qty */}
            <td className={tdBase}>{isLoading ? "..." : stock?.max_sale_qty ?? "—"}</td>

            {/* Manage Stock */}
            <td className={tdBase}>
                {isLoading ? "..." : stock?.manage_stock ? (
                    <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-xs">Yes</span>
                ) : (
                    <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-md text-xs">No</span>
                )}
            </td>
            <td className="relative p-4">
                <button
                    onClick={() => navigate(`/UpdateMagentoInventory/${product.sku}/${stock?.item_id}`)}
                    disabled={isLoading || !stock?.item_id}
                    className="text-gray-400 hover:text-teal-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Edit Stock"
                >
                    <Eye size={18} />
                </button>
            </td>
        </tr>
    );
}

// ============ MAIN COMPONENT ============
function MagentoInventoryList() {
    const [currentPage, setCurrentPage] = useState(1);
    const [skuSearch, setSkuSearch] = useState("");
    const [showFilter, setShowFilter] = useState(false);
    const itemsPerPage = 10;
    const [storeSelection, setStoreSelection] = useState<StoreViewSelection>({ type: "all" });

    const { data, isLoading, error } = useGetProductsQuery({
        filters: skuSearch ? { sku: skuSearch } : {},
        page: currentPage,
        pageSize: itemsPerPage,
    });

    const products: MagentoProduct[] = data?.items || [];
    const totalPages = Math.ceil((data?.total_count || 0) / itemsPerPage);

    const tdBase =
        "relative p-4 text-gray-600 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:bg-gradient-to-r after:from-teal-400 after:to-green-400";

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Magento Inventory</h2>
                <div className="flex items-center gap-3">
                    <StoreViewDropdown onChange={(sel) => setStoreSelection(sel)} />

                    {/* SKU Search */}
                    <input
                        type="text"
                        placeholder="Search by SKU..."
                        value={skuSearch}
                        onChange={(e) => { setSkuSearch(e.target.value); setCurrentPage(1); }}
                        className="px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-600 outline-none focus:border-teal-400 transition-colors w-48"
                    />

                    {/* Filter Toggle */}
                    <button
                        onClick={() => setShowFilter((prev) => !prev)}
                        className="flex items-center gap-2 cursor-pointer px-6 py-2 rounded-full border border-teal-400 text-teal-500 text-sm font-medium hover:bg-teal-50 transition-colors"
                    >
                        <FaFilter className="text-sm" />
                        {showFilter ? "Hide Filters" : "Show Filters"}
                    </button>
                </div>
            </div>

            {/* TABLE */}
            <div className="rounded-t-3xl overflow-x-auto mt-6">
                <table className="w-max min-w-full text-sm border-separate border-spacing-y-3">
                    <thead className="bg-gradient-to-r from-teal-400 to-green-400 text-white">
                        <tr>
                            <th className="p-4 text-left">ID</th>
                            <th className="p-4 text-left">SKU</th>
                            <th className="p-4 text-left">Name</th>
                            <th className="p-4 text-left">Type</th>
                            <th className="p-4 text-left">Price</th>
                            <th className="p-4 text-left">QTY</th>
                            <th className="p-4 text-left">Status</th>
                            <th className="p-4 text-left">Min QTY</th>
                            <th className="p-4 text-left">Max Sale QTY</th>
                            <th className="p-4 text-left">Manage Stock</th>
                            <th className="p-4 text-left">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={10} className="text-center py-6 text-gray-400">
                                    Loading products...
                                </td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan={10} className="text-center py-6 text-red-500">
                                    Error loading inventory
                                </td>
                            </tr>
                        ) : products.length === 0 ? (
                            <tr>
                                <td colSpan={10} className="text-center py-10 text-gray-500">
                                    No products found
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <InventoryRow
                                    key={product.sku}
                                    product={product}
                                    tdBase={tdBase}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION */}
            <div className="flex justify-center gap-2 py-6">
                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-1 rounded ${currentPage === i + 1
                            ? "bg-gradient-to-r from-teal-400 to-green-400 text-white"
                            : "bg-gray-100"
                            }`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default MagentoInventoryList;