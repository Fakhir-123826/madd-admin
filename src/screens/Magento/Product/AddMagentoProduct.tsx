import React, { useState } from "react";
import Input from "../../../component/Inputs Feilds/Input";
import AddButton from "../../../component/AddButton";
import { useCreateProductMutation } from "../../../app/api/MagentoSlices/magentoApi";
import { useNavigate } from "react-router-dom";
import { useGetCategoriesQuery, type MagentoCategory } from "../../../app/api/CategorySlice/CategorySlice";
import AutoCompleteMultiSelect from "../../../component/Inputs Feilds/AutoCompleteMultiSelect";

interface CustomAttribute {
  attribute_code: string;
  value: string | number;
  type: "string" | "number"; // new
}

const AddMagentoProductFull = () => {
  const navigate = useNavigate();
  const [createProduct, { isLoading }] = useCreateProductMutation();
  const { data: categoryData, isLoading: categoriesLoading } = useGetCategoriesQuery();

  // Flatten nested categories
  const flattenCategories = (cat: MagentoCategory, level = 0): MagentoCategory[] => {
    let result = [{ ...cat, level }];
    if (cat.children_data && cat.children_data.length > 0) {
      cat.children_data.forEach(child => {
        result = result.concat(flattenCategories(child, level + 1));
      });
    }
    return result;
  };

  const categories: MagentoCategory[] = categoryData
    ? Array.isArray(categoryData)
      ? categoryData.flatMap((cat) => flattenCategories(cat))
      : flattenCategories(categoryData)
    : [];
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [customAttributes, setCustomAttributes] = useState<CustomAttribute[]>([
    { attribute_code: "description", value: "", type: "string" },
    { attribute_code: "short_description", value: "", type: "string" },
    { attribute_code: "manufacturer", value: 1, type: "number" },
    { attribute_code: "color", value: 5, type: "number" },
    { attribute_code: "size", value: 10, type: "number" },
    { attribute_code: "image", value: "/m/b/mb05-black-0.jpg", type: "string" },
    { attribute_code: "small_image", value: "/m/b/mb05-black-0.jpg", type: "string" },
    { attribute_code: "thumbnail", value: "/m/b/mb05-black-0.jpg", type: "string" },
  ]);

  const handleCustomAttributeChange = (index: number, value: string) => {
    const updated = [...customAttributes];
    updated[index].value = value;
    setCustomAttributes(updated);
  };

  // const handleAddCustomAttribute = () => {
  //   setCustomAttributes([...customAttributes, { attribute_code: "", value: "" }]);
  // };

  const handleRemoveCustomAttribute = (index: number) => {
    setCustomAttributes(customAttributes.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const getInputValue = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement | null)?.value || "";

    const getCheckboxValue = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement | null)?.checked || false;

    const getNumberValue = (name: string) =>
      Number((form.elements.namedItem(name) as HTMLInputElement | null)?.value) || 0;

    const payload = {
      sku: getInputValue("sku"),
      name: getInputValue("name"),
      attribute_set_id: getNumberValue("attribute_set_id") || 4,
      price: getNumberValue("price"),
      status: getCheckboxValue("status") ? 1 : 0,
      visibility: getNumberValue("visibility") || 4,
      type_id: getInputValue("type_id") || "simple",
      extension_attributes: {
        website_ids: [1],
        stock_item: {
          qty: getNumberValue("stock_qty"),
          is_in_stock: getCheckboxValue("is_in_stock"),
        },
        category_links: selectedCategories.map((catId) => ({
          position: 0,
          category_id: catId.toString(),
        })),
      },
      custom_attributes: [
        ...customAttributes.filter(attr => attr.attribute_code && attr.value),
        { attribute_code: "url_key", value: getInputValue("sku") } // ensures unique URL key
      ],
    };

    try {
      await createProduct(payload).unwrap();
      console.log("Product Created Successfully ✅");
      navigate("/MagentoProducts");
    } catch (error) {
      console.error("Create Product Error:", error);
    }
  };
  // Inside your component:
  const categoryOptions = categories.map((cat) => ({
    label: `${"— ".repeat(cat.level || 0)}${cat.name}`,
    value: cat.id?.toString() || "",
  }));

  return (
    <div className="bg-white shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-6">Magento Product Info</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 px-10 rounded-xl space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Product Name" name="name" placeholder="Enter product name" />
          <Input label="SKU" name="sku" placeholder="Enter SKU" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Type ID" name="type_id" placeholder="simple" />
          <Input label="Attribute Set ID" name="attribute_set_id" type="number" placeholder="4" />
        </div>

        {/* Price, Stock, Visibility */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input label="Price" name="price" type="number" placeholder="Enter price" />
          <Input label="Visibility" name="visibility" type="number" placeholder="4=Catalog/Search" />
          <Input label="Stock Qty" name="stock_qty" type="number" placeholder="Enter stock quantity" />
        </div>
        <div className="flex items-center space-x-4">
          <label>
            <input type="checkbox" name="is_in_stock" defaultChecked /> In Stock
          </label>
          <label>
            <input type="checkbox" name="status" defaultChecked /> Active Product
          </label>
        </div>

        {/* Categories */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">Categories</label>
          {categoriesLoading ? (
            <p>Loading categories...</p>
          ) : (
            <select
              value={selectedCategories[0] ?? ""}
              onChange={(e) => setSelectedCategories([Number(e.target.value)])}
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id} style={{ paddingLeft: `${cat.level! * 16}px` }}>
                  {cat.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <AutoCompleteMultiSelect
            label="Select Categories"
            options={categoryOptions}
            selectedValues={selectedCategories.map(String)}
            onChange={(values) => setSelectedCategories(values.map(Number))}
          />
        </div>

        {/* Dynamic Custom Attributes */}
        <div>
          <h3 className="text-md font-semibold mb-2">Custom Attributes</h3>
          {customAttributes.map((attr, index) => (
            <div key={index} className="flex items-center gap-3 mb-2">
              <Input
                placeholder="Attribute Code"
                value={attr.attribute_code}
                onChange={(e) =>
                  setCustomAttributes(customAttributes.map((a, i) =>
                    i === index ? { ...a, attribute_code: e.target.value } : a
                  ))
                }
              />
              <Input
                placeholder="Value"
                type={attr.type === "number" ? "number" : "text"}
                value={attr.value}
                onChange={(e) =>
                  setCustomAttributes(customAttributes.map((a, i) =>
                    i === index ? { ...a, value: attr.type === "number" ? Number(e.target.value) : e.target.value } : a
                  ))
                }
              />
              <button
                type="button"
                className="text-red-500 font-semibold"
                onClick={() => setCustomAttributes(customAttributes.filter((_, i) => i !== index))}
              >
                Remove
              </button>
            </div>
          ))}
          {/* <button
            type="button"
            className="text-teal-500 font-semibold"
            onClick={handleAddCustomAttribute}
          >
            + Add Attribute
          </button> */}
        </div>

        {/* Submit */}
        <div className="mt-6">
          <AddButton label={isLoading ? "Creating..." : "Submit Product"} type="submit" onClick={() => { }} />
        </div>
      </form>
    </div>
  );
};

export default AddMagentoProductFull;