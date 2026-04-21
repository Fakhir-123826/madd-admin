import { useState } from "react";
import { FaFilter } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import StoreViewDropdown from "../../../component/StoreViewDropdown";
import type { StoreViewSelection } from "../../../model/MagentoProduct/StoreViewSelection";
import type { MagentoProduct } from "../../../app/api/MagentoSlices/ProductSlice";

// ============ FAKE DATA ============
const FAKE_PRODUCTS: MagentoProduct[] = [
    {
        id: "prod_001",
        sku: "WB1001",
        magento_sku: "WB1001-BLACK",
        name: "Classic Wireless Headphones",
        type_id: "configurable",
        price: 89.99,
        formatted_price: "$89.99",
        quantity: 245,
        is_in_stock: true,
        min_qty: 5,
        max_sale_qty: 50,
        manage_stock: true
    },
    {
        id: "prod_002",
        sku: "KB2002",
        magento_sku: "KB2002-RGB",
        name: "Mechanical Gaming Keyboard",
        type_id: "simple",
        price: 149.99,
        formatted_price: "$149.99",
        quantity: 0,
        is_in_stock: false,
        min_qty: 10,
        max_sale_qty: 25,
        manage_stock: true
    },
    {
        id: "prod_003",
        sku: "MS3003",
        magento_sku: "MS3003-WIRELESS",
        name: "Ergonomic Wireless Mouse",
        type_id: "simple",
        price: 49.99,
        formatted_price: "$49.99",
        quantity: 3,
        is_in_stock: true,
        min_qty: 15,
        max_sale_qty: 100,
        manage_stock: true
    },
    {
        id: "prod_004",
        sku: "MN4004",
        magento_sku: "MN4004-4K",
        name: "27-inch 4K Monitor",
        type_id: "configurable",
        price: 399.99,
        formatted_price: "$399.99",
        quantity: 8,
        is_in_stock: true,
        min_qty: 2,
        max_sale_qty: 10,
        manage_stock: true
    },
    {
        id: "prod_005",
        sku: "SS5005",
        magento_sku: "SS5005-1TB",
        name: "External SSD 1TB",
        type_id: "simple",
        price: 129.99,
        formatted_price: "$129.99",
        quantity: 0,
        is_in_stock: false,
        min_qty: 20,
        max_sale_qty: 200,
        manage_stock: true
    },
    {
        id: "prod_006",
        sku: "WC6006",
        magento_sku: "WC6006-HD",
        name: "HD Webcam with Microphone",
        type_id: "simple",
        price: 79.99,
        formatted_price: "$79.99",
        quantity: 156,
        is_in_stock: true,
        min_qty: 8,
        max_sale_qty: 75,
        manage_stock: true
    },
    {
        id: "prod_007",
        sku: "US7007",
        magento_sku: "US7007-USBHUB",
        name: "USB-C 7-in-1 Hub",
        type_id: "simple",
        price: 59.99,
        formatted_price: "$59.99",
        quantity: 2,
        is_in_stock: true,
        min_qty: 12,
        max_sale_qty: 150,
        manage_stock: true
    },
    {
        id: "prod_008",
        sku: "LP8008",
        magento_sku: "LP8008-RGB",
        name: "Gaming Mouse Pad",
        type_id: "simple",
        price: 29.99,
        formatted_price: "$29.99",
        quantity: 0,
        is_in_stock: false,
        min_qty: 30,
        max_sale_qty: 500,
        manage_stock: false
    },
    {
        id: "prod_009",
        sku: "SP9009",
        magento_sku: "SP9009-BLUETOOTH",
        name: "Bluetooth Soundbar",
        type_id: "configurable",
        price: 199.99,
        formatted_price: "$199.99",
        quantity: 42,
        is_in_stock: true,
        min_qty: 3,
        max_sale_qty: 30,
        manage_stock: true
    },
    {
        id: "prod_010",
        sku: "CH1010",
        magento_sku: "CH1010-STAND",
        name: "Adjustable Laptop Stand",
        type_id: "simple",
        price: 34.99,
        formatted_price: "$34.99",
        quantity: 7,
        is_in_stock: true,
        min_qty: 6,
        max_sale_qty: 120,
        manage_stock: true
    }
];

// ============ SINGLE ROW ============
function InventoryRow({ product, tdBase }: { product: MagentoProduct; tdBase: string }) {
    const navigate = useNavigate();

    const qtyColor = () => {
        const qty = product?.quantity ?? 0;
        if (qty === 0) return "text-red-500 font-bold";
        if (qty < 10) return "text-orange-500 font-semibold";
        return "text-green-600 font-semibold";
    };

    return (
        <tr className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <td className={`${tdBase} font-medium text-black`}>#{product.id?.slice(0, 8)}</td>
            <td className={tdBase}>{product.magento_sku || product.sku}</td>
            <td className={tdBase}>{product.name}</td>
            <td className={tdBase}>{product.type_id || "simple"}</td>
            <td className={`${tdBase} font-semibold`}>
                {product.formatted_price || `$${product.price}`}
            </td>
            <td className={`${tdBase} ${qtyColor()}`}>
                {product?.quantity ?? "—"}
            </td>
            <td className={tdBase}>
                {product?.is_in_stock ? (
                    <span className="px-3 py-1 rounded-md text-xs font-medium bg-green-100 text-green-600">
                        In Stock
                    </span>
                ) : (
                    <span className="px-3 py-1 rounded-md text-xs font-medium bg-red-100 text-red-600">
                        Out of Stock
                    </span>
                )}
            </td>
            <td className={tdBase}>{product?.min_qty ?? "—"}</td>
            <td className={tdBase}>{product?.max_sale_qty ?? "—"}</td>
            <td className={tdBase}>
                <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-xs">
                    {product?.manage_stock ? "Yes" : "N/A"}
                </span>
            </td>
            <td className="relative p-4">
                <button
                    onClick={() => navigate(`/UpdateMagentoInventory/${product.magento_sku || product.sku}/${product.id}`)}
                    className="text-gray-400 hover:text-teal-500 transition-colors"
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

    // Using only fake data
    const allProducts: MagentoProduct[] = FAKE_PRODUCTS;
    
    // Filter products by SKU search
    const filteredProducts = skuSearch 
        ? allProducts.filter(product => 
            (product.magento_sku || product.sku)?.toLowerCase().includes(skuSearch.toLowerCase())
          )
        : allProducts;
    
    // Pagination
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const currentProducts = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

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
                        {currentProducts.length === 0 ? (
                            <tr>
                                <td colSpan={11} className="text-center py-10 text-gray-500">
                                    No products found
                                </td>
                            </tr>
                        ) : (
                            currentProducts.map((product) => (
                                <InventoryRow
                                    key={product.magento_sku || product.sku || product.id}
                                    product={product}
                                    tdBase={tdBase}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 py-6">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                    >
                        Previous
                    </button>
                    
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`px-3 py-1 rounded transition-all ${currentPage === i + 1
                                ? "bg-gradient-to-r from-teal-400 to-green-400 text-white"
                                : "bg-gray-100 hover:bg-gray-200"
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}

export default MagentoInventoryList;