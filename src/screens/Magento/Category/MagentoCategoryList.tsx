import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import { FaPlus } from "react-icons/fa";
import FilterBar from "../../../component/orderManagement/FilterBar";
import Pagination from "../../../component/Pagination";
import {
  useGetCategoriesQuery,
  type MagentoCategory,
} from "../../../app/api/CategorySlice/CategorySlice";

function MagentoCategoryList() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const queryArgs = useMemo(
    () => ({ page: currentPage, pageSize: itemsPerPage }),
    [currentPage, itemsPerPage]
  );

  const { data, error, isLoading, isFetching } = useGetCategoriesQuery(
    queryArgs as any,
    { refetchOnMountOrArgChange: true }
  );

  // Recursive flatten function
  const flattenCategories = (cat: MagentoCategory, level = 0): MagentoCategory[] => {
    let result = [{ ...cat, level }];
    if (cat.children_data && cat.children_data.length > 0) {
      cat.children_data.forEach((child) => {
        result = result.concat(flattenCategories(child, level + 1));
      });
    }
    return result;
  };

  // Prepare flat categories array
  let categories: MagentoCategory[] = [];
  if (data) {
    if (Array.isArray(data)) {
      data.forEach((cat) => categories.push(...flattenCategories(cat)));
    } else {
      categories.push(...flattenCategories(data));
    }
  }

  const totalPages = Math.ceil(categories.length / itemsPerPage);

  const tdBase =
    "relative p-4 text-gray-600 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:bg-gradient-to-r after:from-teal-400 after:to-green-400";

  if (isLoading)
    return <div className="p-6">Loading categories...</div>;
  if (error)
    return <div className="p-6 text-red-500">Error loading categories</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Magento Categories</h2>

        <button
          onClick={() => navigate("/AddMagentoCategory")}
          className="flex items-center gap-3 px-6 py-1 rounded-full bg-gradient-to-r from-teal-400 to-green-500 text-white text-sm font-medium"
        >
          <span className="relative -left-5 flex items-center justify-center w-10 h-10 rounded-full bg-white">
            <FaPlus className="text-teal-500 text-sm" />
          </span>
          Add Category
        </button>
      </div>

      <FilterBar />

      {/* TABLE */}
      <div className="rounded-t-3xl overflow-x-auto mt-6">
        <table className="w-max min-w-full text-sm border-separate border-spacing-y-3">
          <thead className="bg-gradient-to-r from-teal-400 to-green-400 text-white">
            <tr>
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Parent ID</th>
              <th className="p-4 text-left">Level</th>
              <th className="p-4 text-left">Position</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4"></th>
            </tr>
          </thead>

          <tbody>
            {isFetching ? (
              <tr>
                <td colSpan={7} className="text-center py-6">
                  Loading categories...
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-6">
                  No categories found
                </td>
              </tr>
            ) : (
              categories
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map((category) => (
                  <tr
                    key={category.id}
                    className="bg-white shadow-sm hover:shadow-md"
                  >
                    <td className={`${tdBase} font-medium text-black`}>
                      #{category.id}
                    </td>

                    <td className={tdBase}>
                      {`${"— ".repeat(category.level)}${category.name}`}
                    </td>

                    <td className={tdBase}>{category.parent_id}</td>

                    <td className={tdBase}>{category.level}</td>

                    <td className={tdBase}>{category.position}</td>

                    <td className={tdBase}>
                      <span
                        className={`px-3 py-1 rounded-md text-xs font-medium ${
                          category.is_active
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {category.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="relative p-4 text-right">
                      <button
                        onClick={() =>
                          navigate(`/AddMagentoCategory/${category.id}`, {
                            state: { category },
                          })
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
  );
}

export default MagentoCategoryList;