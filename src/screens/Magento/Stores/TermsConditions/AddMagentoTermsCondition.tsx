import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const AddMagentoTermsCondition = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [conditionName, setConditionName] = useState(isEdit ? "Terms and Conditions" : "");
  const [status, setStatus] = useState(isEdit ? "Disabled" : "Enabled");
  const [showContentAs, setShowContentAs] = useState("Text");
  const [applied, setApplied] = useState("Automatically");
  const [storeView, setStoreView] = useState("All Store Views");
  const [checkboxText, setCheckboxText] = useState("");
  const [content, setContent] = useState("");
  const [contentHeight, setContentHeight] = useState("");

  const [touched, setTouched] = useState(false);
  const [success, setSuccess] = useState("");

  const nameErr = touched && !conditionName.trim();

  const inputClass = (err?: boolean) =>
    `w-full px-4 py-2.5 rounded-xl border text-sm text-gray-700 outline-none transition-all bg-gray-50 focus:bg-white
    ${err ? "border-red-400 focus:border-red-400" : "border-gray-300 focus:border-teal-500"}`;

  const selectClass = "w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-700 bg-gray-50 focus:border-teal-500 outline-none";

  const handleSave = () => {
    setTouched(true);
    if (!conditionName.trim()) return;

    setSuccess(`Terms and Conditions ${isEdit ? "updated" : "saved"} successfully!`);
    setTimeout(() => navigate("/MagentoTermsConditionsList"), 1500);
  };

  return (
    <div className="space-y-6 pb-10">

      {/* TOP BAR */}
      <div className="bg-white rounded-xl shadow-sm px-6 py-4 flex items-center justify-between flex-wrap gap-3 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/MagentoTermsConditionsList")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 text-gray-600 text-sm hover:bg-gray-50">
            <FaArrowLeft className="text-sm" /> Back
          </button>
          <h2 className="text-lg font-semibold text-gray-800">
            {isEdit ? "Edit Terms and Conditions" : "New Terms and Conditions"}
          </h2>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-600 text-sm hover:bg-gray-50">
            Reset
          </button>
          <button onClick={handleSave}
            className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-all"
            style={{ background: "linear-gradient(to right, #38bdf8, #3b82f6)" }}>
            Save Condition
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

        <h3 className="text-base font-semibold text-gray-800 border-b border-gray-200 pb-2">Terms and Conditions Information</h3>

        {/* Condition Name */}
        <div className="grid md:grid-cols-4 gap-4 items-start">
          <label className="md:col-span-1 text-sm font-medium text-gray-700 text-right pt-2.5">
            Condition Name <span className="text-red-500">*</span>
          </label>
          <div className="md:col-span-3">
            <input
              value={conditionName}
              onChange={e => setConditionName(e.target.value)}
              onBlur={() => setTouched(true)}
              className={inputClass(nameErr)}
              placeholder="Enter condition name"
            />
            {nameErr && <p className="mt-1 text-xs text-red-600">This is a required field.</p>}
          </div>
        </div>

        {/* Status */}
        <div className="grid md:grid-cols-4 gap-4 items-start">
          <label className="md:col-span-1 text-sm font-medium text-gray-700 text-right pt-2.5">
            Status
          </label>
          <div className="md:col-span-3">
            <select value={status} onChange={e => setStatus(e.target.value)} className={selectClass}>
              <option>Enabled</option>
              <option>Disabled</option>
            </select>
          </div>
        </div>

        {/* Show Content as */}
        <div className="grid md:grid-cols-4 gap-4 items-start">
          <label className="md:col-span-1 text-sm font-medium text-gray-700 text-right pt-2.5">
            Show Content as
          </label>
          <div className="md:col-span-3">
            <select value={showContentAs} onChange={e => setShowContentAs(e.target.value)} className={selectClass}>
              <option>Text</option>
              <option>Checkbox</option>
            </select>
          </div>
        </div>

        {/* Checkbox Text (show only if Checkbox selected) */}
        {showContentAs === "Checkbox" && (
          <div className="grid md:grid-cols-4 gap-4 items-start">
            <label className="md:col-span-1 text-sm font-medium text-gray-700 text-right pt-2.5">
              Checkbox Text
            </label>
            <div className="md:col-span-3">
              <input
                value={checkboxText}
                onChange={e => setCheckboxText(e.target.value)}
                className={inputClass()}
                placeholder="Enter checkbox text"
              />
            </div>
          </div>
        )}

        {/* Applied */}
        <div className="grid md:grid-cols-4 gap-4 items-start">
          <label className="md:col-span-1 text-sm font-medium text-gray-700 text-right pt-2.5">
            Applied
          </label>
          <div className="md:col-span-3">
            <select value={applied} onChange={e => setApplied(e.target.value)} className={selectClass}>
              <option>Automatically</option>
              <option>Manually</option>
            </select>
          </div>
        </div>

        {/* Store View */}
        <div className="grid md:grid-cols-4 gap-4 items-start">
          <label className="md:col-span-1 text-sm font-medium text-gray-700 text-right pt-2.5">
            Store View
          </label>
          <div className="md:col-span-3">
            <select value={storeView} onChange={e => setStoreView(e.target.value)} className={selectClass}>
              <option>All Store Views</option>
              <option>Main Website</option>
              <option>Main Website Store</option>
              <option>Default Store View</option>
              <option>neo.exp</option>
              <option>raw mart</option>
              <option>nina</option>
            </select>
          </div>
        </div>

        {/* Condition Text */}
        <div className="grid md:grid-cols-4 gap-4 items-start">
          <label className="md:col-span-1 text-sm font-medium text-gray-700 text-right pt-2.5">
            Condition Text <span className="text-red-500">*</span>
          </label>
          <div className="md:col-span-3">
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              onBlur={() => setTouched(true)}
              className={`${inputClass()} min-h-[120px] resize-y`}
              placeholder="Enter full terms and conditions text here..."
            />
          </div>
        </div>

        {/* Content Height */}
        <div className="grid md:grid-cols-4 gap-4 items-start">
          <label className="md:col-span-1 text-sm font-medium text-gray-700 text-right pt-2.5">
            Content Height (px)
          </label>
          <div className="md:col-span-3">
            <input
              type="number"
              value={contentHeight}
              onChange={e => setContentHeight(e.target.value)}
              className={inputClass()}
              placeholder="Enter height in pixels (optional)"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMagentoTermsCondition;