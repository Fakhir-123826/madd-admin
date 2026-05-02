// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import Input from "../../../component/Inputs Feilds/Input";
// import AddButton from "../../../component/AddButton";
// import {
//     useCreateCategoryMutation,
//     useUpdateCategoryMutation,
//     useGetCategoryByIdQuery,
//     type MagentoCategory
// } from "../../../app/api/MagentoSlices/CategorySlice";

// interface CustomAttribute {
//     attribute_code: string;
//     value: string | number;
//     type: "string" | "number";
// }

// const AddMagentoCategory = () => {
//     const navigate = useNavigate();
//     const { id } = useParams();
//     const isEdit = Boolean(id);

//     // ✅ API hooks
//     const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
//     const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();

//     // ✅ Form state
//     const [categoryName, setCategoryName] = useState("");
//     const [isActive, setIsActive] = useState(true);
//     const [includeInMenu, setIncludeInMenu] = useState(true);
//     const [customAttributes, setCustomAttributes] = useState<CustomAttribute[]>([
//         { attribute_code: "display_mode", value: "PAGE", type: "string" },
//         { attribute_code: "is_anchor", value: 0, type: "number" },
//         { attribute_code: "url_key", value: "", type: "string" },
//     ]);

//     // ✅ Fetch category data if editing
//     const { data: categoryData, isLoading: isFetching } = useGetCategoryByIdQuery(Number(id!), {
//         skip: !isEdit,
//     });

//     // ✅ Prefill form when data arrives
//     useEffect(() => {
//         if (categoryData) {
//             setCategoryName(categoryData.name || "");
//             setIsActive(categoryData.is_active ?? true);
//             setIncludeInMenu(true); // or fetch/include_in_menu if available
//             // Map custom attributes if they exist
//             if (categoryData.custom_attributes) {
//                 setCustomAttributes(
//                     categoryData.custom_attributes.map((attr: any) => ({
//                         attribute_code: attr.attribute_code,
//                         value: attr.value,
//                         type: typeof attr.value === "number" ? "number" : "string",
//                     }))
//                 );
//             }
//         }
//     }, [categoryData]);

//     // ✅ Handle attribute changes
//     const handleCustomAttributeChange = (index: number, value: string) => {
//         setCustomAttributes(customAttributes.map((attr, i) =>
//             i === index
//                 ? { ...attr, value: attr.type === "number" ? Number(value) : value }
//                 : attr
//         ));
//     };

//     // ✅ Submit handler
//     const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault();

//         const payload: Partial<MagentoCategory> = {
//             parent_id: 2,
//             name: categoryName,
//             is_active: isActive,
//             include_in_menu: includeInMenu,
//             custom_attributes: customAttributes.map(attr => ({
//                 attribute_code: attr.attribute_code,
//                 value: attr.value,
//             })),
//         };

//         try {
//             if (isEdit && id) {
//                 // Wrap in `category` key for update
//                 await updateCategory({ id: Number(id), data: { category: payload } }).unwrap();
//                 console.log("Category Updated ✅");
//             } else {
//                 await createCategory(payload).unwrap();
//                 console.log("Category Created ✅");
//             }
//             navigate("/MagentoCategoryList");
//         } catch (error) {
//             console.error("Error:", error);
//         }
//     };

//     if (isEdit && isFetching) return <div className="p-6">Loading category...</div>;

//     return (
//         <div className="bg-white shadow-sm p-6 rounded-xl">
//             <h2 className="text-lg font-semibold mb-6">
//                 {isEdit ? "Update Magento Category" : "Add Magento Category"}
//             </h2>

//             <form onSubmit={handleSubmit} className="space-y-6">
//                 {/* Category Name */}
//                 <Input
//                     label="Category Name"
//                     placeholder="Enter category name"
//                     value={categoryName}
//                     onChange={(e) => setCategoryName(e.target.value)}
//                 />

//                 {/* Is Active */}
//                 <div className="flex items-center gap-4">
//                     <label>
//                         <input
//                             type="checkbox"
//                             checked={isActive}
//                             onChange={(e) => setIsActive(e.target.checked)}
//                         /> Active
//                     </label>
//                     <label>
//                         <input
//                             type="checkbox"
//                             checked={includeInMenu}
//                             onChange={(e) => setIncludeInMenu(e.target.checked)}
//                         /> Include in Menu
//                     </label>
//                 </div>

//                 {/* Custom Attributes */}
//                 <div>
//                     <h3 className="font-semibold mb-2">Custom Attributes</h3>
//                     {customAttributes.map((attr, index) => (
//                         <div key={index} className="flex items-center gap-3 mb-2">
//                             <Input placeholder="Attribute Code" value={attr.attribute_code} />
//                             <Input
//                                 placeholder="Value"
//                                 type={attr.type === "number" ? "number" : "text"}
//                                 value={attr.value}
//                                 onChange={(e) => handleCustomAttributeChange(index, e.target.value)}
//                             />
//                         </div>
//                     ))}
//                 </div>

