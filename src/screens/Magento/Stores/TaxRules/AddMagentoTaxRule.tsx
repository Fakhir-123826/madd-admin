import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaChevronDown } from "react-icons/fa";

// Yeh AutoCompleteMultiSelect component copy kar liya tere dusre code se (thoda adjust kiya)
const AutoCompleteMultiSelect = ({
  label,
  options,
  selectedValues,
  onChange,
}: {
  label: string;
  options: { label: string; value: string }[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const toggleValue = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    onChange(newValues);
  };

  return (
    <div className="relative">
      <label className="text-sm font-medium text-gray-700 block mb-1">
        {label} <span className="text-red-500">*</span>
      </label>
      <div
        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-gray-50 text-sm text-gray-700 flex items-center justify-between cursor-pointer focus-within:border-teal-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedValues.length} selected</span>
        <FaChevronDown className="text-gray-500" />
      </div>

      {isOpen && (
        <div className="absolute w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto z-10">
          <div className="p-2 border-b border-gray-200">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-teal-400"
              onClick={e => e.stopPropagation()} // input click pe dropdown band na ho
            />
          </div>
          {filteredOptions.map(opt => (
            <div
              key={opt.value}
              onClick={() => toggleValue(opt.value)}
              className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer flex items-center gap-2 text-sm"
            >
              <input
                type="checkbox"
                checked={selectedValues.includes(opt.value)}
                readOnly
                className="w-4 h-4 accent-teal-500"
              />
              {opt.label}
            </div>
          ))}
          {filteredOptions.length === 0 && (
            <div className="px-4 py-2.5 text-sm text-gray-500">No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

const AddMagentoTaxRule = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [name, setName] = useState(isEdit ? "Rule1" : "");
  const [selectedRates, setSelectedRates] = useState<string[]>([]);

  const [touched, setTouched] = useState(false);
  const [success, setSuccess] = useState("");

  const nameErr = touched && !name.trim();

  const inputClass = (err?: boolean) =>
    `w-full px-4 py-2.5 rounded-xl border text-sm text-gray-700 outline-none transition-all bg-gray-50 focus:bg-white
    ${err ? "border-red-400 focus:border-red-400" : "border-gray-300 focus:border-teal-500"}`;

  const handleSave = () => {
    setTouched(true);
    if (!name.trim() || selectedRates.length === 0) return;

    setSuccess(`Tax Rule ${isEdit ? "updated" : "saved"} successfully!`);
    setTimeout(() => navigate("/MagentoTaxRulesList"), 1500);
  };

  const availableRates = [
    { label: "US-CA-Rate 1", value: "us-ca-rate-1" },
    { label: "US-NY-Rate 1", value: "us-ny-rate-1" },
    { label: "US-MI-Rate 1", value: "us-mi-rate-1" },
    { label: "MY group", value: "my-group" },
    { label: "MY group 2", value: "my-group-2" },
  ];

  return (
    <div className="space-y-6 pb-10">

      {/* TOP BAR */}
      <div className="bg-white rounded-xl shadow-sm px-6 py-4 flex items-center justify-between flex-wrap gap-3 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/MagentoTaxRulesList")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 text-gray-600 text-sm hover:bg-gray-50">
            <FaArrowLeft className="text-sm" /> Back
          </button>
          <h2 className="text-lg font-semibold text-gray-800">
            {isEdit ? "Edit Tax Rule" : "New Tax Rule"}
          </h2>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-600 text-sm hover:bg-gray-50">
            Reset
          </button>
          <button className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-600 text-sm hover:bg-gray-50">
            Save and Continue Edit
          </button>
          <button onClick={handleSave}
            className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-all"
            style={{ background: "linear-gradient(to right, #f97316, #ea580c)" }}>
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

        <h3 className="text-base font-semibold text-gray-800 border-b border-gray-200 pb-2">Tax Rule Information</h3>

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
              placeholder="Enter tax rule name"
            />
            {nameErr && <p className="mt-1 text-xs text-red-600">This is a required field.</p>}
          </div>
        </div>

        {/* Tax Rate – Real Multi-Select Dropdown */}
        <div className="grid md:grid-cols-4 gap-4 items-start">
          <label className="md:col-span-1 text-sm font-medium text-gray-700 text-right pt-2.5">
            Tax Rate <span className="text-red-500">*</span>
          </label>
          <div className="md:col-span-3 space-y-2">
            <AutoCompleteMultiSelect
              label=""
              options={availableRates}
              selectedValues={selectedRates}
              onChange={setSelectedRates}
            />
            <button className="text-xs text-blue-500 hover:text-blue-700">
              + Add New Tax Rate
            </button>
          </div>
        </div>

        {/* Additional Settings */}
        <div className="pt-6 border-t border-gray-200">
          <h3 className="text-base font-semibold text-gray-800 mb-4">Additional Settings</h3>

          <div className="grid md:grid-cols-4 gap-4 items-start">
            <label className="md:col-span-1 text-sm font-medium text-gray-700 text-right pt-2.5">
              Import Tax Rates
            </label>
            <div className="md:col-span-3 flex items-center gap-3">
              <button className="px-4 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-600 hover:bg-gray-50">
                Choose File
              </button>
              <span className="text-sm text-gray-500">No file chosen</span>
              <button className="px-5 py-2 rounded-xl border border-gray-300 text-sm hover:bg-gray-50">
                Import Tax Rates
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4 items-start mt-4">
            <label className="md:col-span-1 text-sm font-medium text-gray-700 text-right pt-2.5">
              Export Tax Rates
            </label>
            <div className="md:col-span-3">
              <button className="px-5 py-2.5 rounded-xl border border-gray-300 text-sm hover:bg-gray-50">
                Export Tax Rates
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMagentoTaxRule;