import { useState } from "react";
import Input from "../../../component/Inputs Feilds/Input";
import AddButton from "../../../component/AddButton";
import { useNavigate, useParams } from "react-router-dom";


const CreateCategory = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);

  return (
    <div>
      <div className="bg-white shadow-sm p-6">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Category Info</h2>

          <AddButton
            label={isEdit ? "Update Category" : "Add Category"}
            type="button"
            onClick={() => console.log("pop")}
          />
        </div>

        {/* CARD */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">

          {/* NAME + URL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Category Name
              </label>
              <input
                placeholder="Category Name"
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                URL handle
              </label>
              <input
                placeholder="Enter URL"
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-400"
              />
            </div>

          </div>

          {/* PARENT CATEGORY */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Parent Category
            </label>

            <select className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-400">
              <option>Select Category</option>
            </select>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Description
              <span className="text-xs text-gray-400 ml-1">(100 words max)</span>
            </label>

            <textarea
              rows={4}
              placeholder="Description"
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-400"
            />
          </div>

          {/* STATUS */}
          <div>
            <p className="text-sm font-semibold mb-2 text-gray-700">Status</p>

            <div className="flex items-center gap-6">

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="status" className="accent-teal-500" defaultChecked />
                <span className="text-sm">Active</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="status" className="accent-teal-500" />
                <span className="text-sm">Inactive</span>
              </label>

            </div>
          </div>

          {/* IMAGES */}
          <div>
            <p className="text-sm font-semibold mb-3 text-gray-700">
              Product Images
            </p>

            <div className="flex gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg" />
              ))}

              <button className="w-20 h-20 bg-gray-100 border border-dashed border-gray-300 rounded-lg flex items-center justify-center text-sm text-gray-500">
                + Add Image
              </button>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-3 pt-4 border-t">

            <button className="px-6 py-2 bg-black text-white rounded-md">
              Cancel
            </button>

            <button className="px-6 py-2 bg-gradient-to-r from-teal-400 to-green-400 text-white rounded-md">
              Add Category
            </button>

          </div>

        </div>

      </div>
    </div>
  );
};

export default CreateCategory;
