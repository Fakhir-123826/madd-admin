// import React, { useState } from "react";
// import Input from "../../../component/Inputs Feilds/Input";
// import AddButton from "../../../component/AddButton";
// import { useCreateCategoryMutation } from "../../../app/api/CategorySlice/CategorySlice"; // your API hook
// import { useNavigate } from "react-router-dom";

// interface CustomAttribute {
//     attribute_code: string;
//     value: string | number;
//     type: "string" | "number";
// }

// const AddMagentoCategory = () => {
//     const navigate = useNavigate();
//     const [createCategory, { isLoading }] = useCreateCategoryMutation();

//     const [categoryName, setCategoryName] = useState("");
//     const [isActive, setIsActive] = useState(true);
//     const [includeInMenu, setIncludeInMenu] = useState(true);
//     const [customAttributes, setCustomAttributes] = useState<CustomAttribute[]>([
//         { attribute_code: "display_mode", value: "PAGE", type: "string" },
//         { attribute_code: "is_anchor", value: 0, type: "number" },
//         { attribute_code: "url_key", value: "", type: "string" },
//     ]);

//     const handleCustomAttributeChange = (index: number, value: string) => {
//         setCustomAttributes(customAttributes.map((attr, i) =>
//             i === index
//                 ? { ...attr, value: customAttributes[i].type === "number" ? Number(value) : value }
//                 : attr
//         ));
//     };

//     const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault();

//         const payload = {
//   parent_id: 2,
//   name: categoryName,
//   is_active: isActive,
//   include_in_menu: includeInMenu,
//   custom_attributes: customAttributes.map(attr => ({
//     attribute_code: attr.attribute_code,
//     value: attr.value,
//   })),
// };

//         try {
//             await createCategory(payload).unwrap();
//             console.log("Category Created ✅");
//             navigate("/categories"); // navigate wherever your category list is
//         } catch (error) {
//             console.error("Category Creation Error:", error);
//         }
//     };

//     return (
//         <div className="bg-white shadow-sm p-6 rounded-xl">
//             <h2 className="text-lg font-semibold mb-6">Add Magento Category</h2>
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
//                             <Input
//                                 placeholder="Attribute Code"
//                                 value={attr.attribute_code}

//                             />
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
//                         label={isLoading ? "Creating..." : "Create Category"}
//                         type="submit"
//                         onClick={() => { }}
//                     />
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default AddMagentoCategory;



import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Input from "../../../component/Inputs Feilds/Input";
import AddButton from "../../../component/AddButton";
import {
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useGetCategoryByIdQuery,
    type MagentoCategory
} from "../../../app/api/CategorySlice/CategorySlice";

interface CustomAttribute {
    attribute_code: string;
    value: string | number;
    type: "string" | "number";
}

const AddMagentoCategory = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    // ✅ API hooks
    const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
    const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();

    // ✅ Form state
    const [categoryName, setCategoryName] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [includeInMenu, setIncludeInMenu] = useState(true);
    const [customAttributes, setCustomAttributes] = useState<CustomAttribute[]>([
        { attribute_code: "display_mode", value: "PAGE", type: "string" },
        { attribute_code: "is_anchor", value: 0, type: "number" },
        { attribute_code: "url_key", value: "", type: "string" },
    ]);

    // ✅ Fetch category data if editing
    const { data: categoryData, isLoading: isFetching } = useGetCategoryByIdQuery(Number(id!), {
        skip: !isEdit,
    });

    // ✅ Prefill form when data arrives
    useEffect(() => {
        if (categoryData) {
            setCategoryName(categoryData.name || "");
            setIsActive(categoryData.is_active ?? true);
            setIncludeInMenu(true); // or fetch/include_in_menu if available
            // Map custom attributes if they exist
            if (categoryData.custom_attributes) {
                setCustomAttributes(
                    categoryData.custom_attributes.map((attr: any) => ({
                        attribute_code: attr.attribute_code,
                        value: attr.value,
                        type: typeof attr.value === "number" ? "number" : "string",
                    }))
                );
            }
        }
    }, [categoryData]);

    // ✅ Handle attribute changes
    const handleCustomAttributeChange = (index: number, value: string) => {
        setCustomAttributes(customAttributes.map((attr, i) =>
            i === index
                ? { ...attr, value: attr.type === "number" ? Number(value) : value }
                : attr
        ));
    };

    // ✅ Submit handler
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const payload: Partial<MagentoCategory> = {
            parent_id: 2, // adjust as needed or add a parent multi-select
            name: categoryName,
            is_active: isActive,
            include_in_menu: includeInMenu,
            custom_attributes: customAttributes.map(attr => ({
                attribute_code: attr.attribute_code,
                value: attr.value,
            })),
        };

        try {
            if (isEdit && id) {
                await updateCategory({ id: Number(id), data: payload }).unwrap();
                console.log("Category Updated ✅");
            } else {
                await createCategory(payload).unwrap();
                console.log("Category Created ✅");
            }
            navigate("/categories"); // navigate to list after create/update
        } catch (error) {
            console.error("Error:", error);
        }
    };

    if (isEdit && isFetching) return <div className="p-6">Loading category...</div>;

    return (
        <div className="bg-white shadow-sm p-6 rounded-xl">
            <h2 className="text-lg font-semibold mb-6">
                {isEdit ? "Update Magento Category" : "Add Magento Category"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Category Name */}
                <Input
                    label="Category Name"
                    placeholder="Enter category name"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                />

                {/* Is Active */}
                <div className="flex items-center gap-4">
                    <label>
                        <input
                            type="checkbox"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                        /> Active
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={includeInMenu}
                            onChange={(e) => setIncludeInMenu(e.target.checked)}
                        /> Include in Menu
                    </label>
                </div>

                {/* Custom Attributes */}
                <div>
                    <h3 className="font-semibold mb-2">Custom Attributes</h3>
                    {customAttributes.map((attr, index) => (
                        <div key={index} className="flex items-center gap-3 mb-2">
                            <Input placeholder="Attribute Code" value={attr.attribute_code} />
                            <Input
                                placeholder="Value"
                                type={attr.type === "number" ? "number" : "text"}
                                value={attr.value}
                                onChange={(e) => handleCustomAttributeChange(index, e.target.value)}
                            />
                        </div>
                    ))}
                </div>

                {/* Submit Button */}
                <div>
                    <AddButton
                        label={isCreating || isUpdating ? "Saving..." : isEdit ? "Update Category" : "Create Category"}
                        type="submit"
                        onClick={() => { }}
                    />
                </div>
            </form>
        </div>
    );
};

export default AddMagentoCategory;