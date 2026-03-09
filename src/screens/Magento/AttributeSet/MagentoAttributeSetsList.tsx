import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Trash2 } from "lucide-react";
import { FaPlus } from "react-icons/fa";
import Pagination from "../../../component/Pagination";
import {
  useGetAttributeSetsQuery,
  useDeleteAttributeSetMutation,
  type AttributeSet,
} from "../../../app/api/MagentoSlices/AttributeSetApi";

function MagentoAttributeSetsList() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: response, isLoading, isFetching, error } = useGetAttributeSetsQuery({
    page: currentPage,
    pageSize: itemsPerPage,
  });

  const [deleteAttributeSet] = useDeleteAttributeSetMutation();

  const isSuccess = response?.success && response?.status === 200;
  const attributeSets: AttributeSet[] = isSuccess ? response.data.items : [];
  const totalCount = isSuccess ? response.data.total_count : 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete attribute set "${name}"?`)) return;
    try {
      await deleteAttributeSet(id).unwrap();
    } catch (err) {
      alert("Error deleting attribute set!");
      console.error(err);
    }
  };

  const tdBase =
    "relative p-4 text-gray-600 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:bg-gradient-to-r after:from-teal-400 after:to-green-400";

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Magento Attribute Sets</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/AddMagentoAttributeSet")}
            className="flex items-center gap-3 px-6 py-1 rounded-full bg-gradient-to-r from-teal-400 to-green-500 text-white text-sm font-medium"
          >
            <span className="relative -left-5 flex items-center justify-center w-10 h-10 rounded-full bg-white">
              <FaPlus className="text-teal-500 text-sm" />
            </span>
            Add Attribute Set
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-t-3xl overflow-x-auto mt-6">
        <table className="w-max min-w-full text-sm border-separate border-spacing-y-3">
          <thead className="bg-gradient-to-r from-teal-400 to-green-400 text-white">
            <tr>
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Sort Order</th>
              <th className="p-4 text-left">Entity Type</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading || isFetching ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-400">
                  Loading attribute sets...
                </td>
              </tr>
            ) : error || !isSuccess ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-red-500">
                  Error loading attribute sets
                </td>
              </tr>
            ) : attributeSets.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-500">
                  No attribute sets found
                </td>
              </tr>
            ) : (
              attributeSets.map((set) => (
                <tr key={set.attribute_set_id} className="bg-white shadow-sm hover:shadow-md transition-shadow">

                  <td className={`${tdBase} font-medium text-black`}>
                    #{set.attribute_set_id}
                  </td>

                  <td className={`${tdBase} font-medium text-gray-800`}>
                    {set.attribute_set_name}
                  </td>

                  <td className={tdBase}>
                    <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-xs font-medium">
                      {set.sort_order}
                    </span>
                  </td>

                  <td className={tdBase}>
                    <span className="px-2 py-1 bg-purple-50 text-purple-600 rounded-md text-xs font-medium">
                      {set.entity_type_id}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="relative p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => navigate(`/AddMagentoAttributeSet/${set.attribute_set_id}`)}
                        className="text-gray-400 hover:text-teal-500 transition-colors"
                        title="Edit"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(set.attribute_set_id, set.attribute_set_name)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
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

export default MagentoAttributeSetsList;