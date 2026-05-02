import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const AddMagentoStore = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [name, setName] = useState(isEdit ? "raw mart" : "");
  const [code, setCode] = useState(isEdit ? "raw_mart" : "");
  const [sortOrder, setSortOrder] = useState(isEdit ? "10" : "");

  const [touched, setTouched] = useState(false);
  const [success, setSuccess] = useState("");

  const nameErr = touched && !name.trim();
  const codeErr = touched && !code.trim();

  const inputClass = (err?: boolean) =>
    `w-full px-4 py-2.5 rounded-xl border text-sm text-gray-700 outline-none transition-all bg-gray-50 focus:bg-white
    ${err ? "border-red-400 focus:border-red-400" : "border-gray-300 focus:border-teal-500"}`;

  const handleSave = () => {
    setTouched(true);
    if (!name.trim() || !code.trim()) return;

    setSuccess(`Store ${isEdit ? "updated" : "saved"} successfully!`);
    setTimeout(() => navigate("/MagentoManageStoresList"), 1500);
  };

  return (
    <div className="space-y-6 pb-10">

      {/* TOP BAR */}
      <div className="bg-white rounded-xl shadow-sm px-6 py-4 flex items-center justify-between flex-wrap gap-3 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/MagentoManageStoresList")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 text-gray-600 text-sm hover:bg-gray-50">
            <FaArrowLeft className="text-sm" /> Back
          </button>
          <h2 className="text-lg font-semibold text-gray-800">
            {isEdit ? "Edit Store" : "New Store"}
          </h2>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-600 text-sm hover:bg-gray-50">
            Reset
          </button>
          <button onClick={handleSave}
            className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-all"
            style={{ background: "linear-gradient(to right, #38bdf8, #3b82f6)" }}>
            Save Store
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

        <h3 className="text-base font-semibold text-gray-800 border-b border-gray-200 pb-2">Store Information</h3>

        {/* Name */}
        <div className="grid md:grid-cols-4 gap-4 items-start">
          <label className="md:col-span-1 text-sm font-medium text-gray-700 text-right pt-2.5">
            Name <span className="text-red-500">*</span>
          </label>
          <div className="md:col-span-3">
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              onBlur={() => setTouched(true)}
              className={inputClass(nameErr)}
              placeholder="Enter store name"
            />
            {nameErr && <p className="mt-1 text-xs text-red-600">This is a required field.</p>}
          </div>
        </div>

        {/* Code */}
        <div className="grid md:grid-cols-4 gap-4 items-start">
          <label className="md:col-span-1 text-sm font-medium text-gray-700 text-right pt-2.5">
            Code <span className="text-red-500">*</span>
          </label>
          <div className="md:col-span-3">
            <input
              value={code}
              onChange={e => setCode(e.target.value)}
              onBlur={() => setTouched(true)}
              className={inputClass(codeErr)}
              placeholder="Enter unique code (e.g. raw_mart)"
            />
            {codeErr && <p className="mt-1 text-xs text-red-600">This is a required field.</p>}
          </div>
        </div>

        {/* Sort Order */}
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
              placeholder="Enter sort order (optional)"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMagentoStore;