import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const AddCurrencySymbols = () => {
  const navigate = useNavigate();

  const [usdSymbol, setUsdSymbol] = useState("$");
  const [useStandard, setUseStandard] = useState(true);

  const [touched, setTouched] = useState(false);
  const [success, setSuccess] = useState("");

  const symbolErr = touched && !usdSymbol.trim();

  const inputClass = (err?: boolean) =>
    `w-full px-4 py-2.5 rounded-xl border text-sm text-gray-700 outline-none transition-all bg-gray-50 focus:bg-white
    ${err ? "border-red-400 focus:border-red-400" : "border-gray-300 focus:border-teal-500"}`;

  const handleSave = () => {
    setTouched(true);
    if (!usdSymbol.trim()) return;

    setSuccess("Currency symbols saved successfully!");
    setTimeout(() => navigate("/some-back-page"), 1500); // yahan apna back route daal dena
  };

  return (
    <div className="space-y-6 pb-10">

      {/* TOP BAR */}
      <div className="bg-white rounded-xl shadow-sm px-6 py-4 flex items-center justify-between flex-wrap gap-3 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 text-gray-600 text-sm hover:bg-gray-50">
            <FaArrowLeft className="text-sm" /> Back
          </button>
          <h2 className="text-lg font-semibold text-gray-800">Currency Symbols</h2>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-600 text-sm hover:bg-gray-50">
            Reset
          </button>
          <button onClick={handleSave}
            className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-all"
            style={{ background: "linear-gradient(to right, #f97316, #ea580c)" }}>
            Save Currency Symbols
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

        {/* USD (US Dollar) */}
        <div className="grid md:grid-cols-4 gap-4 items-start">
          <label className="md:col-span-1 text-sm font-medium text-gray-700 text-right pt-2.5">
            USD (US Dollar) <span className="text-red-500">*</span>
          </label>
          <div className="md:col-span-3">
            <div className="flex items-center gap-3">
              <input
                value={usdSymbol}
                onChange={e => setUsdSymbol(e.target.value)}
                onBlur={() => setTouched(true)}
                className={inputClass(symbolErr)}
                placeholder="Enter symbol"
              />
              <span className="text-sm text-gray-700 font-medium">$</span>
            </div>
            {symbolErr && <p className="mt-1 text-xs text-red-600">This is a required field.</p>}
          </div>
        </div>

        {/* Use Standard Checkbox */}
        <div className="grid md:grid-cols-4 gap-4 items-start">
          <label className="md:col-span-1 text-sm font-medium text-gray-700 text-right pt-2.5"></label>
          <div className="md:col-span-3 flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={useStandard}
                onChange={() => setUseStandard(!useStandard)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
            </label>
            <span className="text-sm text-gray-700">Use Standard</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCurrencySymbols;