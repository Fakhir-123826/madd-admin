import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import { FaPlus } from "react-icons/fa";
import FilterBar from "../../../component/orderManagement/FilterBar";
import Pagination from "../../../component/Pagination";
import StoreViewDropdown from "../../../component/StoreViewDropdown";
import type { StoreViewSelection } from "../../../model/MagentoProduct/StoreViewSelection";

// ============ FAKE MAGENTO CATEGORIES DATA ============
interface MagentoCategory {
  id: number;
  name: string;
  parent_id: number;
  level: number;
  position: number;
  is_active: boolean;
  children_data?: MagentoCategory[];
}

const generateFakeCategories = (): MagentoCategory[] => {
  // Root categories (Level 0)
  const rootCategories: MagentoCategory[] = [
    {
      id: 1,
      name: "Default Category",
      parent_id: 0,
      level: 0,
      position: 1,
      is_active: true,
      children_data: []
    },
    {
      id: 2,
      name: "Electronics",
      parent_id: 1,
      level: 1,
      position: 1,
      is_active: true,
      children_data: []
    },
    {
      id: 3,
      name: "Clothing & Apparel",
      parent_id: 1,
      level: 1,
      position: 2,
      is_active: true,
      children_data: []
    },
    {
      id: 4,
      name: "Home & Garden",
      parent_id: 1,
      level: 1,
      position: 3,
      is_active: true,
      children_data: []
    },
    {
      id: 5,
      name: "Sports & Outdoors",
      parent_id: 1,
      level: 1,
      position: 4,
      is_active: true,
      children_data: []
    },
    {
      id: 6,
      name: "Books & Media",
      parent_id: 1,
      level: 1,
      position: 5,
      is_active: true,
      children_data: []
    },
    {
      id: 7,
      name: "Toys & Hobbies",
      parent_id: 1,
      level: 1,
      position: 6,
      is_active: false,
      children_data: []
    },
  ];

  // Electronics subcategories (Level 2)
  const electronicsChildren: MagentoCategory[] = [
    { id: 8, name: "Smartphones", parent_id: 2, level: 2, position: 1, is_active: true, children_data: [] },
    { id: 9, name: "Laptops", parent_id: 2, level: 2, position: 2, is_active: true, children_data: [] },
    { id: 10, name: "Tablets", parent_id: 2, level: 2, position: 3, is_active: true, children_data: [] },
    { id: 11, name: "Headphones", parent_id: 2, level: 2, position: 4, is_active: true, children_data: [] },
    { id: 12, name: "Cameras", parent_id: 2, level: 2, position: 5, is_active: false, children_data: [] },
    { id: 13, name: "Smart Watches", parent_id: 2, level: 2, position: 6, is_active: true, children_data: [] },
    { id: 14, name: "Gaming Consoles", parent_id: 2, level: 2, position: 7, is_active: true, children_data: [] },
    { id: 15, name: "TV & Home Theater", parent_id: 2, level: 2, position: 8, is_active: true, children_data: [] },
  ];

  // Smartphones subcategories (Level 3)
  const smartphonesChildren: MagentoCategory[] = [
    { id: 16, name: "Apple iPhone", parent_id: 8, level: 3, position: 1, is_active: true, children_data: [] },
    { id: 17, name: "Samsung Galaxy", parent_id: 8, level: 3, position: 2, is_active: true, children_data: [] },
    { id: 18, name: "Google Pixel", parent_id: 8, level: 3, position: 3, is_active: true, children_data: [] },
    { id: 19, name: "OnePlus", parent_id: 8, level: 3, position: 4, is_active: false, children_data: [] },
    { id: 20, name: "Xiaomi", parent_id: 8, level: 3, position: 5, is_active: true, children_data: [] },
  ];

  // Clothing subcategories (Level 2)
  const clothingChildren: MagentoCategory[] = [
    { id: 21, name: "Men's Clothing", parent_id: 3, level: 2, position: 1, is_active: true, children_data: [] },
    { id: 22, name: "Women's Clothing", parent_id: 3, level: 2, position: 2, is_active: true, children_data: [] },
    { id: 23, name: "Kids' Clothing", parent_id: 3, level: 2, position: 3, is_active: true, children_data: [] },
    { id: 24, name: "Shoes", parent_id: 3, level: 2, position: 4, is_active: true, children_data: [] },
    { id: 25, name: "Accessories", parent_id: 3, level: 2, position: 5, is_active: true, children_data: [] },
    { id: 26, name: "Sportswear", parent_id: 3, level: 2, position: 6, is_active: false, children_data: [] },
  ];

  // Men's Clothing subcategories (Level 3)
  const mensClothingChildren: MagentoCategory[] = [
    { id: 27, name: "Shirts", parent_id: 21, level: 3, position: 1, is_active: true, children_data: [] },
    { id: 28, name: "Pants", parent_id: 21, level: 3, position: 2, is_active: true, children_data: [] },
    { id: 29, name: "Jackets", parent_id: 21, level: 3, position: 3, is_active: true, children_data: [] },
    { id: 30, name: "Suits", parent_id: 21, level: 3, position: 4, is_active: false, children_data: [] },
  ];

  // Home & Garden subcategories (Level 2)
  const homeChildren: MagentoCategory[] = [
    { id: 31, name: "Furniture", parent_id: 4, level: 2, position: 1, is_active: true, children_data: [] },
    { id: 32, name: "Kitchen & Dining", parent_id: 4, level: 2, position: 2, is_active: true, children_data: [] },
    { id: 33, name: "Bedding & Bath", parent_id: 4, level: 2, position: 3, is_active: true, children_data: [] },
    { id: 34, name: "Home Decor", parent_id: 4, level: 2, position: 4, is_active: true, children_data: [] },
    { id: 35, name: "Gardening", parent_id: 4, level: 2, position: 5, is_active: false, children_data: [] },
    { id: 36, name: "Tools & Home Improvement", parent_id: 4, level: 2, position: 6, is_active: true, children_data: [] },
  ];

  // Sports & Outdoors subcategories (Level 2)
  const sportsChildren: MagentoCategory[] = [
    { id: 37, name: "Exercise & Fitness", parent_id: 5, level: 2, position: 1, is_active: true, children_data: [] },
    { id: 38, name: "Camping & Hiking", parent_id: 5, level: 2, position: 2, is_active: true, children_data: [] },
    { id: 39, name: "Cycling", parent_id: 5, level: 2, position: 3, is_active: true, children_data: [] },
    { id: 40, name: "Team Sports", parent_id: 5, level: 2, position: 4, is_active: true, children_data: [] },
    { id: 41, name: "Fishing", parent_id: 5, level: 2, position: 5, is_active: false, children_data: [] },
  ];

  // Books & Media subcategories (Level 2)
  const booksChildren: MagentoCategory[] = [
    { id: 42, name: "Fiction", parent_id: 6, level: 2, position: 1, is_active: true, children_data: [] },
    { id: 43, name: "Non-Fiction", parent_id: 6, level: 2, position: 2, is_active: true, children_data: [] },
    { id: 44, name: "E-books", parent_id: 6, level: 2, position: 3, is_active: true, children_data: [] },
    { id: 45, name: "Audiobooks", parent_id: 6, level: 2, position: 4, is_active: false, children_data: [] },
    { id: 46, name: "Magazines", parent_id: 6, level: 2, position: 5, is_active: true, children_data: [] },
  ];

  // Assign children to parent categories
  rootCategories[0].children_data = rootCategories.slice(1);
  rootCategories[1].children_data = electronicsChildren;
  rootCategories[2].children_data = clothingChildren;
  rootCategories[3].children_data = homeChildren;
  rootCategories[4].children_data = sportsChildren;
  rootCategories[5].children_data = booksChildren;
  
  // Add deeper level children
  const smartphonesCat = electronicsChildren.find(c => c.id === 8);
  if (smartphonesCat) smartphonesCat.children_data = smartphonesChildren;
  
  const mensClothingCat = clothingChildren.find(c => c.id === 21);
  if (mensClothingCat) mensClothingCat.children_data = mensClothingChildren;

  return rootCategories;
};

