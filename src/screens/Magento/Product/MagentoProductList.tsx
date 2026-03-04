import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import { FaPlus, FaFilter } from "react-icons/fa";
import Pagination from "../../../component/Pagination";
import ProductFilter from "./ProductFilter";
import { useGetProductsQuery, type MagentoProduct, type ProductFilters } from "../../../app/api/MagentoSlices/ProductSlice";

// export interface MagentoProduct {
//   id: number;
//   sku: string;
//   name: string;
//   attribute_set_id: number;
//   price: number;
//   status: number;
//   visibility: number;
//   type_id: string;
//   created_at: string;
//   updated_at: string;
//   extension_attributes: any;
//   product_links: any[];
//   options: any[];
//   media_gallery_entries: any[];
//   tier_prices: any[];
//   custom_attributes: any[];
// }

/* ================= COMPONENT ================= */

function MagentoProductList() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilter, setShowFilter] = useState(false);

  // Yeh state sirf "Apply Filters" button pe update hoga
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

  // Page reset on filter apply
  useEffect(() => {
    setCurrentPage(1);
  }, [appliedFilters]);

  // ✅ RTK Query — sirf appliedFilters use karega
  const { data, error, isLoading, isFetching } = useGetProductsQuery({
    filters: appliedFilters,
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
        <h2 className="text-lg font-semibold">Magento Products</h2>
        <div className="flex items-center gap-3">
          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilter((prev) => !prev)}
            className="flex items-center gap-2 cursor-pointer px-6 py-2 rounded-full border border-teal-400 text-teal-500 text-sm font-medium hover:bg-teal-50 transition-colors"
          >
            <FaFilter className="text-sm" />
            {showFilter ? "Hide Filters" : "Show Filters"}
          </button>

          {/* Add Product Button */}
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

      {/* FILTER BAR (sirf button pe apply hoga) */}
      {showFilter && (
        <ProductFilter
          onApply={(newFilters) => {
            setAppliedFilters(newFilters);
            setShowFilter(false); // optional: apply pe filter hide ho jaye
          }}
        />
      )}

      {/* TABLE - yeh sirf Apply Filters pe update hoga */}
      <div className="rounded-t-3xl overflow-x-auto mt-6">
        <table className="w-max min-w-full text-sm border-separate border-spacing-y-3">
          <thead className="bg-gradient-to-r from-teal-400 to-green-400 text-white">
            <tr>
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">SKU</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Type</th>
              <th className="p-4 text-left">Created</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading || isFetching ? (
              <tr>
                <td colSpan={7} className="text-center py-6">Loading products...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={7} className="text-center py-6 text-red-500">Error loading products</td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-gray-500">
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
                    {new Date(product.created_at ?? '').toLocaleDateString()}
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