//                 {/* Submit Button */}
//                 <div>
//                     <AddButton
//                         label={isCreating || isUpdating ? "Saving..." : isEdit ? "Update Category" : "Create Category"}
//                         type="submit"
//                         onClick={() => { }}
//                     />
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default AddMagentoCategory;


import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronDown, ChevronRight, Folder, FolderOpen, Plus } from "lucide-react";
import Input from "../../../component/Inputs Feilds/Input";
import AddButton from "../../../component/AddButton";

// Dummy tree structure (you can later replace this with real API data)
const dummyCategories = [
  {
    id: 2,
    name: "Root Catalog",
    children: [
      {
        id: 41,
        name: "What's New",
        children: [],
      },
      {
        id: 23,
        name: "Women",
        children: [
          {
            id: 24,
            name: "Tops",
            children: [
              { id: 26, name: "Jackets", children: [] },
              { id: 27, name: "Hoodies & Sweatshirts", children: [] },
              { id: 28, name: "Tees", children: [] },
              { id: 29, name: "Bras & Tanks", children: [] },
            ],
          },
          {
            id: 25,
            name: "Bottoms",
            children: [
              { id: 30, name: "Pants", children: [] },
              { id: 31, name: "Shorts", children: [] },
            ],
          },
        ],
      },
      {
        id: 14,
        name: "Men",
        children: [
          {
            id: 15,
            name: "Tops",
            children: [
              { id: 17, name: "Jackets", children: [] },
              { id: 18, name: "Hoodies & Sweatshirts", children: [] },
              { id: 19, name: "Tees", children: [] },
              { id: 20, name: "Tanks", children: [] },
            ],
          },
        ],
      },
      {
        id: 7,
        name: "Gear",
        children: [],
      },
      {
        id: 10,
        name: "Collections",
        children: [],
      },
      {
        id: 12,
        name: "Training",
        children: [],
      },
    ],
  },
];

interface CategoryNode {
  id: number;
  name: string;
  children: CategoryNode[];
}

const AddMagentoCategory = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  // State for which nodes are expanded
  const [expanded, setExpanded] = useState<Set<number>>(new Set([2])); // root expanded by default
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    isEdit ? Number(id) : null
  );

  // Form states (simplified for demo)
  const [categoryName, setCategoryName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [includeInMenu, setIncludeInMenu] = useState(true);

  const toggleExpand = (id: number) => {
    setExpanded((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const renderNode = (node: CategoryNode, level = 0) => {
    const isExpanded = expanded.has(node.id);
    const isSelected = selectedCategoryId === node.id;
    const hasChildren = node.children.length > 0;

    return (
      <div key={node.id} className="select-none">
        {/* Node row */}
        <div
          className={`
            flex items-center gap-1.5 py-1.5 px-2 cursor-pointer rounded
            hover:bg-gray-100
            ${isSelected ? "bg-teal-50 text-teal-700 font-medium" : ""}
          `}
          style={{ paddingLeft: `${level * 20 + 8}px` }}
          onClick={() => setSelectedCategoryId(node.id)}
        >
          {/* Expand/Collapse icon */}
          {hasChildren ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(node.id);
              }}
              className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-gray-700"
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          ) : (
            <span className="w-5" />
          )}

          {/* Folder icon */}
          {hasChildren ? (
            isExpanded ? (
              <FolderOpen size={16} className="text-amber-600" />
            ) : (
              <Folder size={16} className="text-amber-600" />
            )
          ) : (
            <Folder size={14} className="text-gray-400" />
          )}

          {/* Name + ID */}
          <span className="ml-1 text-sm truncate">
            {node.name} <span className="text-gray-500 text-xs">(ID: {node.id})</span>
          </span>

          {/* Add child button (optional) */}
          <button
            type="button"
            className="ml-auto opacity-0 group-hover:opacity-100 text-teal-600 hover:text-teal-800"
            title="Add subcategory"
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Children */}
        {isExpanded && hasChildren && (
          <div>
            {node.children.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-[calc(100vh-80px)] bg-gray-50">
      {/* LEFT: Category Tree (dummy) */}
      <div className="w-80 border-r border-gray-200 bg-white overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Categories</h3>
            <button className="text-teal-600 hover:text-teal-800 text-sm flex items-center gap-1">
              <Plus size={16} /> New Category
            </button>
          </div>

          <div className="text-sm">
            {dummyCategories.map((root) => renderNode(root))}
          </div>
        </div>
      </div>

      {/* RIGHT: Form */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold mb-8">
            {isEdit ? "Edit Category" : "Create New Category"}
          </h2>

          <form className="space-y-8">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
              <div className="space-y-6">
                <Input
                  label="Category Name *"
                  placeholder="Enter category name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                />

                <div className="flex items-center gap-10">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                    />
                    <span>Enable Category</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeInMenu}
                      onChange={(e) => setIncludeInMenu(e.target.checked)}
                    />
                    <span>Include in Menu</span>
                  </label>
                </div>
              </div>
            </div>

            {/* You can add more sections here: Content, SEO, Products, Design... */}

            {/* Submit */}
            <div className="flex justify-end pt-6">
              <AddButton
                label={isEdit ? "Update Category" : "Save Category"}
                type="submit"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMagentoCategory;