const FAKE_CATEGORIES = generateFakeCategories();

// ============ MAIN COMPONENT ============
function MagentoCategoryList() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const itemsPerPage = 10;
  const [storeSelection, setStoreSelection] = useState<StoreViewSelection>({ type: "all" });

  // Recursive flatten function (tree ko flat list mein convert)
  const flattenCategories = (cat: MagentoCategory, level = 0): MagentoCategory[] => {
    const current = { ...cat, level };
    let result: MagentoCategory[] = [current];

    if (cat.children_data && cat.children_data.length > 0) {
      cat.children_data.forEach((child) => {
        result = result.concat(flattenCategories(child, level + 1));
      });
    }
    return result;
  };

  // Flat categories prepare karo
  const flatCategories: MagentoCategory[] = useMemo(() => {
    let all: MagentoCategory[] = [];
    FAKE_CATEGORIES.forEach((cat) => {
      all.push(...flattenCategories(cat));
    });
    return all;
  }, []);

  // Filter categories based on search and status
  const filteredCategories = useMemo(() => {
    let result = flatCategories;
    
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(cat => 
        cat.name.toLowerCase().includes(searchLower) ||
        cat.id.toString().includes(searchLower)
      );
    }
    
    // Apply status filter
    if (filterStatus === "active") {
      result = result.filter(cat => cat.is_active === true);
    } else if (filterStatus === "inactive") {
      result = result.filter(cat => cat.is_active === false);
    }
    
    return result;
  }, [flatCategories, searchTerm, filterStatus]);

  const totalCount = filteredCategories.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const tdBase =
    "relative p-4 text-gray-600 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:bg-gradient-to-r after:from-teal-400 after:to-green-400";

  const handleResetFilters = () => {
    setSearchTerm("");
    setFilterStatus("all");
    setCurrentPage(1);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Magento Categories ({totalCount})</h2>
        <div className="flex items-center gap-3">
          <StoreViewDropdown onChange={(sel) => setStoreSelection(sel)} />
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
      </div>

      {/* Custom Filter Bar with Search and Status Filter */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search by category name or ID..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 pl-10 rounded-xl border border-gray-300 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 outline-none transition-all"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value as any);
              setCurrentPage(1);
            }}
            className="px-4 py-2 rounded-xl border border-gray-300 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 outline-none transition-all"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
          
          {(searchTerm || filterStatus !== "all") && (
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 text-sm text-teal-600 hover:text-teal-700 font-medium"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

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
            {paginatedCategories.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10">
                  <div className="text-gray-500">
                    <p className="text-lg font-medium">No categories found</p>
                    <p className="text-sm mt-1">Try adjusting your search or filters</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedCategories.map((category) => (
                <tr
                  key={category.id}
                  className="bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <td className={`${tdBase} font-medium text-black`}>
                    #{category.id}
                  </td>

                  <td className={tdBase}>
                    <span className="inline-flex items-center gap-1">
                      {"— ".repeat(category.level || 0)}
                      <span className={category.level > 1 ? "text-gray-500" : "font-medium"}>
                        {category.name || "Unnamed"}
                      </span>
                    </span>
                  </td>

                  <td className={tdBase}>
                    {category.parent_id === 0 ? (
                      <span className="text-gray-400">—</span>
                    ) : (
                      <span className="text-teal-600">#{category.parent_id}</span>
                    )}
                  </td>

                  <td className={tdBase}>
                    <span className={`px-2 py-1 rounded-md text-xs ${
                      category.level === 0 ? "bg-purple-100 text-purple-600" :
                      category.level === 1 ? "bg-blue-100 text-blue-600" :
                      "bg-gray-100 text-gray-600"
                    }`}>
                      Level {category.level || 0}
                    </span>
                  </td>

                  <td className={tdBase}>{category.position || 0}</td>

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
                      className="text-gray-400 hover:text-teal-500 transition-colors"
                      title="View Category"
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
          onPageChange={(page) => setCurrentPage(page)}
          delta={2}
          showFirstLast={true}
          className="my-4"
        />
      )}
    </div>
  );
}

export default MagentoCategoryList;