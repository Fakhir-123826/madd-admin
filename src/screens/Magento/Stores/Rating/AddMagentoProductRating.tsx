import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

type StoreKey = "main_website" | "main_website_store" | "neo_exp" | "raw_mart" | "nina";

const AddMagentoRating = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  // Rating Title
  const [defaultValue, setDefaultValue] = useState(isEdit ? "Default Rating" : "");
  const [storeTitles, setStoreTitles] = useState({
    default: "",
    main_website_store: "",
    neo_exp: "",
    raw_mart: "",
    nina: ""
  });

  // Visibility – typed keys
  const [visibility, setVisibility] = useState<Record<StoreKey, boolean>>({
    main_website: true,
    main_website_store: true,
    neo_exp: true,
    raw_mart: true,
    nina: true
  });

  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState("0");

  const [touched, setTouched] = useState(false);
  const [success, setSuccess] = useState("");

  const defaultErr = touched && !defaultValue.trim();

  const inputClass = (err?: boolean) =>
    `w-full px-4 py-2.5 rounded-xl border text-sm text-gray-700 outline-none transition-all bg-gray-50 focus:bg-white
    ${err ? "border-red-400 focus:border-red-400" : "border-gray-300 focus:border-teal-500"}`;

  const handleSave = () => {
    setTouched(true);
    if (!defaultValue.trim()) return;

    setSuccess(`Rating ${isEdit ? "updated" : "saved"} successfully!`);
    setTimeout(() => navigate("/MagentoProductRatingsList"), 1500);
  };

  const handleStoreTitleChange = (key: string, value: string) => {
    setStoreTitles(prev => ({ ...prev, [key]: value }));
  };

  const handleVisibilityChange = (key: StoreKey) => {
    setVisibility(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 pb-10">

      {/* TOP BAR */}
      <div className="bg-white rounded-xl shadow-sm px-6 py-4 flex items-center justify-between flex-wrap gap-3 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/MagentoProductRatingsList")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 text-gray-600 text-sm hover:bg-gray-50">
            <FaArrowLeft className="text-sm" /> Back
          </button>
          <h2 className="text-lg font-semibold text-gray-800">
            {isEdit ? "Edit Rating" : "New Rating"}
          </h2>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-600 text-sm hover:bg-gray-50">
            Reset
          </button>
          <button onClick={handleSave}
            className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-all"
            style={{ background: "linear-gradient(to right, #38bdf8, #3b82f6)" }}>
            Save Rating
          </button>
        </div>
      </div>

      {/* SUCCESS */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-5 py-3 rounded-xl">
          ✓ {success}
        </div>
      )}

      {/* FORM */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden p-6 space-y-8">

        <h3 className="text-base font-semibold text-gray-800 border-b border-gray-200 pb-2">Rating Information</h3>

        {/* Info Box */}
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm px-4 py-3 rounded-xl flex items-start gap-3">
          <span className="text-yellow-600 text-xl font-bold">!</span>
          <p>Please specify a rating title for a store, or we'll just use the default value.</p>
        </div>

        {/* Rating Title */}
        <div className="space-y-6">
          <div className="grid md:grid-cols-4 gap-4 items-start">
            <label className="md:col-span-1 text-sm font-medium text-gray-700 text-right pt-2.5">
              Default Value <span className="text-red-500">*</span>
            </label>
            <div className="md:col-span-3">
              <input
                value={defaultValue}
                onChange={e => setDefaultValue(e.target.value)}
                onBlur={() => setTouched(true)}
                className={inputClass(defaultErr)}
                placeholder="Enter default rating title"
              />
              {defaultErr && <p className="mt-1 text-xs text-red-600">This is a required field.</p>}
            </div>
          </div>

          {/* Store-specific titles */}
          <div className="space-y-4">
            <div className="grid md:grid-cols-4 gap-4 items-start">
              <label className="md:col-span-1 text-sm font-medium text-gray-700 text-right pt-2.5">
                Default Store View
              </label>
              <div className="md:col-span-3">
                <input className={inputClass()} placeholder="Custom title for Default Store View" />
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4 items-start">
              <label className="md:col-span-1 text-sm font-medium text-gray-700 text-right pt-2.5">
                Main Website Store
              </label>
              <div className="md:col-span-3">
                <input className={inputClass()} placeholder="Custom title" />
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4 items-start">
              <label className="md:col-span-1 text-sm font-medium text-gray-700 text-right pt-2.5">
                nina
              </label>
              <div className="md:col-span-3">
                <input className={inputClass()} placeholder="Custom title for nina" />
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4 items-start">
              <label className="md:col-span-1 text-sm font-medium text-gray-700 text-right pt-2.5">
                neo.exp
              </label>
              <div className="md:col-span-3">
                <input className={inputClass()} placeholder="Custom title" />
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4 items-start">
              <label className="md:col-span-1 text-sm font-medium text-gray-700 text-right pt-2.5">
                raw mart
              </label>
              <div className="md:col-span-3">
                <input className={inputClass()} placeholder="Custom title" />
              </div>
            </div>
          </div>
        </div>

        {/* Rating Visibility – Updated to match screenshot */}
        <div className="pt-6 border-t border-gray-200">
          <h3 className="text-base font-semibold text-gray-800 mb-4">Rating Visibility</h3>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700 w-40">Visibility</label>
              <div className="relative w-full max-w-md">
                <div className="border border-gray-300 rounded-xl p-4 bg-gray-50 min-h-[180px] resize-y overflow-hidden">
                  <div className="space-y-2 text-sm text-gray-700">
                    <div>Main Website</div>
                    <div>Main Website Store</div>
                    <div>Default Store View</div>
                    <div>neo.exp</div>
                    <div>raw mart</div>
                    <div>nina</div>
                  </div>
                </div>
                {/* Info icon top-right */}
                <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                  <span className="text-lg font-bold">?</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700 w-40">Is Active</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={isActive} onChange={() => setIsActive(!isActive)}
                  className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
              </label>
            </div>

            <div className="grid md:grid-cols-4 gap-4 items-start">
              <label className="md:col-span-1 text-sm font-medium text-gray-700 text-right pt-2.5">
                Sort Order
              </label>
              <div className="md:col-span-3">
                <input
                  type="number"
                  value={sortOrder}
                  onChange={e => setSortOrder(e.target.value)}
                  className={inputClass()}
                  placeholder="Enter sort order"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMagentoRating;