import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import { FaPlus, FaFilter } from "react-icons/fa";
import Pagination from "../../../component/Pagination";
import ProductFilter from "./ProductFilter";
import { type MagentoProduct, type ProductFilters } from "../../../app/api/MagentoSlices/ProductSlice";
import StoreViewDropdown from "../../../component/StoreViewDropdown";
import type { StoreViewSelection } from "../../../model/MagentoProduct/StoreViewSelection";

function MagentoProductList() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilter, setShowFilter] = useState(false);
  const [storeSelection, setStoreSelection] = useState<StoreViewSelection>({ type: "all" });

  const [appliedFilters, setAppliedFilters] = useState<ProductFilters>({
    idFrom: "",
    idTo: "",
    priceFrom: "",
    priceTo: "",
    lastUpdatedFrom: "",
    lastUpdatedTo: "",
    quantityFrom: "",
    quantityTo: "",
    storeView: "All Store Views",
    name: "",
    type: "",
    attributeSet: "",
    visibility: "",
    status: "",
    countryOfManufacture: "",
    sku: "",
    minAdvertisedPrice: "",
  });

  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [appliedFilters]);

  // ==================== DUMMY DATA ====================
  const dummyProducts: MagentoProduct[] = [
    {
      id: 1001,
      sku: "T-SHIRT-BLUE-M",
      name: "Premium Cotton Blue T-Shirt",
      price: 29.99,
      type_id: "simple",
      created_at: "2025-12-15 08:30:00",
      updated_at: "2026-03-20 14:25:00",
      status: 1,
      visibility: 4,
      attribute_set_id: 10,
      extension_attributes: {
        website_ids: [1, 2],
      },
    },
    {
      id: 1002,
      sku: "JEANS-BLACK-32",
      name: "Slim Fit Black Jeans",
      price: 59.99,
      type_id: "simple",
      created_at: "2025-11-20 10:15:00",
      updated_at: "2026-03-22 09:45:00",
      status: 1,
      visibility: 4,
      attribute_set_id: 12,
      extension_attributes: { website_ids: [1] },
    },
    {
      id: 1003,
      sku: "SNEAKERS-WHITE-10",
      name: "Comfort White Sneakers",
      price: 89.50,
      type_id: "simple",
      created_at: "2026-01-05 12:00:00",
      updated_at: "2026-03-23 16:30:00",
      status: 1,
      visibility: 4,
      attribute_set_id: 15,
      extension_attributes: { website_ids: [2, 3] },
    },
    {
      id: 1004,
      sku: "HOODIE-GREY-L",
      name: "Oversized Grey Hoodie",
      price: 45.00,
      type_id: "simple",
      created_at: "2025-10-10 09:20:00",
      updated_at: "2026-03-21 11:10:00",
      status: 2,
      visibility: 1,
      attribute_set_id: 10,
      extension_attributes: { website_ids: [1, 2, 3] },
    },
    {
      id: 1005,
      sku: "BUNDLE-SUMMER-SET",
      name: "Summer Outfit Bundle",
      price: 149.99,
      type_id: "bundle",
      created_at: "2026-02-01 14:45:00",
      updated_at: "2026-03-24 08:00:00",
      status: 1,
      visibility: 4,
      attribute_set_id: 20,
      extension_attributes: { website_ids: [1] },
    },
    {
      id: 1006,
      sku: "WATCH-GOLD",
      name: "Luxury Gold Analog Watch",
      price: 299.00,
      type_id: "simple",
      created_at: "2025-09-15 07:30:00",
      updated_at: "2026-03-19 13:55:00",
      status: 1,
      visibility: 4,
      attribute_set_id: 18,
      extension_attributes: { website_ids: [2] },
    },
    {
      id: 1007,
      sku: "LAPTOP-BAG",
      name: "Waterproof Laptop Backpack",
      price: 39.99,
      type_id: "simple",
      created_at: "2026-01-25 10:00:00",
      updated_at: "2026-03-23 15:20:00",
      status: 1,
      visibility: 4,
      attribute_set_id: 14,
      extension_attributes: { website_ids: [1, 3] },
    },
    {
      id: 1008,
      sku: "COFFEE-MUG-SET",
      name: "Ceramic Coffee Mug Set of 4",
      price: 24.50,
      type_id: "simple",
      created_at: "2025-12-05 11:45:00",
      updated_at: "2026-03-22 12:30:00",
      status: 1,
      visibility: 4,
      attribute_set_id: 8,
      extension_attributes: { website_ids: [1, 2] },
    },
    {
      id: 1009,
      sku: "YOGA-MAT",
      name: "Eco-Friendly Yoga Mat",
      price: 35.00,
      type_id: "simple",
      created_at: "2026-02-10 09:15:00",
      updated_at: "2026-03-20 10:05:00",
      status: 1,
      visibility: 4,
      attribute_set_id: 16,
      extension_attributes: { website_ids: [3] },
    },
    {
      id: 1010,
      sku: "WIRELESS-EARBUDS",
      name: "Pro Wireless Earbuds",
      price: 119.99,
      type_id: "simple",
      created_at: "2026-03-01 08:00:00",
      updated_at: "2026-03-24 14:40:00",
      status: 1,
      visibility: 4,
      attribute_set_id: 22,
      extension_attributes: { website_ids: [1, 2, 3] },
    },
  ];

  const dummyData = {
    items: dummyProducts,
    total_count: 87,
  };

  const data = dummyData;
  const error = null;
  const isLoading = false;
  const isFetching = false;
  // =====================================================================

  const allProducts: MagentoProduct[] = data?.items || [];

  const products = allProducts.filter((product) => {
    if (storeSelection.type === "all") return true;
    const websiteIds = product.extension_attributes?.website_ids || [];
    if (storeSelection.type === "website")
      return websiteIds.includes(storeSelection.website.id);
    if (storeSelection.type === "store")
      return websiteIds.includes(storeSelection.store.website_id);
    if (storeSelection.type === "storeView")
      return websiteIds.includes(storeSelection.storeView.website_id);
    return true;
  });

  const totalPages = Math.ceil((data?.total_count || 0) / itemsPerPage);

  const tdBase =
    "relative p-4 text-gray-600 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:bg-gradient-to-r after:from-teal-400 after:to-green-400";

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Magento Products</h2>
        <div className="flex items-center gap-3">
          <StoreViewDropdown onChange={(sel) => setStoreSelection(sel)} />

          <button
            onClick={() => setShowFilter((prev) => !prev)}
            className="flex items-center gap-2 cursor-pointer px-6 py-2 rounded-full border border-teal-400 text-teal-500 text-sm font-medium hover:bg-teal-50 transition-colors"
          >
            <FaFilter className="text-sm" />
            {showFilter ? "Hide Filters" : "Show Filters"}
          </button>

          <button
            onClick={() => navigate("/AddMagentoProduct")}
            className="flex items-center gap-3 px-6 py-1 rounded-full bg-gradient-to-r from-teal-400 to-green-500 text-white text-sm font-medium"
          >
            <span className="relative -left-5 flex items-center justify-center w-10 h-10 rounded-full bg-white">
              <FaPlus className="text-teal-500 text-sm" />
            </span>
            Add Product
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      {showFilter && (
        <ProductFilter
          onApply={(newFilters) => {
            setAppliedFilters(newFilters);
            setShowFilter(false);
          }}
        />
      )}

      {/* TABLE */}
      <div className="rounded-t-3xl overflow-x-auto mt-6">
        <table className="w-max min-w-full text-sm border-separate border-spacing-y-3">
          <thead className="bg-gradient-to-r from-teal-400 to-green-400 text-white">
            <tr>
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">SKU</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Type</th>
              <th className="p-4 text-left">Websites</th>
              <th className="p-4 text-left">Created</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading || isFetching ? (
              <tr>
                <td colSpan={8} className="text-center py-6">Loading products...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={8} className="text-center py-6 text-red-500">Error loading products</td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-10 text-gray-500">
                  No products found matching your filters
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr
                  key={product.id}
                  className="bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <td className={`${tdBase} font-medium text-black`}>#{product.id}</td>
                  <td className={tdBase}>{product.sku}</td>
                  <td className={tdBase}>{product.name}</td>
                  <td className={`${tdBase} font-semibold`}>
                    ${Number(product.price).toFixed(2)}
                  </td>
                  <td className={tdBase}>{product.type_id}</td>
                  <td className={tdBase}>
                    <div className="flex flex-wrap gap-1">
                      {product.extension_attributes?.website_ids?.map((wid: number) => (
                        <span
                          key={wid}
                          className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-xs font-medium"
                        >
                          Website {wid}
                        </span>
                      ))}
                      {(!product.extension_attributes?.website_ids || product.extension_attributes?.website_ids.length === 0) && (
                        <span className="text-gray-400 text-xs">No website</span>
                      )}
                    </div>
                  </td>
                  <td className={tdBase}>
                    {new Date(product.created_at ?? "").toLocaleDateString()}
                  </td>
                  <td className="relative p-4 text-right">
                    <button
                      onClick={() =>
                        navigate(`/AddMagentoProduct/${product.sku}`, { state: { product } })
                      }
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      title="View / Edit"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => !isFetching && setCurrentPage(page)}
          delta={2}
          showFirstLast={true}
          className="my-6 flex justify-center"
        />
      )}
    </div>
  );
}

export default MagentoProductList;