import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUpdateStockMutation } from "../../../app/api/MagentoSlices/InventoryApi";

function UpdateMagentoInventory() {
  const navigate = useNavigate();
  const { sku, itemId } = useParams<{ sku: string; itemId: string }>();

  const [updateStock, { isLoading: isUpdating }] = useUpdateStockMutation();

  const [qty, setQty] = useState<number>(0);
  const [isInStock, setIsInStock] = useState<boolean>(true);

  const handleSubmit = async () => {
    if (!sku || !itemId) return;
    try {
      await updateStock({
        sku,
        itemId: Number(itemId),
        payload: { qty, is_in_stock: isInStock },
      }).unwrap();
    //   alert("Stock updated successfully!");
      navigate(-1);
    } catch (err) {
    //   alert("Error updating stock!");
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm p-8">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Update Inventory</h2>
            <p className="text-sm text-gray-400 mt-1">
              SKU: <span className="text-teal-500 font-medium">{sku}</span>
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-full border border-gray-200 text-gray-500 text-sm hover:bg-gray-50 transition-colors"
          >
            ← Back
          </button>
        </div>

        {/* FORM */}
        <div className="space-y-6">

          {/* QTY */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <input
              type="number"
              min={0}
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-50 transition-all"
              placeholder="Enter quantity"
            />
          </div>

          {/* IS IN STOCK TOGGLE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Stock Status
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setIsInStock(true)}
                className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all border ${
                  isInStock
                    ? "bg-gradient-to-r from-teal-400 to-green-400 text-white border-transparent shadow-sm"
                    : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                }`}
              >
                ✓ In Stock
              </button>
              <button
                onClick={() => setIsInStock(false)}
                className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all border ${
                  !isInStock
                    ? "bg-red-500 text-white border-transparent shadow-sm"
                    : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                }`}
              >
                ✕ Out of Stock
              </button>
            </div>
          </div>

          {/* SUBMIT */}
          <button
            onClick={handleSubmit}
            disabled={isUpdating}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-400 to-green-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? "Updating..." : "Update Inventory"}
          </button>

        </div>
      </div>
    </div>
  );
}

export default UpdateMagentoInventory;