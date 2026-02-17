import { useState } from "react";
import Input from "../../../component/Inputs Feilds/Input";
import AddButton from "../../../component/AddButton";
import { useNavigate } from "react-router-dom";

const CreateProductBase = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    product_name: "",
    product_id: "",
    category: "",
    description: "",
    quantity: "",
    price: "",
    discount: "",
    add_discount: false,
    in_stock: true,
    status: "active",
    sku: ""
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">

      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-8">

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Product Base Basic Info</h2>
           <AddButton
            label="Add New Product Base"
            type="button"
            onClick={() => navigate("/CreateCategory")}
          />
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Product Info */}
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Product Info</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Product Name" name="product_name" value={formData.product_name} onChange={handleChange} />
            <Input label="Product ID" name="product_id" value={formData.product_id} onChange={handleChange} />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-400"
            >
              <option value="">Select Category</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Description</label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-400"
            />
          </div>

          {/* Qty + Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Quantity" name="quantity" value={formData.quantity} onChange={handleChange} />
            <Input label="Price" name="price" value={formData.price} onChange={handleChange} />
          </div>

          {/* In Stock */}
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
            <span className="text-sm font-semibold text-gray-700">In Stock</span>

            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" name="in_stock" checked={formData.in_stock} onChange={handleChange} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-teal-500 transition"></div>
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition"></div>
            </label>
          </div>

          {/* Discount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <Input label="Discount" name="discount" value={formData.discount} onChange={handleChange} />

            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
              <span className="text-sm font-semibold text-gray-700">Add Discount</span>

              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="add_discount" checked={formData.add_discount} onChange={handleChange} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-teal-500 transition"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition"></div>
              </label>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Status</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input type="radio" name="status" value="active" checked={formData.status === "active"} onChange={handleChange} />
                Active
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="status" value="inactive" checked={formData.status === "inactive"} onChange={handleChange} />
                Inactive
              </label>
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-semibold mb-3 text-gray-700">Product Images</label>
            <div className="flex gap-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-24 h-24 bg-gray-200 rounded-xl" />
              ))}
              <div className="w-24 h-24 bg-gray-100 border border-dashed rounded-xl flex items-center justify-center text-sm text-gray-500">
                + Add Image
              </div>
            </div>
          </div>

          {/* Colors + Sizes + SKU */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Available Colors</label>
              <div className="flex gap-2">
                {["bg-red-500", "bg-blue-500", "bg-green-500", "bg-purple-500"].map(c => (
                  <div key={c} className={`w-6 h-6 rounded-full ${c}`} />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Available Sizes</label>
              <div className="flex gap-2">
                {["XS", "S", "M", "L"].map(s => (
                  <span key={s} className="px-3 py-1 bg-gray-100 rounded-md text-xs">{s}</span>
                ))}
              </div>
            </div>

            <Input label="SKU" name="sku" value={formData.sku} onChange={handleChange} />

          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <button type="button" className="px-6 py-2 bg-black text-white rounded-lg">
              Cancel
            </button>

            <button type="submit" className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600">
              Save Changes
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default CreateProductBase;
