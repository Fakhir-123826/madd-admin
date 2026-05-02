import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const AddMagentoTaxZone = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [taxIdentifier, setTaxIdentifier] = useState(isEdit ? "US-CA-Rate 1" : "");
  const [zipRange, setZipRange] = useState(false);
  const [zipCode, setZipCode] = useState(isEdit ? "*" : "");
  const [state, setState] = useState(isEdit ? "CA" : "");
  const [country, setCountry] = useState(isEdit ? "United States" : "");
  const [ratePercent, setRatePercent] = useState(isEdit ? "8.2500" : "");

  const [touched, setTouched] = useState(false);
  const [success, setSuccess] = useState("");

  const identifierErr = touched && !taxIdentifier.trim();
  const zipErr = touched && !zipCode.trim();
  const rateErr = touched && !ratePercent.trim();

  const inputClass = (err?: boolean) =>
    `w-full px-4 py-2.5 rounded-xl border text-sm text-gray-700 outline-none transition-all bg-gray-50 focus:bg-white
    ${err ? "border-red-400 focus:border-red-400" : "border-gray-300 focus:border-teal-500"}`;

  const selectClass = "w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-700 bg-gray-50 focus:border-teal-500 outline-none";

  const handleSave = () => {
    setTouched(true);
    if (!taxIdentifier.trim() || !zipCode.trim() || !ratePercent.trim()) return;

    setSuccess(`Tax Rate ${isEdit ? "updated" : "saved"} successfully!`);
    setTimeout(() => navigate("/MagentoTaxZonesList"), 1500);
  };

  return (
    <div className="space-y-6 pb-10">

      {/* TOP BAR */}
      <div className="bg-white rounded-xl shadow-sm px-6 py-4 flex items-center justify-between flex-wrap gap-3 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/MagentoTaxZonesList")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 text-gray-600 text-sm hover:bg-gray-50">
            <FaArrowLeft className="text-sm" /> Back
          </button>
          <h2 className="text-lg font-semibold text-gray-800">
            {isEdit ? "Edit Tax Rate" : "New Tax Rate"}
          </h2>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-600 text-sm hover:bg-gray-50">
            Reset
          </button>
          <button onClick={handleSave}
            className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-all"
            style={{ background: "linear-gradient(to right, #38bdf8, #3b82f6)" }}>
            Save
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

        <h3 className="text-base font-semibold text-gray-800 border-b border-gray-200 pb-2">Tax Rate Information</h3>

        {/* Tax Identifier */}
        <div className="grid md:grid-cols-4 gap-4 items-start">
          <label className="md:col-span-1 text-sm font-medium text-gray-700 text-right pt-2.5">
            Tax Identifier <span className="text-red-500">*</span>
          </label>
          <div className="md:col-span-3">
            <input
              value={taxIdentifier}
              onChange={e => setTaxIdentifier(e.target.value)}
              onBlur={() => setTouched(true)}
              className={inputClass(identifierErr)}
              placeholder="Enter tax identifier"
            />
            {identifierErr && <p className="mt-1 text-xs text-red-600">This is a required field.</p>}
          </div>
        </div>

        {/* Zip/Post is Range */}
        <div className="grid md:grid-cols-4 gap-4 items-start">
          <label className="md:col-span-1 text-sm font-medium text-gray-700 text-right pt-2.5">
            Zip/Post is Range
          </label>
          <div className="md:col-span-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={zipRange} onChange={() => setZipRange(!zipRange)}
                className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
            </label>
          </div>
        </div>

        {/* Zip/Post Code */}
        <div className="grid md:grid-cols-4 gap-4 items-start">
          <label className="md:col-span-1 text-sm font-medium text-gray-700 text-right pt-2.5">
            Zip/Post Code <span className="text-red-500">*</span>
          </label>
          <div className="md:col-span-3">
            <input
              value={zipCode}
              onChange={e => setZipCode(e.target.value)}
              onBlur={() => setTouched(true)}
              className={inputClass(zipErr)}
              placeholder="Enter zip/post code (* for any)"
            />
            <p className="mt-1 text-xs text-gray-500">
              * - matches any; 'xyz*' - matches any that begins on 'xyz' and are not longer than 10.
            </p>
            {zipErr && <p className="mt-1 text-xs text-red-600">This is a required field.</p>}
          </div>
        </div>

        {/* State */}
        <div className="grid md:grid-cols-4 gap-4 items-start">
          <label className="md:col-span-1 text-sm font-medium text-gray-700 text-right pt-2.5">
            State <span className="text-red-500">*</span>
          </label>
          <div className="md:col-span-3">
            <select value={state} onChange={e => setState(e.target.value)} className={selectClass}>
              <option>--Please Select--</option>
              <option>CA</option>
              <option>NY</option>
              <option>MI</option>
              <option>*</option>
            </select>
          </div>
        </div>

        {/* Country */}
        <div className="grid md:grid-cols-4 gap-4 items-start">
          <label className="md:col-span-1 text-sm font-medium text-gray-700 text-right pt-2.5">
            Country <span className="text-red-500">*</span>
          </label>
          <div className="md:col-span-3">
            <select value={country} onChange={e => setCountry(e.target.value)} className={selectClass}>
              <option>United States</option>
              <option>Pakistan</option>
              <option>Aruba</option>
            </select>
          </div>
        </div>

        {/* Rate Percent */}
        <div className="grid md:grid-cols-4 gap-4 items-start">
          <label className="md:col-span-1 text-sm font-medium text-gray-700 text-right pt-2.5">
            Rate Percent <span className="text-red-500">*</span>
          </label>
          <div className="md:col-span-3">
            <input
              type="number"
              step="0.0001"
              value={ratePercent}
              onChange={e => setRatePercent(e.target.value)}
              onBlur={() => setTouched(true)}
              className={inputClass(rateErr)}
              placeholder="Enter rate percent (e.g. 8.2500)"
            />
            {rateErr && <p className="mt-1 text-xs text-red-600">This is a required field.</p>}
          </div>
        </div>

        {/* Tax Titles */}
        <div className="pt-6 border-t border-gray-200">
          <h3 className="text-base font-semibold text-gray-800 mb-4">Tax Titles</h3>

          <div className="grid md:grid-cols-4 gap-4 items-start">
            <label className="md:col-span-1 text-sm font-medium text-gray-700 text-right pt-2.5">
              Default Store View
            </label>
            <div className="md:col-span-3">
              <select className={selectClass}>
                <option>Default Store View</option>
                <option>Main Website Store</option>
                <option>nina</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4 items-start mt-4">
            <label className="md:col-span-1 text-sm font-medium text-gray-700 text-right pt-2.5">
              nina
            </label>
            <div className="md:col-span-3">
              <input className={inputClass()} placeholder="Custom title for nina store view" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMagentoTaxZone;