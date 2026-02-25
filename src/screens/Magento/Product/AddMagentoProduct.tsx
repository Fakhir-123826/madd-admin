import React, { useState } from "react";
import Input from "../../../component/Inputs Feilds/Input";
import AddButton from "../../../component/AddButton";

const AddMagentoProductStatic = () => {
  const [categoryInput, setCategoryInput] = useState("");
  const [categories, setCategories] = useState<string[]>([]);

  const handleAddCategory = () => {
    if (!categoryInput.trim()) return;
    setCategories([...categories, categoryInput.trim()]);
    setCategoryInput("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // just log form data for now
    console.log({
      name: (e.target as any).name.value,
      sku: (e.target as any).sku.value,
      price: (e.target as any).price.value,
      status: (e.target as any).status.checked,
      description: (e.target as any).description.value,
      categories,
    });
  };

  return (
    <div className="bg-white shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Magento Product Info</h2>
        <AddButton label="Create Product" type="button" onClick={() => {}} />
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 px-10 rounded-xl space-y-6">

        {/* Product Name + SKU */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Product Name"
            name="name"
            placeholder="Enter product name"
            // required
          />
          <Input
            label="SKU"
            name="sku"
            placeholder="Enter SKU"
            // required
          />
        </div>

        {/* Price + Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Price"
            name="price"
            type="number"
            placeholder="Enter price"
            // required
          />

          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
            <span className="text-sm font-semibold text-gray-700">Active Product</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="status"
                defaultChecked
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:ring-2 peer-focus:ring-teal-400 rounded-full peer peer-checked:bg-teal-500 transition"></div>
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5"></div>
            </label>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">Description</label>
          <textarea
            name="description"
            rows={4}
            className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition"
          />
        </div>

        {/* Categories */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">Categories</label>
          <div className="flex items-end gap-3 mb-3">
            <Input
              name="categoryInput"
              placeholder="Enter category"
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
            />
            <AddButton label="Add" type="button" onClick={handleAddCategory} />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <AddButton label="Submit Product" type="submit" onClick={() => {}} />
        </div>
      </form>
    </div>
  );
};

export default AddMagentoProductStatic;