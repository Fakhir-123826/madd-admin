import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../../../component/Inputs Feilds/Input";
import AddButton from "../../../component/AddButton";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
  useGetProductsQuery,
  useGetProductQuery
} from "../../../app/api/ProductSlice/ProductSlice";
import { useGetCategoriesQuery, type MagentoCategory } from "../../../app/api/CategorySlice/CategorySlice";
import AutoCompleteMultiSelect from "../../../component/Inputs Feilds/AutoCompleteMultiSelect";

interface CustomAttribute {
  attribute_code: string;
  value: string | number;
  type: "string" | "number";
}

const AddMagentoProductFull = () => {
  const navigate = useNavigate();
  const { sku } = useParams(); // URL param
  const isEditMode = !!sku;

  const { data: productData, isFetching: productLoading } = useGetProductQuery(sku!);// fetch all products to find by SKU
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const { data: categoryData, isLoading: categoriesLoading } = useGetCategoriesQuery();
type FlattenedCategory = MagentoCategory & { level: number };
  // Flatten nested categories for multi-select
  const flattenCategories = (cat: MagentoCategory, level = 0): FlattenedCategory[] => {
  let result: FlattenedCategory[] = [{ ...cat, level }]; // now level is guaranteed
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

  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    type_id: "simple",
    attribute_set_id: 4,
    price: 0,
    visibility: 4,
    status: true,
    is_in_stock: true,
    stock_qty: 0,
  });

  // Load product data for edit mode
  useEffect(() => {
    if (isEditMode && productData) {
      const product = productData;
      setFormData({
        sku: product.sku,
        name: product.name,
        type_id: product.type_id || "simple",
        attribute_set_id: product.attribute_set_id || 4,
        price: product.price || 0,
        visibility: product.visibility || 4,
        status: product.status === 1,
        is_in_stock: product.extension_attributes?.stock_item?.is_in_stock ?? true,
        stock_qty: product.extension_attributes?.stock_item?.qty ?? 0,
      });
      setSelectedCategories(
        product.extension_attributes?.category_links?.map((c: any) => Number(c.category_id)) || []
      );
      if (product.custom_attributes?.length) {
        setCustomAttributes(product.custom_attributes.map((attr: any) => ({
          attribute_code: attr.attribute_code,
          value: attr.value,
          type: typeof attr.value === "number" ? "number" : "string"
        })));
      }
    }
  }, [isEditMode, productData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const target = e.target as HTMLInputElement | HTMLSelectElement;

  const { name, value, type } = target;
  const checked = (target as HTMLInputElement).checked; // only exists on input

  setFormData({
    ...formData,
    [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value
  });
};

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      sku: formData.sku,
      name: formData.name,
      attribute_set_id: formData.attribute_set_id,
      price: formData.price,
      status: formData.status ? 1 : 0,
      visibility: formData.visibility,
      type_id: formData.type_id,
      extension_attributes: {
        website_ids: [1],
        stock_item: {
          qty: formData.stock_qty,
          is_in_stock: formData.is_in_stock,
        },
        category_links: selectedCategories.map(catId => ({
          position: 0,
          category_id: catId.toString(),
        })),
      },
      custom_attributes: customAttributes.filter(attr => attr.attribute_code && attr.value),
    };

    try {
      if (isEditMode) {
        await updateProduct({ sku, product: payload }).unwrap(); // use SKU
      } else {
        await createProduct(payload).unwrap();
      }
      navigate("/MagentoProducts");
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const categoryOptions = categories.map(cat => ({
    label: `${"— ".repeat(cat.level || 0)}${cat.name}`,
    value: cat.id?.toString() || "",
  }));

  return (
    <div className="max-w-5xl mx-auto bg-gray-50 p-8 rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {isEditMode ? "Update Product" : "Create Product"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* ===== Basic Info Card ===== */}
        <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Basic Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Product Name" name="name" value={formData.name} onChange={handleInputChange} />
            <Input label="SKU" name="sku" value={formData.sku} onChange={handleInputChange} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Type ID" name="type_id" value={formData.type_id} onChange={handleInputChange} />
            <Input label="Attribute Set ID" name="attribute_set_id" type="number" value={formData.attribute_set_id} onChange={handleInputChange} />
          </div>
        </div>

        {/* ===== Pricing & Stock Card ===== */}
        <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Pricing & Stock</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Price" name="price" type="number" value={formData.price} onChange={handleInputChange} />
            <Input label="Visibility" name="visibility" type="number" value={formData.visibility} onChange={handleInputChange} />
            <Input label="Stock Qty" name="stock_qty" type="number" value={formData.stock_qty} onChange={handleInputChange} />
          </div>
          <div className="flex flex-wrap gap-6 mt-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="is_in_stock" checked={formData.is_in_stock} onChange={handleInputChange} className="w-5 h-5 accent-blue-500" />
              <span className="text-gray-700 font-medium">In Stock</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="status" checked={formData.status} onChange={handleInputChange} className="w-5 h-5 accent-green-500" />
              <span className="text-gray-700 font-medium">Active Product</span>
            </label>
          </div>
        </div>

        {/* ===== Categories Card ===== */}
        <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Categories</h3>
          {categoriesLoading ? (
            <p className="text-gray-500">Loading categories...</p>
          ) : (
            <AutoCompleteMultiSelect
              label="Select Categories"
              options={categoryOptions}
              selectedValues={selectedCategories.map(String)}
              onChange={(values) => setSelectedCategories(values.map(Number))}
            />
          )}
        </div>

        {/* ===== Custom Attributes Card ===== */}
        {/* ===== Custom Attributes Card ===== */}
        <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
          <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">Custom Attributes</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {customAttributes.map((attr, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-4 shadow hover:shadow-md transition-shadow duration-200 flex flex-col gap-3"
              >
                {/* Attribute Code */}
                <label className="text-sm font-medium text-gray-700">Attribute Code</label>
                <Input
                  placeholder="Enter code"
                  value={attr.attribute_code}
                  onChange={(e) =>
                    setCustomAttributes(customAttributes.map((a, i) =>
                      i === index ? { ...a, attribute_code: e.target.value } : a
                    ))
                  }
                  className="border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-100 rounded-md"
                />

                {/* Attribute Value */}
                <label className="text-sm font-medium text-gray-700">Value</label>
                <Input
                  placeholder="Enter value"
                  type={attr.type === "number" ? "number" : "text"}
                  value={attr.value}
                  onChange={(e) =>
                    setCustomAttributes(customAttributes.map((a, i) =>
                      i === index ? { ...a, value: attr.type === "number" ? Number(e.target.value) : e.target.value } : a
                    ))
                  }
                  className="border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-100 rounded-md"
                />
              </div>
            ))}
          </div>
        </div>

        {/* ===== Submit Button ===== */}
        <div className="flex justify-end">
          <AddButton
            label={isCreating || isUpdating ? "Processing..." : isEditMode ? "Update Product" : "Create Product"}
            type="submit"
          />
        </div>
      </form>
    </div>
  );
};

export default AddMagentoProductFull;