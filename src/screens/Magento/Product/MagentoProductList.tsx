import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import { FaPlus, FaFilter, FaGlobe, FaChevronDown } from "react-icons/fa";
import Pagination from "../../../component/Pagination";
import ProductFilter from "./ProductFilter";
import { useGetProductsQuery, type MagentoProduct, type ProductFilters } from "../../../app/api/MagentoSlices/ProductSlice";
import axios from "axios"; // ✅ ye add karo

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
  const [websites, setWebsites] = useState<any[]>([]);
  const [selectedWebsite, setSelectedWebsite] = useState<string>("");
  const [showWebsiteDropdown, setShowWebsiteDropdown] = useState(false);
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
const fetchWebsites = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        const res = await axios.get("http://127.0.0.1:8000/api/websites", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setWebsites(res.data);
      } catch (err) {
        console.error("Websites fetch error:", err);
      }
    };
  // Page reset on filter apply
  // useEffect(() => {
    
  //   fetchWebsites();
  //   setCurrentPage(1);
  // }, [appliedFilters, selectedWebsite]);


  useEffect(() => {
    fetchWebsites();
}, []); // ✅ sirf ek baar

useEffect(() => {
    setCurrentPage(1);
}, [appliedFilters]);

  // ✅ RTK Query — sirf appliedFilters use karega
  const { data, error, isLoading, isFetching } = useGetProductsQuery({
    filters: appliedFilters,
    page: currentPage,
    pageSize: itemsPerPage,
    // website_id: selectedWebsite !== "" ? Number(selectedWebsite) : undefined, // ✅ "" check karo
  });

  const allProducts: MagentoProduct[] = data?.items || [];
  const products: MagentoProduct[] = allProducts.filter((product) => {
    if (selectedWebsite === "") return true;
    const websiteIds = product.extension_attributes?.website_ids || [];
    return websiteIds.includes(Number(selectedWebsite));
  });

  const totalPages = Math.ceil((data?.total_count || 0) / itemsPerPage);

  const tdBase =
    "relative p-4 text-gray-600 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:bg-gradient-to-r after:from-teal-400 after:to-green-400";

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* HEADER */}
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Magento Products</h2>
        <div className="flex items-center gap-3">

          {/* ✅ Website Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowWebsiteDropdown(prev => !prev)}
              className="flex items-center gap-2 px-5 py-2 rounded-full border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <FaGlobe className="text-teal-500" />
              {selectedWebsite
                ? websites.find(w => w.id === Number(selectedWebsite))?.name
                : "All Websites"}
              <FaChevronDown className={`text-xs transition-transform ${showWebsiteDropdown ? "rotate-180" : ""}`} />
            </button>

            {showWebsiteDropdown && (
              <div className="absolute right-0 top-12 z-50 bg-white rounded-xl shadow-lg border border-gray-100 w-48 overflow-hidden">
                <div
                  onClick={() => { setSelectedWebsite(""); setShowWebsiteDropdown(false); }}
                  className={`px-4 py-3 text-sm cursor-pointer hover:bg-gray-50 transition
              ${selectedWebsite === "" ? "text-teal-600 font-semibold bg-teal-50" : "text-gray-600"}`}
                >
                  All Websites
                </div>
                {websites.map((website) => (
                  <div
                    key={website.id}
                    onClick={() => { setSelectedWebsite(String(website.id)); setShowWebsiteDropdown(false); }}
                    className={`px-4 py-3 text-sm cursor-pointer hover:bg-gray-50 transition border-t border-gray-50
                ${selectedWebsite === String(website.id) ? "text-teal-600 font-semibold bg-teal-50" : "text-gray-600"}`}
                  >
                    <div className="font-medium">{website.name}</div>
                    <div className="text-xs text-gray-400">{website.code}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Filter Button */}
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

      {/* ✅ Backdrop - bahar click pe close */}
      {showWebsiteDropdown && (
        <div className="fixed inset-0 z-40" onClick={() => setShowWebsiteDropdown(false)} />
      )}

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
              <th className="p-4 text-left">Websites</th>
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
                    <div className="flex flex-wrap gap-1">
                      {product.extension_attributes?.website_ids?.map((wid: number) => (
                        <span
                          key={wid}
                          className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-xs font-medium"
                        >
                          {websites.find(w => w.id === wid)?.name || `Website ${wid}`}
                        </span>
                      )) || (
                          <span className="text-gray-400 text-xs">No website</span>
                        )}
                    </div>
                  </td>
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