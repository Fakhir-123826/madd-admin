import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Eye } from "lucide-react"
import { FaPlus } from "react-icons/fa"
import FilterBar from "../../../component/orderManagement/FilterBar"
import { useGetProductsFromApiQuery } from "../../../app/api/MagentoSlices/magentoApi"
import Pagination from "../../../component/Pagination"

function MagentoProductList() {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  const queryArgs = useMemo(
    () => ({ page: currentPage, pageSize: itemsPerPage }),
    [currentPage, itemsPerPage]
  )

  const { data, error, isLoading, isFetching } = useGetProductsFromApiQuery(queryArgs, {
    refetchOnMountOrArgChange: true,
  })

  const products = data?.data?.items || []
  const totalPages = Math.ceil((data?.data?.total_count || 0) / itemsPerPage)

  const tdBase =
    "relative p-4 text-gray-600 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:bg-gradient-to-r after:from-teal-400 after:to-green-400"

  if (isLoading) return <div className="p-6">Loading products...</div>
  if (error) return <div className="p-6 text-red-500">Error loading products</div>

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Magento Products</h2>
        <button
          onClick={() => navigate("/addproduct")}
          className="flex items-center gap-3 px-6 py-1 rounded-full bg-gradient-to-r from-teal-400 to-green-500 text-white text-sm font-medium"
        >
          <span className="relative -left-5 flex items-center justify-center w-10 h-10 rounded-full bg-white">
            <FaPlus className="text-teal-500 text-sm" />
          </span>
          Add Product
        </button>
      </div>

      <FilterBar />

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
              <th className="p-4 text-left">Created</th>
              <th className="p-4"></th>
            </tr>
          </thead>

          <tbody>
            {(isFetching) ? (
              <tr>
                <td colSpan={7} className="text-center py-6">Loading products...</td>
              </tr>
            ) : (
              products.map(product => (
                <tr key={product.id} className="bg-white shadow-sm hover:shadow-md">
                  <td className={`${tdBase} font-medium text-black`}>#{product.id}</td>
                  <td className={tdBase}>{product.sku}</td>
                  <td className={tdBase}>{product.name}</td>
                  <td className={`${tdBase} font-semibold`}>${product.price}</td>
                  <td className={tdBase}>{product.type_id}</td>
                  <td className={tdBase}>{product.created_at}</td>
                  <td className="relative p-4 text-right">
                    <button
                      onClick={() =>
                        navigate(`/product/${product.id}`, { state: { product } })
                      }
                      className="text-gray-400 hover:text-gray-600"
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
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => !isFetching && setCurrentPage(page)}
        delta={2}
        showFirstLast={true}
        className="my-4"
      />
    </div>
  )
}

export default MagentoProductList