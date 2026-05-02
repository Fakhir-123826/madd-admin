import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Trash2 } from "lucide-react";
import { FaPlus, FaFilter } from "react-icons/fa";
import Pagination from "../../../../component/Pagination";
import {
  useGetAttributesQuery,
  useDeleteAttributeMutation,
  type MagentoAttribute,
} from "../../../../app/api/MagentoSlices/Attributes";

function MagentoAttributesList() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: response, isLoading, isFetching, error } = useGetAttributesQuery({
    page: currentPage,
    pageSize: itemsPerPage,
  });

  const [deleteAttribute] = useDeleteAttributeMutation();

  // ✅ status check + data extract
  const isSuccess = response?.success && response?.status === 200;
  const attributes: MagentoAttribute[] = isSuccess ? response.data.items : [];
  const totalCount = isSuccess ? response.data.total_count : 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleDelete = async (attribute_code: string) => {
    if (!confirm(`Delete attribute "${attribute_code}"?`)) return;
    try {
      await deleteAttribute(attribute_code).unwrap();
    } catch (err) {
      alert("Error deleting attribute!");
      console.error(err);
    }
  };

  const tdBase =
    "relative p-4 text-gray-600 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:bg-gradient-to-r after:from-teal-400 after:to-green-400";

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Magento Attributes</h2>
        <div className="flex items-center gap-3">

          {/* Add Button */}
          <button
            onClick={() => navigate("/AddMagentoAttribute")}
            className="flex items-center gap-3 px-6 py-1 rounded-full bg-gradient-to-r from-teal-400 to-green-500 text-white text-sm font-medium"
          >
            <span className="relative -left-5 flex items-center justify-center w-10 h-10 rounded-full bg-white">
              <FaPlus className="text-teal-500 text-sm" />
            </span>
            Add Attribute
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-t-3xl overflow-x-auto mt-6">
        <table className="w-max min-w-full text-sm border-separate border-spacing-y-3">
          <thead className="bg-gradient-to-r from-teal-400 to-green-400 text-white">
            <tr>
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">Code</th>
              <th className="p-4 text-left">Label</th>
              <th className="p-4 text-left">Input Type</th>
              <th className="p-4 text-left">Backend Type</th>
              <th className="p-4 text-left">Scope</th>
              <th className="p-4 text-left">Required</th>
              <th className="p-4 text-left">User Defined</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading || isFetching ? (
              <tr>
                <td colSpan={9} className="text-center py-6 text-gray-400">
                  Loading attributes...
                </td>
              </tr>
            ) : error || !isSuccess ? (
              <tr>
                <td colSpan={9} className="text-center py-6 text-red-500">
                  Error loading attributes
                </td>
              </tr>
            ) : attributes.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-10 text-gray-500">
                  No attributes found
                </td>
              </tr>
            ) : (
              attributes.map((attr) => (
                <tr key={attr.attribute_id} className="bg-white shadow-sm hover:shadow-md transition-shadow">

                  <td className={`${tdBase} font-medium text-black`}>
                    #{attr.attribute_id}
                  </td>

                  <td className={`${tdBase} font-mono text-xs`}>
                    {attr.attribute_code}
                  </td>

                  <td className={tdBase}>
                    {attr.default_frontend_label || "—"}
                  </td>

                  <td className={tdBase}>
                    <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-xs font-medium">
                      {attr.frontend_input || "—"}
                    </span>
                  </td>

                  <td className={tdBase}>
                    <span className="px-2 py-1 bg-purple-50 text-purple-600 rounded-md text-xs font-medium">
                      {attr.backend_type || "—"}
                    </span>
                  </td>

                  <td className={tdBase}>
                    <span className={`px-2 py-1 rounded-md text-xs font-medium
                      ${(attr as any).scope === "global" ? "bg-green-50 text-green-600" :
                        (attr as any).scope === "store" ? "bg-yellow-50 text-yellow-600" :
                        "bg-gray-50 text-gray-600"}`}>
                      {(attr as any).scope || "—"}
                    </span>
                  </td>

                  <td className={tdBase}>
                    {attr.is_required ? (
                      <span className="px-2 py-1 bg-red-50 text-red-500 rounded-md text-xs font-medium">Yes</span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-400 rounded-md text-xs">No</span>
                    )}
                  </td>

                  <td className={tdBase}>
                    {attr.is_user_defined ? (
                      <span className="px-2 py-1 bg-teal-50 text-teal-600 rounded-md text-xs font-medium">Yes</span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-400 rounded-md text-xs">No</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="relative p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => navigate(`/AddMagentoAttribute/${attr.attribute_code}`)}
                        className="text-gray-400 hover:text-teal-500 transition-colors"
                        title="View / Edit"
                      >
                        <Eye size={18} />
                      </button>
                      {attr.is_user_defined && (
                        <button
                          onClick={() => handleDelete(attr.attribute_code)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
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

export default MagentoAttributesList;