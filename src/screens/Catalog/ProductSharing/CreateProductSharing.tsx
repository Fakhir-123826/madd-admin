import { useParams } from "react-router-dom";
import AddButton from "../../../component/AddButton";
import { useState } from "react";

type Store = {
  id: number;
  name: string;
  address: string;
  active: boolean;
};

const CreateProductSharing = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [stores, setStores] = useState<Store[]>([
    { id: 1, name: "Store Name", address: "New York street #3, USA", active: true },
    { id: 2, name: "Store Name", address: "New York street #3, USA", active: true },
    { id: 3, name: "Store Name", address: "New York street #3, USA", active: true },
    { id: 4, name: "Store Name", address: "New York street #3, USA", active: true },
  ]);

  const [selected, setSelected] = useState<number[]>([1, 2]);

  const toggleStore = (id: number) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  return (
    <div>
      <div className="bg-white shadow-sm p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">
            Share “Red Shirt” with stores:
          </h2>

          <button className="bg-blue-500 text-white px-5 py-2 rounded-md hover:bg-blue-600 transition">
            Share
          </button>
        </div>

        {/* Store List */}
        <div className="space-y-6">
          {stores.map((store, index) => (
            <div key={store.id}>
              <div className="flex items-start gap-4">

                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={selected.includes(store.id)}
                  onChange={() => toggleStore(store.id)}
                  className="mt-1 w-5 h-5 accent-blue-500"
                />

                {/* Store Info */}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">
                    {store.name}
                  </h3>

                  <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                    📍 {store.address}
                  </p>

                  {/* Status Badge */}
                  {store.active && (
                    <span className="inline-block mt-2 bg-green-100 text-green-700 text-xs px-3 py-1 rounded-md">
                      Active
                    </span>
                  )}
                </div>
              </div>

              {/* Divider */}
              {index !== stores.length - 1 && (
                <hr className="mt-6 border-gray-200" />
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default CreateProductSharing;
