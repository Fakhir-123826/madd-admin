import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const AddCurrencyRates = () => {
  const navigate = useNavigate();

  const [importService, setImportService] = useState("fixer-io-legacy");
  const [usdRate, setUsdRate] = useState("1.0000");
  const [success, setSuccess] = useState("");

  const handleImport = () => {
    // Yeh real mein API call karega (Fixer.io ya backend)
    console.log("Importing rates from:", importService);
    setSuccess("Currency rates imported successfully!");
  };

  const handleSave = () => {
    // Save logic (RTK mutation ya API call)
    console.log("Saving currency rates:", { usd: usdRate });
    setSuccess("Currency rates saved successfully!");
    setTimeout(() => navigate("/currency-rates-list"), 1500); // back route adjust kar lena
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
          <h2 className="text-lg font-semibold text-gray-800">Add Currency Rates</h2>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-600 text-sm hover:bg-gray-50">
            Options
          </button>
          <button className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-600 text-sm hover:bg-gray-50">
            Reset
          </button>
          <button onClick={handleSave}
            className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-all"
            style={{ background: "linear-gradient(to right, #f97316, #ea580c)" }}>
            Save Currency Rates
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

        {/* Import Service */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-800">Import Service</h3>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={importService}
              onChange={e => setImportService(e.target.value)}
              className="w-64 px-4 py-2.5 rounded-xl border border-gray-300 bg-gray-50 text-sm text-gray-700 outline-none focus:border-teal-500"
            >
              <option value="fixer-io-legacy">Fixer.io (legacy)</option>
              <option value="currencylayer">CurrencyLayer</option>
              <option value="manual">Manual Import</option>
            </select>
            <button
              onClick={handleImport}
              className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-all"
              style={{ background: "linear-gradient(to right, #38bdf8, #3b82f6)" }}
            >
              Import
            </button>
          </div>
        </div>

        {/* Currency Rates Table */}
        <div className="pt-6 border-t border-gray-200">
          <h3 className="text-base font-semibold text-gray-800 mb-4">Currency Rates</h3>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Currency</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Rate</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-4 font-medium text-gray-700">
                    USD (US Dollar) <span className="text-red-500">*</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <input
                        value={usdRate}
                        onChange={e => setUsdRate(e.target.value)}
                        className="w-32 px-3 py-2 rounded-xl border border-gray-300 text-sm outline-none focus:border-teal-500"
                        placeholder="1.0000"
                      />
                      <span className="text-sm text-gray-700">USD</span>
                    </div>
                  </td>
                </tr>
                {/* Aur currencies add kar sakte ho */}
              </tbody>
            </table>
          </div>

          {/* Use Standard Checkbox */}
          <div className="mt-4 flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={true} // default true
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

export default AddCurrencyRates;