import { useNavigate, useParams } from "react-router-dom";
import AddButton from "../../../component/AddButton";
import { useState } from "react";
import Input from "../../../component/Inputs Feilds/Input";

const CreateInventoryManagement = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    product_name: "",
    product_id: "",
    category: "",
    description: "",
    quantity: "",
    price: "",
    in_stock: false,
    status: "active",
  });

  // ✅ Handle input / select / textarea / checkbox / radio
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

  // ✅ Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Submitted Data 👉", formData);

    // 👉 API call here
  };

  // ✅ Cancel
  const handleCancel = () => {
    setFormData({
      product_name: "",
      product_id: "",
      category: "",
      description: "",
      quantity: "",
      price: "",
      in_stock: false,
      status: "active",
    });
  };

  return (
    <div>
      <div className="bg-white shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Category Basic Info</h2>
          <AddButton
            label="Add New Category"
            type="button"
            onClick={() => navigate("/CreateCategory")}
          />
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6"
        >

          {/* TITLE */}
          <h2 className="text-lg font-semibold text-gray-800">Product Info</h2>

          {/* NAME + ID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Product Name"
              name="product_name"
              placeholder="Blossom Flowers"
              value={formData.product_name}
              onChange={handleChange}
            />

            <Input
              label="Product ID"
              name="product_id"
              placeholder="2345465"
              value={formData.product_id}
              onChange={handleChange}
            />
          </div>

          {/* CATEGORY */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-400"
            >
              <option value="">Select Category</option>
              <option value="flowers">Flowers</option>
              <option value="plants">Plants</option>
              <option value="gifts">Gifts</option>
            </select>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-3"
            />
          </div>

          {/* QTY + PRICE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Quantity"
              name="quantity"
              type="number"
              placeholder="256"
              value={formData.quantity}
              onChange={handleChange}
            />

            <Input
              label="Price"
              name="price"
              placeholder="256 items"
              value={formData.price}
              onChange={handleChange}
            />
          </div>

          {/* IN STOCK */}
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="in_stock"
                checked={formData.in_stock}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-teal-500 transition"></div>
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5"></div>
            </label>
            <span className="text-sm text-gray-600">In stock</span>
          </div>

          {/* STATUS */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Status</p>

            <div className="flex items-center gap-6">

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="status"
                  value="active"
                  checked={formData.status === "active"}
                  onChange={handleChange}
                />
                <span className="text-sm">Active</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="status"
                  value="inactive"
                  checked={formData.status === "inactive"}
                  onChange={handleChange}
                />
                <span className="text-sm">Inactive</span>
              </label>

            </div>
          </div>

          {/* PRODUCT IMAGES */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">
              Product Images
            </p>

            <div className="flex gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg" />
              ))}

              <button
                type="button"
                className="w-20 h-20 bg-gray-100 border border-dashed border-gray-300 rounded-lg flex items-center justify-center text-sm text-gray-500"
              >
                + Add Image
              </button>
            </div>
          </div>

          {/* COLORS + SIZES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Available Colors
              </p>

              <div className="flex gap-2">
                {["bg-red-500", "bg-blue-500", "bg-green-500", "bg-purple-500"].map(
                  (color, i) => (
                    <div key={i} className={`w-5 h-5 rounded-full ${color}`} />
                  )
                )}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Available Sizes
              </p>

              <div className="flex gap-2">
                {["XS", "S", "M", "L"].map((size) => (
                  <span
                    key={size}
                    className="px-3 py-1 bg-gray-100 rounded-md text-xs"
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* ACTION BUTTONS */}
          <div className="flex justify-end gap-3 pt-4 border-t">

            <button
              type="button"
              onClick={handleCancel}
              className="px-5 py-2 rounded-full bg-red-500 text-white text-sm font-medium"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-lime-500 text-white text-sm font-medium"
            >
              Save Changes
            </button>

          </div>

        </form>

      </div>
    </div>

  )
}

export default CreateInventoryManagement