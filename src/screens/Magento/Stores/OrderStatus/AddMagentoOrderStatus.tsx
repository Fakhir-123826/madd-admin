import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const AddMagentoOrderStatus = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [statusCode, setStatusCode] = useState(isEdit ? "fraud" : "");
  const [statusLabel, setStatusLabel] = useState(isEdit ? "Suspected Fraud" : "");
  const [storeLabels, setStoreLabels] = useState({
    main_website: "",
    main_website_store: "",
    default: "",
    my_web_site: "",
    neo_exp: "",
    raw_mart: "",
    nina: "",
    rrrr: ""
  });

  const [touched, setTouched] = useState(false);
  const [success, setSuccess] = useState("");

  const codeErr = touched && !statusCode.trim();
  const labelErr = touched && !statusLabel.trim();

  const inputClass = (err?: boolean) =>
    `w-full px-4 py-2.5 rounded-xl border text-sm text-gray-700 outline-none transition-all bg-gray-50 focus:bg-white
    ${err ? "border-red-400 focus:border-red-400" : "border-gray-300 focus:border-teal-500"}`;

  const handleSave = () => {
    setTouched(true);
    if (!statusCode.trim() || !statusLabel.trim()) return;

    setSuccess(`Order Status ${isEdit ? "updated" : "saved"} successfully!`);
    setTimeout(() => navigate("/MagentoOrderStatusList"), 1500);
  };

  const handleStoreLabelChange = (key: string, value: string) => {
    setStoreLabels(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6 pb-10">

      {/* TOP BAR */}
      <div className="bg-white rounded-xl shadow-sm px-6 py-4 flex items-center justify-between flex-wrap gap-3 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/MagentoOrderStatusList")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 text-gray-600 text-sm hover:bg-gray-50">
            <FaArrowLeft className="text-sm" /> Back
          </button>
          <h2 className="text-lg font-semibold text-gray-800">
            {isEdit ? "Edit Order Status" : "New Order Status"}
          </h2>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-600 text-sm hover:bg-gray-50">
            Reset
          </button>
          <button onClick={handleSave}
            className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-all"
            style={{ background: "linear-gradient(to right, #38bdf8, #3b82f6)" }}>
            Save Status
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

        <h3 className="text-base font-semibold text-gray-800 border-b border-gray-200 pb-2">Order Status Information</h3>

        {/* Status Code */}
        <div className="grid md:grid-cols-4 gap-4 items-start">
          <label className="md:col-span-1 text-sm font-medium text-gray-700 text-right pt-2.5">
            Status Code <span className="text-red-500">*</span>
          </label>
          <div className="md:col-span-3">
            <input
              value={statusCode}
              onChange={e => setStatusCode(e.target.value)}
              onBlur={() => setTouched(true)}
              className={inputClass(codeErr)}
              placeholder="Enter unique status code"
            />
            {codeErr && <p className="mt-1 text-xs text-red-600">This is a required field.</p>}
          </div>
        </div>

        {/* Status Label */}
        <div className="grid md:grid-cols-4 gap-4 items-start">
          <label className="md:col-span-1 text-sm font-medium text-gray-700 text-right pt-2.5">
            Status Label <span className="text-red-500">*</span>
          </label>
          <div className="md:col-span-3">
            <input
              value={statusLabel}
              onChange={e => setStatusLabel(e.target.value)}
              onBlur={() => setTouched(true)}
              className={inputClass(labelErr)}
              placeholder="Enter status label"
            />
            {labelErr && <p className="mt-1 text-xs text-red-600">This is a required field.</p>}
          </div>
        </div>

        {/* Store View Specific Labels */}
        <div className="grid md:grid-cols-4 gap-4 items-start">
          <label className="md:col-span-1 text-sm font-medium text-gray-700 text-right pt-2.5">
            Store View Specific Labels
          </label>
          <div className="md:col-span-3 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700 w-40">Main Website</span>
                <input
                  value={storeLabels.main_website}
                  onChange={e => handleStoreLabelChange("main_website", e.target.value)}
                  className={inputClass()}
                  placeholder="Custom label for Main Website"
                />
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700 w-40">Main Website Store</span>
                <input
                  value={storeLabels.main_website_store}
                  onChange={e => handleStoreLabelChange("main_website_store", e.target.value)}
                  className={inputClass()}
                  placeholder="Custom label for Main Website Store"
                />
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700 w-40">Default Store View</span>
                <input
                  value={storeLabels.default}
                  onChange={e => handleStoreLabelChange("default", e.target.value)}
                  className={inputClass()}
                  placeholder="Custom label for Default Store View"
                />
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700 w-40">my web site</span>
                <input
                  value={storeLabels.my_web_site}
                  onChange={e => handleStoreLabelChange("my_web_site", e.target.value)}
                  className={inputClass()}
                  placeholder="Custom label"
                />
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700 w-40">neo.exp</span>
                <input
                  value={storeLabels.neo_exp}
                  onChange={e => handleStoreLabelChange("neo_exp", e.target.value)}
                  className={inputClass()}
                  placeholder="Custom label"
                />
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700 w-40">raw mart</span>
                <input
                  value={storeLabels.raw_mart}
                  onChange={e => handleStoreLabelChange("raw_mart", e.target.value)}
                  className={inputClass()}
                  placeholder="Custom label"
                />
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700 w-40">nina</span>
                <input
                  value={storeLabels.nina}
                  onChange={e => handleStoreLabelChange("nina", e.target.value)}
                  className={inputClass()}
                  placeholder="Custom label"
                />
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700 w-40">rrrr</span>
                <input
                  value={storeLabels.rrrr}
                  onChange={e => handleStoreLabelChange("rrrr", e.target.value)}
                  className={inputClass()}
                  placeholder="Custom label"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMagentoOrderStatus;